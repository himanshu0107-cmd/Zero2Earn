package com.zero2earn.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JdbcTemplate jdbc;

    public void create(Integer userId, String type, String title, String message,
                       Integer refId, String refType) {
        String sql = """
            INSERT INTO notifications (user_id, type, title, message, ref_id, ref_type)
            VALUES (?, ?, ?, ?, ?, ?)
            """;
        jdbc.update(sql, userId, type, title, message, refId, refType);
    }

    public java.util.List<java.util.Map<String, Object>> getUserNotifications(Integer userId) {
        String sql = """
            SELECT id, type, title, message, read_flag, ref_id, ref_type, created_at
            FROM notifications WHERE user_id = ?
            ORDER BY created_at DESC LIMIT 30
            """;
        return jdbc.queryForList(sql, userId);
    }

    public void markAllRead(Integer userId) {
        jdbc.update("UPDATE notifications SET read_flag=TRUE WHERE user_id=?", userId);
    }

    public int getUnreadCount(Integer userId) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM notifications WHERE user_id=? AND read_flag=FALSE",
            Integer.class, userId);
        return count != null ? count : 0;
    }
}
