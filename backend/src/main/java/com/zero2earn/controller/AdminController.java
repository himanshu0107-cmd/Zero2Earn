package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", jdbc.queryForObject("SELECT COUNT(*) FROM users", Integer.class));
        stats.put("totalJobs", jdbc.queryForObject("SELECT COUNT(*) FROM jobs", Integer.class));
        stats.put("openJobs", jdbc.queryForObject("SELECT COUNT(*) FROM jobs WHERE status='OPEN'", Integer.class));
        stats.put("totalApplications", jdbc.queryForObject("SELECT COUNT(*) FROM applications", Integer.class));
        stats.put("totalCourses", jdbc.queryForObject("SELECT COUNT(*) FROM courses WHERE status='PUBLISHED'", Integer.class));
        stats.put("totalEnrollments", jdbc.queryForObject("SELECT COUNT(*) FROM enrollments", Integer.class));
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var users = jdbc.queryForList(
            "SELECT u.id, u.name, u.username, u.email, u.role, u.active, u.xp, u.rating, " +
            "u.created_at, c.name AS college_name " +
            "FROM users u LEFT JOIN colleges c ON c.id = u.college_id " +
            "ORDER BY u.created_at DESC LIMIT ? OFFSET ?",
            size, page * size);
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{id}/toggle-active")
    public ResponseEntity<?> toggleUserActive(@PathVariable Integer id) {
        jdbc.update("UPDATE users SET active = NOT active WHERE id = ?", id);
        return ResponseEntity.ok(ApiResponse.ok("User status toggled", null));
    }
}
