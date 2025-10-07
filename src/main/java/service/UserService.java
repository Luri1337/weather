package service;

import dao.UserDao;
import dto.UserDto;
import model.User;
import org.springframework.stereotype.Service;
import util.PasswordUtil;

@Service
public class UserService {
    private final UserDao userDao;
    private final PasswordUtil passwordUtil = new PasswordUtil();

    UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public void saveUser(UserDto userDto) {
        User user = new User();
        user.setLogin(userDto.getLogin());
        user.setPassword(passwordUtil.hashPassword(userDto.getPassword()));
        userDao.save(user);
    }

    public User getUserByLogin(UserDto userDto) {
        User user = userDao.getUserByLogin(userDto.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordUtil.checkPassword(userDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return user;
    }
}
