package com.zero2earn.repository;

import com.zero2earn.model.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class ReviewDao {

    @Autowired
    private JdbcTemplate jdbc;

    private final RowMapper<Review> reviewRowMapper = (rs, rowNum) -> {
        Review r = new Review();
        r.setId(rs.getInt("id"));
        r.setJobId(rs.getInt("job_id"));
        r.setJobTitle(rs.getString("job_title"));
        r.setReviewerId(rs.getInt("reviewer_id"));
        r.setReviewerName(rs.getString("reviewer_name"));
        r.setReviewerAvatar(rs.getString("reviewer_avatar"));
        r.setRevieweeId(rs.getInt("reviewee_id"));
        r.setRating(rs.getInt("rating"));
        r.setComment(rs.getString("comment"));
        r.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        return r;
    };

    public Integer save(Review review) {
        String sql = """
            INSERT INTO reviews (job_id, reviewer_id, reviewee_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE rating=VALUES(rating), comment=VALUES(comment)
            """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, review.getJobId());
            ps.setInt(2, review.getReviewerId());
            ps.setInt(3, review.getRevieweeId());
            ps.setInt(4, review.getRating());
            ps.setString(5, review.getComment());
            return ps;
        }, keyHolder);
        return keyHolder.getKey() != null ? keyHolder.getKey().intValue() : 0;
    }

    public List<Review> findByRevieweeId(Integer userId) {
        String sql = """
            SELECT r.*,
                   j.title AS job_title,
                   u.name AS reviewer_name,
                   u.avatar_url AS reviewer_avatar
            FROM reviews r
            JOIN jobs j ON j.id = r.job_id
            JOIN users u ON u.id = r.reviewer_id
            WHERE r.reviewee_id = ?
            ORDER BY r.created_at DESC
            """;
        return jdbc.query(sql, reviewRowMapper, userId);
    }

    public boolean hasReviewed(Integer jobId, Integer reviewerId) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM reviews WHERE job_id=? AND reviewer_id=?",
            Integer.class, jobId, reviewerId);
        return count != null && count > 0;
    }
}
