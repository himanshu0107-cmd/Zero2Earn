import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    console.log('Logging in with:', { email, password, role });
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f7f7', display: 'flex', flexDirection: 'column' }}>
      <Navbar isLoggedIn={false} />
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '40px 20px' }}>
        <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>
            {isLogin ? 'Sign in to Zero2Earn' : 'Join Zero2Earn Campus'}
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
            {isLogin ? 'Welcome back, student!' : 'Start your campus freelance journey.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e4e5e7', borderRadius: '4px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>I want to...</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ flex: 1, padding: '16px', border: `2px solid ${role === 'buyer' ? 'var(--primary)' : '#e4e5e7'}`, borderRadius: '4px', cursor: 'pointer', textAlign: 'center', fontWeight: '600' }}>
                      <input type="radio" name="role" value="buyer" checked={role === 'buyer'} onChange={() => setRole('buyer')} style={{ display: 'none' }} />
                      Hire Services
                    </label>
                    <label style={{ flex: 1, padding: '16px', border: `2px solid ${role === 'seller' ? 'var(--primary)' : '#e4e5e7'}`, borderRadius: '4px', cursor: 'pointer', textAlign: 'center', fontWeight: '600' }}>
                      <input type="radio" name="role" value="seller" checked={role === 'seller'} onChange={() => setRole('seller')} style={{ display: 'none' }} />
                      Offer Services
                    </label>
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>College Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                style={{ width: '100%', padding: '12px', border: '1px solid #e4e5e7', borderRadius: '4px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #e4e5e7', borderRadius: '4px' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}>
              {isLogin ? 'Sign In' : 'Join Now'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
            >
              {isLogin ? 'Join Now' : 'Sign In'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
