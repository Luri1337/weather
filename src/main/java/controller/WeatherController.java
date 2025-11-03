package controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dto.LocationDto;
import dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import service.WeatherService;

import java.util.List;

@Controller
public class WeatherController {
    private final WeatherService weatherService;
    private final ObjectMapper mapper = new ObjectMapper();

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/searchLocations")
    @ResponseBody
    public String getLocations(HttpServletRequest request, Model model) throws JsonProcessingException {
        String city = request.getParameter("city");
        List<LocationDto> locations = weatherService.getLocations(city);
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

    @PostMapping("/addLocation")
    public String addLocation   (@ModelAttribute LocationDto location, Model model, HttpServletRequest request) {
        UserDto user = (UserDto) request.getAttribute("user");
        weatherService.addLocation(location, user);
        return "redirect:/home";
    }

    @GetMapping("/getUserLocations")
    @ResponseBody
    public String getUserLocations(HttpServletRequest request, Model model) throws JsonProcessingException {
        UserDto user = (UserDto) request.getAttribute("user");
        List<LocationDto> userLocations = weatherService.getUserLocations(user);
        return mapper.writeValueAsString(userLocations);
    }

}
