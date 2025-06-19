package com.swaphub.service;

import com.swaphub.model.SwapRequest;
import java.util.List;
import java.util.UUID;

public interface SwapRequestService {
    SwapRequest createSwapRequest(UUID itemId, UUID requesterId);
    List<SwapRequest> getRequestsByItem(UUID itemId);
    SwapRequest acceptRequest(UUID requestId, String currentUserEmail);
    SwapRequest completeRequest(UUID requestId);
    List<SwapRequest> getMySwapRequests(UUID userId);
}