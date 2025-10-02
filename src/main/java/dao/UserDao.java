package dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import model.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserDao {
    @PersistenceContext
    private EntityManager entityManager;

    public Optional<User> getUserByLogin(String login) {
       User user =  entityManager.createQuery("select u from User u where u.login = :login", User.class)
                .setParameter("login", login)
                .getSingleResult();
       return Optional.ofNullable(user);
    }

    public void save(User user) {
        entityManager.persist(user);
    }
}
