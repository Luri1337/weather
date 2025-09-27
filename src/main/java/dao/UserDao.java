package dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import model.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserDao {
    @PersistenceContext
    EntityManager entityManager;

    public Optional<User> getUserByEmail(String email) {
        return Optional.ofNullable(entityManager.find(User.class, email));
    }

    public void save(User user) {
        entityManager.getTransaction().begin();
        entityManager.persist(user);
        entityManager.getTransaction().commit();
    }
}
