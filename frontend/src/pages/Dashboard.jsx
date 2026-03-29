import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Home, List, DollarSign, Settings, ShoppingCart, User, MessageCircle, Zap } from 'lucide-react';

const Dashboard = () => {
  const [role, setRole] = useState('seller'); // default for demo purposes
  const navigate = useNavigate();

  return (
    <div>
      <Navbar isLoggedIn={true} userRole={role} />
      
      <div className="dashboard-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="#" className="active"><Home size={20} /> Dashboard Overview</a></li>
            {role === 'seller' && (
              <>
                <li><a href="#"><List size={20} /> My Services (Gigs)</a></li>
                <li><a href="#"><ShoppingCart size={20} /> Orders Recieved</a></li>
                <li><a href="#"><DollarSign size={20} /> Earnings & Wallet</a></li>
              </>
            )}
            {role === 'buyer' && (
              <>
                <li><a href="#"><ShoppingCart size={20} /> My Orders</a></li>
                <li><a href="#"><DollarSign size={20} /> Wallet Balance</a></li>
                <li><a href="#"><MessageCircle size={20} /> AI Search Assistant</a></li>
              </>
            )}
            {role === 'admin' && (
              <>
                <li><a href="#"><List size={20} /> Manage Services</a></li>
                <li><a href="#"><User size={20} /> Manage Users</a></li>
                <li><a href="#"><DollarSign size={20} /> Transactions</a></li>
              </>
            )}
            <li><a href="#"><Settings size={20} /> Settings</a></li>
          </ul>

          <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', marginTop: '24px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Demo View As:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setRole('buyer')}
                style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px', background: role === 'buyer' ? 'var(--primary)' : 'white', color: role === 'buyer' ? 'white' : 'inherit' }}>
                Buyer
              </button>
              <button 
                onClick={() => setRole('seller')}
                style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px', background: role === 'seller' ? 'var(--primary)' : 'white', color: role === 'seller' ? 'white' : 'inherit' }}>
                Seller
              </button>
              <button 
                onClick={() => setRole('admin')}
                style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px', background: role === 'admin' ? 'var(--primary)' : 'white', color: role === 'admin' ? 'white' : 'inherit' }}>
                Admin
              </button>
            </div>
          </div>
        </aside>

        <main className="dashboard-content">
          <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Welcome back, Student!</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="card" style={{ marginBottom: '0' }}>
              <h3 className="card-title" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>{role === 'seller' ? 'Earnings this month' : 'Wallet Balance'}</h3>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>Rs 4,500</div>
              {role === 'seller' && <p style={{ color: 'var(--primary)', fontSize: '14px', marginTop: '8px' }}>+12% from last month</p>}
            </div>
            <div className="card" style={{ marginBottom: '0' }}>
              <h3 className="card-title" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>{role === 'admin' ? 'Total Users' : 'Active Orders'}</h3>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{role === 'admin' ? '1,204' : '3'}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>{role === 'admin' ? '+24 new today' : '2 pending your review'}</p>
            </div>
            {role === 'seller' && (
              <div className="card" style={{ marginBottom: '0' }}>
                <h3 className="card-title" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Response Rate</h3>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>100%</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Usually responds in 1 hour</p>
              </div>
            )}
            {role === 'buyer' && (
              <div className="card" style={{ marginBottom: '0' }}>
                <h3 className="card-title" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Services Saved</h3>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>12</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>View your wishlist</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Recent Activity</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e4e5e7' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Service</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>{role === 'seller' ? 'Buyer' : 'Seller'}</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Amount</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { service: 'React Frontend Fix', user: 'johndoe', date: 'Oct 24, 2023', amount: 'Rs 1500', status: 'Completed' },
                    { service: 'Logo Design for Club', user: 'design_soc', date: 'Oct 22, 2023', amount: 'Rs 800', status: 'In Progress' },
                    { service: 'Math Assignment Help', user: 'freshman01', date: 'Oct 20, 2023', amount: 'Rs 300', status: 'Pending' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e4e5e7' }}>
                      <td style={{ padding: '16px' }}>{row.service}</td>
                      <td style={{ padding: '16px' }}>@{row.user}</td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{row.date}</td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>{row.amount}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          backgroundColor: row.status === 'Completed' ? '#e2f5ec' : row.status === 'In Progress' ? '#fff6ed' : '#f0f0f0',
                          color: row.status === 'Completed' ? '#19a463' : row.status === 'In Progress' ? '#ff9b33' : '#62646a'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {role === 'seller' && (
            <div className="card" style={{ background: 'linear-gradient(135deg, #1DBf73 0%, #023a15 100%)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="card-title" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={20} /> AI Skill Analyzer 
                  </h2>
                  <p style={{ opacity: 0.9, maxWidth: '600px', marginBottom: '16px' }}>
                    Based on recent campus searches, "Tailwind CSS" and "Figma UI/UX" are highly requested. 
                    Consider adding these to your services to increase your earnings by an estimated Rs 2,000/month!
                  </p>
                  <button style={{ backgroundColor: 'white', color: '#1DBf73', padding: '8px 16px', borderRadius: '4px', fontWeight: '600' }}>Update Profile</button>
                </div>
              </div>
            </div>
          )}

          {role === 'buyer' && (
            <div className="card" style={{ border: '1px solid #1DBf73', background: 'rgba(29, 191, 115, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="card-title" style={{ color: '#1DBf73', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageCircle size={20} /> AI Smart Search
                  </h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Not sure what you need? Describe your problem and our AI will match you with the perfect seller and suggest a fair price.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="text" placeholder="e.g. I need someone to fix a bug in my python code..." style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <button className="btn btn-primary">Ask AI</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
