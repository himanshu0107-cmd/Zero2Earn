package com.zero2earn.repository;

import com.zero2earn.model.Course;
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
public class CourseDao {

    @Autowired
    private JdbcTemplate jdbc;

    private final RowMapper<Course> courseRowMapper = (rs, rowNum) -> {
        Course c = new Course();
        c.setId(rs.getInt("id"));
        c.setTitle(rs.getString("title"));
        c.setDescription(rs.getString("description"));
        c.setInstructorId(rs.getInt("instructor_id"));
        c.setInstructorName(rs.getString("instructor_name"));
        c.setPrice(rs.getBigDecimal("price"));
        c.setCurrency(rs.getString("currency"));
        c.setThumbnailUrl(rs.getString("thumbnail_url"));
        c.setCategory(rs.getString("category"));
        c.setDurationHours(rs.getInt("duration_hours"));
        c.setDifficulty(rs.getString("difficulty"));
        c.setStatus(rs.getString("status"));
        c.setRating(rs.getBigDecimal("rating"));
        c.setEnrolledCount(rs.getInt("enrolled_count"));
        c.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        return c;
    };

    private static final String BASE_SELECT = """
        SELECT c.*, u.name AS instructor_name
        FROM courses c
        JOIN users u ON u.id = c.instructor_id
        """;

    public List<Course> findPublished(String category, String difficulty, int page, int size) {
        StringBuilder sql = new StringBuilder(BASE_SELECT + " WHERE c.status = 'PUBLISHED'");
        java.util.List<Object> params = new java.util.ArrayList<>();

        if (category != null && !category.isEmpty()) {
            sql.append(" AND c.category = ?");
            params.add(category);
        }
        if (difficulty != null && !difficulty.isEmpty()) {
            sql.append(" AND c.difficulty = ?");
            params.add(difficulty);
        }
        sql.append(" ORDER BY c.enrolled_count DESC LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);
        return jdbc.query(sql.toString(), courseRowMapper, params.toArray());
    }

    public Optional<Course> findById(Integer id) {
        List<Course> res = jdbc.query(BASE_SELECT + " WHERE c.id = ?", courseRowMapper, id);
        return res.isEmpty() ? Optional.empty() : Optional.of(res.get(0));
    }

    public Integer save(Course course) {
        String sql = """
            INSERT INTO courses (title, description, instructor_id, price, currency,
                                 thumbnail_url, category, duration_hours, difficulty, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, course.getTitle());
            ps.setString(2, course.getDescription());
            ps.setInt(3, course.getInstructorId());
            ps.setBigDecimal(4, course.getPrice());
            ps.setString(5, course.getCurrency() != null ? course.getCurrency() : "INR");
            ps.setString(6, course.getThumbnailUrl());
            ps.setString(7, course.getCategory());
            ps.setObject(8, course.getDurationHours());
            ps.setString(9, course.getDifficulty() != null ? course.getDifficulty() : "Beginner");
            ps.setString(10, "PUBLISHED");
            return ps;
        }, keyHolder);
        return keyHolder.getKey().intValue();
    }

    public boolean isEnrolled(Integer userId, Integer courseId) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM enrollments WHERE user_id=? AND course_id=?",
            Integer.class, userId, courseId);
        return count != null && count > 0;
    }

    public void enroll(Integer userId, Integer courseId) {
        jdbc.update("INSERT IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)", userId, courseId);
        jdbc.update("UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = ?", courseId);
    }

    public void updateProgress(Integer userId, Integer courseId, Integer progress) {
        String sql = """
            UPDATE enrollments SET progress_pct=?,
                completed_at = CASE WHEN ? >= 100 THEN NOW() ELSE NULL END
            WHERE user_id=? AND course_id=?
            """;
        jdbc.update(sql, progress, progress, userId, courseId);
    }

    public List<Course> findEnrolledByUser(Integer userId) {
        String sql = BASE_SELECT + """
             JOIN enrollments e ON e.course_id = c.id
             WHERE e.user_id = ?
             ORDER BY e.enrolled_at DESC
            """;
        List<Course> courses = jdbc.query(sql, courseRowMapper, userId);
        courses.forEach(c -> {
            Integer prog = jdbc.queryForObject(
                "SELECT progress_pct FROM enrollments WHERE user_id=? AND course_id=?",
                Integer.class, userId, c.getId());
            c.setUserProgress(prog);
            c.setEnrolled(true);
        });
        return courses;
    }
}
