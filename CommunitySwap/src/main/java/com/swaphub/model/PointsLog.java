package com.swaphub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "points_log")
public class PointsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private int points;
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public PointsLog() {}

    public PointsLog(UUID id, User user, int points, String description, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.points = points;
        this.description = description;
        this.createdAt = createdAt;
    }

    // Getters
    public UUID getId() { return id; }
    public User getUser() { return user; }
    public int getPoints() { return points; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setPoints(int points) { this.points = points; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
