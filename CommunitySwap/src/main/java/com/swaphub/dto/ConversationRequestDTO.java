package com.swaphub.dto;

import java.util.UUID;

public class ConversationRequestDTO {
    private UUID senderId;
    private UUID receiverId;
    private UUID itemId;

    // Getters and Setters
    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public UUID getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(UUID receiverId) {
        this.receiverId = receiverId;
    }

    public UUID getItemId() {
        return itemId;
    }

    public void setItemId(UUID itemId) {
        this.itemId = itemId;
    }
} 