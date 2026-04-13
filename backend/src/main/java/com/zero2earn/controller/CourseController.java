package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.Course;
import com.zero2earn.repository.CourseDao;
import com.zero2earn.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired private CourseDao courseDao;
    @Autowired private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        List<Course> courses = courseDao.findPublished(category, difficulty, page, size);
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourse(@PathVariable Integer id) {
        Optional<Course> course = courseDao.findById(id);
        return course.map(c -> ResponseEntity.ok(ApiResponse.ok(c)))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(ApiResponse.error("Course not found")));
    }

    @PostMapping
    public ResponseEntity<?> createCourse(
            @RequestBody Course course,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        course.setInstructorId(userId);
        Integer id = courseDao.save(course);
        return ResponseEntity.status(201).body(ApiResponse.ok("Course created",
                courseDao.findById(id).orElse(null)));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<?> enroll(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        Optional<Course> courseOpt = courseDao.findById(id);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("Course not found"));
        }
        if (courseDao.isEnrolled(userId, id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Already enrolled"));
        }
        courseDao.enroll(userId, id);
        return ResponseEntity.status(201).body(ApiResponse.ok("Enrolled successfully", null));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<?> updateProgress(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> body,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        Integer progress = body.getOrDefault("progress", 0);
        courseDao.updateProgress(userId, id, progress);
        return ResponseEntity.ok(ApiResponse.ok("Progress updated", null));
    }

    @GetMapping("/my-courses")
    public ResponseEntity<?> getMyCourses(@RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        List<Course> courses = courseDao.findEnrolledByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }

    private Integer getUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.getUserIdFromToken(authHeader.substring(7));
        }
        return -1;
    }
}
