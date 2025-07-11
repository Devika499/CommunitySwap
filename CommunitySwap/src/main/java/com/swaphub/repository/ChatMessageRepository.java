package com.swaphub.repository;

import com.swaphub.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByConversationId(UUID conversationId);
    List<ChatMessage> findByConversationIdOrderByTimestampAsc(UUID conversationId);
}