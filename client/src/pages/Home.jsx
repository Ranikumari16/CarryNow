import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { 
  Package, 
  ShieldCheck, 
  Zap, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Navigation,
  Compass,
  Bike,
  UserCheck,
  PhoneCall,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [progress, setProgress] = useState(25);

  // Auto-animate delivery boy along curved route
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 10 : prev + 1.5));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-hidden font-sans">
      
      {/* --- HERO SECTION WITH SKETCH-BASED CURVED ROUTE & DELIVERY RIDER --- */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-800/80">
        
        {/* Background Glowing Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Active Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Campus & City Delivery Active</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Forgot Something? <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
               We’ll Carry It For You.
              </span>
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl mb-8 leading-relaxed">
              Send forgotten bags, chargers, keys, documents, or personal parcels across campus or cities with instant rider assignment and live tracking.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/book"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <Package className="w-5 h-5" />
                <span>Book Delivery Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/track"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Track Live Parcel</span>
              </Link>
            </div>
          </div>

          {/* --- CURVED ANIMATED ROUTE CARD (BASED ON YOUR SKETCH) --- */}
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/60 backdrop-blur-md relative overflow-hidden">
            
            {/* Header / Delivery Partner Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    Rahul Kumar (Delivery Rider)
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </p>
                  <p className="text-xs text-slate-400">Hero Splendor • BR-01-AX-9082</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                  On The Way (ETA: 8 Mins)
                </span>
                <div className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer border border-slate-700">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CURVED ROUTE CANVAS / SVG PATH (Matching Sketch Curve) */}
            <div className="relative h-64 sm:h-72 w-full my-2 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 flex items-center justify-center">
              
              <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Curved Dotted Guide Line (Like Sketch) */}
                <path 
                  d="M 60 50 Q 250 190 440 50" 
                  fill="none" 
                  stroke="#334155" 
                  strokeWidth="3" 
                  strokeDasharray="8 6" 
                />
                
                {/* Active Animated Progress Arc */}
                <path 
                  d="M 60 50 Q 250 190 440 50" 
                  fill="none" 
                  stroke="url(#routeGradient)" 
                  strokeWidth="4" 
                  strokeDasharray="500"
                  strokeDashoffset={500 - (progress * 5)}
                  className="transition-all duration-300 ease-out"
                />

                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Point A (Top-Left Pickup) */}
              <div className="absolute top-6 left-6 sm:left-12 flex items-center gap-3 bg-slate-900/90 border border-indigo-500/40 px-3.5 py-2 rounded-xl shadow-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400 flex items-center justify-center text-indigo-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-100">Pickup Location</p>
                  <p className="text-[10px] text-indigo-300">Hostel Block A</p>
                </div>
              </div>

              {/* Point B (Top-Right Dropoff) */}
              <div className="absolute top-6 right-6 sm:right-12 flex items-center gap-3 bg-slate-900/90 border border-emerald-500/40 px-3.5 py-2 rounded-xl shadow-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-100">Drop Destination</p>
                  <p className="text-[10px] text-emerald-300">Academic Block 2</p>
                </div>
              </div>

              {/* MOVING DELIVERY RIDER / VEHICLE BADGE ALONG CURVE */}
              <div 
                className="absolute transition-all duration-200 ease-linear pointer-events-none"
                style={{
                  left: `${progress}%`,
                  top: `${50 + Math.sin((progress / 100) * Math.PI) * 75}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative group">
                  <div className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/40 border border-indigo-300 flex items-center gap-2 text-white animate-bounce">
                    <Bike className="w-5 h-5 text-yellow-300" />
                    <div className="text-left">
                      <p className="text-[10px] font-bold leading-none">Rider In Motion</p>
                      <p className="text-[9px] text-indigo-100">Express Delivery</p>
                    </div>
                  </div>
                  {/* Glowing Indicator Dot */}
                  <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 mx-auto mt-1 animate-ping" />
                </div>
              </div>

            </div>

            {/* Bottom Live Tracking Status Row */}
            <div className="mt-6 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>OTP Protection Active</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Speed: 32 km/h</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Live Route Syncing</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- HOW IT WORKS (3 SIMPLE STEPS) --- */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How CarryNow Works</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">Fast 3-step process to get your personal items delivered safely.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative hover:border-indigo-500/40 transition-all">
              <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Book Parcel</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Enter pickup & drop details, item category, and parcel weight.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Rider Pickup</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Nearest verified CarryNow delivery partner picks up your parcel.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Express Delivery</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Track live route until safe delivery with OTP verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="py-14 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Need to send a parcel right now?</h2>
          <p className="text-slate-400 text-sm mb-6">Enjoy instant courier pickup and real-time route tracking.</p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            <Bike className="w-5 h-5" />
            <span>Book Express Delivery</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;