import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { jobAPI, applicationAPI, chatAPI } from '../services/api';

const STATUS_COLOR = {
  PENDING:   'badge-warning',  ACCEPTED: 'badge-success',
  REJECTED:  'badge-danger',   COMPLETED:'badge-primary',  WITHDRAWN:'badge-secondary',
};
const APPLICANT_ACTIONS = ['ACCEPTED','REJECTED','COMPLETED'];

export default function JobDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);

  const [job, setJob]                   = useState(null);
  const [applications, setApplications] = useState([]);
  const [myApp, setMyApp]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [applying, setApplying]         = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyForm, setApplyForm]       = useState({ coverLetter:'', proposedBudget:'', estimatedDays:'' });
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await jobAPI.getById(id);
      if (res.data.success) setJob(res.data.data);

      if (user) {
        const appRes = await applicationAPI.getMyApplications();
        if (appRes.data.success) {
          const found = appRes.data.data.find(a => a.jobId === parseInt(id));
          setMyApp(found || null);
        }
        // If poster — fetch applicants
        if (res.data.data?.posterId === user.id) {
          const appsRes = await applicationAPI.getForJob(id);
          if (appsRes.data.success) setApplications(appsRes.data.data || []);
        }
      }
    } catch { setError('Failed to load job.'); }
    finally { setLoading(false); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true); setError('');
    try {
      const payload = {
        jobId: parseInt(id),
        coverLetter: applyForm.coverLetter,
        proposedBudget: applyForm.proposedBudget ? parseFloat(applyForm.proposedBudget) : null,
        estimatedDays: applyForm.estimatedDays ? parseInt(applyForm.estimatedDays) : null,
      };
      const res = await applicationAPI.apply(payload);
      if (res.data.success) {
        setSuccess('Application submitted! 🎉');
        setShowApplyForm(false);
        setMyApp(res.data.data);
      } else setError(res.data.message);
    } catch (err) { setError(err.response?.data?.message || 'Failed to apply.'); }
    finally { setApplying(false); }
  };

  const handleApplicationAction = async (appId, status) => {
    try {
      await applicationAPI.updateStatus(appId, status);
      setSuccess(`Application ${status.toLowerCase()}!`);
      fetchJob();
    } catch { setError('Action failed.'); }
  };

  const startChat = async (otherUserId) => {
    try {
      const res = await chatAPI.getOrCreateConversation({ otherUserId, jobId: parseInt(id) });
      if (res.data.success) navigate(`/chat/${res.data.data.id}`);
    } catch {}
  };

  const daysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    return diff < 0 ? 'Expired' : `${diff} days left`;
  };

  const isPoster  = user && job && user.id === job.posterId;
  const canApply  = user && job?.status === 'OPEN' && !isPoster && !myApp;

  if (loading) return (
    <div className="page"><Navbar />
      <div className="loading-screen"><div className="spinner"/><p>Loading job…</p></div>
    </div>
  );
  if (!job) return (
    <div className="page"><Navbar />
      <div className="empty-state"><div className="icon">😕</div><h3>Job not found</h3></div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
          ← Back to Jobs
        </button>

        {error   && <div className="alert alert-error mb-4">⚠ {error}</div>}
        {success && <div className="alert alert-success mb-4">✅ {success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          {/* ── Left: Job Info ── */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                {/* Title + Status */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:16 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.3 }}>{job.title}</h1>
                  <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : 'badge-secondary'}`} style={{ flexShrink:0 }}>
                    {job.status}
                  </span>
                </div>

                {/* Poster Info */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, padding:'14px', background:'var(--bg-elevated)', borderRadius:10 }}>
                  <div className="avatar" style={{ width:44, height:44, fontSize:18 }}>
                    {job.posterName?.[0] || '?'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{ fontWeight:700 }}>{job.posterName}</div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', display:'flex', gap:8, marginTop:2 }}>
                      <span className={`badge ${job.posterRole === 'TEACHER' ? 'badge-warning' : 'badge-primary'}`} style={{fontSize:10}}>
                        {job.posterRole}
                      </span>
                      {job.posterRating > 0 && (
                        <span>⭐ {parseFloat(job.posterRating).toFixed(1)}</span>
                      )}
                      {job.collegeName && <span>🏛 {job.collegeName}</span>}
                    </div>
                  </div>
                  {user && !isPoster && (
                    <button className="btn btn-ghost btn-sm" onClick={() => startChat(job.posterId)}>
                      💬 Chat
                    </button>
                  )}
                </div>

                {/* Description */}
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>About this Job</h3>
                <p style={{ color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap', marginBottom:20 }}>
                  {job.description}
                </p>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>Skills Required</h3>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {job.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                {!user ? (
                  <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/login')}>
                    Sign in to Apply
                  </button>
                ) : myApp ? (
                  <div className="alert alert-info">
                    ✅ You applied on {new Date(myApp.appliedAt).toLocaleDateString()} ·
                    <span className={`badge ${STATUS_COLOR[myApp.status]}`} style={{ marginLeft:8 }}>
                      {myApp.status}
                    </span>
                    {myApp.status === 'PENDING' && (
                      <button className="btn btn-danger btn-sm"
                        style={{ marginLeft:'auto', display:'block', marginTop:10 }}
                        onClick={() => handleApplicationAction(myApp.id, 'WITHDRAWN')}>
                        Withdraw Application
                      </button>
                    )}
                  </div>
                ) : canApply ? (
                  <>
                    {!showApplyForm ? (
                      <button className="btn btn-primary btn-lg btn-block"
                        onClick={() => setShowApplyForm(true)}>
                        ✍ Apply Now — {job.type === 'UNPAID' ? 'Free' : `₹${job.budget}`}
                      </button>
                    ) : (
                      <div style={{ marginTop:4, padding:20, background:'var(--bg-elevated)', borderRadius:12, border:'1px solid var(--border)' }}>
                        <h3 style={{ marginBottom:16, fontSize:16 }}>Submit Application</h3>
                        <form onSubmit={handleApply}>
                          <div className="form-group">
                            <label className="form-label">Cover Letter *</label>
                            <textarea className="form-textarea" rows={5} required
                              placeholder="Introduce yourself and explain why you're the best fit..."
                              value={applyForm.coverLetter}
                              onChange={e => setApplyForm(f => ({...f, coverLetter:e.target.value}))}/>
                          </div>
                          {job.type === 'PAID' && (
                            <div className="form-row">
                              <div className="form-group">
                                <label className="form-label">Your Quote (₹)</label>
                                <input className="form-input" type="number" placeholder="Enter amount"
                                  value={applyForm.proposedBudget}
                                  onChange={e => setApplyForm(f => ({...f, proposedBudget:e.target.value}))}/>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Delivery (Days)</label>
                                <input className="form-input" type="number" placeholder="e.g. 7"
                                  value={applyForm.estimatedDays}
                                  onChange={e => setApplyForm(f => ({...f, estimatedDays:e.target.value}))}/>
                              </div>
                            </div>
                          )}
                          <div style={{ display:'flex', gap:10 }}>
                            <button type="submit" className="btn btn-primary" disabled={applying}>
                              {applying ? <><span className="spinner spinner-sm"/>Submitting…</> : 'Submit Application'}
                            </button>
                            <button type="button" className="btn btn-ghost"
                              onClick={() => setShowApplyForm(false)}>Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                ) : isPoster ? null : (
                  <div className="alert alert-warning">This job is not accepting applications.</div>
                )}
              </div>
            </div>

            {/* ── Applicants (poster only) ── */}
            {isPoster && applications.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 style={{ fontSize:18, fontWeight:700 }}>
                    👥 Applicants ({applications.length})
                  </h2>
                </div>
                <div>
                  {applications.map(app => (
                    <div key={app.id} style={{
                      padding:'18px 24px', borderBottom:'1px solid var(--border)',
                      display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12,
                    }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                          <div className="avatar" style={{ width:36, height:36, fontSize:14 }}>
                            {app.applicantName?.[0] || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:14 }}>{app.applicantName}</div>
                            <div style={{ fontSize:12, color:'var(--text-secondary)', display:'flex', gap:8 }}>
                              @{app.applicantUsername}
                              {app.applicantRating > 0 && <span>⭐ {parseFloat(app.applicantRating).toFixed(1)}</span>}
                            </div>
                          </div>
                          <span className={`badge ${STATUS_COLOR[app.status]}`} style={{ marginLeft:'auto' }}>
                            {app.status}
                          </span>
                        </div>
                        {app.coverLetter && (
                          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:8, lineHeight:1.6 }}>
                            {app.coverLetter}
                          </p>
                        )}
                        <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--text-muted)' }}>
                          {app.proposedBudget && <span>💰 Quoted ₹{app.proposedBudget}</span>}
                          {app.estimatedDays && <span>📅 {app.estimatedDays} days</span>}
                          <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
                        {app.status === 'PENDING' && (
                          <>
                            <button className="btn btn-success btn-sm"
                              onClick={() => handleApplicationAction(app.id, 'ACCEPTED')}>✓ Accept</button>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => handleApplicationAction(app.id, 'REJECTED')}>✕ Reject</button>
                          </>
                        )}
                        {app.status === 'ACCEPTED' && (
                          <button className="btn btn-primary btn-sm"
                            onClick={() => handleApplicationAction(app.id, 'COMPLETED')}>🏆 Mark Complete</button>
                        )}
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => startChat(app.applicantId)}>💬</button>
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/profile/${app.applicantId}`)}>👤</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Job Info Sidebar ── */}
          <aside>
            <div className="card" style={{ marginBottom:16 }}>
              <div className="card-body">
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>📋 Job Details</h3>
                {[
                  { icon:'💰', label:'Budget',   val: job.type === 'UNPAID' ? 'Free / Volunteer' : job.budget ? `₹${Number(job.budget).toLocaleString()}` : 'Open' },
                  { icon:'📌', label:'Type',     val: job.type },
                  { icon:'📅', label:'Deadline', val: job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'No deadline' },
                  { icon:'⏳', label:'Time Left', val: daysLeft(job.deadline) || '—' },
                  { icon:'🌐', label:'Remote',   val: job.remote ? 'Yes' : 'On-site' },
                  { icon:'🏛', label:'College',  val: job.collegeName || 'Any' },
                  { icon:'👥', label:'Applicants',val: `${job.applicantCount || 0} applied` },
                  { icon:'📆', label:'Posted',   val: new Date(job.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) },
                ].map(row => (
                  <div key={row.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:14 }}>
                    <span style={{ color:'var(--text-muted)' }}>{row.icon} {row.label}</span>
                    <span style={{ fontWeight:600, textAlign:'right' }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {isPoster && (
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>⚙ Manage Job</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {job.status === 'OPEN' && (
                      <button className="btn btn-danger btn-sm btn-block"
                        onClick={() => handleApplicationAction(null, 'CANCELLED')}>
                        Cancel Job
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
