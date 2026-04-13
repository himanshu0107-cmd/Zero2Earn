import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import { AuthContext } from '../context/AuthContext';
import { jobAPI, applicationAPI, courseAPI } from '../services/api';

const SIDEBAR_TABS = [
  { id: 'overview',     label: 'Overview',      emoji: '📊' },
  { id: 'recommended',  label: 'Recommended',   emoji: '⚡' },
  { id: 'applications', label: 'Applications',   emoji: '📋' },
  { id: 'my-jobs',      label: 'My Posted Jobs', emoji: '📌' },
  { id: 'courses',      label: 'My Courses',     emoji: '🎓' },
];

const STATUS_COLOR = {
  PENDING:   { cls: 'badge-warning',   label: '⏳ Pending'   },
  ACCEPTED:  { cls: 'badge-success',   label: '✅ Accepted'  },
  REJECTED:  { cls: 'badge-danger',    label: '❌ Rejected'  },
  COMPLETED: { cls: 'badge-primary',   label: '🏆 Completed' },
  WITHDRAWN: { cls: 'badge-secondary', label: '↩ Withdrawn'  },
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab]     = useState('overview');
  const [recommended, setRecommended] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs]           = useState([]);
  const [myCourses, setMyCourses]     = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [recRes, appRes, jobsRes, coursesRes] = await Promise.allSettled([
        jobAPI.getRecommended({ page: 0, size: 6 }),
        applicationAPI.getMyApplications(),
        jobAPI.getMyJobs(),
        courseAPI.getMyCourses(),
      ]);
      if (recRes.status === 'fulfilled' && recRes.value.data.success)
        setRecommended(recRes.value.data.data || []);
      if (appRes.status === 'fulfilled' && appRes.value.data.success)
        setApplications(appRes.value.data.data || []);
      if (jobsRes.status === 'fulfilled' && jobsRes.value.data.success)
        setMyJobs(jobsRes.value.data.data || []);
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data.success)
        setMyCourses(coursesRes.value.data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  const xpLevel = (xp) => {
    if (xp >= 500) return { label: 'Platinum', color: '#A78BFA' };
    if (xp >= 200) return { label: 'Gold',     color: '#FBBF24' };
    if (xp >= 100) return { label: 'Silver',   color: '#9CA3AF' };
    return { label: 'Bronze', color: '#D97706' };
  };
  const level = xpLevel(user?.xp || 0);
  const nextXp = level.label === 'Bronze' ? 100 : level.label === 'Silver' ? 200 : level.label === 'Gold' ? 500 : 1000;
  const xpPct  = Math.min(100, Math.round(((user?.xp || 0) / nextXp) * 100));

  const completedJobs = applications.filter(a => a.status === 'COMPLETED').length;
  const activeApps    = applications.filter(a => a.status === 'PENDING' || a.status === 'ACCEPTED').length;

  return (
    <div className="dashboard">
      <Navbar />
      <div className="page-content">
        <div className="dashboard-grid">

          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-user">
              <div className="avatar avatar-lg" style={{ margin: '0 auto' }}>
                {user?.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.name} />
                  : (user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                }
              </div>
              <div className="sidebar-name">{user?.name}</div>
              <div className="sidebar-role">
                <span className={`badge ${user?.role === 'TEACHER' ? 'badge-warning' : user?.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: 11 }}>
                  {user?.role}
                </span>
              </div>
              {user?.collegeName && <div className="sidebar-college">🏛 {user.collegeName}</div>}

              {/* XP Bar */}
              <div className="xp-bar-wrap">
                <div className="xp-bar-label">
                  <span style={{ color: level.color, fontWeight: 700 }}>⭐ {level.label}</span>
                  <span>{user?.xp || 0} / {nextXp} XP</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ width: `${xpPct}%` }} />
                </div>
              </div>
            </div>

            <div className="divider" style={{margin:'0 0 16px'}}/>

            <nav className="sidebar-nav">
              {SIDEBAR_TABS.map(tab => (
                <button key={tab.id}
                  className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}>
                  <span>{tab.emoji}</span> {tab.label}
                </button>
              ))}
              <div className="divider" style={{margin:'12px 0'}}/>
              <button className="sidebar-link" onClick={() => navigate(`/profile/${user?.id}`)}>
                <span>👤</span> My Profile
              </button>
              <button className="sidebar-link" onClick={() => navigate('/post-job')}>
                <span>➕</span> Post a Job
              </button>
              <button className="sidebar-link" onClick={() => navigate('/chat')}>
                <span>💬</span> Messages
              </button>
            </nav>
          </aside>

          {/* ── Main Content ── */}
          <main>
            {loading ? (
              <div className="loading-screen" style={{height:300}}>
                <div className="spinner"/><p>Loading dashboard…</p>
              </div>
            ) : (
              <>
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                  <>
                    <div style={{ marginBottom: 28 }}>
                      <h1 style={{ fontSize: 26, fontWeight: 800 }}>
                        Welcome back, {user?.name?.split(' ')[0]}! 👋
                      </h1>
                      <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
                        Here's what's happening with your freelancing journey.
                      </p>
                    </div>

                    <div className="grid-4" style={{ marginBottom: 28 }}>
                      <div className="stat-card">
                        <div className="stat-icon-wrap stat-icon-purple">💼</div>
                        <div>
                          <div className="stat-label">Applied Jobs</div>
                          <div className="stat-value">{applications.length}</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon-wrap stat-icon-green">✅</div>
                        <div>
                          <div className="stat-label">Completed</div>
                          <div className="stat-value">{completedJobs}</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon-wrap stat-icon-orange">⏳</div>
                        <div>
                          <div className="stat-label">Active</div>
                          <div className="stat-value">{activeApps}</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon-wrap stat-icon-red">📌</div>
                        <div>
                          <div className="stat-label">Posted Jobs</div>
                          <div className="stat-value">{myJobs.length}</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card" style={{ marginBottom: 24 }}>
                      <div className="card-header">
                        <h2 className="section-title" style={{margin:0}}>⚡ Quick Actions</h2>
                      </div>
                      <div className="card-body">
                        <div className="grid-4">
                          {[
                            { emoji:'🔍', label:'Browse Jobs',   path:'/jobs' },
                            { emoji:'📤', label:'Post a Job',    path:'/post-job' },
                            { emoji:'📚', label:'Explore Courses',path:'/courses' },
                            { emoji:'💬', label:'Messages',      path:'/chat' },
                          ].map(a => (
                            <button key={a.path}
                              onClick={() => navigate(a.path)}
                              style={{
                                background:'var(--bg-elevated)', border:'1px solid var(--border)',
                                borderRadius:12, padding:'20px 12px', textAlign:'center',
                                cursor:'pointer', transition:'all 0.2s', color:'var(--text-primary)',
                              }}
                              onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary)'}
                              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.emoji}</div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent Applications */}
                    {applications.length > 0 && (
                      <div className="card">
                        <div className="card-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <h2 className="section-title" style={{margin:0}}>📋 Recent Applications</h2>
                          <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('applications')}>View all →</button>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          {applications.slice(0, 3).map(app => (
                            <div key={app.id} style={{
                              display:'flex', justifyContent:'space-between', alignItems:'center',
                              padding:'14px 24px', borderBottom:'1px solid var(--border)'
                            }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{app.jobTitle}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <span className={`badge ${STATUS_COLOR[app.status]?.cls}`}>
                                {STATUS_COLOR[app.status]?.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* RECOMMENDED */}
                {activeTab === 'recommended' && (
                  <>
                    <h2 className="section-title"><span>⚡</span> Jobs Matched to Your Skills</h2>
                    {recommended.length === 0 ? (
                      <div className="empty-state">
                        <div className="icon">🎯</div>
                        <h3>No matches yet</h3>
                        <p>Add skills to your profile to get personalized job recommendations.</p>
                        <button className="btn btn-primary mt-4" onClick={() => navigate(`/profile/${user?.id}`)}>
                          Update Profile
                        </button>
                      </div>
                    ) : (
                      <div className="jobs-grid">
                        {recommended.map(job => <JobCard key={job.id} job={job} />)}
                      </div>
                    )}
                  </>
                )}

                {/* APPLICATIONS */}
                {activeTab === 'applications' && (
                  <>
                    <h2 className="section-title"><span>📋</span> My Applications</h2>
                    {applications.length === 0 ? (
                      <div className="empty-state">
                        <div className="icon">📭</div>
                        <h3>No applications yet</h3>
                        <p>Browse jobs and apply to start earning!</p>
                        <button className="btn btn-primary mt-4" onClick={() => navigate('/jobs')}>
                          Browse Jobs
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {applications.map(app => (
                          <div key={app.id} className="card card-body"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/jobs/${app.jobId}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{app.jobTitle}</div>
                                {app.coverLetter && (
                                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
                                    {app.coverLetter.slice(0, 100)}…
                                  </p>
                                )}
                                <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                  {app.proposedBudget && (
                                    <span style={{ fontSize: 12, color: 'var(--secondary)' }}>
                                      💰 ₹{app.proposedBudget} proposed
                                    </span>
                                  )}
                                  {app.estimatedDays && (
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                      📅 {app.estimatedDays} days
                                    </span>
                                  )}
                                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <span className={`badge ${STATUS_COLOR[app.status]?.cls}`}>
                                {STATUS_COLOR[app.status]?.label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* MY POSTED JOBS */}
                {activeTab === 'my-jobs' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h2 className="section-title" style={{ margin: 0 }}><span>📌</span> My Posted Jobs</h2>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/post-job')}>+ Post New Job</button>
                    </div>
                    {myJobs.length === 0 ? (
                      <div className="empty-state">
                        <div className="icon">📝</div>
                        <h3>No jobs posted yet</h3>
                        <p>Post your first job and find talented students!</p>
                        <button className="btn btn-primary mt-4" onClick={() => navigate('/post-job')}>
                          Post a Job
                        </button>
                      </div>
                    ) : (
                      <div className="jobs-grid">
                        {myJobs.map(job => <JobCard key={job.id} job={job} showStatus />)}
                      </div>
                    )}
                  </>
                )}

                {/* MY COURSES */}
                {activeTab === 'courses' && (
                  <>
                    <h2 className="section-title"><span>🎓</span> Enrolled Courses</h2>
                    {myCourses.length === 0 ? (
                      <div className="empty-state">
                        <div className="icon">📚</div>
                        <h3>No courses yet</h3>
                        <p>Explore the course marketplace to upskill yourself.</p>
                        <button className="btn btn-primary mt-4" onClick={() => navigate('/courses')}>
                          Browse Courses
                        </button>
                      </div>
                    ) : (
                      <div className="courses-grid">
                        {myCourses.map(course => (
                          <div key={course.id} className="course-card"
                            onClick={() => navigate(`/courses/${course.id}`)}>
                            <div className="course-thumb" style={{ fontSize: 36 }}>
                              {course.category === 'Programming' ? '💻'
                               : course.category === 'Design' ? '🎨'
                               : course.category === 'AI/ML' ? '🤖' : '📚'}
                            </div>
                            <div className="course-body">
                              <div className="course-title">{course.title}</div>
                              <div className="course-instructor">by {course.instructorName}</div>
                              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Progress: {course.userProgress || 0}%
                              </div>
                              <div className="course-progress">
                                <div className="course-progress-fill" style={{ width: `${course.userProgress || 0}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
