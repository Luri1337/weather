package service;

import dao.SessionDao;
import dto.UserDto;
import model.Session;
import model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//TODO исправить ошибку, при регистрации(ошибка возникает при sign up)
//доработать авторизацию полностью уже
@Service
public class AuthService {
    private final UserService userService;
    private final SessionService sessionService;
    private final SessionDao sessionDao;

    AuthService(UserService userService, SessionService sessionService, SessionDao sessionDao) {
        this.userService = userService;
        this.sessionService = sessionService;
        this.sessionDao = sessionDao;
    }

    @Transactional
    public Session register(UserDto userDto) {
        userService.saveUser(userDto);
        return authenticate(userDto);
    }

    @Transactional
    public Session authenticate(UserDto userDto) {
        User user = userService.getUserByLogin(userDto);
        return sessionService.createSession(user);
    }
}
