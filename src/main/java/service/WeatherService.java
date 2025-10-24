package service;

import dto.LocationDto;
import external.WeatherApiClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherService {
    private final WeatherApiClient weatherApiClient;

    public WeatherService(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
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
        if(location == null) {
            throw new RuntimeException("Weather not found");
        }
        return convertTempInCelsius(location);
    }

    private LocationDto convertTempInCelsius(LocationDto location) {
        location.setTemp(location.getTemp() - 273.15);
        return location;
    }
}
