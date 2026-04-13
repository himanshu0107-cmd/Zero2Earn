package com.zero2earn.model;

import java.time.LocalDateTime;

public class Conversation {
    private Integer id;
    private Integer participant1;
    private String participant1Name;
    private String participant1Avatar;
    private Integer participant2;
    private String participant2Name;
    private String participant2Avatar;
    private Integer jobId;
    private String jobTitle;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;
    private Integer unreadCount;

    public Conversation() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getParticipant1() { return participant1; }
    public void setParticipant1(Integer participant1) { this.participant1 = participant1; }

    public String getParticipant1Name() { return participant1Name; }
    public void setParticipant1Name(String participant1Name) { this.participant1Name = participant1Name; }

    public String getParticipant1Avatar() { return participant1Avatar; }
    public void setParticipant1Avatar(String participant1Avatar) { this.participant1Avatar = participant1Avatar; }

    public Integer getParticipant2() { return participant2; }
    public void setParticipant2(Integer participant2) { this.participant2 = participant2; }

    public String getParticipant2Name() { return participant2Name; }
    public void setParticipant2Name(String participant2Name) { this.participant2Name = participant2Name; }

    public String getParticipant2Avatar() { return participant2Avatar; }
    public void setParticipant2Avatar(String participant2Avatar) { this.participant2Avatar = participant2Avatar; }

    public Integer getJobId() { return jobId; }
    public void setJobId(Integer jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getUnreadCount() { return unreadCount; }
    public void setUnreadCount(Integer unreadCount) { this.unreadCount = unreadCount; }
}
