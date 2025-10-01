package service;

import dao.SessionDao;
import model.Session;
import model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SessionService {

    public static final int TIME_TO_EXPIRE = 30;

    private final SessionDao sessionDao;

    public SessionService(SessionDao sessionDao) {
        this.sessionDao = sessionDao;
    }

    public Session createSession(User user) {
        Session session = new Session();
        session.setExpiresAt(LocalDateTime.now().plusMinutes(TIME_TO_EXPIRE));
        session.setUser(user);

        sessionDao.save(session);

        return session;
    }

    public int getUserId(String sessionId) {
        Session session = sessionDao.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        return session.getUser().getId();
    }

    public void invalidate(String sessionId) {
        Session session = sessionDao.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        sessionDao.delete(session);
    }
}
