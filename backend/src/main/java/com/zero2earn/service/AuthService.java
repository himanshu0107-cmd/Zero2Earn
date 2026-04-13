package com.zero2earn.service;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.dto.LoginRequest;
import com.zero2earn.dto.RegisterRequest;
import com.zero2earn.model.User;
import com.zero2earn.repository.UserDao;
import com.zero2earn.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired private UserDao userDao;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    public ApiResponse<?> register(RegisterRequest req) {
        if (userDao.existsByEmail(req.getEmail())) {
            return ApiResponse.error("Email already registered");
        }
        if (userDao.existsByUsername(req.getUsername())) {
            return ApiResponse.error("Username already taken");
        }

        User user = new User();
        user.setName(req.getName());
        user.setUsername(req.getUsername().toLowerCase().trim());
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole().toUpperCase() : "STUDENT");
        user.setCollegeId(req.getCollegeId());

        Integer userId = userDao.save(user);
        user.setId(userId);

        String token = jwtUtil.generateToken(userId, user.getEmail(), user.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", buildUserResponse(user));

        return ApiResponse.ok("Registration successful", data);
    }

    public ApiResponse<?> login(LoginRequest req) {
        Optional<User> userOpt = userDao.findByEmail(req.getEmail().toLowerCase().trim());

        if (userOpt.isEmpty()) {
            return ApiResponse.error("Invalid email or password");
        }

        User user = userOpt.get();

        if (!user.getActive()) {
            return ApiResponse.error("Account is disabled. Contact support.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ApiResponse.error("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        user.setPasswordHash(null); // never expose

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", buildUserResponse(user));

        return ApiResponse.ok("Login successful", data);
    }

    public ApiResponse<?> validate(String token) {
        if (!jwtUtil.validateToken(token)) {
            return ApiResponse.error("Invalid or expired token");
        }
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Optional<User> userOpt = userDao.findById(userId);
        if (userOpt.isEmpty()) return ApiResponse.error("User not found");

        User user = userOpt.get();
        user.setPasswordHash(null);
        return ApiResponse.ok(buildUserResponse(user));
    }

    private Map<String, Object> buildUserResponse(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("username", u.getUsername());
        m.put("email", u.getEmail());
        m.put("role", u.getRole());
        m.put("collegeId", u.getCollegeId());
        m.put("collegeName", u.getCollegeName());
        m.put("avatarUrl", u.getAvatarUrl());
        m.put("xp", u.getXp());
        m.put("rating", u.getRating());
        m.put("walletBalance", u.getWalletBalance());
        return m;
    }
}
