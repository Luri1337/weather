package service.authentication;

import config.TestApplicationConfig;
import dao.SessionDao;
import dto.UserDto;
import model.Session;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = TestApplicationConfig.class)
@Transactional
class SessionServiceTest {
    @Autowired
    private SessionService sessionService;
    @Autowired
    private SessionDao sessionDao;

    @Autowired
    private AuthService authService;


    @Test
    void sessionExpireTest() {
        UserDto testUser = new UserDto("test", "password");
        Session session = authService.register(testUser);

        session.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        sessionDao.update(session);

        //Call func that need appropriate session to check if it invalidated
        authService.authenticate(testUser);

        assertThrows(Exception.class, () -> sessionService.getSession(String.valueOf(session.getId())));

    }
}

