import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await userAPI.getNotifications(user.id);
      if (res.data.success) {
        setNotifications(res.data.data.notifications || []);
        setUnread(res.data.data.unreadCount || 0);
      }
    } catch {}
  };

  const handleNotifClick = async () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unread > 0) {
      try {
        await userAPI.markNotificationsRead(user.id);
        setUnread(0);
      } catch {}
    }
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { label: 'Jobs',       path: '/jobs'       },
    { label: 'Courses',    path: '/courses'    },
    { label: 'Leaderboard',path: '/leaderboard'},
  ];

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-emoji">⚡</span>
          Zero2Earn
        </Link>

        {/* Nav Links */}
        <div className="navbar-nav">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
              {item.label}
            </Link>
          ))}
          {user && (
            <Link to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              {/* Post Job button */}
              {(user.role === 'TEACHER' || user.role === 'STUDENT') && (
                <button className="btn btn-primary btn-sm"
                  onClick={() => navigate('/post-job')}>
                  + Post Job
                </button>
              )}

              {/* Notifications */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button className="notif-btn" onClick={handleNotifClick} title="Notifications">
                  🔔
                  {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
                </button>

                {showNotifs && (
                  <div className="notif-drawer">
                    <div className="notif-drawer-header">
                      <span style={{ fontWeight: 700 }}>Notifications</span>
                      {unread > 0 && <span className="badge badge-primary">{unread} new</span>}
                    </div>
                    <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                          No notifications yet
                        </div>
                      ) : notifications.map((n, i) => (
                        <div key={i} className={`notif-item ${!n.read_flag ? 'unread' : ''}`}>
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-msg">{n.message}</div>
                          <div className="notif-time">
                            {new Date(n.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat */}
              <button className="notif-btn" onClick={() => navigate('/chat')} title="Messages">
                💬
              </button>

              {/* User avatar */}
              <div className="user-avatar-btn" onClick={() => navigate(`/profile/${user.id}`)}>
                <div className="avatar">
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt={user.name} />
                    : getInitials(user.name)
                  }
                </div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
              </div>

              <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/login?tab=register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
