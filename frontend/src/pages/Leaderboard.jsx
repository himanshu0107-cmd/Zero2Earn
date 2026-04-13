import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { userAPI } from '../services/api';

const MEDALS = ['🥇','🥈','🥉'];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await userAPI.getLeaderboard(20);
        if (res.data.success) setUsers(res.data.data || []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const xpLevel = (xp) => {
    if (xp >= 500) return { l:'Platinum', c:'#A78BFA' };
    if (xp >= 200) return { l:'Gold',     c:'#FBBF24' };
    if (xp >= 100) return { l:'Silver',   c:'#9CA3AF' };
    return { l:'Bronze', c:'#D97706' };
  };

  return (
    <div className="page">
      <Navbar/>
      <div className="page-content">
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <h1 style={{ fontSize:36, fontWeight:900, marginBottom:8 }}>
            🏆 <span className="gradient-text">Leaderboard</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:16 }}>
            Top earners and most active students on Zero2Earn
          </p>
        </div>

        {/* Top 3 Podium */}
        {!loading && users.length >= 3 && (
          <div style={{
            display:'flex', justifyContent:'center', alignItems:'flex-end',
            gap:16, marginBottom:40, flexWrap:'wrap',
          }}>
            {[users[1], users[0], users[2]].map((u, idx) => {
              const realRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const heights  = [120, 150, 100];
              const lv = xpLevel(u?.xp || 0);
              return u ? (
                <div key={u.id} style={{ textAlign:'center', cursor:'pointer' }}
                  onClick={() => navigate(`/profile/${u.id}`)}>
                  <div style={{ marginBottom:8, fontSize:28 }}>{MEDALS[realRank-1]}</div>
                  <div className="avatar" style={{
                    width:60, height:60, fontSize:22, margin:'0 auto 8px',
                    border:`3px solid ${realRank===1?'#FBBF24':realRank===2?'#9CA3AF':'#D97706'}`,
                  }}>
                    {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name}/> : (u.name||'?')[0]}
                  </div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>
                    {u.name?.split(' ')[0]}
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>
                    {u.collegeName || u.role}
                  </div>
                  <div style={{
                    height:heights[idx],
                    background:`linear-gradient(to top, ${realRank===1?'var(--primary)':realRank===2?'var(--bg-elevated)':'var(--bg-elevated)'}, transparent)`,
                    borderRadius:'8px 8px 0 0',
                    display:'flex', alignItems:'flex-start', justifyContent:'center',
                    paddingTop:12,
                    border:'1px solid var(--border)', borderBottom:'none',
                    minWidth:100,
                  }}>
                    <span style={{ fontWeight:800, color: lv.c }}>⚡{u.xp}</span>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* Full Table */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize:16, fontWeight:700 }}>Top 20 Students</h2>
          </div>
          {loading ? (
            <div className="loading-screen" style={{ height:200 }}>
              <div className="spinner"/><p>Loading…</p>
            </div>
          ) : (
            users.map((u, i) => {
              const lv = xpLevel(u.xp||0);
              return (
                <div key={u.id}
                  style={{
                    display:'flex', alignItems:'center', gap:16, padding:'14px 24px',
                    borderBottom:'1px solid var(--border)', cursor:'pointer',
                    transition:'background 0.2s',
                  }}
                  onClick={() => navigate(`/profile/${u.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>

                  <div style={{ minWidth:36, textAlign:'center' }}>
                    {i < 3
                      ? <span style={{ fontSize:22 }}>{MEDALS[i]}</span>
                      : <span style={{ fontSize:16, fontWeight:700, color:'var(--text-muted)' }}>#{i+1}</span>
                    }
                  </div>

                  <div className="avatar" style={{ width:44, height:44, fontSize:17 }}>
                    {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name}/> : (u.name||'?')[0]}
                  </div>

                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15 }}>{u.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', display:'flex', gap:10, marginTop:2, flexWrap:'wrap' }}>
                      <span>@{u.username}</span>
                      {u.collegeName && <span>🏛 {u.collegeName}</span>}
                      <span className={`badge ${u.role==='TEACHER'?'badge-warning':'badge-primary'}`} style={{ fontSize:10 }}>
                        {u.role}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:800, fontSize:20, color: lv.c }}>
                      ⚡{u.xp||0}
                    </div>
                    <div style={{ fontSize:11, color: lv.c }}>{lv.l}</div>
                  </div>

                  {u.rating > 0 && (
                    <div style={{ textAlign:'center', minWidth:60 }}>
                      <div style={{ color:'#FBBF24', fontWeight:700 }}>⭐{parseFloat(u.rating).toFixed(1)}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{u.ratingCount} reviews</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
