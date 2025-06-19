package com.swaphub.service;

import com.swaphub.model.PointsLog;
import com.swaphub.model.User;
import com.swaphub.repository.PointsLogRepository;
import com.swaphub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PointsService {
    private final PointsLogRepository pointsLogRepository;
    private final UserRepository userRepository;

    public PointsService(PointsLogRepository pointsLogRepository, UserRepository userRepository) {
        this.pointsLogRepository = pointsLogRepository;
        this.userRepository = userRepository;
    }

    public void addPoints(UUID userId, int points, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PointsLog pointsLog = new PointsLog();
        pointsLog.setUser(user);
        pointsLog.setPoints(points);
        pointsLog.setDescription(description);
        pointsLogRepository.save(pointsLog);
        
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
    }

    public List<PointsLog> getUserPointsLog(UUID userId) {
        return pointsLogRepository.findByUserId(userId);
    }
}