package service;

import dto.UserDto;
import org.springframework.transaction.annotation.Transactional;
import model.User;
import org.springframework.stereotype.Service;

//TODO в этом сервисе будет 2 метода для логина и регистрации соответственно,
// логика сервисов юзера и сессии будет отвечать только за юзера и сервис соответственно,
// чтобы не нарушать срп и более структурно разделить бизнес логику.
// То есть все запросы на авторизацию или аутентификацию будут идти в этот сервис сначала
@Service
@Transactional
public class AuthService {
    private final UserService userService;
    private final SessionService sessionService;

    AuthService(UserService userService, SessionService sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }

    public void register(UserDto userDto) {
        userService.saveUser(userDto);
    }

    public void authenticate(UserDto userDto) {
        User user = userService.getUserByLogin(userDto);
        sessionService.createSession(user);
    }
}
