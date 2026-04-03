import React, { useState } from 'react';
import { User, Booking } from '../types';
import { storage } from '../services/storage.service';
import { 
  Calendar, 
  Clock, 
  Home, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface BookingPageProps {
  user: User;
}

export const BookingPage: React.FC<BookingPageProps> = ({ user }) => {
  const [roomType, setRoomType] = useState<'Single' | 'Double' | 'Triple'>('Single');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const roomOptions = [
    { 
      type: 'Single' as const, 
      price: '$500', 
      desc: 'Private room with ensuite bathroom and study desk.', 
      capacity: '1 Person',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'
    },
    { 
      type: 'Double' as const, 
      price: '$350', 
      desc: 'Shared room for two students with individual closets.', 
      capacity: '2 People',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
    },
    { 
      type: 'Triple' as const, 
      price: '$250', 
      desc: 'Shared room for three students, spacious and budget-friendly.', 
      capacity: '3 People',
      image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      roomType,
      checkIn,
      checkOut,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    storage.addBooking(newBooking);
    setIsSuccess(true);
    setIsLoading(false);

    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Your room has been successfully allocated. You can view your booking details on the dashboard.
          </p>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full mb-8">
            <p className="text-sm text-gray-500 font-medium uppercase mb-4 tracking-wider">Redirecting you to dashboard...</p>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full animate-progress-bar"></div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Room Booking</h1>
        <p className="text-lg text-gray-600">Select your preferred accommodation and secure your stay.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Room Selection */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                <Home className="h-5 w-5" />
              </div>
              Select Room Type
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roomOptions.map((room) => (
                <div 
                  key={room.type}
                  onClick={() => setRoomType(room.type)}
                  className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-3xl border-2 transition-all",
                    roomType === room.type 
                      ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100" 
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  <div className="h-40 overflow-hidden">
                    <img src={room.image} alt={room.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{room.type}</h4>
                      {roomType === room.type && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                    </div>
                    <p className="text-2xl font-extrabold text-blue-600 mb-4">{room.price}<span className="text-sm text-gray-500 font-medium">/month</span></p>
                    <div className="flex items-center text-sm text-gray-500 mb-4 bg-white/50 px-3 py-1 rounded-lg">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      {room.capacity}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{room.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Booking Details */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5" />
              </div>
              Stay Duration
            </h3>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Check-in Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Check-out Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Booking Summary</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-gray-500 font-medium">Room Type:</span>
                <span className="text-gray-900 font-extrabold">{roomType} Room</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-500 font-medium text-sm px-1">Check-in</p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900">
                  {checkIn || 'Not selected'}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-500 font-medium text-sm px-1">Check-out</p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900">
                  {checkOut || 'Not selected'}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start mb-6 border border-red-100">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={cn(
                "w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold flex items-center justify-center transition-all shadow-xl hover:shadow-blue-200 disabled:opacity-70",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? 'Processing...' : (
                <>
                  Confirm Booking <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
            
            <div className="mt-8 flex items-start p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <Info className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                Upon confirmation, your room allocation is subject to hostel policy and availability. 
                Payment details will be shared separately via email.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-emerald-500" />
              Safe & Secure
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
                24/7 Biometric Access
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
                CCTV Surveillance
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
                Secure Data Protection
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
