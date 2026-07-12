const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'http://localhost:5000/api'
    : `${window.location.origin}/api`;
};

const API_BASE = getApiBase();

// Custom fetch wrapper with a 6-second timeout to handle offline/hang scenarios gracefully
const originalFetch = window.fetch || globalThis.fetch;
const fetch = async (resource, options = {}) => {
  const { timeout = 6000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await originalFetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  loginAdmin: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  loginCustomer: async (instanceId, password) => {
    const res = await fetch(`${API_BASE}/auth/customer/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ instanceId, password }),
    });
    return res.json();
  },

  // Categories (Surprises)
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getFAQs: async () => {
    const res = await fetch(`${API_BASE}/faqs`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getCategory: async (slug) => {
    const res = await fetch(`${API_BASE}/categories/${slug}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createCategory: async (data, token) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateCategory: async (id, data, token) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteCategory: async (id, token) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  },

  // Website Templates
  getTemplates: async () => {
    const res = await fetch(`${API_BASE}/templates`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createTemplate: async (data, token) => {
    const res = await fetch(`${API_BASE}/templates`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateTemplate: async (id, data, token) => {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteTemplate: async (id, token) => {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  },

  // Coupons
  validateCoupon: async (code) => {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code }),
    });
    return res.json();
  },

  getCoupons: async (token) => {
    const res = await fetch(`${API_BASE}/coupons`, {
      headers: getHeaders(token),
    });
    return res.json();
  },

  createCoupon: async (data, token) => {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteCoupon: async (id, token) => {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  },

  // Leads (Quote Requests)
  submitLead: async (data) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getLeads: async (token) => {
    const res = await fetch(`${API_BASE}/leads`, {
      headers: getHeaders(token),
    });
    return res.json();
  },

  updateLeadStatus: async (id, status, token) => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  deleteLead: async (id, token) => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  },

  // Payments / Checkout
  createPaymentOrder: async (data) => {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  verifyPaymentSignature: async (data) => {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // AI Assistant Integrations
  generateAIMemoryDescription: async (title, recipientName) => {
    const res = await fetch(`${API_BASE}/categories/ai-memory-description`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, recipientName }),
      timeout: 60000
    });
    return res.json();
  },

  generateAILetter: async (prompt, recipientName, senderName) => {
    const res = await fetch(`${API_BASE}/categories/ai-letter`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prompt, recipientName, senderName }),
      timeout: 60000
    });
    return res.json();
  },

  generateAIText: async (prompt) => {
    const res = await fetch(`${API_BASE}/categories/ai-text`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prompt }),
      timeout: 60000
    });
    return res.json();
  },



  // Surprise Instances
  getLiveInstance: async (instanceId) => {
    const res = await fetch(`${API_BASE}/instances/live/${instanceId}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getInstanceDetails: async (instanceId, token) => {
    const res = await fetch(`${API_BASE}/instances/${instanceId}`, {
      headers: getHeaders(token),
    });
    return res.json();
  },

  updateInstanceConfig: async (instanceId, data, token) => {
    const res = await fetch(`${API_BASE}/instances/${instanceId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getAllInstances: async (token) => {
    const res = await fetch(`${API_BASE}/instances`, {
      headers: getHeaders(token),
    });
    return res.json();
  },

  deleteInstance: async (id, token) => {
    const res = await fetch(`${API_BASE}/instances/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  },

  updateInstanceTier: async (id, tier, token) => {
    const res = await fetch(`${API_BASE}/instances/${id}/tier`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ tier }),
    });
    return res.json();
  },

  adminCreateInstance: async (data, token) => {
    const res = await fetch(`${API_BASE}/instances/admin-create`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  submitAdminResponse: async (instanceId, adminResponse, token) => {
    const res = await fetch(`${API_BASE}/instances/${instanceId}/admin-response`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ adminResponse }),
    });
    return res.json();
  },

  // Dashboard Stats
  getDashboardStats: async (token) => {
    const res = await fetch(`${API_BASE}/analytics/stats`, {
      headers: getHeaders(token),
    });
    return res.json();
  },

  // Admin Demos management
  createDemo: async (data, token) => {
    const res = await fetch(`${API_BASE}/demos`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteDemo: async (id, token) => {
    const res = await fetch(`${API_BASE}/demos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  },

  updateDemo: async (id, data, token) => {
    const res = await fetch(`${API_BASE}/demos/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  uploadFile: async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      
      xhr.open('POST', `${API_BASE}/upload`, true);
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        });
      }
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  },

  submitRecipientResponse: async (instanceId, payload) => {
    const res = await fetch(`${API_BASE}/instances/live/${instanceId}/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  submitRating: async (payload) => {
    const res = await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  getRatings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/ratings?${query}`, {
      headers: getHeaders(),
    });
    return res.json();
  }
};
