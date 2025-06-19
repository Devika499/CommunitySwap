package com.swaphub.controller;

import com.swaphub.model.SwapRequest;
import com.swaphub.service.SwapRequestService;
import com.swaphub.service.NotificationService;
import com.swaphub.repository.ItemRepository;
import com.swaphub.repository.UserRepository;
import com.swaphub.model.Item;
import com.swaphub.model.User;
import com.swaphub.model.Notification;
import com.swaphub.security.CustomUserDetails;
import com.swaphub.dto.SwapRequestResponseDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/swap-requests")
@RequiredArgsConstructor
public class SwapRequestController {
	private final SwapRequestService swapRequestService;
    private final NotificationService notificationService;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody SwapRequestDTO requestDTO) {
        try {
            SwapRequest request = swapRequestService.createSwapRequest(
                requestDTO.getRequestedItemId(),
                requestDTO.getRequesterId()
            );

            Item requestedItem = itemRepository.findById(requestDTO.getRequestedItemId())
                                    .orElseThrow(() -> new RuntimeException("Requested item not found"));
            User requesterUser = userRepository.findById(requestDTO.getRequesterId())
                                    .orElseThrow(() -> new RuntimeException("Requester user not found"));
            User itemOwner = requestedItem.getUser();

            String message = String.format("%s has requested to swap for your item: %s",
                                        requesterUser.getName(), requestedItem.getTitle());
            notificationService.createNotification(itemOwner, requesterUser, requestedItem, request, "SWAP_REQUEST", message);

            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/item/{itemId}")
    public List<SwapRequest> getByItem(@PathVariable UUID itemId) {
        return swapRequestService.getRequestsByItem(itemId);
    }
    
    @GetMapping("/my-swaps")
    public ResponseEntity<List<SwapRequestResponseDTO>> getMySwaps() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User currentUser = userDetails.getUser();
            List<SwapRequest> swaps = swapRequestService.getMySwapRequests(currentUser.getId());
            List<SwapRequestResponseDTO> swapDTOs = swaps.stream()
                .map(SwapRequestResponseDTO::fromSwapRequest)
                .collect(Collectors.toList());
            return ResponseEntity.ok(swapDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/accept")
    public SwapRequest acceptRequest(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // this gives the authenticated user's email

        SwapRequest acceptedRequest = swapRequestService.acceptRequest(id, email);

        // Create notification for the requester that their swap request has been accepted
        if (acceptedRequest != null) {
            User requester = acceptedRequest.getRequester();
            Item requestedItem = acceptedRequest.getItem();
            User itemOwner = acceptedRequest.getItem().getUser();

            String message = String.format("Your swap request for \"%s\" has been accepted by %s!",
                                        requestedItem.getTitle(), itemOwner.getName());
            notificationService.createNotification(requester, itemOwner, requestedItem, acceptedRequest, "SWAP_ACCEPTED", message);
        }
        return acceptedRequest;
    }


    @PutMapping("/{id}/complete")
    public SwapRequest completeRequest(@PathVariable UUID id) {
        return swapRequestService.completeRequest(id);
    }
}

// DTO for swap request creation
class SwapRequestDTO {
    private UUID requestedItemId;
    private UUID requesterId;

    // Getters and setters
    public UUID getRequestedItemId() { return requestedItemId; }
    public void setRequestedItemId(UUID requestedItemId) { this.requestedItemId = requestedItemId; }
    public UUID getRequesterId() { return requesterId; }
    public void setRequesterId(UUID requesterId) { this.requesterId = requesterId; }
}
