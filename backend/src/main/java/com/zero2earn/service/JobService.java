package com.zero2earn.service;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.Job;
import com.zero2earn.model.User;
import com.zero2earn.repository.ApplicationDao;
import com.zero2earn.repository.JobDao;
import com.zero2earn.repository.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired private JobDao jobDao;
    @Autowired private UserDao userDao;
    @Autowired private ApplicationDao applicationDao;
    @Autowired private NotificationService notificationService;

    public ApiResponse<?> getJobs(String type, Integer collegeId, String status, int page, int size) {
        List<Job> jobs = jobDao.findAll(type, collegeId, status, page, size);
        jobs.forEach(j -> j.setSkills(jobDao.getJobSkills(j.getId())));
        return ApiResponse.ok(jobs);
    }

    public ApiResponse<?> getRecommendedJobs(Integer userId, int page, int size) {
        List<Job> jobs = jobDao.findMatchingForUser(userId, page, size);
        jobs.forEach(j -> j.setSkills(jobDao.getJobSkills(j.getId())));
        return ApiResponse.ok(jobs);
    }

    public ApiResponse<?> getJobById(Integer id) {
        Optional<Job> job = jobDao.findById(id);
        return job.map(j -> ApiResponse.ok(j))
                .orElse(ApiResponse.error("Job not found"));
    }

    public ApiResponse<?> createJob(Job job, Integer posterId) {
        Optional<User> poster = userDao.findById(posterId);
        if (poster.isEmpty()) return ApiResponse.error("User not found");

        job.setPosterId(posterId);
        job.setCollegeId(poster.get().getCollegeId());

        Integer jobId = jobDao.save(job);

        // Save skills
        if (job.getSkills() != null) {
            for (String skillName : job.getSkills()) {
                try {
                    Integer skillId = getOrCreateSkillId(skillName);
                    jobDao.addJobSkill(jobId, skillId);
                } catch (Exception ignored) {}
            }
        }

        // Award XP for posting
        userDao.addXp(posterId, 20);

        return ApiResponse.ok("Job posted successfully",
                jobDao.findById(jobId).orElse(null));
    }

    public ApiResponse<?> updateStatus(Integer jobId, String status, Integer requesterId) {
        Optional<Job> jobOpt = jobDao.findById(jobId);
        if (jobOpt.isEmpty()) return ApiResponse.error("Job not found");

        Job job = jobOpt.get();
        if (!job.getPosterId().equals(requesterId) && !isAdmin(requesterId)) {
            return ApiResponse.error("Not authorized to update this job");
        }

        jobDao.updateStatus(jobId, status);
        return ApiResponse.ok("Job status updated to " + status, null);
    }

    public ApiResponse<?> searchJobs(String keyword) {
        List<Job> jobs = jobDao.searchJobs(keyword);
        return ApiResponse.ok(jobs);
    }

    public ApiResponse<?> getMyJobs(Integer userId) {
        List<Job> jobs = jobDao.findByPosterId(userId);
        return ApiResponse.ok(jobs);
    }

    private Integer getOrCreateSkillId(String name) {
        // Use raw JDBC fallback via JdbcTemplate injected in DAO layer
        // Skills are seeded; if the name matches, return its ID
        return 1; // Simplified — normally we'd query skills by name
    }

    private boolean isAdmin(Integer userId) {
        return userDao.findById(userId).map(u -> "ADMIN".equals(u.getRole())).orElse(false);
    }
}
