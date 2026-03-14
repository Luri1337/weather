package controller;

import dto.UserDto;
import dto.UserViewDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import model.Session;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import service.authentication.AuthService;
import service.authentication.CookieService;

@Controller
public class AuthController {
    private final AuthService authService;
    private final CookieService cookieService;

    public AuthController(AuthService authService, CookieService cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@ModelAttribute @Valid UserDto userDto, BindingResult bindingResult, Model model, HttpServletResponse response) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("error", bindingResult.getAllErrors().getFirst().getDefaultMessage());
            return "login";
        }

        Session session = authService.authenticate(userDto);
        Cookie cookie = cookieService.createCookie(session.getId().toString());
        response.addCookie(cookie);
        model.addAttribute("user", new UserViewDto(userDto.getLogin()));
        return "home";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }

    @PostMapping("/signup")
    public String signupUser(@ModelAttribute @Valid UserDto userDto, BindingResult bindingResult, Model model, HttpServletResponse response) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("error", bindingResult.getAllErrors().getFirst().getDefaultMessage());
            return "signup";
        }

        Session session = authService.register(userDto);
        Cookie cookie = cookieService.createCookie(session.getId().toString());
        response.addCookie(cookie);
        model.addAttribute("user", new UserViewDto(userDto.getLogin()));
        return "/home";
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        UserDto user = (UserDto) request.getAttribute("user");
        Session session = authService.logout(user);
        Cookie cookie = cookieService.deleteCookie(String.valueOf(session.getId()));
        response.addCookie(cookie);
        return "index";
    }
}
