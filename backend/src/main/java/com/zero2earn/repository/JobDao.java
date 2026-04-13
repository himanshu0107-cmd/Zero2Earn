package com.zero2earn.repository;

import com.zero2earn.model.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public class JobDao {

    @Autowired
    private JdbcTemplate jdbc;

    private final RowMapper<Job> jobRowMapper = (rs, rowNum) -> {
        Job j = new Job();
        j.setId(rs.getInt("id"));
        j.setTitle(rs.getString("title"));
        j.setDescription(rs.getString("description"));
        j.setPosterId(rs.getInt("poster_id"));
        j.setPosterName(rs.getString("poster_name"));
        j.setPosterRole(rs.getString("poster_role"));
        j.setPosterRating(rs.getBigDecimal("poster_rating"));
        j.setCollegeId(rs.getObject("college_id", Integer.class));
        j.setCollegeName(rs.getString("college_name"));
        j.setType(rs.getString("type"));
        j.setBudget(rs.getBigDecimal("budget"));
        j.setCurrency(rs.getString("currency"));
        Date d = rs.getDate("deadline");
        if (d != null) j.setDeadline(d.toLocalDate());
        j.setStatus(rs.getString("status"));
        j.setRemote(rs.getBoolean("remote"));
        j.setApplicantCount(rs.getInt("applicant_count"));
        j.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        j.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        return j;
    };

    private static final String BASE_SELECT = """
        SELECT j.*,
               u.name AS poster_name, u.role AS poster_role, u.rating AS poster_rating,
               c.name AS college_name,
               (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicant_count
        FROM jobs j
        JOIN users u ON u.id = j.poster_id
        LEFT JOIN colleges c ON c.id = j.college_id
        """;

    public List<Job> findAll(String type, Integer collegeId, String status, int page, int size) {
        StringBuilder sql = new StringBuilder(BASE_SELECT + " WHERE 1=1");
        java.util.List<Object> params = new java.util.ArrayList<>();

        if (type != null && !type.isEmpty()) { sql.append(" AND j.type = ?"); params.add(type); }
        if (collegeId != null) { sql.append(" AND j.college_id = ?"); params.add(collegeId); }
        if (status != null && !status.isEmpty()) { sql.append(" AND j.status = ?"); params.add(status); }
        else { sql.append(" AND j.status = 'OPEN'"); }

        sql.append(" ORDER BY j.created_at DESC LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);
        return jdbc.query(sql.toString(), jobRowMapper, params.toArray());
    }

    public List<Job> findMatchingForUser(Integer userId, int page, int size) {
        String sql = BASE_SELECT + """
             WHERE j.status = 'OPEN'
             ORDER BY (
                SELECT COUNT(*) FROM job_skills js
                JOIN user_skills us ON us.skill_id = js.skill_id
                WHERE js.job_id = j.id AND us.user_id = ?
             ) DESC, j.created_at DESC
             LIMIT ? OFFSET ?
            """;
        return jdbc.query(sql, jobRowMapper, userId, size, page * size);
    }

    public Optional<Job> findById(Integer id) {
        String sql = BASE_SELECT + " WHERE j.id = ?";
        List<Job> res = jdbc.query(sql, jobRowMapper, id);
        if (res.isEmpty()) return Optional.empty();
        Job job = res.get(0);
        job.setSkills(getJobSkills(id));
        return Optional.of(job);
    }

    public List<Job> findByPosterId(Integer posterId) {
        String sql = BASE_SELECT + " WHERE j.poster_id = ? ORDER BY j.created_at DESC";
        List<Job> jobs = jdbc.query(sql, jobRowMapper, posterId);
        jobs.forEach(j -> j.setSkills(getJobSkills(j.getId())));
        return jobs;
    }

    public Integer save(Job job) {
        String sql = """
            INSERT INTO jobs (title, description, poster_id, college_id, type, budget, currency, deadline, remote)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, job.getTitle());
            ps.setString(2, job.getDescription());
            ps.setInt(3, job.getPosterId());
            ps.setObject(4, job.getCollegeId());
            ps.setString(5, job.getType() != null ? job.getType() : "PAID");
            ps.setBigDecimal(6, job.getBudget());
            ps.setString(7, job.getCurrency() != null ? job.getCurrency() : "INR");
            ps.setObject(8, job.getDeadline() != null ?
                    Date.valueOf(job.getDeadline()) : null);
            ps.setBoolean(9, job.getRemote() != null ? job.getRemote() : true);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().intValue();
    }

    public void updateStatus(Integer jobId, String status) {
        jdbc.update("UPDATE jobs SET status = ? WHERE id = ?", status, jobId);
    }

    public void delete(Integer jobId) {
        jdbc.update("UPDATE jobs SET status = 'CANCELLED' WHERE id = ?", jobId);
    }

    public void addJobSkill(Integer jobId, Integer skillId) {
        String sql = "INSERT IGNORE INTO job_skills (job_id, skill_id) VALUES (?, ?)";
        jdbc.update(sql, jobId, skillId);
    }

    public List<String> getJobSkills(Integer jobId) {
        String sql = "SELECT s.name FROM skills s JOIN job_skills js ON js.skill_id = s.id WHERE js.job_id = ?";
        return jdbc.queryForList(sql, String.class, jobId);
    }

    public int countOpen() {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM jobs WHERE status = 'OPEN'", Integer.class);
        return count != null ? count : 0;
    }

    public List<Job> searchJobs(String keyword) {
        String sql = BASE_SELECT + """
             WHERE j.status = 'OPEN'
             AND (j.title LIKE ? OR j.description LIKE ?)
             ORDER BY j.created_at DESC LIMIT 20
            """;
        String like = "%" + keyword + "%";
        List<Job> jobs = jdbc.query(sql, jobRowMapper, like, like);
        jobs.forEach(j -> j.setSkills(getJobSkills(j.getId())));
        return jobs;
    }
}
