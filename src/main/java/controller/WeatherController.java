package controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dto.LocationDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import service.WeatherService;

import java.util.List;

@Controller
public class WeatherController {
    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/searchLocations")
    @ResponseBody
    public String getLocations(HttpServletRequest request, Model model) throws JsonProcessingException {
        String city = request.getParameter("city");
        List<LocationDto> locations = weatherService.getLocations(city);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(locations);
    }

    @GetMapping("/weather")
    public String getWeather(HttpServletRequest request, Model model) {
        double lat = Double.parseDouble(request.getParameter("lat"));
        double lon = Double.parseDouble(request.getParameter("lon"));
        LocationDto location = weatherService.getWeather(lat, lon);
        model.addAttribute("weatherLocation", location);
        return "home";
    }

}
