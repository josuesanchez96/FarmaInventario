/**
 * API Service Client with JWT Interceptors & Error Standardization
 */

const BASE_URL = '/api';

/**
 * Get JWT Token from localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Custom fetch wrapper acting as HTTP Interceptor
 */
async function request(endpoint, options = {}) {
  const token = getToken();

  // Merge default headers with custom options
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // JWT Interceptor: Attach bearer token if present
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle token expiry or unauthorized access
    if (response.status === 401 || response.status === 403) {
      if (token) {
        // Clear expired token and trigger auto logout event
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error((data && data.message) || `Error HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('No se pudo conectar con el servidor backend. Verifique su conexión.');
      netError.isNetworkError = true;
      throw netError;
    }
    throw error;
  }
}

// Export REST helper methods
export const api = {
  get: (url, options = {}) => request(url, { method: 'GET', ...options }),
  post: (url, body, options = {}) => request(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (url, body, options = {}) => request(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (url, options = {}) => request(url, { method: 'DELETE', ...options }),
};

// API Endpoints Definition
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateAvatar: (avatar) => api.put('/auth/avatar', { avatar }),
};

export const medicamentosApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/medicamentos${query ? `?${query}` : ''}`);
  },
  getById: (id) => api.get(`/medicamentos/${id}`),
  create: (data) => api.post('/medicamentos', data),
  update: (id, data) => api.put(`/medicamentos/${id}`, data),
  delete: (id) => api.delete(`/medicamentos/${id}`),
  getDashboard: () => api.get('/medicamentos/dashboard'),
};

export default api;
