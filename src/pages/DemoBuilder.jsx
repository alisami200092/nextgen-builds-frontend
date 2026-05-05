import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, Cpu, MonitorPlay, MemoryStick, 
  HardDrive, Box, Loader2, Sparkles, Target,
  Activity, CheckCircle2, ChevronDown, LogOut, User
} from 'lucide-react';

import purplePcImage from '../assets/purple-pc-build.png'; 

// --- STATIC DEMO DATABASE (Zero Backend Load) ---
const DEMO_BUILDS = {
  400: { cpu: 'AMD Ryzen 5 4600G', gpu: 'Radeon Vega 7 (Integrated)', ram: '16GB DDR4-3200', storage: '500GB NVMe SSD', case: 'Thermaltake Versa H18', total: 385, profile: 'Entry-level 720p/1080p Esports Gaming.' },
  500: { cpu: 'Intel Core i3-12100F', gpu: 'Intel Arc A580 8GB', ram: '16GB DDR4-3200', storage: '500GB NVMe SSD', case: 'Fractal Focus G', total: 495, profile: 'Solid 1080p Medium Settings Gaming.' },
  750: { cpu: 'AMD Ryzen 5 5600', gpu: 'AMD Radeon RX 7600', ram: '16GB DDR4-3600', storage: '1TB NVMe M.2', case: 'Phanteks Eclipse G360A', total: 740, profile: 'Maximized for 1080p High-Refresh Gaming.' },
  1000: { cpu: 'Intel Core i5-13400F', gpu: 'NVIDIA RTX 4060 8GB', ram: '32GB DDR5-5600', storage: '1TB NVMe M.2 Gen4', case: 'Corsair 4000D Airflow', total: 990, profile: 'Excellent 1080p Ultra / Entry 1440p Gaming.' },
  1250: { cpu: 'AMD Ryzen 5 7600X', gpu: 'AMD Radeon RX 7800 XT 16GB', ram: '32GB DDR5-6000', storage: '1TB NVMe M.2 Gen4', case: 'NZXT H5 Flow', total: 1245, profile: 'Flawless 1440p High-Refresh Gaming.' },
  1500: { cpu: 'Intel Core i7-14700K', gpu: 'NVIDIA RTX 4070 Super 12GB', ram: '32GB DDR5-6400', storage: '2TB NVMe M.2 Gen4', case: 'Lian Li Lancool 216', total: 1490, profile: 'Elite 1440p Ultra / Entry 4K Gaming.' },
  2000: { cpu: 'AMD Ryzen 7 7800X3D', gpu: 'AMD Radeon RX 7900 XTX 24GB', ram: '32GB DDR5-6000', storage: '2TB NVMe M.2 Gen4', case: 'NZXT H7 Flow', total: 1980, profile: 'Uncompromised 4K UHD High-Refresh Gaming.' },
  2500: { cpu: 'Intel Core Ultra 9 285K', gpu: 'NVIDIA RTX 5080 16GB', ram: '64GB DDR5-7200', storage: '4TB NVMe M.2 Gen5', case: 'Hyte Y70 Touch', total: 2450, profile: 'Next-Gen 4K Ray Tracing & Heavy Workloads.' },
  3000: { cpu: 'AMD Ryzen 9 9950X', gpu: 'NVIDIA RTX 5090 32GB', ram: '64GB DDR5-8000', storage: '4TB NVMe M.2 Gen5', case: 'Lian Li O11 Dynamic EVO XL', total: 2990, profile: 'Absolute God-Tier 4K & Machine Learning Workstation.' },
  3500: { cpu: 'AMD Ryzen 9 9950X3D', gpu: 'NVIDIA RTX 5090 32GB (Liquid Cooled)', ram: '128GB DDR5-8000', storage: '8TB NVMe M.2 Gen5', case: 'Corsair Obsidian 1000D', total: 3450, profile: 'Blank Check Build. Zero compromises.' }
};

