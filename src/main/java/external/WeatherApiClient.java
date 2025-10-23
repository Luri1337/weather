package external;

import dto.LocationDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
//TODO сделать парсинг нормальным
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
        return webClient.get().uri(uriBuilder -> uriBuilder
                        .path("/geo/1.0/direct")
                        .queryParam("q", city)
                        .queryParam("limit", CITIES_LIMIT)
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .bodyToFlux(LocationDto.class)
                .collectList()
                .block();
    }

    public LocationDto getWeather(double lat, double lon) {
        Map<String, Object> resp = webClient.get().uri(uriBuilder -> uriBuilder
                        .path("/data/2.5/weather")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        LocationDto dto = new LocationDto();
        dto.setName((String) resp.get("name"));

        Map<String, Object> coord = (Map<String, Object>) resp.get("coord");
        if (coord != null) {
            dto.setLat((Double) coord.get("lat"));
            dto.setLon((Double) coord.get("lon"));
        }

        Map<String, Object> sys = (Map<String, Object>) resp.get("sys");
        if (sys != null) {
            dto.setCountry((String) sys.get("country"));
        }

        return dto;

    }
}
