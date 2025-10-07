package dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import model.Session;
import model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class SessionDao {
    @PersistenceContext
    private EntityManager em;

    public void save(Session session) {
        em.persist(session);
    }

    public Optional<Session> findById(UUID id) {
        return Optional.ofNullable(em.find(Session.class, id));
    }

    public Optional<Session> findByUserId(int userId) {
        List<Session> session = em.createQuery("select s from Session s where s.user.id = :userId", Session.class)
                .setParameter("userId", userId)
                .getResultList();
       return session.isEmpty() ? Optional.empty() : Optional.of(session.getFirst());
    }

    public void delete(Session session) {
        em.remove(session);
    }
}
