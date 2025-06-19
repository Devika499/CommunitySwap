package com.swaphub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id") // Can be null if system-generated
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id") // Related item, can be null for general notifications
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "swap_request_id") // Link to associated swap request, can be null
    private SwapRequest swapRequest;

    @Column(nullable = false)
    private String type; // e.g., "SWAP_REQUEST", "MESSAGE", "GENERAL"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private boolean isRead = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Notification() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public SwapRequest getSwapRequest() {
        return swapRequest;
    }

    public void setSwapRequest(SwapRequest swapRequest) {
        this.swapRequest = swapRequest;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 