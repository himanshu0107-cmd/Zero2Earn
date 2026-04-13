package com.zero2earn.controller;

import com.zero2earn.dto.ApiResponse;
import com.zero2earn.model.Conversation;
import com.zero2earn.model.Message;
import com.zero2earn.repository.MessageDao;
import com.zero2earn.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired private MessageDao messageDao;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    // Get or create a conversation
    @PostMapping("/conversation")
    public ResponseEntity<?> getOrCreateConversation(
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        Integer otherUserId = (Integer) body.get("otherUserId");
        Integer jobId = (Integer) body.get("jobId");

        Optional<Conversation> existing = messageDao.findConversation(userId, otherUserId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(ApiResponse.ok(existing.get()));
        }

        Integer convId = messageDao.createConversation(userId, otherUserId, jobId);
        Optional<Conversation> created = messageDao.findConversation(userId, otherUserId);
        return ResponseEntity.status(201).body(ApiResponse.ok("Conversation created", created.orElse(null)));
    }

    // Get user's conversation list
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(@RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        List<Conversation> convs = messageDao.getUserConversations(userId);
        return ResponseEntity.ok(ApiResponse.ok(convs));
    }

    // Get messages in a conversation
    @GetMapping("/conversation/{convId}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable Integer convId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        List<Message> messages = messageDao.getMessages(convId, page, size);
        messageDao.markRead(convId, userId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    // Send message via REST (fallback)
    @PostMapping("/conversation/{convId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable Integer convId,
            @RequestBody Message msg,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        msg.setConversationId(convId);
        msg.setSenderId(userId);
        Integer msgId = messageDao.saveMessage(msg);

        // Broadcast via WebSocket
        messagingTemplate.convertAndSend("/topic/chat/" + convId, msg);

        return ResponseEntity.status(201).body(ApiResponse.ok(msg));
    }

    // ─── WebSocket handler ───────────────────────────────────
    @MessageMapping("/chat.send")
    public void handleMessage(@Payload Message msg) {
        // Save to DB
        messageDao.saveMessage(msg);
        // Broadcast to subscribers of this conversation room
        messagingTemplate.convertAndSend("/topic/chat/" + msg.getConversationId(), msg);
    }

    private Integer getUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.getUserIdFromToken(authHeader.substring(7));
        }
        return -1;
    }
}
