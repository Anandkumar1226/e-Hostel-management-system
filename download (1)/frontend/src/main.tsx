import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { storage } from './services/storage.service';
import { User, Booking, AttendanceRecord } from './types';

// Initial Mock Data
const initializeMockData = () => {
  if (storage.getUsers().length === 0) {
    const adminUser: User = {
      id: 'admin-1',
      name: 'Admin System',
      email: 'admin@hostel.com',
      password: 'password',
      role: 'admin',
      phone: '1234567890',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    };

    const studentUser: User = {
      id: 'student-1',
      name: 'John Doe',
      email: 'john@student.com',
      password: 'password',
      role: 'student',
      phone: '9876543210',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    };

    storage.saveUsers([adminUser, studentUser]);

    const mockBooking: Booking = {
      id: 'book-1',
      userId: 'student-1',
      userName: 'John Doe',
      roomType: 'Double',
      checkIn: '2024-03-01',
      checkOut: '2024-06-30',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    storage.saveBookings([mockBooking]);

    const mockAttendance: AttendanceRecord[] = [
      {
        id: 'att-1',
        userId: 'student-1',
        userName: 'John Doe',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        time: '08:45 AM'
      },
      {
        id: 'att-2',
        userId: 'student-1',
        userName: 'John Doe',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        time: '09:12 AM'
      }
    ];

    storage.saveAttendance(mockAttendance);
  }
};

initializeMockData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);