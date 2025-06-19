package com.swaphub.controller;

import com.swaphub.model.User;
import com.swaphub.repository.UserRepository;
import com.swaphub.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.swaphub.dto.UserProfileResponse;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        
        UserProfileResponse response = new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getLocation()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateCurrentUser(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        // Update only allowed fields
        currentUser.setName(updatedUser.getName());
        currentUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getLocation() != null) {
            currentUser.setLocation(updatedUser.getLocation());
        }

        // If password update is requested
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        User savedUser = userRepository.save(currentUser);
        UserProfileResponse response = new UserProfileResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getLocation()
        );
        return ResponseEntity.ok(response);
    }
} 