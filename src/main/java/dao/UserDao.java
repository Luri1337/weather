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

    public Optional<User> getUserByLogin(String login) {
        return Optional.ofNullable(entityManager.find(User.class, login));
    }

    public void save(User user) {
        entityManager.persist(user);
    }
}
