import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request interceptor: attach JWT ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor: handle 401 only for expired tokens ─
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const token = localStorage.getItem('authToken');
      // Only force-logout if user HAD a token (expired/invalid)
      // Don't redirect on initial validate calls when no token exists
      if (token && !err.config?.url?.includes('/auth/validate')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  validate: ()     => api.get('/auth/validate'),
};

// ─── USERS ───────────────────────────────────────────────────
export const userAPI = {
  getProfile:          (id)         => api.get(`/users/${id}/profile`),
  updateProfile:       (id, data)   => api.put(`/users/${id}/profile`, data),
  addSkill:            (id, data)   => api.post(`/users/${id}/skills`, data),
  removeSkill:         (id, skillId)=> api.delete(`/users/${id}/skills/${skillId}`),
  getLeaderboard:      (limit = 10) => api.get(`/users/leaderboard?limit=${limit}`),
  getNotifications:    (id)         => api.get(`/users/${id}/notifications`),
  markNotificationsRead:(id)        => api.put(`/users/${id}/notifications/read`),
};

// ─── SKILLS ──────────────────────────────────────────────────
export const skillAPI = {
  getAll:       () => api.get('/skills'),
  getCategories:() => api.get('/skills/categories'),
};

// ─── JOBS ────────────────────────────────────────────────────
export const jobAPI = {
  getJobs:       (params) => api.get('/jobs', { params }),
  getRecommended:(params) => api.get('/jobs/recommended', { params }),
  getById:       (id)     => api.get(`/jobs/${id}`),
  search:        (q)      => api.get(`/jobs/search?q=${q}`),
  getMyJobs:     ()       => api.get('/jobs/my'),
  create:        (data)   => api.post('/jobs', data),
  updateStatus:  (id, status) => api.patch(`/jobs/${id}/status`, { status }),
};

// ─── APPLICATIONS ────────────────────────────────────────────
export const applicationAPI = {
  apply:              (data)        => api.post('/applications', data),
  getForJob:          (jobId)       => api.get(`/applications/job/${jobId}`),
  getMyApplications:  ()            => api.get('/applications/my'),
  updateStatus:       (id, status)  => api.patch(`/applications/${id}/status`, { status }),
};

// ─── REVIEWS ─────────────────────────────────────────────────
export const reviewAPI = {
  submit:     (data)   => api.post('/reviews', data),
  getForUser: (userId) => api.get(`/reviews/user/${userId}`),
};

// ─── CHAT ────────────────────────────────────────────────────
export const chatAPI = {
  getOrCreateConversation: (data)   => api.post('/chat/conversation', data),
  getConversations:        ()       => api.get('/chat/conversations'),
  getMessages:             (convId, page = 0) =>
    api.get(`/chat/conversation/${convId}/messages?page=${page}`),
  sendMessage: (convId, data) =>
    api.post(`/chat/conversation/${convId}/messages`, data),
};

// ─── COURSES ─────────────────────────────────────────────────
export const courseAPI = {
  getCourses:    (params) => api.get('/courses', { params }),
  getById:       (id)     => api.get(`/courses/${id}`),
  create:        (data)   => api.post('/courses', data),
  enroll:        (id)     => api.post(`/courses/${id}/enroll`),
  updateProgress:(id, progress) => api.patch(`/courses/${id}/progress`, { progress }),
  getMyCourses:  ()       => api.get('/courses/my-courses'),
};

// ─── ADMIN ───────────────────────────────────────────────────
export const adminAPI = {
  getStats:       () => api.get('/admin/stats'),
  getUsers:       (page = 0) => api.get(`/admin/users?page=${page}`),
  toggleUserActive:(id) => api.patch(`/admin/users/${id}/toggle-active`),
};

export default api;
