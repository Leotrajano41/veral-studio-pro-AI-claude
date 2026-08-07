import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para logs e tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ── Service 1: Project Service ──
export const projectService = {
  list: (params) => api.get('/projects', { params }),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  duplicate: (id) => api.post(`/projects/${id}/duplicate`),
};

// ── Service 2: Pipeline Service ──
export const pipelineService = {
  start: (data) => api.post('/pipeline/start', data),
  status: (projectId) => api.get(`/pipeline/${projectId}/status`),
  reset: (projectId) => api.post(`/pipeline/${projectId}/reset`),
  cancel: (jobId) => api.post(`/queue/${jobId}/cancel`),
};

// ── Service 3: Trends Service ──
export const trendsService = {
  search: (params) => api.get('/trends/youtube', { params }),
  hot: () => api.get('/trends/youtube', { params: { chart: 'mostPopular' } }),
};

// ── Service 4: News Service ──
export const newsService = {
  search: (params) => api.get('/trends/news', { params }),
  headlines: () => api.get('/trends/news', { params: { section: 'top' } }),
  getChannels: () => api.get('/news/channels'),
  createChannel: (data) => api.post('/news/channels', data),
  addToPauta: (channelId, item) => api.post(`/news/channels/${channelId}/pauta`, item),
};

// ── Service 5: Media Service ──
export const mediaService = {
  searchPixabay: (params) => api.get('/media/pixabay', { params }),
  searchPexels: (params) => api.get('/media/pexels', { params }),
  download: (items) => api.post('/media/download', { items }),
  getLibrary: () => api.get('/media/library'),
  deleteLibraryItem: (id) => api.delete(`/media/library/${id}`),
};

// ── Service 6: Config Service ──
export const configService = {
  get: () => api.get('/config'),
  update: (data) => api.patch('/config', data),
  listApiKeys: () => api.get('/apikeys'),
  saveApiKey: (data) => api.post('/apikeys', data),
  testApiKey: (service) => api.post(`/apikeys/${service}/test`),
  validateSerial: (serial) => api.post('/config/validate-serial', { serial }),
  exportBackup: () => api.get('/config/backup', { responseType: 'blob' }),
  importBackup: (formData) => api.post('/config/restore', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  clearCache: (options) => api.post('/config/cache/clear', options),
};

// ── Service 7: Voice Service ──
export const voiceService = {
  list: (params) => api.get('/voices', { params }),
  get: (id) => api.get(`/voices/${id}`),
  createCustom: (formData) => api.post('/voices/custom', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/voices/${id}`),
  loadEdgeVoices: () => api.get('/voices/edge-tts'),
  installXTTS: () => api.post('/voices/xtts/install'),
};

export default api;
