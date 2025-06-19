package com.swaphub.repository;

import com.swaphub.model.SwapRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

public interface SwapRequestRepository extends JpaRepository<SwapRequest, UUID> {
    List<SwapRequest> findByItemId(UUID itemId);
    List<SwapRequest> findByRequesterId(UUID requesterId);

    @Query("SELECT sr FROM SwapRequest sr WHERE sr.requester.id = :userId OR sr.item.user.id = :userId")
    List<SwapRequest> findByRequesterIdOrItemUserId(UUID userId);
}