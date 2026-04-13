package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.Review;
import com.zero2earn.repository.ReviewDao;
import com.zero2earn.repository.UserDao;
import com.zero2earn.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired private ReviewDao reviewDao;
    @Autowired private UserDao userDao;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> submitReview(
            @RequestBody Review review,
            @RequestHeader("Authorization") String authHeader) {

        Integer reviewerId = getUserId(authHeader);
        review.setReviewerId(reviewerId);

        if (reviewDao.hasReviewed(review.getJobId(), reviewerId)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You have already reviewed this job"));
        }
        if (review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Rating must be between 1 and 5"));
        }

        reviewDao.save(review);

        // Update reviewee's aggregate rating
        userDao.updateRating(review.getRevieweeId());

        return ResponseEntity.status(201).body(ApiResponse.ok("Review submitted", null));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserReviews(@PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewDao.findByRevieweeId(userId)));
    }

    private Integer getUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.getUserIdFromToken(authHeader.substring(7));
        }
        return -1;
    }
}
