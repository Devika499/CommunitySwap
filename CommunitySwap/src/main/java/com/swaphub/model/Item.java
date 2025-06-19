package com.swaphub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.swaphub.model.SwapRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;
    private String category;
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    private String location;
    private Double latitude;
private Double longitude;

    @Enumerated(EnumType.STRING)
    private ItemType type;

    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
private List<SwapRequest> swapRequests = new ArrayList<>();

    public enum ItemType {
        SWAP, GIVEAWAY
    }

    public enum ItemStatus {
        AVAILABLE, SWAPPED, PENDING_SWAP
    }

    // No-arg constructor
    public Item() {
        this.status = ItemStatus.AVAILABLE;
    }

    // All-args constructor
    public Item(UUID id, String title, String description, String category, String imageUrl, String location,
                ItemType type, ItemStatus status, User user, boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.imageUrl = imageUrl;
        this.location = location;
        this.type = type;
        this.status = status;
        this.user = user;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    // Getters and setters for all fields

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ItemType getType() {
        return type;
    }

    public void setType(ItemType type) {
        this.type = type;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Helper to get owner ID directly for frontend convenience
    public UUID getOwnerId() {
        return this.user != null ? this.user.getId() : null;
    }
    public Double getLatitude() {
    return latitude;
}

public void setLatitude(Double latitude) {
    this.latitude = latitude;
}

public Double getLongitude() {
    return longitude;
}

public void setLongitude(Double longitude) {
    this.longitude = longitude;
}

}
