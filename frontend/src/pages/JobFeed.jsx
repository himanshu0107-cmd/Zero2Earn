import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import { jobAPI, skillAPI } from '../services/api';

const TYPES   = ['All', 'PAID', 'UNPAID', 'INTERNSHIP'];
const SORT    = ['Latest', 'Budget (High)', 'Budget (Low)'];

export default function JobFeed() {
  const [jobs, setJobs]       = useState([]);
  const [skills, setSkills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ type: 'All', skill: '', minBudget: '', maxBudget: '', remote: false });
  const [page, setPage]       = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    setPage(0);
    fetchJobs(0, true);
  }, [filters, debouncedSearch]);

  const fetchSkills = async () => {
    try {
      const res = await skillAPI.getAll();
      if (res.data.success) setSkills(res.data.data);
    } catch {}
  };

  const fetchJobs = useCallback(async (pg = 0, reset = false) => {
    setLoading(true);
    try {
      let res;
      if (debouncedSearch.trim()) {
        res = await jobAPI.search(debouncedSearch);
      } else {
        const params = {
          page: pg, size: PAGE_SIZE,
          type: filters.type !== 'All' ? filters.type : undefined,
        };
        res = await jobAPI.getJobs(params);
      }
      if (res.data.success) {
        const newJobs = res.data.data || [];
        setJobs(prev => reset ? newJobs : [...prev, ...newJobs]);
        setHasMore(newJobs.length === PAGE_SIZE);
      }
    } catch {}
    finally { setLoading(false); }
  }, [filters, debouncedSearch]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchJobs(next, false);
  };

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
  };

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight:800, marginBottom: 6 }}>🔍 Browse Jobs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find freelance tasks that match your skills</p>
        </div>

        <div className="jobs-layout">
          {/* ── Filter Panel ── */}
          <aside className="filter-panel">
            <div className="filter-title">🎛 Filters</div>

            <div className="filter-section">
              <div className="filter-label">Job Type</div>
              <div className="filter-options">
                {TYPES.map(t => (
                  <label key={t} className="filter-option">
                    <input type="radio" name="type" checked={filters.type === t}
                      onChange={() => setFilter('type', t)} />
                    <div className={`filter-check`}>
                      {filters.type === t && '✓'}
                    </div>
                    {t === 'All' ? 'All Types' : t}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-label">Remote Only</div>
              <label className="filter-option">
                <input type="checkbox" checked={filters.remote}
                  onChange={e => setFilter('remote', e.target.checked)} />
                <div className={`filter-check`}>
                  {filters.remote && '✓'}
                </div>
                Remote Jobs
              </label>
            </div>

            <div className="filter-section">
              <div className="filter-label">Budget Range (₹)</div>
              <input
                className="form-input"
                type="number" placeholder="Min budget"
                value={filters.minBudget}
                onChange={e => setFilter('minBudget', e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <input
                className="form-input"
                type="number" placeholder="Max budget"
                value={filters.maxBudget}
                onChange={e => setFilter('maxBudget', e.target.value)}
              />
            </div>

            <div className="filter-section">
              <div className="filter-label">Required Skill</div>
              <select className="form-select"
                value={filters.skill}
                onChange={e => setFilter('skill', e.target.value)}>
                <option value="">Any Skill</option>
                {skills.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-ghost btn-block btn-sm"
              onClick={() => setFilters({ type:'All', skill:'', minBudget:'', maxBudget:'', remote:false })}>
              Clear Filters
            </button>
          </aside>

          {/* ── Job List ── */}
          <div>
            {/* Search + count */}
            <div className="jobs-header">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search jobs by title, skill, keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:18 }}
                    onClick={() => setSearch('')}>✕</button>
                )}
              </div>
              <div style={{ fontSize: 14, color:'var(--text-secondary)', flexShrink: 0 }}>
                {loading ? '…' : `${jobs.length} jobs found`}
              </div>
            </div>

            {loading && jobs.length === 0 ? (
              <div className="loading-screen" style={{ height: 300 }}>
                <div className="spinner" /><p>Loading jobs…</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                <div className="jobs-grid">
                  {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>

                {hasMore && (
                  <div style={{ textAlign:'center', marginTop: 28 }}>
                    <button className="btn btn-secondary" onClick={loadMore} disabled={loading}>
                      {loading ? <><span className="spinner spinner-sm"/> Loading…</> : 'Load More Jobs'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
