package external;

import dto.LocationDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class WeatherApiClient {
    public static final int CITIES_LIMIT = 5;
    private final WebClient webClient;

    @Value("${weather.api.key}")
    private String apiKey;

    public WeatherApiClient(@Value("${weather.api.base-url}") String baseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public List<LocationDto> getLocations(String city) {
        List<Map<String, Object>> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/geo/1.0/direct")
                        .queryParam("q", city)
                        .queryParam("limit", CITIES_LIMIT)
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                })
                .block();

        if(response == null) {
            throw new RuntimeException("No locations found");
        }

        List<LocationDto> locations = new ArrayList<>();
        for (Map<String, Object> location : response) {
            LocationDto locationDto = new LocationDto();
            locationDto.setName((String) location.get("name"));
            locationDto.setCountry((String) location.get("country"));
            locationDto.setLat((Double) location.get("lat"));
            locationDto.setLon((Double) location.get("lon"));
            locations.add(locationDto);
        }

        return locations;
    }

    public LocationDto getWeather(double lat, double lon) {
        Map<String, Object> resp = webClient.get().uri(uriBuilder -> uriBuilder
                        .path("/data/2.5/weather")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .block();

        LocationDto locationDto = new LocationDto();
        locationDto.setCountry((String) resp.get("name"));

        Map<String, Object> cord = (Map<String, Object>) resp.get("coord");
        if (cord != null) {
            locationDto.setLat((Double) cord.get("lat"));
            locationDto.setLon((Double) cord.get("lon"));
        }

        Map<String, Object> sys = (Map<String, Object>) resp.get("sys");
        if (sys != null) {
            locationDto.setCountry((String) sys.get("country"));
        }
        Map<String, Object> main = (Map<String, Object>) resp.get("main");
        if (main != null) {
            locationDto.setTemp((double) main.get("temp"));
        }

        return locationDto;

    }
}
