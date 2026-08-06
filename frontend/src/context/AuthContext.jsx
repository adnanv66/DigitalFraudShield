import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const isValidToken = (t) => t && t !== 'undefined' && t !== 'null' && typeof t === 'string' && t.trim() !== '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return isValidToken(t) ? t : null;
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    const rt = localStorage.getItem('refresh_token');
    return isValidToken(rt) ? rt : null;
  });
  const [loading, setLoading] = useState(true);

  // Auto-Login & Silent Token Refresh Handler on Startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      const validAccess = isValidToken(storedToken);
      const validRefresh = isValidToken(storedRefreshToken);

      if (!validAccess && !validRefresh) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setLoading(false);
        return;
      }

      if (validAccess) {
        try {
          const res = await api.get('/user/profile', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(res.data);
          setLoading(false);
          return;
        } catch (err) {
          console.warn("Access token expired or invalid, attempting silent refresh...");
        }
      }

      // If Access token failed or missing, attempt Silent Refresh using stored Refresh Token
      if (validRefresh) {
        try {
          const refreshRes = await api.post('/auth/refresh', { refresh_token: storedRefreshToken });
          const newAccessToken = refreshRes.data.access_token;
          const newRefreshToken = refreshRes.data.refresh_token;

          localStorage.setItem('token', newAccessToken);
          localStorage.setItem('refresh_token', newRefreshToken);
          setToken(newAccessToken);
          setRefreshToken(newRefreshToken);

          // Fetch user profile with new access token
          const profileRes = await api.get('/user/profile', {
            headers: { Authorization: `Bearer ${newAccessToken}` }
          });
          setUser(profileRes.data);
        } catch (refreshErr) {
          console.error("Refresh token expired or failed. User must re-authenticate.");
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          setToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, access_token, refresh_token } = res.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      setToken(access_token);
      setRefreshToken(refresh_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Invalid email or password.";
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password, language_preference = 'en') => {
    try {
      const res = await api.post('/auth/register', { name, email, password, language_preference });
      const { user: userData, access_token, refresh_token } = res.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      setToken(access_token);
      setRefreshToken(refresh_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Registration failed. Email may already be in use.";
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
