import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { courseAPI } from '../services/api';

const CATEGORIES = ['All','Programming','Design','AI/ML','Marketing','Writing','Media','Mobile'];
const DIFFICULTY = ['All','Beginner','Intermediate','Advanced'];
const EMOJIS = { Programming:'💻', Design:'🎨', 'AI/ML':'🤖', Marketing:'📣', Writing:'✍', Media:'🎬', Mobile:'📱', Default:'📚' };

export default function Courses() {
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);

  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [category, setCategory]   = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [enrolling, setEnrolling] = useState(null);
  const [msg, setMsg]             = useState('');

  useEffect(() => { fetchCourses(); }, [category, difficulty]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        category: category !== 'All' ? category : undefined,
        difficulty: difficulty !== 'All' ? difficulty : undefined,
        page: 0, size: 20,
      };
      const res = await courseAPI.getCourses(params);
      if (res.data.success) setCourses(res.data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    setEnrolling(courseId);
    try {
      const res = await courseAPI.enroll(courseId);
      if (res.data.success) {
        setMsg('Enrolled successfully! 🎉');
        fetchCourses();
      } else setMsg(res.data.message);
    } catch (err) { setMsg(err.response?.data?.message || 'Enrollment failed.'); }
    finally { setEnrolling(null); setTimeout(() => setMsg(''), 3000); }
  };

  const starRating = (r) => {
    const n = parseFloat(r) || 0;
    return '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
  };

  return (
    <div className="page">
      <Navbar/>
      <div className="page-content">
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h1 style={{ fontSize:36, fontWeight:900, marginBottom:10 }}>
            📚 Course <span className="gradient-text">Marketplace</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:17 }}>
            Upskill with affordable courses taught by expert instructors
          </p>
        </div>

        {msg && (
          <div className="alert alert-success" style={{ maxWidth:480, margin:'0 auto 20px' }}>✅ {msg}</div>
        )}

        {/* Category Tabs */}
        <div style={{ overflowX:'auto', marginBottom:20 }}>
          <div style={{ display:'flex', gap:8, paddingBottom:4, minWidth:'max-content' }}>
            {CATEGORIES.map(cat => (
              <button key={cat}
                className={`tab ${category === cat ? 'active' : ''}`}
                style={{ background: category === cat ? 'var(--primary)' : 'var(--bg-elevated)', flexShrink:0 }}
                onClick={() => setCategory(cat)}>
                {EMOJIS[cat] || '📚'} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div style={{ display:'flex', gap:8, marginBottom:28, alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:600 }}>Level:</span>
          {DIFFICULTY.map(d => (
            <button key={d}
              className={`btn btn-sm ${difficulty === d ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setDifficulty(d)}>{d}</button>
          ))}
          {user && (
            <button className="btn btn-secondary btn-sm" style={{ marginLeft:'auto' }}
              onClick={() => navigate('/dashboard')}>
              📖 My Enrolled Courses
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading-screen" style={{ height:300 }}>
            <div className="spinner"/><p>Loading courses…</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📚</div>
            <h3>No courses found</h3>
            <p>Try a different category or difficulty level.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card"
                onClick={() => navigate(`/courses/${course.id}`)}>
                <div className="course-thumb">
                  <span style={{ fontSize:48 }}>
                    {EMOJIS[course.category] || '📚'}
                  </span>
                </div>
                <div className="course-body">
                  <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                    <span className="badge badge-secondary" style={{ fontSize:10 }}>{course.category}</span>
                    <span className="badge badge-outline" style={{ fontSize:10 }}>{course.difficulty}</span>
                  </div>
                  <div className="course-title">{course.title}</div>
                  <div className="course-instructor">by {course.instructorName}</div>

                  {/* Rating */}
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                    <span style={{ color:'#FBBF24', fontSize:13, letterSpacing:-1 }}>
                      {starRating(course.rating)}
                    </span>
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>
                      ({course.enrolledCount} enrolled)
                    </span>
                  </div>

                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12, fontSize:12, color:'var(--text-muted)', flexWrap:'wrap' }}>
                    {course.durationHours > 0 && <span>⏱ {course.durationHours}h</span>}
                  </div>

                  <div className="course-meta">
                    <div className="course-price">
                      {parseFloat(course.price) === 0 ? 'FREE' : `₹${Number(course.price).toLocaleString()}`}
                    </div>
                    <button className="btn btn-primary btn-sm"
                      onClick={(e) => handleEnroll(e, course.id)}
                      disabled={enrolling === course.id}>
                      {enrolling === course.id
                        ? <span className="spinner spinner-sm"/>
                        : 'Enroll'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
