package com.swaphub.service.impl;

import com.swaphub.service.PointsService;
import com.swaphub.model.SwapRequest;
import com.swaphub.model.SwapRequest.SwapStatus;
import com.swaphub.model.User;
import com.swaphub.repository.SwapRequestRepository;
import com.swaphub.service.ItemService;
import com.swaphub.service.SwapRequestService;
import com.swaphub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import com.swaphub.model.Item;

@Service
@RequiredArgsConstructor
public class SwapRequestServiceImpl implements SwapRequestService {

	private final SwapRequestRepository swapRequestRepository;
    private final ItemService itemService;
    private final UserService userService;
    private final PointsService pointsService;

    @Override
    @Transactional
    public SwapRequest createSwapRequest(UUID itemId, UUID requesterId) {
        if (!itemService.existsById(itemId)) {
            throw new RuntimeException("Item not found");
        }
        if (!userService.existsById(requesterId)) {
            throw new RuntimeException("User not found");
        }

        SwapRequest request = new SwapRequest();
        request.setRequester(userService.getUserById(requesterId));
        request.setItem(itemService.getItemById(itemId));
        request.setStatus(SwapStatus.REQUESTED);

        return swapRequestRepository.save(request);
    }

    @Override
    @Transactional
    public SwapRequest acceptRequest(UUID requestId, String currentUserEmail) {
        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Swap request not found"));

        User itemOwner = request.getItem().getUser();
        if (!itemOwner.getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("User not authorized to accept this request");
        }

        request.setStatus(SwapStatus.ACCEPTED);

        // Set the item status to SWAPPED
        Item itemToUpdate = request.getItem();
        itemToUpdate.setStatus(Item.ItemStatus.SWAPPED);
        itemService.saveItem(itemToUpdate); // Save the updated item

        return swapRequestRepository.save(request);
    }

    @Override
    @Transactional
    public SwapRequest completeRequest(UUID requestId) {
        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Swap request not found"));

        if (request.getStatus() != SwapStatus.ACCEPTED) {
            throw new RuntimeException("Swap request must be accepted before it can be completed");
        }

        // Add points to the item owner and requester
        pointsService.addPoints(request.getItem().getUser().getId(), 10, "Item swap completed");
        pointsService.addPoints(request.getRequester().getId(), 5, "Item swap completed (requester)");

        request.setStatus(SwapStatus.COMPLETED);
        return swapRequestRepository.save(request);
    }

    @Override
    public List<SwapRequest> getRequestsByItem(UUID itemId) {
        return swapRequestRepository.findByItemId(itemId);
    }

    @Override
    public List<SwapRequest> getMySwapRequests(UUID userId) {
        return swapRequestRepository.findByRequesterIdOrItemUserId(userId);
    }
}
