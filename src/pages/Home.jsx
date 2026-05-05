import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Cpu, BarChart3, 
  Settings, ShieldCheck, Zap, Star, LayoutGrid, Twitter, Instagram,
  ChevronDown, LogOut, User, CheckCircle2, Terminal, Swords, ShoppingCart, Activity
} from 'lucide-react';

import heroPcImage from '../assets/pc-banner.png';
import featureImage from '../assets/pc-feature-image.png';

const Home = () => {
  const navigate = useNavigate();
  
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

  const handleGetStarted = () => {
    if (user) {
      navigate('/get-started'); 
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 🚀 ACTUAL APP FEATURES (Using the original 7-item count to fit the grid perfectly)
  const features = [
    { icon: <Swords className="text-pink-400 w-6 h-6" />, title: "The Versus Comparison", desc: "Select multiple saved builds from your hangar and pit them head-to-head to determine the ultimate performance winner." },
    { icon: <BarChart3 className="text-blue-400 w-6 h-6" />, title: "Deep Telemetry Dashboards", desc: "View detailed FPS predictions, Synthetic benchmarks, and Creator workload rendering times." },
    { icon: <Terminal className="text-purple-400 w-6 h-6" />, title: "Neural Architect Reports", desc: "Our AI generates a custom, real-time textual analysis explaining component synergy and upgrade paths." },
    { icon: <ShoppingCart className="text-green-400 w-6 h-6" />, title: "Live Market Pricing", desc: "Instantly scrape live MSRP targets and deal badges from Amazon, Newegg, and Best Buy." },
    { icon: <Settings className="text-cyan-400 w-6 h-6" />, title: "Compatibility Guarantee", desc: "Our Boot Sequence algorithm cross-references chassis clearance, RAM channels, and PSU overhead." },
    { icon: <Activity className="text-orange-400 w-6 h-6" />, title: "Dynamic Bottleneck Detection", desc: "Identify exact CPU/GPU imbalances and 1% low frame stability issues before you spend a single dollar." },
    { icon: <Zap className="text-yellow-400 w-6 h-6" />, title: "Neural Rendering Simulation", desc: "Toggle DLSS, FSR, and Frame Generation to see how AI upscaling impacts your predicted framerates." }
  ];

  const testimonials = [
    {
      quote: "Found my perfect streaming PC, hitting consistent FPS! The compatibility check saved me from buying the wrong motherboard.",
      name: "GamerX",
      role: "Twitch Streamer",
      avatar: "https://i.pravatar.cc/100?img=33",
      icon: <Cpu className="text-purple-400" size={24} />,
      color: "border-purple-500/30 bg-purple-500/10"
    },
    {
      quote: "The AI optimized my $1500 budget perfectly. I got a much better GPU than I originally planned by saving on RAM overhead.",
      name: "Sarah V.",
      role: "Video Editor",
      avatar: "https://i.pravatar.cc/100?img=44",
      icon: <Zap className="text-cyan-400" size={24} />,
      color: "border-cyan-500/30 bg-cyan-500/10"
    },
    {
      quote: "I've never built a PC before. NextGen's Novice path gave me a 4K gaming rig without needing to learn what a PCIe lane is.",
      name: "Alex D.",
      role: "First-Time Builder",
      avatar: "https://i.pravatar.cc/100?img=11",
      icon: <CheckCircle2 className="text-pink-400" size={24} />,
      color: "border-pink-500/30 bg-pink-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-300 font-sans selection:bg-purple-500 selection:text-white">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50 border-b border-white/5 bg-[#090b14]/80 backdrop-blur-md top-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
            <div className="w-4 h-4 bg-[#090b14] rounded-sm transform -rotate-45"></div>
          </div>
          <span className="text-white font-bold text-xl tracking-wider">NEXTGEN<br/><span className="text-sm text-slate-400 leading-3 block">BUILDS</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          <button onClick={() => scrollToSection('how-it-works')} className="text-slate-400 hover:text-white transition-colors cursor-pointer tracking-widest uppercase text-xs">How it Works</button>
          <button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-white transition-colors cursor-pointer tracking-widest uppercase text-xs">Features</button>
          <button onClick={() => scrollToSection('reviews')} className="text-slate-400 hover:text-white transition-colors cursor-pointer tracking-widest uppercase text-xs">Reviews</button>
        </div>

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

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-[#131627] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-white/5 mb-1">
                    <p className="text-xs text-slate-500 mb-0.5">Logged in as</p>
                    <p className="text-sm text-white font-bold truncate">{user.email || user.username}</p>
                  </div>
                  <Link to="/profile" className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-400 transition-colors flex items-center gap-3 font-medium">
                    <User size={16} className="text-slate-400" /> My Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3 font-medium mt-1">
                    <LogOut size={16} className="text-red-400/80" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Login</Link>
              <Link to="/signup" className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION - Keep pc-banner.png here! */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          BUILD YOUR DREAM PC. SMARTER.<br/>
          FASTER. <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500">POWERED BY AI</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-sm md:text-base">
          Experience unparalleled customization with AI that understands budget, bottlenecks, and your unique performance demands.
        </p>

        <div className="flex items-center justify-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-purple-600/30 rounded-full blur-[100px] -z-10"></div>
          {/* Your beloved banner image */}
          <img src={heroPcImage} alt="AI Powered Custom PC" className="h-64 md:h-128 object-contain drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform duration-500 relative z-10" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={handleGetStarted} className="w-full sm:w-auto bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            GET STARTED
          </button>
          <Link to="/demo" className="w-full sm:w-auto bg-transparent border border-white/20 hover:bg-white/5 text-white px-8 py-3 rounded-full font-semibold transition-all text-center block">
            TRY AI PC BUILDER
          </Link>
        </div>
      </main>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-2">The Process</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white">How the Neural Engine Works</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-cyan-500/20 via-purple-500/50 to-pink-500/20 -z-10"></div>

          <div className="bg-[#0b0f19] border border-[#1e293b] p-8 rounded-3xl text-center relative shadow-lg hover:border-cyan-500/30 transition-all group">
            <div className="w-16 h-16 mx-auto bg-[#070815] border-2 border-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform">
              <span className="text-xl font-black text-cyan-400">1</span>
            </div>
            <h4 className="text-white font-bold text-lg mb-3">Define Parameters</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Input your strict budget, target resolution, and primary use-case. Our engine locks in your hardware constraints.</p>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] p-8 rounded-3xl text-center relative shadow-lg hover:border-purple-500/30 transition-all transform md:-translate-y-4 group">
            <div className="w-16 h-16 mx-auto bg-[#070815] border-2 border-purple-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
              <span className="text-xl font-black text-purple-400">2</span>
            </div>
            <h4 className="text-white font-bold text-lg mb-3">AI Synergy Scan</h4>
            <p className="text-slate-400 text-sm leading-relaxed">The neural net scans millions of hardware combinations to assemble a loadout that eliminates system bottlenecks.</p>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] p-8 rounded-3xl text-center relative shadow-lg hover:border-pink-500/30 transition-all group">
            <div className="w-16 h-16 mx-auto bg-[#070815] border-2 border-pink-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(236,72,153,0.3)] group-hover:scale-110 transition-transform">
              <span className="text-xl font-black text-pink-400">3</span>
            </div>
            <h4 className="text-white font-bold text-lg mb-3">The Versus Engine</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Save generated builds to your hangar (User profile) and compare them head-to-head to determine the ultimate performance winner.</p>
          </div>
        </div>
      </section>
      
      {/* 🚀 RESTORED ORIGINAL FEATURES UI (With new text and featureImage) */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-white/5 bg-[#070815]/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
            WHY OUR AI IS YOUR ULTIMATE PC PARTNER
          </h2>
          <div className="hidden md:flex gap-2">
            <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"><ChevronLeft size={20}/></button>
            <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-slate-800/50 transition-colors group cursor-pointer">
              <div className="mb-4 bg-slate-800/80 w-12 h-12 rounded-lg flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm leading-tight">{feature.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
          
          {/* Your beloved Carbon-Fibre Image Card! */}
          <div className="hidden lg:flex bg-linear-to-br from-slate-900 to-[#120f21] border border-purple-500/20 p-6 rounded-2xl items-center justify-center overflow-hidden relative">
            <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <img src={featureImage} alt="Real world benchmarks" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform duration-300" />
          </div>
        </div> 
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="text-center mb-20">
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            READY TO GAME, CREATE, AND CONQUER?
          </h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of users who have optimized their rigs using our neural architecture engine.
          </p>
          <button onClick={handleGetStarted} className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white border border-white/10 px-8 py-4 rounded-full text-base font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] inline-flex items-center gap-2">
            Start Your Build Journey <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, idx) => (
            <div key={idx} className="bg-slate-900/60 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col justify-between shadow-xl hover:bg-slate-800/60 hover:border-white/10 transition-all">
              <div>
                <div className="flex text-yellow-500 mb-6">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <p className="text-white text-base font-medium italic mb-8 leading-relaxed">
                  "{review.quote}"
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden border-2 border-white/10">
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{review.name}</p>
                    <p className="text-slate-500 text-xs">{review.role}</p>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl border ${review.color} flex items-center justify-center shrink-0`}>
                  {review.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 relative z-10 bg-[#090b14]">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-6 h-6 bg-linear-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center transform rotate-45">
            <div className="w-3 h-3 bg-[#090b14] rounded-sm transform -rotate-45"></div>
          </div>
          <span className="text-white font-bold tracking-wider text-sm">NEXTGEN BUILDS</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-bold tracking-widest uppercase">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Discord Community</a>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition-colors"><Twitter size={18} /></a>
          <a href="#" className="hover:text-pink-400 transition-colors"><Instagram size={18} /></a>
        </div>
      </footer>
    </div>
  );
};

export default Home;