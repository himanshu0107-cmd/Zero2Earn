package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.Application;
import com.zero2earn.security.JwtUtil;
import com.zero2earn.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired private ApplicationService applicationService;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> apply(
            @RequestBody Application app,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        ApiResponse<?> res = applicationService.apply(app, userId);
        return ResponseEntity.status(res.isSuccess() ? 201 : 400).body(res);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsForJob(
            @PathVariable Integer jobId,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        ApiResponse<?> res = applicationService.getApplicationsForJob(jobId, userId);
        return ResponseEntity.status(res.isSuccess() ? 200 : 403).body(res);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(@RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        return ResponseEntity.ok(applicationService.getMyApplications(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        ApiResponse<?> res = applicationService.updateStatus(id, body.get("status"), userId);
        return ResponseEntity.status(res.isSuccess() ? 200 : 403).body(res);
    }

    private Integer getUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.getUserIdFromToken(authHeader.substring(7));
        }
        return -1;
    }
}
