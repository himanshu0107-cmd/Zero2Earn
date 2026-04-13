import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { taskAPI, userTaskAPI } from '../services/api';
import { Zap, Clock, Award } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const response = await taskAPI.getTaskById(id);
      if (response.data.success) {
        setTask(response.data.data);
      }
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await userTaskAPI.completeTask(user.id, task.id);
      if (response.data.success) {
        alert(`Task completed! +${task.rewardCoins} coins earned!`);
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error completing task');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading" style={{ paddingTop: '200px' }}>Loading task details...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div>
        <Navbar />
        <div className="error-message" style={{ margin: '40px 24px' }}>Task not found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="task-details-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <button 
          onClick={() => navigate('/services')}
          className="btn btn-secondary"
          style={{ marginBottom: '24px' }}
        >
          ← Back to Tasks
        </button>

        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>{task.title}</h1>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#64748b' }}>
                  <Award size={16} /> Type: {task.taskType}
                </span>
                <span style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#64748b' }}>
                  <Clock size={16} /> Status: {task.status}
                </span>
              </div>
            </div>
            <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '12px', color: '#b45309', fontWeight: '600' }}>REWARD</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '24px', fontWeight: '800', color: '#d97706' }}>
                <Zap size={24} />
                {task.rewardCoins}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>Task Description</h3>
            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '16px' }}>
              {task.description}
            </p>
          </div>

          {user && (
            <button 
              onClick={handleCompleteTask}
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
            >
              <Zap size={20} /> Complete Task & Earn {task.rewardCoins} Coins
            </button>
          )}
          
          {!user && (
            <>
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>
                Sign in to complete this task and earn coins
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-large"
                style={{ width: '100%' }}
              >
                Sign In to Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
