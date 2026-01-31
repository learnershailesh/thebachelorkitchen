import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import CancellationPolicy from './pages/CancellationPolicy';

import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/cancellation-policy" element={<CancellationPolicy />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
