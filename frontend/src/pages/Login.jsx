import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ROLES = [
  { value: 'STUDENT', label: 'Student', emoji: '🎓' },
  { value: 'TEACHER', label: 'Teacher', emoji: '📚' },
  { value: 'ADMIN',   label: 'Admin',   emoji: '🛡' },
];

const Login = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab]   = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name:'', username:'', email:'', password:'', confirmPassword:'', role:'STUDENT', collegeId:'' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'register' && form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    setLoading(true);
    try {
      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, username: form.username, email: form.email,
            password: form.password, role: form.role,
            collegeId: form.collegeId ? parseInt(form.collegeId) : null };

      const res = tab === 'login' ? await authAPI.login(payload) : await authAPI.register(payload);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        navigate('/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">⚡ Zero2Earn</div>
          <h1 className="auth-title">
            {tab === 'login' ? 'Welcome back!' : 'Create account'}
          </h1>
          <p className="auth-subtitle">
            {tab === 'login'
              ? 'Sign in to access your dashboard'
              : 'Join thousands of students earning through skills'}
          </p>

          {/* Tab Switcher */}
          <div className="tabs" style={{ marginBottom: 24, justifyContent: 'center' }}>
            <button className={`tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); }}>
              Sign In
            </button>
            <button className={`tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError(''); }}>
              Register
            </button>
          </div>

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <>
                {/* Role Selection */}
                <div className="form-group">
                  <label className="form-label">I am a</label>
                  <div className="role-selector">
                    {ROLES.map(r => (
                      <div key={r.value}
                        className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, role: r.value }))}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{r.emoji}</div>
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="Your full name"
                    value={form.name} onChange={set('name')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input className="form-input" type="text" placeholder="username (no spaces)"
                    value={form.username} onChange={set('username')} required />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@college.edu"
                value={form.email} onChange={set('email')} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')} required minLength={6} />
            </div>

            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg"
              disabled={loading}>
              {loading ? (
                <><span className="spinner spinner-sm" /> Processing...</>
              ) : (
                tab === 'login' ? 'Sign In →' : 'Create Account →'
              )}
            </button>
          </form>

          <div className="auth-footer">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button className="link-btn"
              onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}>
              {tab === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </div>

          {tab === 'login' && (
            <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-surface)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Demo accounts:</strong><br/>
              admin@zero2earn.in / Test@1234 &nbsp;|&nbsp; rahul@mitpune.edu / Test@1234
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
