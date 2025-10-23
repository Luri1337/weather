package controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WeatherController {

    @GetMapping
    public void getLocations() {

    }

    @GetMapping
    public void getWeather(){}

}
