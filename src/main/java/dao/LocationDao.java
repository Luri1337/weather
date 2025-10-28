package dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import model.Location;
import org.springframework.stereotype.Repository;

@Repository
public class LocationDao {
    @PersistenceContext
    private EntityManager em;

    public void save(Location location) {
        em.persist(location);
    }
}
