package com.swaphub.controller;

import com.swaphub.model.Notification;
import com.swaphub.model.User;
import com.swaphub.service.NotificationService;
import com.swaphub.security.CustomUserDetails;
import com.swaphub.dto.NotificationResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getUserNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        List<Notification> notifications = notificationService.getNotificationsForUser(currentUser.getId());
        
        List<NotificationResponseDTO> notificationDTOs = notifications.stream().map(notification -> {
            NotificationResponseDTO dto = new NotificationResponseDTO();
            dto.setId(notification.getId());
            dto.setRecipientId(notification.getRecipient().getId());
            dto.setRecipientName(notification.getRecipient().getName());
            if (notification.getSender() != null) {
                dto.setSenderId(notification.getSender().getId());
                dto.setSenderName(notification.getSender().getName());
            }
            if (notification.getItem() != null) {
                dto.setItemId(notification.getItem().getId());
                dto.setItemTitle(notification.getItem().getTitle());
            }
            if (notification.getSwapRequest() != null) {
                dto.setSwapRequestId(notification.getSwapRequest().getId());
            }
            dto.setType(notification.getType());
            dto.setMessage(notification.getMessage());
            dto.setRead(notification.isRead());
            dto.setCreatedAt(notification.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOs);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadNotificationCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        long count = notificationService.getUnreadNotificationCount(currentUser.getId());
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markNotificationAsRead(@PathVariable UUID id) {
        Notification notification = notificationService.markNotificationAsRead(id);
        
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setRecipientId(notification.getRecipient().getId());
        dto.setRecipientName(notification.getRecipient().getName());
        if (notification.getSender() != null) {
            dto.setSenderId(notification.getSender().getId());
            dto.setSenderName(notification.getSender().getName());
        }
        if (notification.getItem() != null) {
            dto.setItemId(notification.getItem().getId());
            dto.setItemTitle(notification.getItem().getTitle());
        }
        if (notification.getSwapRequest() != null) {
            dto.setSwapRequestId(notification.getSwapRequest().getId());
        }
        dto.setType(notification.getType());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());

        return ResponseEntity.ok(dto);
    }
} 