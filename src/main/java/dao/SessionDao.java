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
        em.getTransaction().begin();
        em.persist(session);
        em.getTransaction().commit();
    }

    public Optional<Session> findById(int id) {
        return Optional.ofNullable(em.find(Session.class, id));
    }

    public void delete(Session session) {
        em.getTransaction().begin();
        em.remove(session);
        em.getTransaction().commit();
    }
}
