import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || 'Erro de conexão';
    toast.error(msg);
    return Promise.reject(new Error(msg));
  }
);

// ── Projects ──
export async function getProjects(page = 1, limit = 12) {
  return client.get('/projects', { params: { page, limit } });
}
export async function createProject(data) {
  return client.post('/projects', data);
}
export async function updateProject(id, data) {
  return client.put(`/projects/${id}`, data);
}
export async function deleteProject(id) {
  return client.delete(`/projects/${id}`);
}

// ── Videos ──
export async function getVideos(page = 1, limit = 12) {
  return client.get('/videos', { params: { page, limit } });
}
export async function generateVideo(data) {
  return client.post('/videos/generate', data);
}
export async function getVideoStatus(id) {
  return client.get(`/videos/${id}/status`);
}
export async function deleteVideo(id) {
  return client.delete(`/videos/${id}`);
}

// ── Settings ──
export async function getSettings() {
  return client.get('/settings');
}
export async function updateSettings(data) {
  return client.post('/settings', data);
}

// ── Antgravity ──
export async function optimizeCode(codigo) {
  return client.post('/antgravity/optimize', { codigo });
}
export async function analyzePerformance(codigo) {
  return client.post('/antgravity/analyze', { codigo });
}
export async function autoDeploy(projeto) {
  return client.post('/antgravity/deploy', projeto);
}

// ── Connection test ──
export async function testAPIConnection(keyName, keyValue) {
  return client.post('/settings/test-key', { keyName, keyValue });
}

export default client;
