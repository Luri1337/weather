package service;

import dao.SessionDao;
import dto.UserDto;
import model.Session;
import model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserService userService;
    private final SessionService sessionService;
    private final CookieService cookieService;

    AuthService(UserService userService, SessionService sessionService, CookieService cookieService) {
        this.userService = userService;
        this.sessionService = sessionService;
        this.cookieService = cookieService;
    }

    @Transactional
    public Session register(UserDto userDto) {
        userService.saveUser(userDto);
        return authenticate(userDto);
    }

    @Transactional
    public Session authenticate(UserDto userDto) {
        User user = userService.getUserByLogin(userDto);
        return sessionService.getOrCreateSession(user);
    }

    @Transactional
    public Session logout(UserDto userDto) {
        User user = userService.getUserByLogin(userDto);
        Session session = sessionService.getOrCreateSession(user);
        sessionService.invalidate(String.valueOf(session.getId()));
        return session;
    }
}
