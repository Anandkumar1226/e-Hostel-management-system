import React, { useState } from 'react';
import { User, AttendanceRecord } from '../types';
import { storage } from '../services/storage.service';
import { 
  History, 
  Search, 
  Calendar, 
  Clock, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AttendanceHistoryProps {
  user: User;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const allRecords = storage.getAttendance().filter(r => 
    user.role === 'admin' ? true : r.userId === user.id
  );

  const filteredRecords = allRecords.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.date.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between space-y-6 md:space-y-0">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase mb-4 border border-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified System Records</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Attendance History</h1>
          <p className="text-lg text-gray-600">Review your automated biometric logs and tracking details.</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="relative group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by date or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm w-full md:w-80"
            />
          </div>
          <button className="p-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
            <Download className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Records Table Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <History className="h-5 w-5 mr-3 text-blue-600" />
              Recent Logs
            </h3>
            <div className="flex items-center text-sm font-bold text-gray-500">
              <Filter className="h-4 w-4 mr-2" />
              Showing {currentRecords.length} of {filteredRecords.length} records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">Resident Name</th>
                  <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">Date</th>
                  <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">Verification Time</th>
                  <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                  <th className="px-8 py-6 text-sm font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">System Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 font-bold text-sm">
                            {record.userName.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{record.userName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center text-gray-600 font-medium">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {record.date}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center text-gray-600 font-medium">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {record.time}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                          Verified
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          {record.id.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <History className="h-10 w-10 text-gray-300" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">No Records Found</h4>
                      <p className="text-gray-500">We couldn't find any attendance logs matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-4">Total Scans</p>
            <h4 className="text-4xl font-extrabold">{allRecords.length}</h4>
            <div className="mt-6 flex items-center text-sm font-bold text-blue-100 cursor-pointer hover:translate-x-1 transition-transform">
              View Detailed Analytics <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Recognition Rate</p>
              <h4 className="text-4xl font-extrabold text-gray-900">99.8%</h4>
            </div>
            <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[99.8%]"></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Active Days</p>
              <h4 className="text-4xl font-extrabold text-gray-900">
                {new Set(allRecords.map(r => r.date)).size}
              </h4>
            </div>
            <p className="mt-6 text-sm text-gray-500 font-medium leading-relaxed">
              Consistently marking attendance since the beginning of your stay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
