package com.zero2earn.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Course {
    private Integer id;
    private String title;
    private String description;
    private Integer instructorId;
    private String instructorName;
    private BigDecimal price;
    private String currency;
    private String thumbnailUrl;
    private String category;
    private Integer durationHours;
    private String difficulty; // Beginner, Intermediate, Advanced
    private String status;     // DRAFT, PUBLISHED, ARCHIVED
    private BigDecimal rating;
    private Integer enrolledCount;
    private LocalDateTime createdAt;
    // Optional: user-specific enrollment info
    private Integer userProgress;
    private Boolean enrolled;

    public Course() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getInstructorId() { return instructorId; }
    public void setInstructorId(Integer instructorId) { this.instructorId = instructorId; }

    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getEnrolledCount() { return enrolledCount; }
    public void setEnrolledCount(Integer enrolledCount) { this.enrolledCount = enrolledCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getUserProgress() { return userProgress; }
    public void setUserProgress(Integer userProgress) { this.userProgress = userProgress; }

    public Boolean getEnrolled() { return enrolled; }
    public void setEnrolled(Boolean enrolled) { this.enrolled = enrolled; }
}
