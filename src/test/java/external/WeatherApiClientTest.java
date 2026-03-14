package external;

import dto.LocationDto;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class WeatherApiClientTest {
    private WeatherApiClient weatherApiClient;
    private MockWebServer server;

    @BeforeEach
    void setUp() throws IOException {
        server = new MockWebServer();
        server.start();
        weatherApiClient = new WeatherApiClient(server.url("/").toString());
    }

    @AfterEach
    void tearDown() throws IOException {
        server.shutdown();
    }

    @Test
    void getLocationsTest() {
           server.enqueue(new MockResponse()
                   .setResponseCode(200)
                   .setBody("[ {\"name\":\"London\", \"country\":\"GB\", \"lat\":51.5, \"lon\":-0.1} ]")
                   .addHeader("content-type", "application/json"));

        List<LocationDto> locations = weatherApiClient.getLocations("London");

        assertEquals("London", locations.getFirst().getName());

    }

    @Test
    void getLocations400ThrowsException() {
        server.enqueue(new MockResponse().setResponseCode(400));
        assertThrows(RuntimeException.class, () -> weatherApiClient.getLocations("London"));
    }

    @Test
    void getLocations500ThrowsException() {
        server.enqueue(new MockResponse().setResponseCode(500));
        assertThrows(RuntimeException.class, () -> weatherApiClient.getLocations("London"));
    }
}
