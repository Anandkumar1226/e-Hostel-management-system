import React from 'react';
import { User, Booking } from '../types';
import { storage } from '../services/storage.service';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  History, 
  ArrowRight,
  Camera,
  User as UserIcon,
  Phone,
  Mail,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const bookings = storage.getUserBookings(user.id);
  const latestBooking = bookings[bookings.length - 1];
  const attendance = storage.getAttendance().filter(r => r.userId === user.id).slice(0, 5);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-blue-600 bg-blue-100' },
    { label: 'Attendance Days', value: storage.getAttendance().filter(r => r.userId === user.id).length, icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Upcoming Stays', value: bookings.filter(b => new Date(b.checkIn) > new Date()).length, icon: Clock, color: 'text-amber-600 bg-amber-100' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your hostel stay today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={cn("p-4 rounded-2xl", stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Profile & Booking */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Booking Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-8 py-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Home className="h-6 w-6" />
                <h3 className="text-xl font-bold">Current Room Allocation</h3>
              </div>
              <Link to="/book" className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
                Manage Booking
              </Link>
            </div>
            <div className="p-8">
              {latestBooking ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Stay Period:</span>
                    </div>
                    <div className="pl-8">
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(latestBooking.checkIn).toLocaleDateString()} - {new Date(latestBooking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Room Details:</span>
                    </div>
                    <div className="pl-8">
                      <p className="text-lg font-bold text-gray-900">{latestBooking.roomType} Room (Shared)</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <span className="text-sm text-gray-500 font-medium uppercase mb-2">Booking Status</span>
                    <span className={cn(
                      "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider",
                      latestBooking.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {latestBooking.status}
                    </span>
                    <p className="mt-4 text-xs text-center text-gray-500">ID: {latestBooking.id.toUpperCase()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-10 w-10 text-gray-300" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">No Active Booking</h4>
                  <p className="text-gray-500 mb-6">You haven't booked a room yet. Secure your spot today!</p>
                  <Link to="/book" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Book a Room <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/attendance" className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Mark Attendance</h4>
              <p className="text-gray-500 text-sm mb-4">Use biometric face recognition to log your presence instantly.</p>
              <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                Start Scan <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>

            <Link to="/history" className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <History className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Attendance History</h4>
              <p className="text-gray-500 text-sm mb-4">View your complete attendance logs and tracking history.</p>
              <span className="text-emerald-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                View Logs <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column: Profile Summary & Recent Attendance */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center mb-8">
              <div className="h-24 w-24 rounded-full border-4 border-blue-100 overflow-hidden mb-4 p-1">
                <img src={user.photoUrl} alt="User avatar" className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-500 font-medium text-sm">Hostel Resident</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-2xl">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium truncate">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-2xl">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-2xl">
                <UserIcon className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium uppercase">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-emerald-500" />
              Recent Attendance
            </h4>
            
            <div className="space-y-4">
              {attendance.length > 0 ? (
                attendance.map((record, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{record.date}</p>
                      <p className="text-xs text-gray-500">{record.time}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase">
                      Present
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4 italic">No attendance records yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
