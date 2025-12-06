package dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<User> getUserByLogin(String login) {
       List<User> users =  em.createQuery("select u from User u where u.login = :login", User.class)
                .setParameter("login", login)
                .getResultList();
       return users.stream().findFirst();
    }

    public void save(User user) {
        em.persist(user);
    }
}
