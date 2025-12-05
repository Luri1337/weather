package service;

import dao.LocationDao;
import dao.UserDao;
import dto.LocationDto;
import external.WeatherApiClient;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {
    private final WeatherApiClient weatherApiClient;


    public WeatherService(WeatherApiClient weatherApiClient, LocationDao locationDao, UserDao userDao) {
        this.weatherApiClient = weatherApiClient;
    }


    public LocationDto getWeather(double lat, double lon) {
        LocationDto location = weatherApiClient.getWeather(lat, lon);
        if (location == null) {
            throw new RuntimeException("Weather not found");
        }
        return convertTempInCelsius(location);
    }

    private LocationDto convertTempInCelsius(LocationDto location) {
        location.setTemp(location.getTemp() - 273.15);
        return location;
    }


}
