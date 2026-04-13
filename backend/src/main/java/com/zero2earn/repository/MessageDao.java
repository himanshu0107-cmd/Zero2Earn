package com.zero2earn.repository;

import com.zero2earn.model.Conversation;
import com.zero2earn.model.Message;
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
public class MessageDao {

    @Autowired
    private JdbcTemplate jdbc;

    private final RowMapper<Message> messageRowMapper = (rs, rowNum) -> {
        Message m = new Message();
        m.setId(rs.getInt("id"));
        m.setConversationId(rs.getInt("conversation_id"));
        m.setSenderId(rs.getInt("sender_id"));
        m.setSenderName(rs.getString("sender_name"));
        m.setSenderAvatar(rs.getString("sender_avatar"));
        m.setContent(rs.getString("content"));
        m.setMsgType(rs.getString("msg_type"));
        m.setFileUrl(rs.getString("file_url"));
        m.setSentAt(rs.getTimestamp("sent_at") != null ?
                rs.getTimestamp("sent_at").toLocalDateTime() : null);
        m.setReadAt(rs.getTimestamp("read_at") != null ?
                rs.getTimestamp("read_at").toLocalDateTime() : null);
        return m;
    };

    private final RowMapper<Conversation> convRowMapper = (rs, rowNum) -> {
        Conversation c = new Conversation();
        c.setId(rs.getInt("id"));
        c.setParticipant1(rs.getInt("participant_1"));
        c.setParticipant1Name(rs.getString("p1_name"));
        c.setParticipant1Avatar(rs.getString("p1_avatar"));
        c.setParticipant2(rs.getInt("participant_2"));
        c.setParticipant2Name(rs.getString("p2_name"));
        c.setParticipant2Avatar(rs.getString("p2_avatar"));
        c.setJobId(rs.getObject("job_id", Integer.class));
        c.setJobTitle(rs.getString("job_title"));
        c.setLastMessage(rs.getString("last_message"));
        c.setLastMessageAt(rs.getTimestamp("last_message_at") != null ?
                rs.getTimestamp("last_message_at").toLocalDateTime() : null);
        c.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        c.setUnreadCount(rs.getInt("unread_count"));
        return c;
    };

    public Optional<Conversation> findConversation(Integer userId1, Integer userId2) {
        String sql = """
            SELECT c.*,
                   u1.name AS p1_name, u1.avatar_url AS p1_avatar,
                   u2.name AS p2_name, u2.avatar_url AS p2_avatar,
                   j.title AS job_title,
                   (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id
                    AND m.sender_id != ? AND m.read_at IS NULL) AS unread_count
            FROM conversations c
            JOIN users u1 ON u1.id = c.participant_1
            JOIN users u2 ON u2.id = c.participant_2
            LEFT JOIN jobs j ON j.id = c.job_id
            WHERE (c.participant_1 = ? AND c.participant_2 = ?)
               OR (c.participant_1 = ? AND c.participant_2 = ?)
            LIMIT 1
            """;
        List<Conversation> res = jdbc.query(sql, convRowMapper,
                userId1, userId1, userId2, userId2, userId1);
        return res.isEmpty() ? Optional.empty() : Optional.of(res.get(0));
    }

    public Integer createConversation(Integer userId1, Integer userId2, Integer jobId) {
        String sql = "INSERT INTO conversations (participant_1, participant_2, job_id) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, userId1);
            ps.setInt(2, userId2);
            ps.setObject(3, jobId);
            return ps;
        }, keyHolder);
        return keyHolder.getKey().intValue();
    }

    public List<Conversation> getUserConversations(Integer userId) {
        String sql = """
            SELECT c.*,
                   u1.name AS p1_name, u1.avatar_url AS p1_avatar,
                   u2.name AS p2_name, u2.avatar_url AS p2_avatar,
                   j.title AS job_title,
                   (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id
                    AND m.sender_id != ? AND m.read_at IS NULL) AS unread_count
            FROM conversations c
            JOIN users u1 ON u1.id = c.participant_1
            JOIN users u2 ON u2.id = c.participant_2
            LEFT JOIN jobs j ON j.id = c.job_id
            WHERE c.participant_1 = ? OR c.participant_2 = ?
            ORDER BY c.last_message_at DESC
            """;
        return jdbc.query(sql, convRowMapper, userId, userId, userId);
    }

    public Integer saveMessage(Message msg) {
        String sql = """
            INSERT INTO messages (conversation_id, sender_id, content, msg_type, file_url)
            VALUES (?, ?, ?, ?, ?)
            """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, msg.getConversationId());
            ps.setInt(2, msg.getSenderId());
            ps.setString(3, msg.getContent());
            ps.setString(4, msg.getMsgType() != null ? msg.getMsgType() : "TEXT");
            ps.setString(5, msg.getFileUrl());
            return ps;
        }, keyHolder);
        Integer msgId = keyHolder.getKey().intValue();

        // Update conversation last_message
        jdbc.update("""
            UPDATE conversations SET last_message=?, last_message_at=NOW()
            WHERE id=?
            """, msg.getContent(), msg.getConversationId());

        return msgId;
    }

    public List<Message> getMessages(Integer conversationId, int page, int size) {
        String sql = """
            SELECT m.*, u.name AS sender_name, u.avatar_url AS sender_avatar
            FROM messages m
            JOIN users u ON u.id = m.sender_id
            WHERE m.conversation_id = ?
            ORDER BY m.sent_at DESC
            LIMIT ? OFFSET ?
            """;
        return jdbc.query(sql, messageRowMapper, conversationId, size, page * size);
    }

    public void markRead(Integer conversationId, Integer userId) {
        String sql = """
            UPDATE messages SET read_at = NOW()
            WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL
            """;
        jdbc.update(sql, conversationId, userId);
    }
}
