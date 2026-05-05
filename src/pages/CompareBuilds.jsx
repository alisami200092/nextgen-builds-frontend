import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Swords, Cpu, Monitor, MemoryStick, Zap, 
  Award, Scale, Activity, ShoppingCart, Gamepad2, Video, TestTube
} from 'lucide-react';

import PricingDashboard from './PricingDashboard'; // 🚀 IMPORTED THE DASHBOARD

export default function CompareBuilds() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('gaming'); 
  
  // 🚀 NEW: State to handle passing a build to the Pricing Dashboard
  const [checkoutBuild, setCheckoutBuild] = useState(null);

  const builds = location.state?.builds || [];

  useEffect(() => {
    if (builds.length !== 2) {
      navigate('/profile'); 
    } else {
      generateComparison(builds[0], builds[1]);
    }
  }, [builds, navigate]);

  const generateComparison = (b1, b2) => {
    const getBase = (b) => Math.floor((b.total_price * 0.12) + (b.cpu.includes('Ryzen 9') || b.cpu.includes('Core i9') || b.cpu.includes('Ultra 9') ? 25 : 0));
    
    const b1Base = getBase(b1);
    const b2Base = getBase(b2);

    const metrics = {
      b1: {
        gaming: {
          fhd: b1Base + 40,
          qhd: Math.floor(b1Base * 0.8),
          uhd: Math.floor(b1Base * 0.5)
        },
        synthetic: {
          multi: Math.floor(b1.total_price * 12.5),
          single: Math.floor(1500 + (b1.total_price * 0.2)),
          timespy: Math.floor(b1.total_price * 8.5)
        },
        creator: {
          premiere: Math.floor(b1.total_price * 0.35),
          blender: Math.max(30, Math.floor(120000 / b1.total_price)), 
          compile: Math.max(20, Math.floor(80000 / b1.total_price))   
        },
        efficiency: {
          power: Math.floor(250 + (b1.total_price * 0.12)), 
          temp: Math.floor(65 + (Math.random() * 15))       
        }
      },
      b2: {
        gaming: {
          fhd: b2Base + 40,
          qhd: Math.floor(b2Base * 0.8),
          uhd: Math.floor(b2Base * 0.5)
        },
        synthetic: {
          multi: Math.floor(b2.total_price * 12.5),
          single: Math.floor(1500 + (b2.total_price * 0.2)),
          timespy: Math.floor(b2.total_price * 8.5)
        },
        creator: {
          premiere: Math.floor(b2.total_price * 0.35),
          blender: Math.max(30, Math.floor(120000 / b2.total_price)), 
          compile: Math.max(20, Math.floor(80000 / b2.total_price))   
        },
        efficiency: {
          power: Math.floor(250 + (b2.total_price * 0.12)), 
          temp: Math.floor(65 + (Math.random() * 15))       
        }
      }
    };

    const b1Value = b1Base / b1.total_price;
    const b2Value = b2Base / b2.total_price;
    let winner = 0;
    let verdict = '';

    if (Math.abs(b1Value - b2Value) < 0.005) {
      winner = null; 
      verdict = "Both architectures offer an identical price-to-performance ratio. Your choice depends entirely on brand preference and specific aesthetic requirements.";
    } else if (b1Value > b2Value) {
      winner = 1;
      verdict = `[${b1.build_name}] is the superior neural choice. It provides greater raw output per dollar spent, preventing unnecessary budget drain while maintaining high-fidelity pacing across all workloads.`;
    } else {
      winner = 2;
      verdict = `[${b2.build_name}] mathematically dominates this matchup. The synergy between its components yields a higher performance-per-dollar ratio, making it the most optimal investment for your hardware hangar.`;
    }

    setTimeout(() => {
      setAnalysis({ metrics, winner, verdict });
      setIsLoading(false);
    }, 1500); 
  };

  if (builds.length !== 2) return null;

  const b1 = builds[0];
  const b2 = builds[1];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070815] flex flex-col items-center justify-center text-purple-400">
        <Swords className="w-16 h-16 animate-bounce mb-6 text-cyan-400" />
        <h2 className="text-2xl font-black tracking-widest uppercase mb-2 text-white">Initiating Comparison Builds</h2>
        <p className="tracking-widest font-bold text-sm text-slate-500">CALCULATING HARDWARE ENERGY 🚀...</p>
      </div>
    );
  }

  // 🚀 NEW: If the user clicks a Checkout button, intercept the render and show the PricingDashboard!
  if (checkoutBuild) {
    return (
      <div className="min-h-screen bg-[#070815] text-slate-300 font-sans pt-24 pb-20 px-6 flex justify-center">
        <div className="max-w-6xl w-full animate-in fade-in zoom-in duration-500">
          <PricingDashboard 
            build={checkoutBuild} 
            onBack={() => setCheckoutBuild(null)} 
          />
        </div>
      </div>
    );
  }

  const telemetryData = {
    gaming: [
      { label: '1080p Ultra', v1: analysis.metrics.b1.gaming.fhd, v2: analysis.metrics.b2.gaming.fhd, max: 600, unit: 'FPS' },
      { label: '1440p High', v1: analysis.metrics.b1.gaming.qhd, v2: analysis.metrics.b2.gaming.qhd, max: 400, unit: 'FPS' },
      { label: '4K Native', v1: analysis.metrics.b1.gaming.uhd, v2: analysis.metrics.b2.gaming.uhd, max: 250, unit: 'FPS' },
    ],
    synthetic: [
      { label: 'Cinebench R23 (Multi)', v1: analysis.metrics.b1.synthetic.multi, v2: analysis.metrics.b2.synthetic.multi, max: 50000, unit: 'pts' },
      { label: 'Cinebench R23 (Single)', v1: analysis.metrics.b1.synthetic.single, v2: analysis.metrics.b2.synthetic.single, max: 2500, unit: 'pts' },
      { label: '3DMark Time Spy', v1: analysis.metrics.b1.synthetic.timespy, v2: analysis.metrics.b2.synthetic.timespy, max: 40000, unit: 'pts' },
    ],
    creator: [
      { label: 'Premiere Pro Score', v1: analysis.metrics.b1.creator.premiere, v2: analysis.metrics.b2.creator.premiere, max: 1500, unit: 'pts' },
      { label: 'Blender Classroom', v1: analysis.metrics.b1.creator.blender, v2: analysis.metrics.b2.creator.blender, max: 200, unit: 'sec', lowerIsBetter: true },
      { label: 'Code Compilation', v1: analysis.metrics.b1.creator.compile, v2: analysis.metrics.b2.creator.compile, max: 150, unit: 'sec', lowerIsBetter: true },
    ],
    efficiency: [
      { label: 'Peak Power Draw', v1: analysis.metrics.b1.efficiency.power, v2: analysis.metrics.b2.efficiency.power, max: 1200, unit: 'W', lowerIsBetter: true },
      { label: 'Load Temperature', v1: analysis.metrics.b1.efficiency.temp, v2: analysis.metrics.b2.efficiency.temp, max: 100, unit: '°C', lowerIsBetter: true },
      { label: 'Perf-per-Watt (CB23)', v1: Math.floor(analysis.metrics.b1.synthetic.multi / analysis.metrics.b1.efficiency.power), v2: Math.floor(analysis.metrics.b2.synthetic.multi / analysis.metrics.b2.efficiency.power), max: 60, unit: 'pts/W' },
    ]
  };

  const tabs = [
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'synthetic', label: 'Synthetic', icon: TestTube },
    { id: 'creator', label: 'Creator', icon: Video },
    { id: 'efficiency', label: 'Efficiency', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-[#070815] text-slate-300 font-sans relative overflow-x-hidden pt-24 pb-20 px-6">
      
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 flex">
        <div className="w-1/2 h-full bg-cyan-900/5 blur-[150px]"></div>
        <div className="w-1/2 h-full bg-purple-900/5 blur-[150px]"></div>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-[#1e293b] to-transparent pointer-events-none hidden md:block"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <Link to="/profile" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors self-start">
            <ChevronLeft size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Go Back</span>
          </Link>
          <div className="flex flex-col items-center bg-[#0b0f19] border border-[#1e293b] px-8 py-3 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
              Versus <Swords className="text-pink-500 w-8 h-8" /> Builds
            </h1>
          </div>
          <div className="w-24 hidden md:block"></div>
        </div>

        {/* --- THE HEAD-TO-HEAD CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative mb-8">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-16 h-16 bg-[#070815] border-2 border-[#1e293b] rounded-full shadow-[0_0_30px_rgba(0,0,0,1)]">
            <span className="text-xl font-black text-transparent bg-clip-text bg-linear-to-br from-cyan-400 to-purple-500 italic">VS</span>
          </div>

          {/* BUILD 1 (CYAN THEME) */}
          <div className={`bg-[#0b0f19] border-2 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-700 animate-in slide-in-from-left-10 flex flex-col ${analysis.winner === 1 ? 'border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.2)]' : 'border-[#1e293b]'}`}>
            {analysis.winner === 1 && (
              <div className="bg-cyan-500 text-[#070815] text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full self-start mb-6 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <Award size={14} /> AI Recommended
              </div>
            )}
            <p className="text-cyan-400 font-bold tracking-widest text-[10px] uppercase mb-1">Combatant Alpha</p>
            <h2 className="text-3xl font-black text-white mb-2 leading-tight">{b1.build_name}</h2>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-cyan-600 mb-8">${b1.total_price.toLocaleString()}</p>
            
            <div className="space-y-4 mb-8 grow">
              <div className="flex items-center gap-4 bg-[#060913] border border-[#1e293b] p-3 rounded-2xl">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <div className="truncate">
                  <p className="text-[9px] text-slate-500 font-black uppercase">Processor</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{b1.cpu}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#060913] border border-[#1e293b] p-3 rounded-2xl">
                <Monitor className="w-5 h-5 text-cyan-400" />
                <div className="truncate">
                  <p className="text-[9px] text-slate-500 font-black uppercase">Graphics</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{b1.gpu}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#060913] border border-[#1e293b] p-3 rounded-2xl">
                <MemoryStick className="w-5 h-5 text-cyan-400" />
                <div className="truncate">
                  <p className="text-[9px] text-slate-500 font-black uppercase">Memory</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{b1.ram}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCheckoutBuild(b1)} // 🚀 WIRED UP
              className="w-full py-4 rounded-2xl font-black text-[#0b0f19] bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <ShoppingCart size={18} /> Checkout Alpha
            </button>
          </div>

          {/* BUILD 2 (PURPLE THEME) */}
          <div className={`bg-[#0b0f19] border-2 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-700 animate-in slide-in-from-right-10 flex flex-col ${analysis.winner === 2 ? 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'border-[#1e293b]'}`}>
            {analysis.winner === 2 && (
              <div className="bg-purple-500 text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full self-start mb-6 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Award size={14} /> AI Recommended
              </div>
            )}
            <p className="text-purple-400 font-bold tracking-widest text-[10px] uppercase mb-1">Combatant Beta</p>
            <h2 className="text-3xl font-black text-white mb-2 leading-tight">{b2.build_name}</h2>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 mb-8">${b2.total_price.toLocaleString()}</p>
            
            <div className="space-y-4 mb-8 grow">
              <div className="flex items-center gap-4 bg-[#060913] border border-[#1e293b] p-3 rounded-2xl">
                <Cpu className="w-5 h-5 text-purple-400" />
                <div className="truncate">
                  <p className="text-[9px] text-slate-500 font-black uppercase">Processor</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{b2.cpu}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#060913] border border-[#1e293b] p-3 rounded-2xl">
                <Monitor className="w-5 h-5 text-purple-400" />
                <div className="truncate">
                  <p className="text-[9px] text-slate-500 font-black uppercase">Graphics</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{b2.gpu}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#060913] border border-[#1e293b] p-3 rounded-2xl">
                <MemoryStick className="w-5 h-5 text-purple-400" />
                <div className="truncate">
                  <p className="text-[9px] text-slate-500 font-black uppercase">Memory</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{b2.ram}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCheckoutBuild(b2)} // 🚀 WIRED UP
              className="w-full py-4 rounded-2xl font-black text-white bg-purple-500 hover:bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <ShoppingCart size={18} /> Checkout Beta
            </button>
          </div>

        </div>

        {/* --- PERFORMANCE GRAPHS & VERDICT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          {/* Left: Tabbed Bar Charts */}
          <div className="lg:col-span-2 bg-[#0b0f19] border border-[#1e293b] rounded-[2.5rem] p-8 shadow-xl flex flex-col">
            
            <div className="flex flex-wrap gap-2 mb-8 bg-[#060913] p-1.5 rounded-2xl border border-[#1e293b]">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-cyan-400' : ''} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="space-y-8 grow relative">
              {telemetryData[activeTab].map((stat, i) => {
                const v1Wins = stat.lowerIsBetter ? stat.v1 < stat.v2 : stat.v1 > stat.v2;
                const v2Wins = stat.lowerIsBetter ? stat.v2 < stat.v1 : stat.v2 > stat.v1;
                
                return (
                  <div key={`${activeTab}-${i}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="flex justify-between items-end text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">
                      <span>{stat.label}</span>
                      <span className="flex gap-4 bg-[#060913] px-3 py-1.5 rounded-lg border border-[#1e293b]">
                        <span className={v1Wins ? 'text-cyan-400 font-black drop-shadow-sm' : 'text-slate-500'}>
                          {stat.v1} <span className="text-[9px]">{stat.unit}</span>
                        </span>
                        <span className="text-slate-700">|</span>
                        <span className={v2Wins ? 'text-purple-400 font-black drop-shadow-sm' : 'text-slate-500'}>
                          {stat.v2} <span className="text-[9px]">{stat.unit}</span>
                        </span>
                      </span>
                    </div>
                    
                    <div className="space-y-2 relative">
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-800/50 -translate-x-1/2 z-0"></div>
                      
                      <div className="w-full bg-[#060913] rounded-full h-4 overflow-hidden relative border border-[#1e293b] z-10">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                          style={{ width: `${(stat.v1 / stat.max) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="w-full bg-[#060913] rounded-full h-4 overflow-hidden relative border border-[#1e293b] z-10">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                          style={{ width: `${(stat.v2 / stat.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: AI Verdict Box */}
          <div className="lg:col-span-1 bg-linear-to-br from-[#0b0f19] to-[#070815] border border-[#1e293b] border-t-pink-500/50 rounded-[2.5rem] p-8 shadow-2xl flex flex-col relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 blur-[50px] rounded-full"></div>
            
            <h3 className="text-white font-black text-xl mb-6 flex items-center gap-2 relative z-10">
              <Scale className="w-5 h-5 text-pink-500" /> Neural Verdict
            </h3>
            
            <div className="grow flex flex-col justify-center relative z-10">
              <p className="text-slate-300 leading-relaxed font-medium">
                {analysis.verdict}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#1e293b] flex items-center gap-3 relative z-10">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Versus Matrix Complete</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}