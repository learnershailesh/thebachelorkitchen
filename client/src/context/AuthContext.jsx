import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configure Axios Base URL - Use environment variable for production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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

  const sendEmailOtp = async (email) => {
    try {
      const { data } = await api.post('/auth/send-otp', { email });
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to send OTP';
    }
  };

  const verifyEmailOtp = async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });

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
      throw error.response?.data?.message || 'OTP verification failed';
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

  const firebaseLogin = async (idToken) => {
    try {
      const { data } = await api.post('/auth/firebase-login', { idToken });

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
      throw error.response?.data?.message || 'Firebase login failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tiffin_user');
    localStorage.removeItem('tiffin_token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, sendEmailOtp, verifyEmailOtp, firebaseLogin, loading, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { api };
