package dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import model.Location;
import model.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LocationDao {
    @PersistenceContext
    private EntityManager em;

    public void save(Location location) {
        em.persist(location);
    }

    public List<Location> getUserLocations(User userId) {
        return em.createQuery("select l from Location l where l.userId = :userId", Location.class)
                .setParameter("userId", userId)
                .getResultList();
    }
}
