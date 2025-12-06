package service;

import dao.UserDao;
import dto.UserDto;
import model.User;
import org.springframework.stereotype.Service;
import util.PasswordUtil;
import util.exception.NotUniqueLoginException;

import java.util.Optional;

@Service
public class UserService {
    private final UserDao userDao;
    private final PasswordUtil passwordUtil = new PasswordUtil();

    UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public void saveUser(UserDto userDto) {
        if (!isUnique(userDto)) {
            throw new NotUniqueLoginException("Login already exists");
        }

        User user = new User();
        user.setLogin(userDto.getLogin());
        user.setPassword(passwordUtil.hashPassword(userDto.getPassword()));
        userDao.save(user);
    }

    public User getUserByLoginAndCheckPass(UserDto userDto) {
        User user = userDao.getUserByLogin(userDto.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordUtil.checkPassword(userDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return user;
    }

    public User getUserByLogin(UserDto userDto) {
        return userDao.getUserByLogin(userDto.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private boolean isUnique(UserDto userDto) {
        Optional<User> user = userDao.getUserByLogin(userDto.getLogin());
        return user.isEmpty();
    }
}
