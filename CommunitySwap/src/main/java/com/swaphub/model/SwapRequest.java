package com.swaphub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.swaphub.model.Notification;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    @JsonManagedReference
    private Item item;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id", nullable = false)
    @JsonManagedReference
    private User requester;

    @Enumerated(EnumType.STRING)
    private SwapStatus status = SwapStatus.REQUESTED;

    @OneToMany(mappedBy = "swapRequest", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Notification> notifications = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    public SwapRequest() {}

    public SwapRequest(UUID id, Item item, User requester, SwapStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.item = item;
        this.requester = requester;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters
    public UUID getId() { return id; }
    public Item getItem() { return item; }
    public User getRequester() { return requester; }
    public SwapStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setItem(Item item) { this.item = item; }
    public void setRequester(User requester) { this.requester = requester; }
    public void setStatus(SwapStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum SwapStatus {
        REQUESTED, ACCEPTED, REJECTED, COMPLETED
    }
}
