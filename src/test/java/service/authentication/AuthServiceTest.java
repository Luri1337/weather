package service.authentication;

import config.TestApplicationConfig;
import dao.UserDao;
import dto.UserDto;
import model.Session;
import model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = TestApplicationConfig.class)
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    UserDao userDao;

    @Test
    void registerTest(){
        UserDto testUser= new UserDto("test", "password");
        Session session = authService.register(testUser);

        User user = userDao.getUserByLogin(testUser.getLogin()).orElse(null);


        assertAll(
                () -> assertNotNull(session),
                () -> assertNotNull(user)
        );
    }
}
