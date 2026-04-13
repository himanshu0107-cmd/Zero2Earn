import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { userAPI, skillAPI, reviewAPI } from '../services/api';

const PROFICIENCY = ['Beginner', 'Intermediate', 'Expert'];

const Stars = ({ value, onChange }) => (
  <div className="rating-stars">
    {[1,2,3,4,5].map(n => (
      <span key={n} className={`star ${n <= value ? 'filled' : 'empty'}`}
        onClick={() => onChange && onChange(n)}>★</span>
    ))}
  </div>
);

export default function Profile() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const [profile, setProfile]     = useState(null);
  const [skills, setSkills]       = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [editForm, setEditForm]   = useState({});
  const [addSkillId, setAddSkillId]       = useState('');
  const [addProficiency, setAddProficiency] = useState('Beginner');
  const [reviewForm, setReviewForm] = useState({ rating:5, comment:'' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [msg, setMsg] = useState({ type:'', text:'' });

  const isOwner = user && parseInt(id) === user.id;

  useEffect(() => { fetchProfile(); fetchAllSkills(); }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getProfile(id);
      if (res.data.success) {
        const { user: u, skills: s, reviews: r } = res.data.data;
        setProfile(u);
        setSkills(s || []);
        setReviews(r || []);
        setEditForm({
          name: u.name, bio: u.bio || '',
          avatarUrl: u.avatarUrl || '', phone: u.phone || '',
          collegeId: u.collegeId || '',
        });
      }
    } catch { setMsg({ type:'error', text:'Failed to load profile.' }); }
    finally { setLoading(false); }
  };

  const fetchAllSkills = async () => {
    try {
      const res = await skillAPI.getAll();
      if (res.data.success) setAllSkills(res.data.data || []);
    } catch {}
  };

  const handleSaveProfile = async () => {
    try {
      await userAPI.updateProfile(id, editForm);
      setMsg({ type:'success', text:'Profile updated!' });
      setEditing(false);
      fetchProfile();
      if (isOwner) updateUser({ name: editForm.name, avatarUrl: editForm.avatarUrl });
    } catch { setMsg({ type:'error', text:'Update failed.' }); }
  };

  const handleAddSkill = async () => {
    if (!addSkillId) return;
    try {
      await userAPI.addSkill(id, { skillId: parseInt(addSkillId), proficiency: addProficiency });
      setMsg({ type:'success', text:'Skill added!' });
      setAddSkillId(''); fetchProfile();
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.message || 'Failed.' }); }
  };

  const handleRemoveSkill = async (skillName) => {
    const sk = allSkills.find(s => s.name === skillName);
    if (!sk) return;
    try {
      await userAPI.removeSkill(id, sk.id);
      fetchProfile();
    } catch {}
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.submit({ revieweeId: parseInt(id), ...reviewForm });
      setMsg({ type:'success', text:'Review submitted!' });
      setShowReviewForm(false);
      fetchProfile();
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.message || 'Failed.' }); }
  };

  const avgRating = profile?.rating ? parseFloat(profile.rating).toFixed(1) : '—';
  const xpLevel   = (xp) => {
    if (xp >= 500) return { l:'Platinum', c:'#A78BFA' };
    if (xp >= 200) return { l:'Gold',     c:'#FBBF24' };
    if (xp >= 100) return { l:'Silver',   c:'#9CA3AF' };
    return { l:'Bronze', c:'#D97706' };
  };
  const lv = xpLevel(profile?.xp || 0);

  if (loading) return (
    <div className="page"><Navbar/>
      <div className="loading-screen"><div className="spinner"/><p>Loading profile…</p></div>
    </div>
  );
  if (!profile) return (
    <div className="page"><Navbar/>
      <div className="empty-state"><div className="icon">😕</div><h3>User not found</h3></div>
    </div>
  );

  return (
    <div className="page">
      <Navbar/>

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <div className="avatar avatar-xl" style={{ flexShrink:0 }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt={profile.name}/>
              : (profile.name||'U').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
            }
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:6 }}>
              <h1 style={{ fontSize:28, fontWeight:800 }}>{profile.name}</h1>
              <span className={`badge ${profile.role === 'TEACHER' ? 'badge-warning' : profile.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                {profile.role}
              </span>
              <span style={{ fontWeight:700, color:lv.c }}>⭐ {lv.l}</span>
            </div>
            <div style={{ color:'var(--text-secondary)', marginBottom:8, display:'flex', gap:12, flexWrap:'wrap' }}>
              <span>@{profile.username}</span>
              {profile.collegeName && <span>🏛 {profile.collegeName}</span>}
              {profile.phone && <span>📱 {profile.phone}</span>}
            </div>
            {profile.bio && (
              <p style={{ color:'var(--text-secondary)', maxWidth:600, lineHeight:1.7, marginBottom:12 }}>
                {profile.bio}
              </p>
            )}
            <div className="profile-stats-row">
              {[
                { val: profile.xp || 0,          lbl: 'XP Earned' },
                { val: avgRating,                 lbl: '⭐ Rating'  },
                { val: profile.ratingCount || 0,  lbl: 'Reviews'   },
              ].map(s => (
                <div key={s.lbl}>
                  <div className="profile-stat-val">{s.val}</div>
                  <div className="profile-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {isOwner ? (
              <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : '✏ Edit Profile'}
              </button>
            ) : user && (
              <button className="btn btn-secondary" onClick={() => setShowReviewForm(!showReviewForm)}>
                ⭐ Leave Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="page-content" style={{ maxWidth:960 }}>
        {msg.text && (
          <div className={`alert alert-${msg.type} mb-4`}
            onClick={() => setMsg({type:'',text:''})}>
            {msg.type==='success'?'✅':'⚠'} {msg.text}
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24, alignItems:'start' }}>
          <div>
            {/* Edit Profile Form */}
            {editing && isOwner && (
              <div className="card" style={{ marginBottom:20 }}>
                <div className="card-header"><h2 style={{fontSize:16,fontWeight:700}}>✏ Edit Profile</h2></div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={editForm.name}
                      onChange={e => setEditForm(f=>({...f,name:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="form-textarea" rows={4} value={editForm.bio}
                      onChange={e => setEditForm(f=>({...f,bio:e.target.value}))}
                      placeholder="Tell the world about yourself..."/>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Avatar URL</label>
                      <input className="form-input" type="url" value={editForm.avatarUrl}
                        onChange={e => setEditForm(f=>({...f,avatarUrl:e.target.value}))}
                        placeholder="https://..."/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={editForm.phone}
                        onChange={e => setEditForm(f=>({...f,phone:e.target.value}))}/>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                </div>
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && user && !isOwner && (
              <div className="card" style={{ marginBottom:20 }}>
                <div className="card-header"><h2 style={{fontSize:16,fontWeight:700}}>⭐ Write a Review</h2></div>
                <div className="card-body">
                  <form onSubmit={handleReview}>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <Stars value={reviewForm.rating} onChange={r => setReviewForm(f=>({...f,rating:r}))}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comment</label>
                      <textarea className="form-textarea" rows={3} required
                        value={reviewForm.comment}
                        onChange={e => setReviewForm(f=>({...f,comment:e.target.value}))}
                        placeholder="Share your experience working with this person…"/>
                    </div>
                    <div style={{ display:'flex', gap:10 }}>
                      <button type="submit" className="btn btn-primary">Submit Review</button>
                      <button type="button" className="btn btn-ghost" onClick={() => setShowReviewForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="card" style={{ marginBottom:20 }}>
              <div className="card-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{fontSize:16,fontWeight:700}}>🛠 Skills</h2>
              </div>
              <div className="card-body">
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom: isOwner ? 16 : 0 }}>
                  {skills.length === 0
                    ? <p style={{color:'var(--text-muted)',fontSize:14}}>No skills added yet.</p>
                    : skills.map(s => (
                      <span key={s} className="skill-tag removable"
                        onClick={isOwner ? () => handleRemoveSkill(s) : undefined}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}>
                        {s}
                        {isOwner && <span className="remove-x" title="Remove">×</span>}
                      </span>
                    ))
                  }
                </div>
                {isOwner && (
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <select className="form-select" style={{ flex:2, minWidth:140 }}
                      value={addSkillId} onChange={e => setAddSkillId(e.target.value)}>
                      <option value="">Select Skill…</option>
                      {allSkills.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <select className="form-select" style={{ flex:1, minWidth:120 }}
                      value={addProficiency} onChange={e => setAddProficiency(e.target.value)}>
                      {PROFICIENCY.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <button className="btn btn-primary btn-sm" onClick={handleAddSkill}>+ Add</button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="card">
              <div className="card-header">
                <h2 style={{fontSize:16,fontWeight:700}}>⭐ Reviews ({reviews.length})</h2>
              </div>
              {reviews.length === 0 ? (
                <div className="card-body">
                  <p style={{color:'var(--text-muted)',fontSize:14}}>No reviews yet.</p>
                </div>
              ) : reviews.map(r => (
                <div key={r.id} style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ width:36, height:36, fontSize:14 }}>
                        {r.reviewerName?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{r.reviewerName}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>
                          {r.jobTitle && `For: ${r.jobTitle}`}
                        </div>
                      </div>
                    </div>
                    <Stars value={r.rating}/>
                  </div>
                  {r.comment && (
                    <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 }}>{r.comment}</p>
                  )}
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:6 }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            <div className="card">
              <div className="card-body">
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>📊 Stats</h3>
                {[
                  { icon:'⚡', label:'XP',          val: profile.xp || 0 },
                  { icon:'💰', label:'Wallet (₹)',   val: parseFloat(profile.walletBalance || 0).toFixed(2) },
                  { icon:'⭐', label:'Avg Rating',   val: avgRating },
                  { icon:'💬', label:'Reviews',      val: profile.ratingCount || 0 },
                  { icon:'📅', label:'Member Since', val: new Date(profile.createdAt).toLocaleDateString('en-IN',{month:'short',year:'numeric'}) },
                ].map(row => (
                  <div key={row.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:14 }}>
                    <span style={{color:'var(--text-muted)'}}>{row.icon} {row.label}</span>
                    <span style={{fontWeight:700}}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
