package com.swaphub.controller;

import com.swaphub.model.PointsLog;
import com.swaphub.model.User;
import com.swaphub.repository.PointsLogRepository;
import com.swaphub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/points")
public class PointsController {

    @Autowired
    private PointsLogRepository pointsLogRepository;

    @Autowired
    private UserRepository userRepository;

    // Add points to a user (e.g., after swap completion)
    @PostMapping("/add")
    public User addPoints(
            @RequestParam UUID userId,
            @RequestParam int points,
            @RequestParam String description) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setPoints(user.getPoints() + points);

        PointsLog log = new PointsLog();
        log.setUser(user);
        log.setPoints(points);
        log.setDescription(description);
        pointsLogRepository.save(log);

        return userRepository.save(user);
    }

    // Get points history for a user
    @GetMapping("/history/{userId}")
    public List<PointsLog> getPointsHistory(@PathVariable UUID userId) {
        return pointsLogRepository.findByUserId(userId);
    }
}