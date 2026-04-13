import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const FEATURES = [
  { emoji:'💼', title:'Find Freelance Tasks',   desc:'Browse hundreds of paid and unpaid tasks posted by students, teachers, and colleges. Filter by skills, budget, or type.' },
  { emoji:'🎯', title:'Smart Job Matching',     desc:'Our algorithm matches jobs to your skill profile so the best opportunities appear at the top of your feed automatically.' },
  { emoji:'💬', title:'Real-Time Chat',         desc:'Discuss task details, negotiate, and collaborate with job posters through built-in WebSocket-powered instant messaging.' },
  { emoji:'📚', title:'Course Marketplace',     desc:'Learn in-demand skills with affordable courses taught by verified instructors — get certified and boost your profile.' },
  { emoji:'⭐', title:'Rating & Trust System',  desc:'Build credibility with verified reviews after every completed task. High ratings unlock premium opportunities.' },
  { emoji:'⚡', title:'XP & Gamification',      desc:'Earn XP for every action. Level up from Bronze to Platinum. Compete on the leaderboard with your college peers.' },
];

const STEPS = [
  { n:'01', title:'Create Your Profile',     desc:'Sign up, pick your role, add your skills, and set your college.' },
  { n:'02', title:'Browse & Apply to Jobs',  desc:'Explore the job feed. Apply with a cover letter and your quote.' },
  { n:'03', title:'Complete & Get Paid',     desc:'Deliver the work. Get accepted, earn money, collect XP and reviews.' },
];

const STATS = [
  { val:'2,400+', lbl:'Active Students' },
  { val:'800+',   lbl:'Tasks Posted'    },
  { val:'₹12L+',  lbl:'Earnings Paid'   },
  { val:'50+',    lbl:'Colleges'        },
];

export default function Home() {
  const { user }  = useContext(AuthContext);
  const navigate  = useNavigate();

  return (
    <div className="page">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span>⚡</span> India's #1 Campus Freelancing Platform
          </div>
          <h1 className="hero-title">
            Turn Your Skills Into
            <br />
            <span className="gradient-text">Real Earnings</span>
          </h1>
          <p className="hero-sub">
            Zero2Earn connects college students with freelance opportunities posted by
            teachers, peers &amp; colleges. Apply, complete tasks, get paid — all in one place.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard →
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate('/jobs')}>
                  Browse Jobs
                </button>
              </>
            ) : (
              <>
                <Link to="/login?tab=register" className="btn btn-primary btn-lg">
                  Get Started Free →
                </Link>
                <Link to="/jobs" className="btn btn-secondary btn-lg">
                  Browse Jobs
                </Link>
              </>
            )}
          </div>

          {/* Platform Stats */}
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.lbl}>
                <div className="hero-stat-val">{s.val}</div>
                <div className="hero-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section style={{ padding:'80px 24px', background:'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:32, fontWeight:800, marginBottom:10 }}>
              How It Works
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:16 }}>
              Start earning in three simple steps
            </p>
          </div>
          <div className="grid-3">
            {STEPS.map((step, i) => (
              <div key={i} style={{
                background:'var(--bg-card)', border:'1px solid var(--border)',
                borderRadius:16, padding:'32px 24px', position:'relative', overflow:'hidden',
              }}>
                {/* Step number watermark */}
                <div style={{
                  position:'absolute', top:-10, right:12,
                  fontSize:80, fontWeight:900, color:'var(--bg-elevated)',
                  lineHeight:1, userSelect:'none',
                }}>
                  {step.n}
                </div>
                <div style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:44, height:44, borderRadius:12,
                  background:'rgba(108,99,255,0.15)', marginBottom:16,
                  fontWeight:800, color:'var(--primary-light)', fontSize:16,
                }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, marginBottom:10 }}>{step.title}</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.7, margin:0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section style={{ padding:'80px 24px' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:32, fontWeight:800, marginBottom:10 }}>
              Everything You Need to <span className="gradient-text">Thrive</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:16 }}>
              A complete campus freelancing ecosystem built for Indian college students
            </p>
          </div>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background:'var(--bg-card)', border:'1px solid var(--border)',
                borderRadius:16, padding:'28px 24px', transition:'all 0.25s',
                cursor:'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{f.emoji}</div>
                <h3 style={{ fontSize:17, fontWeight:700, marginBottom:10 }}>{f.title}</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.7, margin:0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES SECTION ─────────────────────────────────────── */}
      <section style={{ padding:'60px 24px', background:'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>Built For Every Campus Role</h2>
          </div>
          <div className="grid-3">
            {[
              { emoji:'🎓', role:'Students',   perks:['Apply to paid & unpaid tasks','Build a verified portfolio','Earn XP and level up','Learn through the course marketplace'] },
              { emoji:'📚', role:'Teachers',   perks:['Post internal academic tasks','Find skilled student help','Create and sell courses','Verify student profiles'] },
              { emoji:'🏛', role:'Colleges',   perks:['Post internships & projects','Discover top student talent','Build campus communities','Official verified college badge'] },
            ].map(r => (
              <div key={r.role} style={{
                background:'var(--bg-card)', border:'1px solid var(--border)',
                borderRadius:16, padding:'28px 24px',
              }}>
                <div style={{ fontSize:40, marginBottom:12 }}>{r.emoji}</div>
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>{r.role}</h3>
                {r.perks.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:14, color:'var(--text-secondary)' }}>
                    <span style={{ color:'var(--success)', flexShrink:0 }}>✓</span> {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding:'80px 24px' }}>
        <div className="container">
          <div style={{
            background:'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,200,150,0.1))',
            border:'1px solid var(--border-strong)',
            borderRadius:24, padding:'60px 40px', textAlign:'center',
          }}>
            <h2 style={{ fontSize:36, fontWeight:900, marginBottom:12 }}>
              Ready to Start Earning?
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:17, marginBottom:32 }}>
              Join thousands of students already building their careers on Zero2Earn.
              It's free to sign up.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              {user ? (
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                  Open Dashboard →
                </button>
              ) : (
                <>
                  <Link to="/login?tab=register" className="btn btn-primary btn-lg">
                    Create Free Account →
                  </Link>
                  <Link to="/jobs" className="btn btn-secondary btn-lg">
                    Browse Jobs First
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{
        background:'var(--bg-surface)', borderTop:'1px solid var(--border)',
        padding:'40px 24px', color:'var(--text-secondary)', fontSize:14,
      }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>
              ⚡ <span className="gradient-text">Zero2Earn</span>
            </div>
            <div>Campus Freelancing for India's Students</div>
          </div>
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            <Link to="/jobs" style={{ color:'var(--text-secondary)' }}>Jobs</Link>
            <Link to="/courses" style={{ color:'var(--text-secondary)' }}>Courses</Link>
            <Link to="/leaderboard" style={{ color:'var(--text-secondary)' }}>Leaderboard</Link>
            <Link to="/login" style={{ color:'var(--text-secondary)' }}>Sign In</Link>
          </div>
          <div style={{ color:'var(--text-muted)' }}>© 2026 Zero2Earn. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
