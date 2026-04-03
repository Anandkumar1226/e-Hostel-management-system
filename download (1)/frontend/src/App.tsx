import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { BookingPage } from './pages/Booking';
import { Attendance } from './pages/Attendance';
import { AttendanceHistory } from './pages/AttendanceHistory';
import { AdminDashboard } from './pages/Admin';
import { storage } from './services/storage.service';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authUser = storage.getAuthUser();
    if (authUser) {
      setUser(authUser);
    }
  }, []);

  const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
    if (!user) return <Navigate to="/auth" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
    return <>{children}</>;
  };

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth setUser={setUser} />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard user={user!} />
            </ProtectedRoute>
          } />
          
          <Route path="/book" element={
            <ProtectedRoute>
              <BookingPage user={user!} />
            </ProtectedRoute>
          } />
          
          <Route path="/attendance" element={
            <ProtectedRoute>
              <Attendance user={user!} />
            </ProtectedRoute>
          } />

          <Route path="/history" element={
            <ProtectedRoute>
              <AttendanceHistory user={user!} />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;