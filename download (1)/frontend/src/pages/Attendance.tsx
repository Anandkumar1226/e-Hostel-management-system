import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { User, AttendanceRecord } from '../types';
import { storage } from '../services/storage.service';
import { 
  Camera, 
  ScanLine, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  History,
  Info,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface AttendanceProps {
  user: User;
}

export const Attendance: React.FC<AttendanceProps> = ({ user }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'failed' | 'duplicate'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognizedUser, setRecognizedUser] = useState<User | null>(null);
  const [lastAttendance, setLastAttendance] = useState<AttendanceRecord | null>(null);

  const stats = [
    { label: 'Current Session', value: 'Active', icon: Clock, color: 'text-blue-600' },
    { label: 'System Status', value: 'Secure', icon: ShieldCheck, color: 'text-emerald-600' },
    { label: 'Recognition', value: 'AI Ready', icon: ScanLine, color: 'text-amber-600' }
  ];

  useEffect(() => {
    const userAttendance = storage.getAttendance().filter(r => r.userId === user.id);
    if (userAttendance.length > 0) {
      setLastAttendance(userAttendance[0]);
    }
  }, [user.id]);

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setRecognizedUser(null);
    setErrorMessage(null);

    // Simulated recognition logic
    await new Promise(resolve => setTimeout(resolve, 2500));

    // For simulation, we'll assume recognition is successful for the logged-in user
    // In a real app, this would send an image chunk to a face recognition API
    const isSuccess = Math.random() > 0.05; // 95% success rate simulation

    if (isSuccess) {
      const timestamp = new Date().toISOString();
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const record: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        timestamp,
        date,
        time
      };

      const added = storage.addAttendance(record);
      
      if (added) {
        setScanStatus('success');
        setRecognizedUser(user);
        setLastAttendance(record);
      } else {
        setScanStatus('duplicate');
        setErrorMessage('Attendance already marked recently (within 30 seconds).');
      }
    } else {
      setScanStatus('failed');
      setErrorMessage('Face not recognized. Please adjust lighting and try again.');
    }

    setIsScanning(false);
  }, [user]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Biometric Attendance</h1>
          <p className="text-lg text-gray-600">Position your face within the frame for real-time verification.</p>
        </div>
        <Link to="/history" className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <History className="mr-2 h-5 w-5" />
          View History
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Webcam Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-gray-200 group">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />
            
            {/* Scan Overlay */}
            {(isScanning || scanStatus === 'scanning') && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-blue-400/50 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white/80 rounded-3xl animate-face-scan overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner-line"></div>
                </div>
              </div>
            )}

            {/* Recognition Status Overlay */}
            {scanStatus === 'success' && (
              <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                  <CheckCircle2 className="h-14 w-14 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-2 shadow-sm">Verified!</h3>
                <p className="text-xl text-emerald-50 font-bold bg-emerald-900/40 px-6 py-2 rounded-full backdrop-blur-md">
                  Welcome, {recognizedUser?.name}
                </p>
                <button 
                  onClick={() => setScanStatus('idle')}
                  className="mt-10 px-8 py-3 bg-white text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-xl"
                >
                  Close
                </button>
              </div>
            )}

            {scanStatus === 'failed' && (
              <div className="absolute inset-0 bg-red-500/20 backdrop-blur-md flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Recognition Failed</h3>
                <p className="text-red-50 text-center max-w-sm mb-8 font-medium bg-red-900/40 px-6 py-4 rounded-2xl backdrop-blur-md">
                  {errorMessage}
                </p>
                <button 
                  onClick={handleScan}
                  className="px-8 py-3 bg-white text-red-700 rounded-2xl font-bold hover:bg-red-50 transition-colors shadow-xl flex items-center"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try Again
                </button>
              </div>
            )}

            {scanStatus === 'duplicate' && (
              <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-md flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <Clock className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Duplicate Scan</h3>
                <p className="text-amber-50 text-center max-w-sm mb-8 font-medium bg-amber-900/40 px-6 py-4 rounded-2xl backdrop-blur-md">
                  {errorMessage}
                </p>
                <button 
                  onClick={() => setScanStatus('idle')}
                  className="px-8 py-3 bg-white text-amber-700 rounded-2xl font-bold hover:bg-amber-50 transition-colors shadow-xl"
                >
                  Acknowledged
                </button>
              </div>
            )}

            {/* Viewport Info Overlay (Permanent) */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-mono uppercase tracking-widest border border-white/10 flex items-center">
                <div className={cn("w-2 h-2 rounded-full mr-3 animate-pulse", isScanning ? "bg-red-500" : "bg-emerald-500")}></div>
                System: {isScanning ? 'Processing...' : 'Ready'}
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                <Maximize2 className="h-5 w-5 text-white/80" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <stat.icon className={cn("h-8 w-8 mb-4", stat.color)} />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center">
              <ScanLine className="h-5 w-5 mr-3 text-blue-600" />
              Scan Controls
            </h3>
            
            <div className="space-y-6">
              <button
                disabled={isScanning || scanStatus === 'success'}
                onClick={handleScan}
                className={cn(
                  "w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-extrabold text-xl flex flex-col items-center justify-center transition-all shadow-xl hover:shadow-blue-200 disabled:opacity-70 disabled:grayscale",
                  isScanning && "animate-pulse"
                )}
              >
                {isScanning ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <span className="text-sm">Matching Encodings...</span>
                  </div>
                ) : (
                  <>
                    <Camera className="h-8 w-8 mb-2" />
                    Start Recognition
                  </>
                )}
              </button>

              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <h4 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-600" />
                  Tips for better scan
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 mt-1.5 flex-shrink-0"></div>
                    Ensure your face is well lit and centered.
                  </li>
                  <li className="flex items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 mt-1.5 flex-shrink-0"></div>
                    Remove glasses or headwear if possible.
                  </li>
                  <li className="flex items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 mt-1.5 flex-shrink-0"></div>
                    Stay still for 2-3 seconds during the scan.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {lastAttendance && (
            <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-emerald-200/40 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center relative z-10">
                <CheckCircle2 className="h-5 w-5 mr-3 text-emerald-600" />
                Last Attendance
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-emerald-700 font-medium text-sm">Date:</span>
                  <span className="text-emerald-900 font-extrabold">{lastAttendance.date}</span>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-emerald-700 font-medium text-sm">Time:</span>
                  <span className="text-emerald-900 font-extrabold">{lastAttendance.time}</span>
                </div>
                <div className="bg-emerald-600 text-white p-4 rounded-2xl text-center font-bold text-sm tracking-widest uppercase">
                  Verified Successfully
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
