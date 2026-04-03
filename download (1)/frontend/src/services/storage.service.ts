import { User, Booking, AttendanceRecord } from '../types';

const USERS_KEY = 'hms_users';
const BOOKINGS_KEY = 'hms_bookings';
const ATTENDANCE_KEY = 'hms_attendance';
const AUTH_USER_KEY = 'hms_auth_user';

export const storage = {
  // Auth & Users
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  getAuthUser: (): User | null => JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null'),
  setAuthUser: (user: User | null) => localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)),

  // Bookings
  getBookings: (): Booking[] => JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]'),
  saveBookings: (bookings: Booking[]) => localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)),
  addBooking: (booking: Booking) => {
    const bookings = storage.getBookings();
    storage.saveBookings([...bookings, booking]);
  },
  getUserBookings: (userId: string): Booking[] => {
    return storage.getBookings().filter(b => b.userId === userId);
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]'),
  saveAttendance: (records: AttendanceRecord[]) => localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records)),
  addAttendance: (record: AttendanceRecord) => {
    const records = storage.getAttendance();
    // Prevent duplicates within 30 seconds
    const lastRecord = records.find(r => r.userId === record.userId && 
      new Date(record.timestamp).getTime() - new Date(r.timestamp).getTime() < 30000);
    
    if (!lastRecord) {
      storage.saveAttendance([record, ...records]);
      return true;
    }
    return false;
  }
};
