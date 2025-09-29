package service;

import jakarta.transaction.Transactional;
import model.Session;
import model.User;
import org.hibernate.grammars.hql.HqlParser;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
@Transactional
public class SessionService {

    public static final int TIME_TO_EXPIRE = 30;

    public Session createSession(User user) {
        Session session = new Session();
        session.setExpiresAt(LocalDateTime.now().plusMinutes(TIME_TO_EXPIRE));
        session.setUserId(user);
        return session;
    }
}
