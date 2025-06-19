package com.swaphub.service;

import com.swaphub.model.User;
import com.swaphub.repository.UserRepository;
import com.swaphub.security.CustomUserDetails;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@Primary
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
          .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return new CustomUserDetails(user);
    }
}
