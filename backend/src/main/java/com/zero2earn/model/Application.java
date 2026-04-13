package com.zero2earn.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Application {
    private Integer id;
    private Integer jobId;
    private String jobTitle;
    private Integer applicantId;
    private String applicantName;
    private String applicantUsername;
    private BigDecimal applicantRating;
    private String coverLetter;
    private BigDecimal proposedBudget;
    private Integer estimatedDays;
    private String status; // PENDING, ACCEPTED, REJECTED, COMPLETED, WITHDRAWN
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public Application() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getJobId() { return jobId; }
    public void setJobId(Integer jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Integer getApplicantId() { return applicantId; }
    public void setApplicantId(Integer applicantId) { this.applicantId = applicantId; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicantUsername() { return applicantUsername; }
    public void setApplicantUsername(String applicantUsername) { this.applicantUsername = applicantUsername; }

    public BigDecimal getApplicantRating() { return applicantRating; }
    public void setApplicantRating(BigDecimal applicantRating) { this.applicantRating = applicantRating; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public BigDecimal getProposedBudget() { return proposedBudget; }
    public void setProposedBudget(BigDecimal proposedBudget) { this.proposedBudget = proposedBudget; }

    public Integer getEstimatedDays() { return estimatedDays; }
    public void setEstimatedDays(Integer estimatedDays) { this.estimatedDays = estimatedDays; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
