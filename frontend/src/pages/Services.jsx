import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { taskAPI, userTaskAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Zap, Users, Award } from 'lucide-react';

const Services = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getAllActiveTasks();
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await userTaskAPI.completeTask(user.id, taskId);
      if (response.data.success) {
        alert(`Task completed! +${response.data.data.task.rewardCoins} coins earned!`);
        loadTasks();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      alert(error.response?.data?.message || 'Error completing task');
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.taskType === filter);

  const taskTypes = ['video', 'share', 'review', 'referral', 'survey', 'education', 'content'];

  return (
    <div className="services-page">
      <Navbar />

      <div className="services-container">
        <div className="services-header">
          <h1>Available Tasks & Opportunities</h1>
          <p>Complete tasks to earn coins, gain followers, and build your influence</p>
        </div>

        <div className="tasks-filter">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          {taskTypes.map(type => (
            <button 
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-reward">
                    <Zap size={20} />
                    <span className="reward-value">{task.rewardCoins}</span>
                  </div>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-meta">
                  <span className="task-type">{task.taskType}</span>
                  <span className="task-status">{task.status}</span>
                </div>

                {user ? (
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => handleCompleteTask(task.id)}
                  >
                    Complete Task <Zap size={16} />
                  </button>
                ) : (
                  <button 
                    className="btn btn-secondary btn-block"
                    onClick={() => navigate('/login')}
                  >
                    Sign in to complete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tasks available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
