import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { jobAPI, skillAPI } from '../services/api';
import { useEffect } from 'react';

const COLLEGES = [
  { id:1, name:'MIT Pune' }, { id:2, name:'IIT Bombay' },
  { id:3, name:'VIT Vellore' }, { id:4, name:'BITS Pilani' }, { id:5, name:'NIT Trichy' },
];

export default function PostJob() {
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);

  const [form, setForm] = useState({
    title:'', description:'', type:'PAID', budget:'',
    currency:'INR', deadline:'', remote:true, skills:[],
  });
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const res = await skillAPI.getAll();
      if (res.data.success) setAllSkills(res.data.data || []);
    } catch {}
  };

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const addSkill = () => {
    if (!selectedSkill || form.skills.includes(selectedSkill)) return;
    setForm(f => ({ ...f, skills: [...f.skills, selectedSkill] }));
    setSelectedSkill('');
  };

  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())       { setError('Title is required'); return; }
    if (!form.description.trim()) { setError('Description is required'); return; }
    if (form.type === 'PAID' && !form.budget) { setError('Budget is required for paid jobs'); return; }

    setLoading(true); setError('');
    try {
      const payload = {
        ...form,
        budget: form.budget ? parseFloat(form.budget) : null,
        deadline: form.deadline || null,
      };
      const res = await jobAPI.create(payload);
      if (res.data.success) {
        navigate(`/jobs/${res.data.data.id}`);
      } else setError(res.data.message);
    } catch (err) { setError(err.response?.data?.message || 'Failed to post job.'); }
    finally { setLoading(false); }
  };

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="page">
      <Navbar/>
      <div className="page-content" style={{ maxWidth:760 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom:20 }}>
          ← Back
        </button>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>📤 Post a New Job</h1>
          <p style={{ color:'var(--text-secondary)' }}>
            Find talented students for your tasks. Be clear and detailed for the best applicants.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" type="text" required
                  placeholder="e.g. Build a Portfolio Website in React"
                  value={form.title} onChange={set('title')} maxLength={300}/>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea className="form-textarea" required rows={6}
                  placeholder="Describe the task clearly: what needs to be done, expected output, any specific requirements..."
                  value={form.description} onChange={set('description')}/>
              </div>

              {/* Type + Budget + Currency */}
              <div className="form-row" style={{ gridTemplateColumns:'1fr 1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select className="form-select" value={form.type} onChange={set('type')}>
                    <option value="PAID">💰 Paid</option>
                    <option value="UNPAID">🤝 Volunteer / Unpaid</option>
                    <option value="INTERNSHIP">🏢 Internship</option>
                  </select>
                </div>

                {form.type === 'PAID' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Budget *</label>
                      <input className="form-input" type="number" min="1" step="1"
                        placeholder="e.g. 2500"
                        value={form.budget} onChange={set('budget')}/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Currency</label>
                      <select className="form-select" value={form.currency} onChange={set('currency')}>
                        <option value="INR">₹ INR</option>
                        <option value="USD">$ USD</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Deadline + Remote */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Deadline (optional)</label>
                  <input className="form-input" type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.deadline} onChange={set('deadline')}/>
                </div>
                <div className="form-group" style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'11px 0' }}>
                    <input type="checkbox" checked={form.remote} onChange={set('remote')}
                      style={{ width:18, height:18, accentColor:'var(--primary)' }}/>
                    <span className="form-label" style={{ margin:0 }}>🌐 Remote / Online</span>
                  </label>
                </div>
              </div>

              {/* Skills Required */}
              <div className="form-group">
                <label className="form-label">Skills Required</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:10 }}>
                  {form.skills.map(s => (
                    <span key={s} className="skill-tag removable" onClick={() => removeSkill(s)}>
                      {s} <span className="remove-x">×</span>
                    </span>
                  ))}
                  {form.skills.length === 0 && (
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>No skills added yet</span>
                  )}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <select className="form-select"
                    value={selectedSkill}
                    onChange={e => setSelectedSkill(e.target.value)}>
                    <option value="">Select a skill…</option>
                    {allSkills
                      .filter(s => !form.skills.includes(s.name))
                      .map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                    }
                  </select>
                  <button type="button" className="btn btn-secondary" onClick={addSkill}>
                    + Add
                  </button>
                </div>
              </div>

              {/* Preview Card */}
              {form.title && (
                <div style={{ marginBottom:20, padding:16, background:'var(--bg-elevated)', borderRadius:10, border:'1px dashed var(--border)' }}>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8, fontWeight:600 }}>PREVIEW</div>
                  <div style={{ fontWeight:700 }}>{form.title}</div>
                  {form.type === 'PAID' && form.budget && (
                    <div style={{ color:'var(--secondary)', fontSize:14, marginTop:4 }}>₹{form.budget}</div>
                  )}
                  <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                    {form.skills.map(s => <span key={s} className="skill-tag" style={{ fontSize:11 }}>{s}</span>)}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                {loading ? <><span className="spinner spinner-sm"/>Posting…</> : '📤 Post Job'}
              </button>
            </form>
          </div>
        </div>

        {/* Tips */}
        <div className="card" style={{ marginTop:20 }}>
          <div className="card-body">
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>💡 Tips for a Great Job Post</h3>
            {[
              'Be specific about what you need — vague posts get fewer applicants',
              'Set a realistic budget based on the complexity of the task',
              'Add the exact skills required to attract the right candidates',
              'Set a clear deadline so applicants can plan accordingly',
            ].map((tip, i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13, color:'var(--text-secondary)' }}>
                <span style={{ color:'var(--success)' }}>✓</span> {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
