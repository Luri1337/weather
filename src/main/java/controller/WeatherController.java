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
import service.LocationService;
import service.WeatherService;

import java.util.List;

@Controller
public class WeatherController {
    private final LocationService locationService;
    private final WeatherService weatherService;
    private final ObjectMapper mapper = new ObjectMapper();

    public WeatherController(LocationService locationService, WeatherService weatherService) {
        this.locationService = locationService;
        this.weatherService = weatherService;
    }

    @GetMapping(value = "/searchLocations", produces = "application/json; charset=UTF-8")
    @ResponseBody
    public String getLocations(HttpServletRequest request, Model model) throws JsonProcessingException {
        String city = request.getParameter("city");
        List<LocationDto> locations = locationService.getLocations(city);
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
        locationService.addLocation(location, user);
        return "redirect:/home";
    }

    @GetMapping(value = "/getUserLocations", produces = "application/json; charset=UTF-8")
    @ResponseBody
    public String getUserLocations(HttpServletRequest request, Model model) throws JsonProcessingException {
        UserDto user = (UserDto) request.getAttribute("user");
        List<LocationDto> userLocations = locationService.getUserLocations(user);
        return mapper.writeValueAsString(userLocations);
    }

    @PostMapping("/deleteLocation")
    public String deleteLocation(@ModelAttribute LocationDto location, Model model, HttpServletRequest request) {
        UserDto user = (UserDto) request.getAttribute("user");
        locationService.deleteLocation(user, location);
        return "redirect:/home";
    }

}
