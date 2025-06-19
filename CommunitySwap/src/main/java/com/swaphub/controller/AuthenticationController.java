package com.swaphub.controller;

import com.swaphub.config.JwtService;
import com.swaphub.model.User;
import com.swaphub.service.UserService;
import com.swaphub.dto.AuthResponse;
import com.swaphub.dto.LoginRequest;
import com.swaphub.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    // ✅ Manual constructor for dependency injection
    public AuthenticationController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtService.generateToken(userDetails);
        
        CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
        AuthResponse authResponse = new AuthResponse(jwt, customUserDetails.getId());

        return ResponseEntity.ok(authResponse);
    }
}
