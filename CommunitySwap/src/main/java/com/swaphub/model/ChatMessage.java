package com.swaphub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false)
    private String message;

    @CreationTimestamp
    private LocalDateTime timestamp;

    public ChatMessage() {}

    public ChatMessage(UUID id, Conversation conversation, User sender, String message, LocalDateTime timestamp) {
        this.id = id;
        this.conversation = conversation;
        this.sender = sender;
        this.message = message;
        this.timestamp = timestamp;
    }

    // Getters
    public UUID getId() { return id; }
    public Conversation getConversation() { return conversation; }
    public User getSender() { return sender; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setConversation(Conversation conversation) { this.conversation = conversation; }
    public void setSender(User sender) { this.sender = sender; }
    public void setMessage(String message) { this.message = message; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
