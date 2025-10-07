package service;

import dao.SessionDao;
import model.Session;
import model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {

    public static final int TIME_TO_EXPIRE = 30;

    private final SessionDao sessionDao;

    public SessionService(SessionDao sessionDao) {
        this.sessionDao = sessionDao;
    }

    public Session getOrCreateSession(User user) {
        Optional<Session> existing = getSessionByUserId(user.getId());

        if (existing.isPresent()) {
            if(!existing.get().getExpiresAt().isBefore(LocalDateTime.now())) {
                return existing.orElseThrow(() -> new RuntimeException("Session expired") );
            }
        }


        Session session = new Session();
        session.setExpiresAt(LocalDateTime.now().plusMinutes(TIME_TO_EXPIRE));
        session.setUser(user);

        sessionDao.save(session);

        return session;
    }

    public Session getSession(String sessionId) {
        return sessionDao.findById(UUID.fromString(sessionId)).orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public Optional<Session> getSessionByUserId(int userId) {
        return sessionDao.findByUserId(userId);
    }

    public void invalidate(String sessionId) {
        Session session = sessionDao.findById(UUID.fromString(sessionId)).orElseThrow(() -> new RuntimeException("Session not found"));
        sessionDao.delete(session);
    }
}
