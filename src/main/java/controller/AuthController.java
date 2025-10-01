package controller;

import dto.UserDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import model.Session;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import service.AuthService;
import service.CookieService;
import service.UserService;

@Controller
public class AuthController {
    private final AuthService authService;
    private final CookieService cookieService;

    public AuthController(AuthService authService, CookieService cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
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
    public String loginUser(@ModelAttribute UserDto userDto, Model model, HttpServletResponse response) {
        Session session = authService.authenticate(userDto);
        Cookie cookie = cookieService.createCookie(session.getId().toString());
        response.addCookie(cookie);
        model.addAttribute("user", userDto);
        return "redirect:/";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }

    @PostMapping("/signup")
    public String signupUser(@ModelAttribute UserDto userDto, Model model, HttpServletResponse response) {
        Session session = authService.register(userDto);
        Cookie cookie = cookieService.createCookie(session.getId().toString());
        response.addCookie(cookie);
        model.addAttribute("user", userDto);
        return "redirect:/";
    }

    @PostMapping("/logout")
    public String logout() {
        return "logout";
    }
}
