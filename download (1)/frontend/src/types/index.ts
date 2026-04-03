export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  phone: string;
  photoUrl?: string; // For face recognition simulation
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  roomType: 'Single' | 'Double' | 'Triple';
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  date: string;
  time: string;
}