const BuilderDemo = () => {
  const navigate = useNavigate();
  
  const [budget, setBudget] = useState(1500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildResult, setBuildResult] = useState(null);

  // --- AUTH STATE & LOGIC ---
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

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
    setIsDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameArray = name.trim().split(' ');
    if (nameArray.length >= 2) {
      return (nameArray[0][0] + nameArray[nameArray.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase(); 
  };

  const handleGenerateBuild = () => {
    if (!budget) return;
    
    setIsGenerating(true);
    setBuildResult(null);

    // Find the closest budget in our static dictionary
    const availableBudgets = Object.keys(DEMO_BUILDS).map(Number);
    const closestBudget = availableBudgets.reduce((prev, curr) => 
      Math.abs(curr - budget) < Math.abs(prev - budget) ? curr : prev
    );

    // Simulate AI loading time for the "cool" factor
    setTimeout(() => {
      setBuildResult(DEMO_BUILDS[closestBudget]);
      setIsGenerating(false);
    }, 1200); 
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-300 font-sans relative overflow-x-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>
      
      {/* Purple Glow */}
      <div className="fixed top-0 right-0 w-150 h-150 bg-purple-900/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center transform rotate-45 group-hover:scale-110 transition-transform">
            <div className="w-4 h-4 bg-[#090b14] rounded-sm transform -rotate-45"></div>
          </div>
          <span className="text-white font-bold text-xl tracking-wider">NEXTGEN<br/><span className="text-sm text-purple-400 leading-3 block">BUILDS</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="text-purple-400 font-bold transition-colors">Live Demo</a>
        </div>
        
        {/* UPDATED DYNAMIC AUTH SECTION */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 cursor-pointer group">
                <span className="text-sm font-semibold text-slate-300 hidden sm:block group-hover:text-white transition-colors">
                  {user.username}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)] border-2 border-[#090b14] transition-transform group-hover:scale-105">
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
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold hover:text-white transition-colors text-slate-300">Login</Link>
              <Link to="/signup" className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-purple-500/25">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN DEMO CONTENT */}
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-widest uppercase mb-6">
            <Activity size={14} className="animate-pulse" /> Interactive Live Demo
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            AI-Powered Builds.<br/> Your Budget, Your Rules.
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Dial in your budget below to preview how our engine crafts the perfect system. Sign up to unlock full brand customization and AI Frame Predictions.
          </p>
        </div>

        {/* --- BUDGET SLIDER AREA --- */}
        <div className="w-full max-w-2xl bg-[#0b0f19] border border-white/10 rounded-4xl p-8 shadow-2xl mb-12 flex flex-col items-center">
          <div className="w-full mb-8">
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Target Budget</label>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 drop-shadow-sm">
                ${budget}
              </span>
            </div>
            
            <div className="relative w-full py-4">
              <input 
                type="range" min="400" max="3500" step="50" value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer bg-slate-800 accent-purple-500 z-10 relative outline-none shadow-inner"
                style={{ background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${(budget - 400) / 31}%, #1e293b ${(budget - 400) / 31}%, #1e293b 100%)` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-bold">
              <span>$400</span>
              <span>$3500+</span>
            </div>
          </div>

          <button 
            onClick={handleGenerateBuild}
            disabled={isGenerating}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-4 rounded-full font-black text-lg tracking-wide transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <><Loader2 size={24} className="animate-spin" /> COMPILING ARCHITECTURE...</>
            ) : (
              <><Sparkles size={24} /> GENERATE OPTIMAL BUILD</>
            )}
          </button>
        </div>

        {/* RESULT ZONE */}
        {buildResult && !isGenerating && (
          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={24} /> Preview Build Generated
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Left: Animated PC Image Container */}
              <div className="bg-[#0b0f19] rounded-3xl border border-white/5 p-4 h-full min-h-137.5 relative overflow-hidden flex justify-center items-center group shadow-xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>
                
                <img 
                  src={purplePcImage} 
                  alt="AI Optimized Gaming Rig" 
                  className="h-4/5 w-4/5 object-contain relative z-10 drop-shadow-[0_0_25px_rgba(168,85,247,0.3)] transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-purple-900/10 to-transparent pointer-events-none rounded-3xl"></div>
              </div>

              {/* Right: Build Details Card */}
              <div className="bg-[#0b0f19] border border-white/10 border-t-purple-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full group hover:border-purple-500/40 transition-colors">
                <div>
                  <h4 className="text-white font-black text-2xl mb-8 tracking-tight">System Architecture</h4>
                  
                  <ul className="space-y-5 mb-8">
                    <li className="flex items-center gap-4 text-sm border-b border-white/5 pb-3">
                      <div className="p-2 bg-cyan-500/10 rounded-lg"><Cpu size={20} className="text-cyan-400" /></div>
                      <span className="text-slate-400 font-medium w-20">Processor</span>
                      <span className="text-white font-bold truncate">{buildResult.cpu}</span>
                    </li>
                    <li className="flex items-center gap-4 text-sm border-b border-white/5 pb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg"><MonitorPlay size={20} className="text-purple-400" /></div>
                      <span className="text-slate-400 font-medium w-20">Graphics</span>
                      <span className="text-white font-bold truncate">{buildResult.gpu}</span>
                    </li>
                    <li className="flex items-center gap-4 text-sm border-b border-white/5 pb-3">
                      <div className="p-2 bg-pink-500/10 rounded-lg"><MemoryStick size={20} className="text-pink-400" /></div>
                      <span className="text-slate-400 font-medium w-20">Memory</span>
                      <span className="text-white font-bold truncate">{buildResult.ram}</span>
                    </li>
                    <li className="flex items-center gap-4 text-sm border-b border-white/5 pb-3">
                      <div className="p-2 bg-slate-500/10 rounded-lg"><Box size={20} className="text-slate-400" /></div>
                      <span className="text-slate-400 font-medium w-20">Chassis</span>
                      <span className="text-white font-bold truncate">{buildResult.case}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <div className="bg-[#060913] rounded-2xl p-6 border border-[#1e293b] mb-8">
                    <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">Target Profile</p>
                    <p className="text-slate-300 text-sm font-medium">{buildResult.profile}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Estimated Value</p>
                    <div className="text-4xl font-black text-white">
                      ${buildResult.total.toLocaleString()}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      to={user ? "/get-started" : "/signup"} // Dynamic routing based on auth state
                      className="flex-1 bg-purple-500/10 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
                    >
                      {user ? "Build Your Own Now" : "Unlock Full Analysis"}
                    </Link>
                    <button 
                      onClick={() => {
                        setBuildResult(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' }); 
                      }}
                      className="flex-1 bg-transparent border border-white/20 text-slate-300 hover:bg-white/5 hover:border-white/40 py-3 rounded-full text-sm font-bold transition-colors"
                    >
                      Try Different Budget
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuilderDemo;