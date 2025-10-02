package dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import model.Session;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class SessionDao {
    @PersistenceContext
    private EntityManager em;

    public void save(Session session) {
        em.persist(session);
    }

    public Optional<Session> findById(String id) {
        return Optional.ofNullable(em.find(Session.class, id));
    }

    public void delete(Session session) {
        em.remove(session);
    }
}
