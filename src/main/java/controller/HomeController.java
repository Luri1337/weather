package controller;

import dto.UserDto;
import dto.UserViewDto;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping( "/home")
    public String home(HttpServletRequest req, Model model) {
        UserDto user = (UserDto) req.getAttribute("user");
        model.addAttribute("user",new UserViewDto(user.getLogin()));
        return "home";
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }
}
