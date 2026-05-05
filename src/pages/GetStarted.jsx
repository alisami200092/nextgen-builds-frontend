import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown, User, LogOut } from 'lucide-react';

import assistantImg from '../assets/smart-assisstant.png';
import configuratorImg from '../assets/pc-configurator.png';

const GetStarted = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // --- AUTH DROPDOWN STATE & LOGIC ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(loggedInUser);
        setUser(parsedUser);
      } catch (error) {
        setUser({ username: loggedInUser });
      }
      setIsLoading(false);
    }
  }, [navigate]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Redirecting to login since this page requires auth
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameArray = name.trim().split(' ');
    if (nameArray.length >= 2) {
      return (nameArray[0][0] + nameArray[nameArray.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase(); 
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#090b14] flex items-center justify-center text-cyan-400">Loading Configuration...</div>;
  }

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-300 font-sans relative overflow-hidden flex flex-col">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar with Profile Dropdown */}
      <nav className="relative z-50 px-8 py-6 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
          <span className="text-sm font-semibold">Back to Home</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user && (
            <div className="relative" ref={dropdownRef}>
              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 cursor-pointer group">
                <span className="text-sm font-semibold text-slate-300 hidden sm:block group-hover:text-white transition-colors">
                  {user.username}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(34,211,238,0.4)] border-2 border-[#090b14] transition-transform group-hover:scale-105">
                    {getInitials(user.username)}
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-[#131627] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-white/5 mb-1">
                    <p className="text-xs text-slate-500 mb-0.5">Logged in as</p>
                    <p className="text-sm text-white font-bold truncate">{user.email || user.username}</p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-400 transition-colors flex items-center gap-3 font-medium"
                  >
                    <User size={16} className="text-slate-400" /> My Profile
                  </Link>

                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3 font-medium mt-1"
                  >
                    <LogOut size={16} className="text-red-400/80" /> Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="grow flex flex-col items-center justify-center px-6 py-12 relative z-10">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">Build Path</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Select how you want our AI to generate your perfect PC. Whether you are entirely new to PCs or a seasoned hardware veteran, we have a path for you.
          </p>
        </div>

        {/* The Choice Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mx-auto">
          
          {/* PATH A: THE NOVICE */}
          <div 
            onClick={() => navigate('/builder/novice')}
            className="group relative bg-[#121524] border-2 border-cyan-400/80 rounded-4xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] flex flex-col aspect-square w-full max-w-105 mx-auto"
          >
            {/* Top Text Section */}
            <div className="text-left mb-2 z-20">
              <h2 className="text-2xl font-bold text-white mb-2">The Smart Assistant</h2>
              <p className="text-slate-400 text-sm leading-relaxed pr-2">
                Tell us your budget and let AI find your perfect match.
              </p>
            </div>

            {/* Center 3D Asset - Absolute Positioning Trick */}
            <div className="grow relative w-full flex items-center justify-center z-10 pointer-events-none">
              <img 
                src={assistantImg} 
                alt="Smart Assistant Robot" 
                className="absolute w-[110%] sm:w-[130%] max-w-none object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Button */}
            <div className="mt-auto pt-4 flex justify-center w-full z-20">
              <button className="w-full bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg text-sm tracking-wide">
                Start Building
              </button>
            </div>
          </div>

          {/* PATH B: THE ENTHUSIAST */}
          <div 
            onClick={() => navigate('/builder/enthusiast')}
            className="group relative bg-[#121524] border-2 border-fuchsia-500/80 rounded-4xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.2)] hover:shadow-[0_0_50px_rgba(217,70,239,0.4)] flex flex-col aspect-square w-full max-w-105 mx-auto"
          >
            {/* Top Text Section */}
            <div className="text-left mb-2 z-20">
              <h2 className="text-2xl font-bold text-white mb-2">The Pro Configurator</h2>
              <p className="text-slate-400 text-sm leading-relaxed pr-2">
                Full control over brand preferences and high-end specs.
              </p>
            </div>

            {/* Center 3D Asset - Absolute Positioning Trick */}
            <div className="grow relative w-full flex items-center justify-center z-10 pointer-events-none">
              <img 
                src={configuratorImg} 
                alt="Pro Configurator Components" 
                className="absolute w-[130%] sm:w-[150%] max-w-none object-contain drop-shadow-[0_0_25px_rgba(217,70,239,0.3)] group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Button */}
            <div className="mt-auto pt-4 flex justify-center w-full z-20">
              <button className="w-full bg-linear-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg text-sm tracking-wide">
                Configure Now
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default GetStarted;