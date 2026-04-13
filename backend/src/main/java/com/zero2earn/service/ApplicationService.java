package com.zero2earn.service;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.Application;
import com.zero2earn.model.Job;
import com.zero2earn.repository.ApplicationDao;
import com.zero2earn.repository.JobDao;
import com.zero2earn.repository.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired private ApplicationDao applicationDao;
    @Autowired private JobDao jobDao;
    @Autowired private UserDao userDao;
    @Autowired private NotificationService notificationService;

    public ApiResponse<?> apply(Application app, Integer applicantId) {
        Optional<Job> jobOpt = jobDao.findById(app.getJobId());
        if (jobOpt.isEmpty()) return ApiResponse.error("Job not found");

        Job job = jobOpt.get();
        if (!"OPEN".equals(job.getStatus())) {
            return ApiResponse.error("This job is not accepting applications");
        }
        if (job.getPosterId().equals(applicantId)) {
            return ApiResponse.error("You cannot apply to your own job");
        }
        if (applicationDao.hasApplied(app.getJobId(), applicantId)) {
            return ApiResponse.error("You have already applied to this job");
        }

        app.setApplicantId(applicantId);
        Integer appId = applicationDao.save(app);

        // Award XP for applying
        userDao.addXp(applicantId, 10);

        // Notify job poster
        notificationService.create(job.getPosterId(), "NEW_APPLICATION",
                "New Application Received",
                "Someone applied to: " + job.getTitle(),
                appId, "APPLICATION");

        return ApiResponse.ok("Application submitted successfully",
                applicationDao.findById(appId).orElse(null));
    }

    public ApiResponse<?> getApplicationsForJob(Integer jobId, Integer requesterId) {
        Optional<Job> jobOpt = jobDao.findById(jobId);
        if (jobOpt.isEmpty()) return ApiResponse.error("Job not found");

        if (!jobOpt.get().getPosterId().equals(requesterId)) {
            return ApiResponse.error("Not authorized to view these applications");
        }

        List<Application> apps = applicationDao.findByJobId(jobId);
        return ApiResponse.ok(apps);
    }

    public ApiResponse<?> getMyApplications(Integer applicantId) {
        List<Application> apps = applicationDao.findByApplicantId(applicantId);
        return ApiResponse.ok(apps);
    }

    public ApiResponse<?> updateStatus(Integer applicationId, String status, Integer requesterId) {
        Optional<Application> appOpt = applicationDao.findById(applicationId);
        if (appOpt.isEmpty()) return ApiResponse.error("Application not found");

        Application app = appOpt.get();
        Optional<Job> jobOpt = jobDao.findById(app.getJobId());
        if (jobOpt.isEmpty()) return ApiResponse.error("Job not found");

        Job job = jobOpt.get();

        // Only poster can accept/reject; applicant can withdraw
        boolean isPoster = job.getPosterId().equals(requesterId);
        boolean isApplicant = app.getApplicantId().equals(requesterId);

        if (!isPoster && !isApplicant) {
            return ApiResponse.error("Not authorized");
        }
        if ("WITHDRAWN".equals(status) && !isApplicant) {
            return ApiResponse.error("Only the applicant can withdraw");
        }
        if (("ACCEPTED".equals(status) || "REJECTED".equals(status)) && !isPoster) {
            return ApiResponse.error("Only the job poster can accept/reject applications");
        }

        applicationDao.updateStatus(applicationId, status);

        // Award XP on completion
        if ("COMPLETED".equals(status)) {
            userDao.addXp(app.getApplicantId(), 100);
            jobDao.updateStatus(app.getJobId(), "COMPLETED");
        }

        // Notify applicant of decision
        if ("ACCEPTED".equals(status) || "REJECTED".equals(status)) {
            notificationService.create(app.getApplicantId(), "APPLICATION_UPDATE",
                    "Application " + status,
                    "Your application for \"" + job.getTitle() + "\" was " + status.toLowerCase(),
                    applicationId, "APPLICATION");
        }

        return ApiResponse.ok("Application status updated to " + status, null);
    }
}
