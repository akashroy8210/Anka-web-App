const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'http://localhost:5000/api'
    : `${window.location.origin}/api`;
};

const API_BASE = getApiBase();

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const adminToken = localStorage.getItem('adminToken');
  const customerToken = localStorage.getItem('customerToken');
  const token = adminToken || customerToken;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const aiApi = {
  generate: async (type, data) => {
    try {
      const res = await fetch(`${API_BASE}/ai/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type, data })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('AI API Generate Error:', err);
      return { success: false, message: err.message || 'Network error.' };
    }
  },

  status: async () => {
    try {
      const res = await fetch(`${API_BASE}/ai/status`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('AI API Status Error:', err);
      return { success: false, running: false, message: 'Local AI Offline' };
    }
  }
};
