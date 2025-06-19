package com.swaphub.controller;

import com.swaphub.model.User;
import com.swaphub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // Get all users (Admin-only)
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Ban a user (Admin-only)
    @DeleteMapping("/users/{id}")
    public void banUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
    }
}