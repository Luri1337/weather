package service.authentication;

import dto.UserDto;
import model.Session;
import model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.UserService;

@Service
public class AuthService {
    private final UserService userService;
    private final SessionService sessionService;

    AuthService(UserService userService, SessionService sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }

    @Transactional
    public Session register(UserDto userDto) {
        userService.saveUser(userDto);
        return authenticate(userDto);
    }

    @Transactional
    public Session authenticate(UserDto userDto) {
        User user = userService.getUserByLoginAndCheckPass(userDto);
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
