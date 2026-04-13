import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home       from './pages/Home';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import JobFeed    from './pages/JobFeed';
import JobDetail  from './pages/JobDetail';
import PostJob    from './pages/PostJob';
import Profile    from './pages/Profile';
import Chat       from './pages/Chat';
import Courses    from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/jobs"     element={<JobFeed />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/courses"  element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute><PostJob /></ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/chat/:convId" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
