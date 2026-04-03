import React, { useState } from 'react';
import { storage } from '../services/storage.service';
import { Booking, User } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Filter,
  ArrowUpRight,
  TrendingUp,
  Activity,
  UserCheck,
  Building2,
  MoreVertical,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const bookings = storage.getBookings();
  const users = storage.getUsers().filter(u => u.role === 'student');
  const attendance = storage.getAttendance();

  const filteredBookings = bookings.filter(b => 
    b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Residents', value: users.length, icon: Users, color: 'bg-blue-100 text-blue-600', trend: '+12% this month' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'confirmed').length, icon: Building2, color: 'bg-emerald-100 text-emerald-600', trend: '88% occupancy' },
    { label: 'Today Attendance', value: attendance.filter(r => r.date === new Date().toLocaleDateString()).length, icon: UserCheck, color: 'bg-amber-100 text-amber-600', trend: '95.2% daily avg' },
    { label: 'Pending Requests', value: bookings.filter(b => b.status === 'pending').length, icon: Activity, color: 'bg-purple-100 text-purple-600', trend: 'Needs review' }
  ];

  const handleStatusChange = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    const allBookings = storage.getBookings();
    const updated = allBookings.map(b => b.id === bookingId ? { ...b, status } : b);
    storage.saveBookings(updated);
    window.location.reload(); // Quick refresh to update UI
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between space-y-6 lg:space-y-0">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase mb-4 border border-blue-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Administrative Access • System Node 01</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Hostel Management Panel</h1>
          <p className="text-lg text-gray-600">Centralized control for room allocations, student data, and security logs.</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by resident or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm w-full lg:w-96"
            />
          </div>
          <button className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-xl flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-3xl font-extrabold text-gray-900 mb-4">{stat.value}</h4>
              <div className="flex items-center text-xs font-extrabold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Bookings Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                Recent Booking Requests
              </h3>
              <div className="flex space-x-2">
                <button className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                  <Filter className="h-5 w-5" />
                </button>
                <button className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest">Resident</th>
                    <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest">Room Type</th>
                    <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest">Stay Duration</th>
                    <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 font-bold text-sm">
                              {booking.userName.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{booking.userName}</span>
                              <span className="text-xs text-gray-400">ID: {booking.userId.substr(0, 6).toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-gray-900 font-bold">{booking.roomType}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-600">{new Date(booking.checkIn).toLocaleDateString()}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">to</span>
                            <span className="text-sm font-bold text-gray-600">{new Date(booking.checkOut).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase border",
                            booking.status === 'confirmed' ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
                            booking.status === 'pending' ? "bg-amber-100 text-amber-700 border-amber-200" :
                            "bg-red-100 text-red-700 border-red-200"
                          )}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end space-x-2">
                            {booking.status !== 'confirmed' && (
                              <button 
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-24 text-center">
                        <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Calendar className="h-10 w-10 text-gray-300" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No Booking Records</h4>
                        <p className="text-gray-500">The booking table is currently empty.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Student Lists & Attendance Summary */}
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center">
              <Users className="h-5 w-5 mr-3 text-blue-600" />
              Registered Students
            </h3>
            
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {users.length > 0 ? (
                users.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-white shadow-sm mr-4">
                        <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">{student.name}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">{student.phone}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 italic py-8">No registered students yet.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-8 flex items-center">
                <Clock className="h-5 w-5 mr-3 text-blue-400" />
                Attendance Heatmap
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-bold">Morning Scan</span>
                  <span className="text-emerald-400 font-extrabold text-sm">92% Compliance</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[92%]"></div>
                </div>
                
                <div className="flex items-center justify-between mt-8">
                  <span className="text-gray-400 text-sm font-bold">Night Roll-call</span>
                  <span className="text-amber-400 font-extrabold text-sm">84% Compliance</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[84%]"></div>
                </div>

                <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.2em] mb-2">Total System Scans</p>
                  <p className="text-2xl font-black text-white">{attendance.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
