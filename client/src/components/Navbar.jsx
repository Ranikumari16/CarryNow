import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 sticky top-0 z-50 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-wide text-indigo-400">
          <Package className="w-6 h-6 text-indigo-500" />
          <span>CarryNow</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
          <Link to="/book" className="hover:text-indigo-400 transition">Book Parcel</Link>
          <Link to="/track" className="hover:text-indigo-400 transition">Track Order</Link>
          
          {user ? (
            /* Profile Dropdown Menu on Hover */
            <div className="relative group py-2">
              <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-indigo-300 font-semibold text-xs hover:bg-slate-700 transition">
                <User className="w-4 h-4 text-indigo-400" />
                <span>{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Hover Dropdown Box */}
              <div className="absolute right-0 top-full pt-1 w-44 hidden group-hover:block transition-all duration-200">
                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-1.5">
                  <div className="px-3 py-2 border-b border-slate-700/60 mb-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Signed in as</p>
                    <p className="text-xs text-indigo-300 font-semibold truncate">{user.name}</p>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg text-xs transition font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <User className="w-4 h-4" /> Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-slate-300 hover:text-white focus:outline-none p-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800 flex flex-col gap-4 text-sm font-medium bg-slate-900 pb-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-indigo-400 transition py-1">Home</Link>
          <Link to="/book" onClick={() => setIsOpen(false)} className="hover:text-indigo-400 transition py-1">Book Parcel</Link>
          <Link to="/track" onClick={() => setIsOpen(false)} className="hover:text-indigo-400 transition py-1">Track Order</Link>
          
          {user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <span className="text-indigo-300 font-semibold text-sm">Signed in as: {user.name}</span>
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }} 
                className="bg-red-600/20 text-red-400 border border-red-500/30 py-2 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition inline-flex items-center justify-center gap-1.5 shadow-md"
            >
              <User className="w-4 h-4" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;