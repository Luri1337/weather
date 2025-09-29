package controller;

import dto.UserDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import service.UserService;

@Controller
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
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
        userService.authenticateUser(userDto);
        model.addAttribute("user", userDto);
        return "redirect:/";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }

    @PostMapping("/signup")
    public String signupUser(@ModelAttribute UserDto userDto, Model model) {
        userService.registerUser(userDto);
        model.addAttribute("user", userDto);
        return "redirect:/";
    }

    @PostMapping("/logout")
    public String logout() {
        return "logout";
    }
}
