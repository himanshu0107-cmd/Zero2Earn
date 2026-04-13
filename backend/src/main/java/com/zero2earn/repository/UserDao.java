package com.zero2earn.repository;

import com.zero2earn.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDao {

    @Autowired
    private JdbcTemplate jdbc;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User u = new User();
        u.setId(rs.getInt("id"));
        u.setName(rs.getString("name"));
        u.setUsername(rs.getString("username"));
        u.setEmail(rs.getString("email"));
        u.setPasswordHash(rs.getString("password_hash"));
        u.setRole(rs.getString("role"));
        u.setCollegeId(rs.getObject("college_id", Integer.class));
        u.setCollegeName(rs.getString("college_name"));
        u.setBio(rs.getString("bio"));
        u.setAvatarUrl(rs.getString("avatar_url"));
        u.setPhone(rs.getString("phone"));
        u.setXp(rs.getInt("xp"));
        u.setRating(rs.getBigDecimal("rating"));
        u.setRatingCount(rs.getInt("rating_count"));
        u.setWalletBalance(rs.getBigDecimal("wallet_balance"));
        u.setActive(rs.getBoolean("active"));
        u.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        u.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        return u;
    };

    private static final String BASE_SELECT = """
        SELECT u.*, c.name AS college_name
        FROM users u
        LEFT JOIN colleges c ON c.id = u.college_id
        """;

    public Optional<User> findById(Integer id) {
        String sql = BASE_SELECT + " WHERE u.id = ?";
        List<User> result = jdbc.query(sql, userRowMapper, id);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public Optional<User> findByEmail(String email) {
        String sql = BASE_SELECT + " WHERE u.email = ?";
        List<User> result = jdbc.query(sql, userRowMapper, email);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public Optional<User> findByUsername(String username) {
        String sql = BASE_SELECT + " WHERE u.username = ?";
        List<User> result = jdbc.query(sql, userRowMapper, username);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public boolean existsByEmail(String email) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM users WHERE email = ?", Integer.class, email);
        return count != null && count > 0;
    }

    public boolean existsByUsername(String username) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM users WHERE username = ?", Integer.class, username);
        return count != null && count > 0;
    }

    public Integer save(User user) {
        String sql = """
            INSERT INTO users (name, username, email, password_hash, role, college_id, bio, avatar_url, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getName());
            ps.setString(2, user.getUsername());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPasswordHash());
            ps.setString(5, user.getRole() != null ? user.getRole() : "STUDENT");
            ps.setObject(6, user.getCollegeId());
            ps.setString(7, user.getBio());
            ps.setString(8, user.getAvatarUrl());
            ps.setString(9, user.getPhone());
            return ps;
        }, keyHolder);
        return keyHolder.getKey().intValue();
    }

    public void updateProfile(Integer id, String name, String bio, String avatarUrl,
                              String phone, Integer collegeId) {
        String sql = """
            UPDATE users SET name=?, bio=?, avatar_url=?, phone=?, college_id=?
            WHERE id=?
            """;
        jdbc.update(sql, name, bio, avatarUrl, phone, collegeId, id);
    }

    public void addSkill(Integer userId, Integer skillId, String proficiency) {
        String sql = """
            INSERT INTO user_skills (user_id, skill_id, proficiency)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE proficiency = VALUES(proficiency)
            """;
        jdbc.update(sql, userId, skillId, proficiency);
    }

    public void removeSkill(Integer userId, Integer skillId) {
        jdbc.update("DELETE FROM user_skills WHERE user_id=? AND skill_id=?", userId, skillId);
    }

    public List<String> getUserSkills(Integer userId) {
        String sql = """
            SELECT s.name FROM skills s
            JOIN user_skills us ON us.skill_id = s.id
            WHERE us.user_id = ?
            """;
        return jdbc.queryForList(sql, String.class, userId);
    }

    public void updateRating(Integer userId) {
        String sql = """
            UPDATE users u SET
                rating = (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.reviewee_id = u.id),
                rating_count = (SELECT COUNT(*) FROM reviews r WHERE r.reviewee_id = u.id)
            WHERE u.id = ?
            """;
        jdbc.update(sql, userId);
    }

    public void addXp(Integer userId, Integer points) {
        jdbc.update("UPDATE users SET xp = xp + ? WHERE id = ?", points, userId);
    }

    public List<User> getTopByXp(int limit) {
        String sql = BASE_SELECT + " WHERE u.active = TRUE ORDER BY u.xp DESC LIMIT ?";
        return jdbc.query(sql, userRowMapper, limit);
    }
}
