package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.User;
import com.zero2earn.repository.ReviewDao;
import com.zero2earn.repository.UserDao;
import com.zero2earn.security.JwtUtil;
import com.zero2earn.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserDao userDao;
    @Autowired private ReviewDao reviewDao;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private NotificationService notificationService;
    @Autowired private JdbcTemplate jdbc;

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Integer id) {
        Optional<User> userOpt = userDao.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        }
        User user = userOpt.get();
        user.setPasswordHash(null);

        List<String> skills = userDao.getUserSkills(id);
        var reviews = reviewDao.findByRevieweeId(id);

        Map<String, Object> profile = new HashMap<>();
        profile.put("user", user);
        profile.put("skills", skills);
        profile.put("reviews", reviews);

        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String authHeader) {

        Integer requesterId = getRequesterIdFromToken(authHeader);
        if (!id.equals(requesterId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Cannot update another user's profile"));
        }

        String name = (String) body.get("name");
        String bio = (String) body.get("bio");
        String avatarUrl = (String) body.get("avatarUrl");
        String phone = (String) body.get("phone");
        Integer collegeId = body.get("collegeId") != null ? (Integer) body.get("collegeId") : null;

        userDao.updateProfile(id, name, bio, avatarUrl, phone, collegeId);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", null));
    }

    @PostMapping("/{id}/skills")
    public ResponseEntity<?> addSkill(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String authHeader) {

        Integer requesterId = getRequesterIdFromToken(authHeader);
        if (!id.equals(requesterId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));
        }

        Integer skillId = (Integer) body.get("skillId");
        String proficiency = (String) body.getOrDefault("proficiency", "Beginner");

        userDao.addSkill(id, skillId, proficiency);
        return ResponseEntity.ok(ApiResponse.ok("Skill added", null));
    }

    @DeleteMapping("/{id}/skills/{skillId}")
    public ResponseEntity<?> removeSkill(
            @PathVariable Integer id,
            @PathVariable Integer skillId,
            @RequestHeader("Authorization") String authHeader) {

        Integer requesterId = getRequesterIdFromToken(authHeader);
        if (!id.equals(requesterId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));
        }

        userDao.removeSkill(id, skillId);
        return ResponseEntity.ok(ApiResponse.ok("Skill removed", null));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        List<User> topUsers = userDao.getTopByXp(limit);
        topUsers.forEach(u -> u.setPasswordHash(null));
        return ResponseEntity.ok(ApiResponse.ok(topUsers));
    }

    @GetMapping("/{id}/notifications")
    public ResponseEntity<?> getNotifications(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getRequesterIdFromToken(authHeader);
        if (!id.equals(requesterId)) return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));

        var notifications = notificationService.getUserNotifications(id);
        int unread = notificationService.getUnreadCount(id);

        Map<String, Object> data = new HashMap<>();
        data.put("notifications", notifications);
        data.put("unreadCount", unread);
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @PutMapping("/{id}/notifications/read")
    public ResponseEntity<?> markNotificationsRead(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getRequesterIdFromToken(authHeader);
        if (!id.equals(requesterId)) return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));

        notificationService.markAllRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Notifications marked as read", null));
    }

    private Integer getRequesterIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.getUserIdFromToken(authHeader.substring(7));
        }
        return -1;
    }
}
