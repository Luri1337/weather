package controller;

import dto.UserDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import service.AuthService;
import service.UserService;

@Controller
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/auth")
    public String auth() {
        return "auth";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@ModelAttribute UserDto userDto, Model model) {
        authService.authenticate(userDto);
        model.addAttribute("user", userDto);
        return "redirect:/";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }

    @PostMapping("/signup")
    public String signupUser(@ModelAttribute UserDto userDto, Model model) {
        authService.register(userDto);
        model.addAttribute("user", userDto);
        return "redirect:/";
    }

    @PostMapping("/logout")
    public String logout() {
        return "logout";
    }
}
