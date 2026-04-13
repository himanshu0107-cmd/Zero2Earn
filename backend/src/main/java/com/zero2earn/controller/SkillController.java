package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping
    public ResponseEntity<?> getAllSkills() {
        List<Map<String, Object>> skills = jdbc.queryForList(
            "SELECT id, name, category FROM skills ORDER BY category, name");
        return ResponseEntity.ok(ApiResponse.ok(skills));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<String> cats = jdbc.queryForList(
            "SELECT DISTINCT category FROM skills ORDER BY category", String.class);
        return ResponseEntity.ok(ApiResponse.ok(cats));
    }
}
