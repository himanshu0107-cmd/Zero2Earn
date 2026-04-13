package com.zero2earn.repository;

import com.zero2earn.model.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class ApplicationDao {

    @Autowired
    private JdbcTemplate jdbc;

    private final RowMapper<Application> applicationRowMapper = (rs, rowNum) -> {
        Application a = new Application();
        a.setId(rs.getInt("id"));
        a.setJobId(rs.getInt("job_id"));
        a.setJobTitle(rs.getString("job_title"));
        a.setApplicantId(rs.getInt("applicant_id"));
        a.setApplicantName(rs.getString("applicant_name"));
        a.setApplicantUsername(rs.getString("applicant_username"));
        a.setApplicantRating(rs.getBigDecimal("applicant_rating"));
        a.setCoverLetter(rs.getString("cover_letter"));
        a.setProposedBudget(rs.getBigDecimal("proposed_budget"));
        a.setEstimatedDays(rs.getObject("estimated_days", Integer.class));
        a.setStatus(rs.getString("status"));
        a.setAppliedAt(rs.getTimestamp("applied_at") != null ?
                rs.getTimestamp("applied_at").toLocalDateTime() : null);
        a.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        return a;
    };

    private static final String BASE_SELECT = """
        SELECT a.*,
               j.title AS job_title,
               u.name AS applicant_name,
               u.username AS applicant_username,
               u.rating AS applicant_rating
        FROM applications a
        JOIN jobs j ON j.id = a.job_id
        JOIN users u ON u.id = a.applicant_id
        """;

    public Integer save(Application app) {
        String sql = """
            INSERT INTO applications (job_id, applicant_id, cover_letter, proposed_budget, estimated_days)
            VALUES (?, ?, ?, ?, ?)
            """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, app.getJobId());
            ps.setInt(2, app.getApplicantId());
            ps.setString(3, app.getCoverLetter());
            ps.setBigDecimal(4, app.getProposedBudget());
            ps.setObject(5, app.getEstimatedDays());
            return ps;
        }, keyHolder);
        return keyHolder.getKey().intValue();
    }

    public Optional<Application> findById(Integer id) {
        List<Application> res = jdbc.query(BASE_SELECT + " WHERE a.id = ?", applicationRowMapper, id);
        return res.isEmpty() ? Optional.empty() : Optional.of(res.get(0));
    }

    public List<Application> findByJobId(Integer jobId) {
        return jdbc.query(BASE_SELECT + " WHERE a.job_id = ? ORDER BY a.applied_at DESC",
                applicationRowMapper, jobId);
    }

    public List<Application> findByApplicantId(Integer applicantId) {
        return jdbc.query(BASE_SELECT + " WHERE a.applicant_id = ? ORDER BY a.applied_at DESC",
                applicationRowMapper, applicantId);
    }

    public boolean hasApplied(Integer jobId, Integer applicantId) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM applications WHERE job_id=? AND applicant_id=?",
            Integer.class, jobId, applicantId);
        return count != null && count > 0;
    }

    public void updateStatus(Integer applicationId, String status) {
        jdbc.update("UPDATE applications SET status=? WHERE id=?", status, applicationId);
    }

    public int countByApplicant(Integer applicantId, String status) {
        String sql = status != null
            ? "SELECT COUNT(*) FROM applications WHERE applicant_id=? AND status=?"
            : "SELECT COUNT(*) FROM applications WHERE applicant_id=?";
        Integer count = status != null
            ? jdbc.queryForObject(sql, Integer.class, applicantId, status)
            : jdbc.queryForObject(sql, Integer.class, applicantId);
        return count != null ? count : 0;
    }
}
