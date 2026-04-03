import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ScanLine, 
  ShieldCheck, 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Home = () => {
  const features = [
    {
      title: "Face Recognition",
      description: "Automated biometric attendance with high accuracy and real-time verification.",
      icon: ScanLine,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Easy Room Booking",
      description: "Quick and seamless room selection and allocation for all students.",
      icon: Calendar,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Real-time Tracking",
      description: "Monitor hostel capacity, student attendance, and security in real-time.",
      icon: Clock,
      color: "bg-amber-100 text-amber-600"
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive panel for hostel management and analytics.",
      icon: ShieldCheck,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-emerald-50 opacity-50 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100">
            <ScanLine className="h-4 w-4" />
            <span>AI-Powered Biometric Attendance Integration</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Next Generation <span className="text-blue-600">Smart Hostel</span> Management
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mb-10 leading-relaxed">
            Revolutionize your hostel operations with our advanced AI-driven platform. 
            Automated attendance, seamless room bookings, and comprehensive management tools in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-blue-200"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-lg font-bold transition-all"
            >
              View Demo
            </Link>
          </div>
          
          <div className="mt-16 relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center group">
            <img 
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1600" 
              alt="Hostel Room" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-left text-white">
              <p className="text-sm font-medium uppercase tracking-wider mb-2 opacity-80">Modern Infrastructure</p>
              <h3 className="text-3xl font-bold">Premium Living Experience</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Hostels</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our system is built with students and administrators in mind, offering tools to streamline every aspect of hostel life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.color)}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold cursor-pointer group-hover:translate-x-1 transition-transform">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="text-center p-8 bg-blue-50 rounded-3xl border border-blue-100">
            <div className="text-4xl font-bold text-blue-700 mb-2">99.8%</div>
            <div className="text-gray-600 font-medium">Recognition Accuracy</div>
          </div>
          <div className="text-center p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
            <div className="text-4xl font-bold text-emerald-700 mb-2">1,500+</div>
            <div className="text-gray-600 font-medium">Students Managed</div>
          </div>
          <div className="text-center p-8 bg-amber-50 rounded-3xl border border-amber-100">
            <div className="text-4xl font-bold text-amber-700 mb-2">15,000+</div>
            <div className="text-gray-600 font-medium">Monthly Attendance Scans</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-4">
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-12 text-center border border-white/20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to upgrade your hostel experience?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of smart hostels using our technology to improve security and management.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-10 py-5 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl text-xl font-extrabold transition-all shadow-xl"
          >
            Create Your Account Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};
