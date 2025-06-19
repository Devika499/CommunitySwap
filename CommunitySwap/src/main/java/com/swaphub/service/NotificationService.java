package com.swaphub.service;

import com.swaphub.model.Item;
import com.swaphub.model.Notification;
import com.swaphub.model.User;
import com.swaphub.model.SwapRequest;
import com.swaphub.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User recipient, User sender, Item item, String type, String message) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setItem(item);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public Notification createNotification(User recipient, User sender, Item item, SwapRequest swapRequest, String type, String message) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setItem(item);
        notification.setSwapRequest(swapRequest);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(UUID userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadNotificationCount(UUID userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public Notification markNotificationAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
} 