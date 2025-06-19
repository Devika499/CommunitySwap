package com.swaphub.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    public Conversation() {}

    public Conversation(UUID id, User user1, User user2, Item item) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
        this.item = item;
    }

    // Getters
    public UUID getId() { return id; }
    public User getUser1() { return user1; }
    public User getUser2() { return user2; }
    public Item getItem() { return item; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setUser1(User user1) { this.user1 = user1; }
    public void setUser2(User user2) { this.user2 = user2; }
    public void setItem(Item item) { this.item = item; }
}
