import React from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Format helpers ───────────────────────────────────────────
const fmtBudget = (type, budget, currency) => {
  if (type === 'UNPAID') return 'Free';
  if (!budget) return type === 'INTERNSHIP' ? 'Internship' : 'Free';
  return `${currency || '₹'}${Number(budget).toLocaleString()}`;
};

const daysLeft = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  return diff < 0 ? 'Expired' : `${diff}d left`;
};

const typeColor = { PAID: 'badge-success', UNPAID: 'badge-secondary', INTERNSHIP: 'badge-warning' };
const statusColor = { OPEN: 'badge-success', IN_PROGRESS: 'badge-warning', COMPLETED: 'badge-secondary', CANCELLED: 'badge-danger' };

const JobCard = ({ job, showStatus = false }) => {
  const navigate = useNavigate();
  const deadline = daysLeft(job.deadline);
  const budget = fmtBudget(job.type, job.budget, job.currency);

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job.id}`)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/jobs/${job.id}`)}>

      <div className="job-card-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <div className="poster-info" style={{ marginTop: 4 }}>
            <div className="avatar" style={{ width: 22, height: 22, fontSize: 10 }}>
              {job.posterName ? job.posterName[0] : '?'}
            </div>
            <span className="poster-name">{job.posterName || 'Anonymous'}</span>
            <span className="badge badge-secondary" style={{ fontSize: 10, padding: '2px 6px' }}>
              {job.posterRole}
            </span>
          </div>
        </div>
        <div className="job-budget">{budget}</div>
      </div>

      <p className="job-description">{job.description}</p>

      {job.skills?.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 4).map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {job.skills.length > 4 && (
            <span className="skill-tag" style={{ opacity: 0.6 }}>+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="job-footer">
        <div className="job-meta">
          <span className={`badge ${typeColor[job.type] || 'badge-secondary'}`}>
            {job.type}
          </span>
          {showStatus && (
            <span className={`badge ${statusColor[job.status] || 'badge-secondary'}`}>
              {job.status?.replace('_', ' ')}
            </span>
          )}
          {job.collegeName && (
            <span className="job-meta-item">🏛 {job.collegeName}</span>
          )}
          {deadline && (
            <span className="job-meta-item" style={{ color: deadline === 'Expired' ? 'var(--danger)' : '' }}>
              🕒 {deadline}
            </span>
          )}
          {job.remote && <span className="job-meta-item">🌐 Remote</span>}
        </div>
        <span className="job-meta-item">
          👥 {job.applicantCount || 0} applied
        </span>
      </div>
    </div>
  );
};

export default JobCard;
