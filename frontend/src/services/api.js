import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const isValidToken = (t) => t && t !== 'undefined' && t !== 'null' && typeof t === 'string' && t.trim() !== '';

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (isValidToken(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized via Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (isValidToken(refreshToken) && !originalRequest.url.includes('/auth/refresh')) {
        try {
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          const newAccessToken = res.data.access_token;
          const newRefreshToken = res.data.refresh_token;

          localStorage.setItem('token', newAccessToken);
          localStorage.setItem('refresh_token', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
