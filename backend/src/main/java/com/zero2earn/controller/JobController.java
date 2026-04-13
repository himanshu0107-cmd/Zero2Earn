package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.Job;
import com.zero2earn.security.JwtUtil;
import com.zero2earn.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired private JobService jobService;
    @Autowired private JwtUtil jwtUtil;

    // GET /api/jobs?type=PAID&collegeId=1&status=OPEN&page=0&size=10
    @GetMapping
    public ResponseEntity<?> getJobs(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer collegeId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getJobs(type, collegeId, status, page, size));
    }

    // GET /api/jobs/recommended — skill-matched jobs for logged-in user
    @GetMapping("/recommended")
    public ResponseEntity<?> getRecommended(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Integer userId = getUserId(authHeader);
        return ResponseEntity.ok(jobService.getRecommendedJobs(userId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Integer id) {
        ApiResponse<?> res = jobService.getJobById(id);
        return ResponseEntity.status(res.isSuccess() ? 200 : 404).body(res);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q) {
        return ResponseEntity.ok(jobService.searchJobs(q));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyJobs(@RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        return ResponseEntity.ok(jobService.getMyJobs(userId));
    }

    @PostMapping
    public ResponseEntity<?> createJob(
            @RequestBody Job job,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        ApiResponse<?> res = jobService.createJob(job, userId);
        return ResponseEntity.status(res.isSuccess() ? 201 : 400).body(res);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        ApiResponse<?> res = jobService.updateStatus(id, body.get("status"), userId);
        return ResponseEntity.status(res.isSuccess() ? 200 : 403).body(res);
    }

    private Integer getUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.getUserIdFromToken(authHeader.substring(7));
        }
        return -1;
    }
}
