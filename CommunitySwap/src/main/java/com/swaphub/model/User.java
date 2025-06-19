package com.swaphub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String location;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private int points = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum Role {
        USER, ADMIN
    }

    // --- Constructors ---
    public User() {}

    public User(UUID id, String name, String email, String password, String location, Role role, int points, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.location = location;
        this.role = role;
        this.points = points;
        this.createdAt = createdAt;
    }

    // --- Getters ---
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getLocation() { return location; }
    public Role getRole() { return role; }
    public int getPoints() { return points; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // --- Setters ---
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setLocation(String location) { this.location = location; }
    public void setRole(Role role) { this.role = role; }
    public void setPoints(int points) { this.points = points; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private java.util.List<SwapRequest> requests = new java.util.ArrayList<>();

}
