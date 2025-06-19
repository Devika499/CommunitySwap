package com.swaphub.repository;

import com.swaphub.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {
    // Reference Item.ItemType (the inner enum)
    List<Item> findByType(Item.ItemType type);
    
    List<Item> findByLocation(String location);
    
    // Updated to use Item.ItemType
    List<Item> findByTypeAndLocation(Item.ItemType type, String location);
    
    List<Item> findByUserId(UUID userId); 
    List<Item> findByUserIdNot(UUID userId);
    @Query(value = "SELECT * FROM items WHERE (6371 * acos(LEAST(1, GREATEST(-1, cos(radians(:lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(latitude)))))) < :radius", nativeQuery = true)
    List<Item> findByLocationWithinRadius(@Param("lat") double lat, @Param("lng") double lng, @Param("radius") double radius);
}