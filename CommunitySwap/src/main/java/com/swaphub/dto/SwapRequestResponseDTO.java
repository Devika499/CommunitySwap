package com.swaphub.dto;

import com.swaphub.model.SwapRequest;
import java.time.LocalDateTime;
import java.util.UUID;

public class SwapRequestResponseDTO {
    private UUID id;
    private UUID itemId;
    private String itemTitle;
    private UUID requesterId;
    private String requesterName;
    private UUID itemOwnerId;
    private String itemOwnerName;
    private String status;
    private LocalDateTime createdAt;

    public static SwapRequestResponseDTO fromSwapRequest(SwapRequest request) {
        SwapRequestResponseDTO dto = new SwapRequestResponseDTO();
        dto.setId(request.getId());
        dto.setItemId(request.getItem().getId());
        dto.setItemTitle(request.getItem().getTitle());
        dto.setRequesterId(request.getRequester().getId());
        dto.setRequesterName(request.getRequester().getName());
        dto.setItemOwnerId(request.getItem().getUser().getId());
        dto.setItemOwnerName(request.getItem().getUser().getName());
        dto.setStatus(request.getStatus().toString());
        dto.setCreatedAt(request.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }
    public UUID getRequesterId() { return requesterId; }
    public void setRequesterId(UUID requesterId) { this.requesterId = requesterId; }
    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
    public UUID getItemOwnerId() { return itemOwnerId; }
    public void setItemOwnerId(UUID itemOwnerId) { this.itemOwnerId = itemOwnerId; }
    public String getItemOwnerName() { return itemOwnerName; }
    public void setItemOwnerName(String itemOwnerName) { this.itemOwnerName = itemOwnerName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 