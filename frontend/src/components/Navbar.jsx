import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Briefcase, PlusCircle, Bell, MessageSquare } from 'lucide-react';

const Navbar = ({ isLoggedIn, userRole }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Zero2Earn<span>.</span>
        </Link>

        {isLoggedIn && (
          <div className="search-bar" style={{ maxWidth: '400px', margin: '0 24px', border: '1px solid #e4e5e7', flex: 1 }}>
            <input type="text" placeholder="Find services (e.g., 'React tutor', 'Logo design')" style={{ padding: '10px 16px' }} />
            <button style={{ padding: '0 16px', backgroundColor: '#222325' }}>
              <Search size={18} />
            </button>
          </div>
        )}

        <div className="navbar-links">
          {!isLoggedIn ? (
            <>
              <Link to="/services" className="nav-link">Explore</Link>
              <Link to="/services?category=coding" className="nav-link">Coding Help</Link>
              <Link to="/services?category=design" className="nav-link">Design</Link>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/login" className="btn btn-primary">Join</Link>
            </>
          ) : (
            <>
              <Link to="/services" className="nav-link" title="Explore"><Briefcase size={20} /></Link>
              <Link to="/messages" className="nav-link" title="Messages"><MessageSquare size={20} /></Link>
              <Link to="/notifications" className="nav-link" title="Notifications"><Bell size={20} /></Link>
              {userRole === 'seller' && (
                <Link to="/dashboard/add-service" className="nav-link" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PlusCircle size={18} /> Post Service
                </Link>
              )}
              <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  U
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
