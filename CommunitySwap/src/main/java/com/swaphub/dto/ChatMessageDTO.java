package com.swaphub.dto;

import java.util.UUID;

public class ChatMessageDTO {
    private UUID conversationId;
    private UUID senderId;
    private String message;

    public UUID getConversationId() { return conversationId; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }
    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
} 