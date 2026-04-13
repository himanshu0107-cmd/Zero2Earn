import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { courseAPI } from '../services/api';

const EMOJIS = { Programming:'💻', Design:'🎨', 'AI/ML':'🤖', Marketing:'📣', Writing:'✍', Default:'📚' };

export default function CourseDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);

  const [course, setCourse]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [msg, setMsg]             = useState({ type:'', text:'' });

  useEffect(() => { fetchCourse(); }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await courseAPI.getById(id);
      if (res.data.success) {
        setCourse(res.data.data);
        setProgress(res.data.data.userProgress || 0);
      }
    } catch { setMsg({ type:'error', text:'Failed to load course.' }); }
    finally { setLoading(false); }
  };

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      const res = await courseAPI.enroll(id);
      if (res.data.success) {
        setMsg({ type:'success', text:'Enrolled! Start learning now 🎉' });
        fetchCourse();
      } else setMsg({ type:'error', text: res.data.message });
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.message || 'Enrollment failed.' }); }
    finally { setEnrolling(false); }
  };

  const handleProgress = async (val) => {
    setProgress(val);
    try { await courseAPI.updateProgress(id, val); }
    catch {}
  };

  if (loading) return (
    <div className="page"><Navbar/>
      <div className="loading-screen"><div className="spinner"/><p>Loading course…</p></div>
    </div>
  );
  if (!course) return (
    <div className="page"><Navbar/>
      <div className="empty-state"><div className="icon">😕</div><h3>Course not found</h3></div>
    </div>
  );

  const emoji = EMOJIS[course.category] || EMOJIS.Default;
  const isFree = parseFloat(course.price) === 0;
  const isEnrolled = course.enrolled;

  return (
    <div className="page">
      <Navbar/>
      <div className="page-content">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom:20 }}>
          ← Back to Courses
        </button>

        {msg.text && (
          <div className={`alert alert-${msg.type} mb-4`}>{msg.text}</div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:28, alignItems:'start' }}>
          {/* Left */}
          <div>
            <div className="card" style={{ marginBottom:20 }}>
              <div style={{ height:200, background:'linear-gradient(135deg,var(--bg-elevated),var(--bg-hover))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80 }}>
                {emoji}
              </div>
              <div className="card-body">
                <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                  <span className="badge badge-secondary">{course.category}</span>
                  <span className="badge badge-outline">{course.difficulty}</span>
                </div>
                <h1 style={{ fontSize:24, fontWeight:800, marginBottom:12 }}>{course.title}</h1>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div className="avatar" style={{ width:32, height:32, fontSize:13 }}>
                      {(course.instructorName||'?')[0]}
                    </div>
                    <span style={{ fontSize:14, color:'var(--text-secondary)' }}>
                      Instructor: <strong style={{ color:'var(--text-primary)' }}>{course.instructorName}</strong>
                    </span>
                  </div>
                  {course.rating > 0 && (
                    <span style={{ color:'#FBBF24' }}>{'★'.repeat(Math.round(course.rating))} {parseFloat(course.rating).toFixed(1)}</span>
                  )}
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>
                    👥 {course.enrolledCount} students
                  </span>
                  {course.durationHours > 0 && (
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>⏱ {course.durationHours} hours</span>
                  )}
                </div>
                {course.description && (
                  <p style={{ color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>
                    {course.description}
                  </p>
                )}
              </div>
            </div>

            {/* Progress trackter when enrolled */}
            {isEnrolled && (
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>📈 Your Progress</h3>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <div style={{ flex:1, background:'var(--bg-surface)', borderRadius:8, height:12, overflow:'hidden' }}>
                      <div style={{
                        height:'100%',
                        background:'linear-gradient(90deg,var(--primary),var(--secondary))',
                        width:`${progress}%`, borderRadius:8,
                        transition:'width 0.4s',
                      }}/>
                    </div>
                    <span style={{ fontWeight:700, color:'var(--primary-light)', minWidth:36 }}>{progress}%</span>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {[0,25,50,75,100].map(p => (
                      <button key={p}
                        className={`btn btn-sm ${progress >= p ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => handleProgress(p)}>
                        {p}%
                      </button>
                    ))}
                  </div>
                  {progress === 100 && (
                    <div className="alert alert-success" style={{ marginTop:16 }}>
                      🏆 Congratulations! You've completed this course!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="card" style={{ position:'sticky', top:80 }}>
              <div className="card-body">
                <div style={{ textAlign:'center', marginBottom:20 }}>
                  <div style={{ fontSize:36, fontWeight:900, color:'var(--secondary)', marginBottom:4 }}>
                    {isFree ? 'FREE' : `₹${Number(course.price).toLocaleString()}`}
                  </div>
                  {!isFree && (
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>One-time payment</div>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="alert alert-success" style={{ textAlign:'center', margin:0 }}>
                    ✅ You are enrolled!<br/>
                    <span style={{ fontSize:12 }}>Track your progress above.</span>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-lg btn-block" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? <><span className="spinner spinner-sm"/>Enrolling…</> : '🎓 Enroll Now'}
                  </button>
                )}

                <div className="divider"/>

                <h4 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>This course includes:</h4>
                {[
                  '✅ Lifetime access',
                  '✅ Certificate on completion',
                  '✅ Mobile & desktop accessible',
                  `✅ ${course.durationHours || '—'} hours of content`,
                  '✅ Direct instructor support',
                ].map(item => (
                  <div key={item} style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:8 }}>{item}</div>
                ))}

                <div className="divider"/>
                <button className="btn btn-ghost btn-sm btn-block"
                  onClick={() => navigate(`/profile/${course.instructorId}`)}>
                  👤 View Instructor Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
