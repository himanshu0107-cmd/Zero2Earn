import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const API_WS = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

const fmt = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  }
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
};

export default function Chat() {
  const { convId: urlConvId } = useParams();
  const { user }              = useContext(AuthContext);
  const navigate              = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const [stompClient, setStompClient]     = useState(null);
  const [connected, setConnected]         = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });

  // ── Fetch conversations ──────────────────────────────────────
  useEffect(() => { fetchConversations(); }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await chatAPI.getConversations();
      if (res.data.success) {
        const convs = res.data.data || [];
        setConversations(convs);
        // Auto-select from URL param or first
        if (urlConvId) {
          const found = convs.find(c => c.id === parseInt(urlConvId));
          if (found) loadConversation(found);
        } else if (convs.length > 0) {
          loadConversation(convs[0]);
        }
      }
    } catch {}
    finally { setLoading(false); }
  };

  // ── Load a conversation ──────────────────────────────────────
  const loadConversation = async (conv) => {
    setActiveConv(conv);
    setMessages([]);
    try {
      const res = await chatAPI.getMessages(conv.id);
      if (res.data.success) {
        const msgs = (res.data.data || []).reverse();
        setMessages(msgs);
        setTimeout(scrollToBottom, 100);
      }
    } catch {}
  };

  // ── WebSocket connection ──────────────────────────────────────
  useEffect(() => {
    if (!activeConv) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(API_WS),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${activeConv.id}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setTimeout(scrollToBottom, 50);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    setStompClient(client);

    return () => { client.deactivate(); setStompClient(null); setConnected(false); };
  }, [activeConv?.id]);

  // ── Send message ─────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !activeConv) return;
    setInput(''); setSending(true);

    const msg = { conversationId: activeConv.id, senderId: user.id, content: text, msgType: 'TEXT' };

    // Optimistic UI
    const optimistic = { ...msg, id: Date.now(), senderName: user.name, sentAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);
    setTimeout(scrollToBottom, 50);

    try {
      if (connected && stompClient) {
        stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(msg) });
      } else {
        await chatAPI.sendMessage(activeConv.id, msg);
      }
    } catch {}
    finally { setSending(false); inputRef.current?.focus(); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Get "other" participant name ─────────────────────────────
  const otherName = (conv) => {
    if (!conv || !user) return 'Unknown';
    return conv.participant1 === user.id ? conv.participant2Name : conv.participant1Name;
  };
  const otherAvatar = (conv) => {
    if (!conv || !user) return '';
    return conv.participant1 === user.id ? conv.participant1Avatar : conv.participant2Avatar;
  };
  const otherId = (conv) => {
    if (!conv || !user) return null;
    return conv.participant1 === user.id ? conv.participant2 : conv.participant1;
  };

  if (!user) {
    navigate('/login'); return null;
  }

  return (
    <div className="page" style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <Navbar />
      <div className="chat-layout" style={{ flex:1 }}>

        {/* ── Conversation List ── */}
        <div className="conv-list">
          <div className="conv-header">
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>💬 Messages</h2>
            <input className="conv-search" placeholder="Search conversations…" readOnly />
          </div>

          {loading ? (
            <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>
              <div className="spinner" style={{margin:'0 auto 8px'}}/>Loading…
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding:24, textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>
              No conversations yet.<br/>
              Apply to a job and chat with the poster!
            </div>
          ) : (
            conversations.map(conv => (
              <div key={conv.id}
                className={`conv-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                onClick={() => { navigate(`/chat/${conv.id}`); loadConversation(conv); }}>
                <div className="avatar" style={{ width:42, height:42, fontSize:17, flexShrink:0 }}>
                  {otherAvatar(conv)
                    ? <img src={otherAvatar(conv)} alt={otherName(conv)}/>
                    : (otherName(conv)||'?')[0]}
                </div>
                <div className="conv-info">
                  <div className="conv-name">{otherName(conv)}</div>
                  {conv.jobTitle && (
                    <div style={{ fontSize:11, color:'var(--primary-light)', marginBottom:2 }}>
                      📌 {conv.jobTitle}
                    </div>
                  )}
                  <div className="conv-last">{conv.lastMessage || 'No messages yet'}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                  {conv.lastMessageAt && (
                    <span style={{ fontSize:10, color:'var(--text-muted)' }}>{fmt(conv.lastMessageAt)}</span>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="conv-badge">{conv.unreadCount}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Chat Window ── */}
        <div className="chat-window">
          {!activeConv ? (
            <div className="chat-no-conv">
              <div className="icon">💬</div>
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="avatar" style={{ width:40, height:40, fontSize:16 }}>
                  {(otherName(activeConv)||'?')[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700 }}>{otherName(activeConv)}</div>
                  {activeConv.jobTitle && (
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>📌 {activeConv.jobTitle}</div>
                  )}
                </div>
                {connected && (
                  <span style={{ fontSize:11, color:'var(--success)', display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ width:6, height:6, background:'currentColor', borderRadius:'50%', display:'inline-block'}}/>
                    Live
                  </span>
                )}
                <button className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/profile/${otherId(activeConv)}`)}>
                  👤 Profile
                </button>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="chat-empty">No messages yet. Say hello! 👋</div>
                )}
                {messages.map((msg, i) => {
                  const isMine = msg.senderId === user.id;
                  return (
                    <div key={msg.id || i} className={`msg-row ${isMine ? 'mine' : ''}`}>
                      {!isMine && (
                        <div className="avatar" style={{ width:30, height:30, fontSize:12, flexShrink:0 }}>
                          {(msg.senderName||'?')[0]}
                        </div>
                      )}
                      <div>
                        <div className={`msg-bubble ${isMine ? 'mine' : 'theirs'}`}>
                          {msg.content}
                        </div>
                        <div className="msg-time" style={{ textAlign: isMine ? 'right' : 'left' }}>
                          {fmt(msg.sentAt)}
                          {isMine && msg.readAt && ' · Read'}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef}/>
              </div>

              {/* Input */}
              <div className="chat-input-area">
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  placeholder="Type a message… (Enter to send)"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button className="btn btn-primary" onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  style={{ padding:'10px 18px', flexShrink:0 }}>
                  {sending ? <span className="spinner spinner-sm"/> : '➤'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
