package com.swaphub.repository;

import com.swaphub.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    Optional<Conversation> findByUser1IdAndUser2IdAndItemId(UUID user1Id, UUID user2Id, UUID itemId);
    List<Conversation> findByUser1IdOrUser2Id(UUID user1Id, UUID user2Id);
}