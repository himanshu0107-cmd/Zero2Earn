package com.zero2earn.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class Job {
    private Integer id;
    private String title;
    private String description;
    private Integer posterId;
    private String posterName;
    private String posterRole;
    private BigDecimal posterRating;
    private Integer collegeId;
    private String collegeName;
    private String type; // PAID, UNPAID, INTERNSHIP
    private BigDecimal budget;
    private String currency;
    private LocalDate deadline;
    private String status; // OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    private Boolean remote;
    private Integer applicantCount;
    private List<String> skills;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Job() {}

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPosterId() { return posterId; }
    public void setPosterId(Integer posterId) { this.posterId = posterId; }

    public String getPosterName() { return posterName; }
    public void setPosterName(String posterName) { this.posterName = posterName; }

    public String getPosterRole() { return posterRole; }
    public void setPosterRole(String posterRole) { this.posterRole = posterRole; }

    public BigDecimal getPosterRating() { return posterRating; }
    public void setPosterRating(BigDecimal posterRating) { this.posterRating = posterRating; }

    public Integer getCollegeId() { return collegeId; }
    public void setCollegeId(Integer collegeId) { this.collegeId = collegeId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getRemote() { return remote; }
    public void setRemote(Boolean remote) { this.remote = remote; }

    public Integer getApplicantCount() { return applicantCount; }
    public void setApplicantCount(Integer applicantCount) { this.applicantCount = applicantCount; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
