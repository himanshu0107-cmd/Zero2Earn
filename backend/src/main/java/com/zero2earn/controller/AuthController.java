package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.dto.LoginRequest;
import com.zero2earn.dto.RegisterRequest;
import com.zero2earn.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        ApiResponse<?> response = authService.register(req);
        return ResponseEntity.status(response.isSuccess() ? 201 : 400).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        ApiResponse<?> response = authService.login(req);
        return ResponseEntity.status(response.isSuccess() ? 200 : 401).body(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validate(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("No token provided"));
        }
        ApiResponse<?> response = authService.validate(authHeader.substring(7));
        return ResponseEntity.status(response.isSuccess() ? 200 : 401).body(response);
    }
}
