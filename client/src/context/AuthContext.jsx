import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configure Axios Base URL - Change this for production
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State & Axios Token
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('tiffin_user');
      const token = localStorage.getItem('tiffin_token');

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        // Set default header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);

      const userObj = {
        _id: data._id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: data.role,
        address: data.address
      };

      // Save Session
      localStorage.setItem('tiffin_user', JSON.stringify(userObj));
      localStorage.setItem('tiffin_token', data.token);

      // Set State & Header
      setUser(userObj);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return userObj;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const login = async (phone, password) => {
    try {
      const { data } = await api.post('/auth/login', { phone, password });

      const userObj = {
        _id: data._id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: data.role,
        address: data.address
      };

      // Save Session
      localStorage.setItem('tiffin_user', JSON.stringify(userObj));
      localStorage.setItem('tiffin_token', data.token);

      // Set State & Header
      setUser(userObj);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return userObj;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const loginWithOtp = async (idToken) => {
    try {
      const { data } = await api.post('/auth/otp-login', { idToken });

      const userObj = {
        _id: data._id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: data.role,
        address: data.address
      };

      // Save Session
      localStorage.setItem('tiffin_user', JSON.stringify(userObj));
      localStorage.setItem('tiffin_token', data.token);

      // Set State & Header
      setUser(userObj);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return userObj;
    } catch (error) {
      throw error.response?.data?.message || 'OTP Login failed';
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/auth/profile', userData);

      const userObj = {
        _id: data._id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: data.role,
        address: data.address
      };

      // Update Local Storage
      localStorage.setItem('tiffin_user', JSON.stringify(userObj));
      localStorage.setItem('tiffin_token', data.token);

      // Update State
      setUser(userObj);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return userObj;
    } catch (error) {
      throw error.response?.data?.message || 'Update failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tiffin_user');
    localStorage.removeItem('tiffin_token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loginWithOtp, loading, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { api };
