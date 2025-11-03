package service;

import dao.LocationDao;
import dao.UserDao;
import dto.LocationDto;
import dto.UserDto;
import external.WeatherApiClient;
import model.Location;
import model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class WeatherService {
    private final WeatherApiClient weatherApiClient;
    private final LocationDao locationDao;
    private final UserDao userDao;

    public WeatherService(WeatherApiClient weatherApiClient, LocationDao locationDao, UserDao userDao) {
        this.weatherApiClient = weatherApiClient;
        this.locationDao = locationDao;
        this.userDao = userDao;
    }

    public List<LocationDto> getLocations(String city) {
        List<LocationDto> locations = weatherApiClient.getLocations(city);
        if (locations.isEmpty()) {
            throw new RuntimeException("No locations found for " + city);
        }
        return locations;
    }

    public LocationDto getWeather(double lat, double lon) {
        LocationDto location = weatherApiClient.getWeather(lat, lon);
        if (location == null) {
            throw new RuntimeException("Weather not found");
        }
        return convertTempInCelsius(location);
    }

    @Transactional
    public void addLocation(LocationDto location, UserDto user) {
        User userId = userDao.getUserByLogin(user.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Location newLoc = new Location();
        newLoc.setLatitude(location.getLat());
        newLoc.setLongitude(location.getLon());
        newLoc.setName(location.getName());
        newLoc.setUserId(userId);
        locationDao.save(newLoc);
    }

    private LocationDto convertTempInCelsius(LocationDto location) {
        location.setTemp(location.getTemp() - 273.15);
        return location;
    }

    @Transactional
    public List<LocationDto> getUserLocations(UserDto user) {
        User userId = userDao.getUserByLogin(user.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Location> userLocations = locationDao.getUserLocations(userId);
        if (userLocations.isEmpty()) {
            return Collections.emptyList();
        }

        List<LocationDto> locations = new ArrayList<>();
        for (Location location : userLocations) {
            LocationDto locationDto = new LocationDto();
            locationDto.setName(location.getName());
            locationDto.setLat(location.getLatitude());
            locationDto.setLon(location.getLongitude());
            locations.add(locationDto);
        }
        return locations;
    }
}
