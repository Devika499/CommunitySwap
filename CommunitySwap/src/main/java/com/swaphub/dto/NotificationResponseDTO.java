package com.swaphub.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationResponseDTO {
    private UUID id;
    private UUID recipientId;
    private String recipientName; // Optionally include name for display
    private UUID senderId; // Can be null
    private String senderName; // Optionally include name for display
    private UUID itemId; // Can be null
    private String itemTitle; // Optionally include item title for display
    private UUID swapRequestId; // New: Link to associated swap request, can be null
    private String type;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getRecipientId() { return recipientId; }
    public void setRecipientId(UUID recipientId) { this.recipientId = recipientId; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }
    public UUID getSwapRequestId() { return swapRequestId; }
    public void setSwapRequestId(UUID swapRequestId) { this.swapRequestId = swapRequestId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 