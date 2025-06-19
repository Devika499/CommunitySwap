package com.swaphub.service;

import com.swaphub.model.User;
import java.util.UUID;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User createUser(User user);
    User getUserById(UUID userId);
    boolean existsById(UUID userId);
    User registerUser(User user);
}
