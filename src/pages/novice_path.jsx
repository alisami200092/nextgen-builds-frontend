import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Gamepad2, Briefcase, Video, Monitor, Wifi, Cable, 
  Target, Cpu, Layers, Microchip, Zap, Box, ShoppingCart, Share2, 
  Download, Activity, CheckCircle2, Crosshair, Server, Settings, RefreshCw,
  Sparkles, Lock 
} from 'lucide-react';

import PricingDashboard from './PricingDashboard';

export default function NovicePath() {
  const navigate = useNavigate();

  const [budget, setBudget] = useState(1500);
  const [selectedPurposes, setSelectedPurposes] = useState(['Gaming']);
  const [resolution, setResolution] = useState('1440p');
  const [needsWifi, setNeedsWifi] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePurposeToggle = (purpose) => {
    if (selectedPurposes.includes(purpose)) {
      if (selectedPurposes.length > 1) { 
        setSelectedPurposes(selectedPurposes.filter(p => p !== purpose));
      }
    } else {
      setSelectedPurposes([...selectedPurposes, purpose]);
    }
  };

  const handleFindMyPC = async () => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    const buildData = { budget, purposes: selectedPurposes, resolution, needsWifi };

    try {
      const response = await fetch('http://localhost:5000/api/build/novice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate build.');

      setTimeout(() => {
        const realResult = {
          User_Budget: budget,
          CPU: data.cpu,
          GPU: data.gpu,
          Motherboard: data.motherboard,
          RAM: data.ram,
          PSU: data.psu || '750W 80+ Bronze',
          Case: data.case || 'Standard ATX Case',
          Total_Price: parseInt(data.total_price),
          PS_Wattage: parseInt((data.psu || "750").match(/\d+/)?.[0] || 750),
          image_url: data.image_url,
          
          // ==========================================
          // ML DATA CAPTURE
          // ==========================================
          specs: {
            cpuCores: data.cpu_core || 6,
            cpuThreads: data.cpu_thre || 12,
            cpuBoost: data.cpu_boos || 4.2,
            cpuL3: data.cpu_l3_c || 16,
            gpuVram: data.gpu_vram || 8,
            gpuBoost: data.gpu_boos || 2000,
            gpuShaders: data.gpu_shad || 3584,
            ramCapacity: data.ram_cap || 16,
            ramSpeed: data.ram_speed_mhz || 3200
          }
        };
        setResult(realResult);
        setIsProcessing(false);
      }, 1500);

    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const purposeOptions = [
    { id: 'Gaming', icon: Gamepad2 },
    { id: 'Work', icon: Briefcase },
    { id: 'Content Creation', icon: Video },
    { id: 'Office', icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-[#070815] text-slate-300 font-sans relative overflow-x-hidden flex flex-col items-center justify-center p-6 pb-20">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar / Back Button */}
      <div className="absolute top-6 left-8 z-20">
        <Link to="/get-started" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
          <span className="text-sm font-semibold">Back</span>
        </Link>
      </div>

      <style>{`
        @keyframes aiWaveIdle {
          0%, 100% { transform: scaleY(0.7); opacity: 0.6; }
          50% { transform: scaleY(1.1); opacity: 1; }
        }
        @keyframes aiWaveActive {
          0%, 100% { transform: scaleY(0.4); opacity: 0.8; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
      `}</style>

      {/* --- FORM & EQUALIZER WRAPPER --- */}
      {!result && (
        <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in duration-500 z-10">
          
          <div className="w-full flex flex-col items-center justify-center mb-10 h-28">
            <p className={`font-black text-sm mb-6 tracking-widest uppercase transition-colors duration-500 ${isProcessing ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-slate-400'}`}>
              {isProcessing ? "Analyzing Hardware Constraints..." : "AI Ready & Waiting"}
            </p>
            
            <div className="flex items-end justify-center gap-1 h-16 w-full px-4">
              {[
                20, 25, 35, 45, 30, 20, 35, 65, 85, 100, 75, 50, 30, 20, 15, 12, 
                10, 15, 20, 15, 10, 12, 18, 25, 18, 12, 15, 20, 15, 12,
                20, 40, 70, 90, 100, 50, 45, 40, 35, 35, 30, 28, 25, 20, 15, 10, 8, 5, 2, 1
              ].map((baseHeight, i) => {
                const hue = 190 + (i * 2);
                return (
                  <div
                    key={i}
                    className="w-1 rounded-t-sm transition-all duration-300"
                    style={{
                      backgroundColor: isProcessing ? `hsl(${hue}, 100%, 65%)` : `hsl(${hue}, 50%, 40%)`, 
                      height: `${baseHeight}%`, 
                      animation: isProcessing ? `aiWaveActive 0.5s ease-in-out infinite` : `aiWaveIdle 2s ease-in-out infinite`,
                      animationDelay: `${i * (isProcessing ? 0.03 : 0.08)}s`, 
                      boxShadow: isProcessing ? `0 0 15px hsl(${hue}, 100%, 60%)` : `0 0 5px hsl(${hue}, 40%, 20%)`,
                      transformOrigin: 'bottom'
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] border-t-purple-500/30 rounded-[2.5rem] p-8 md:p-12 w-full shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <h2 className="text-3xl font-extrabold text-white mb-10 tracking-tight">Tell Us Your Needs</h2>

            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <label className="text-sm font-bold text-slate-400">Your Budget</label>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 drop-shadow-sm">
                  ${budget}
                </span>
              </div>
              <div className="relative w-full">
                {/* 🚀 FIXED SLIDER LOGIC FOR $4000 MAX: Divisor changed to 36 */}
                <input 
                  type="range" min="400" max="4000" step="100" value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-purple-500 z-10 relative outline-none"
                  style={{ background: `linear-gradient(to right, #22d3ee 0%, #a855f7 ${(budget - 400) / 36}%, #1e293b ${(budget - 400) / 36}%, #1e293b 100%)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-3 font-semibold">
                <span>$400</span>
                <span>$4000+</span>
              </div>
            </div>

            <div className="mb-12">
              <label className="text-sm font-bold text-slate-400 block mb-4">Primary Usage</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {purposeOptions.map((option) => {
                  const isSelected = selectedPurposes.includes(option.id);
                  const Icon = option.icon;
                  return (
                    <div 
                      key={option.id} onClick={() => handlePurposeToggle(option.id)}
                      className={`flex flex-col items-center justify-center p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        isSelected ? 'border-cyan-500/50 bg-cyan-900/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.15)] scale-105' : 'border-[#1e293b] bg-[#070815] hover:bg-[#161a2b] hover:border-slate-600'
                      }`}
                    >
                      <Icon size={28} className={`mb-3 transition-colors ${isSelected ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-slate-500'}`} />
                      <span className={`text-xs font-bold text-center ${isSelected ? 'text-white' : 'text-slate-500'}`}>{option.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <label className="text-sm font-bold text-slate-400 block mb-4">Target Resolution</label>
                <div className="flex bg-[#070815] rounded-2xl p-1.5 border border-[#1e293b]">
                  {['1080p', '1440p', '4K UHD'].map(res => (
                    <button 
                      key={res} onClick={() => setResolution(res)}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                        resolution === res ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]' : 'text-slate-500 hover:text-slate-300 hover:bg-[#0b0f19] border border-transparent'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-400 block mb-4">Networking Need</label>
                <div className="flex bg-[#070815] rounded-2xl p-1.5 border border-[#1e293b]">
                  <button onClick={() => setNeedsWifi(true)} className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all ${needsWifi ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]' : 'text-slate-500 hover:text-slate-300 hover:bg-[#0b0f19] border border-transparent'}`}>
                    <Wifi size={16} /> WiFi
                  </button>
                  <button onClick={() => setNeedsWifi(false)} className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all ${!needsWifi ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]' : 'text-slate-500 hover:text-slate-300 hover:bg-[#0b0f19] border border-transparent'}`}>
                    <Cable size={16} /> Ethernet
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-[#1F0D0D] border border-red-900 border-t-red-500/50 rounded-2xl text-red-200 text-sm flex items-center gap-3">
                <Target size={20} className="text-red-500" /> {error}
              </div>
            )}

            <button 
              onClick={handleFindMyPC}
              disabled={isProcessing || selectedPurposes.length === 0}
              className="w-full bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg tracking-wide"
            >
              {isProcessing ? 'COMPILING NEURAL PATHWAYS...' : 'FIND MY PERFECT PC'}
            </button>
          </div>
        </div>
      )}

      {/* --- RESULTS AREA --- */}
      {result && !isProcessing && (
        <div className="relative z-10 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700 mt-4 flex flex-col items-center">
          <ResultCard build={result} onReset={() => setResult(null)} />
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// --- RESULT CARD (MATRIX UPGRADED) ---
// ==============================================================================
function ResultCard({ build, onReset }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [aiMatrix, setAiMatrix] = useState(null); 
  const [showPricing, setShowPricing] = useState(false); 
  
  // 🚀 Added State for Saving/Sharing
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fallbackMatrix = {
    'Low': { '1080p': {avg: 200, lows: 150}, '1440p': {avg: 150, lows: 110}, '4K UHD': {avg: 90, lows: 60} },
    'Medium': { '1080p': {avg: 180, lows: 130}, '1440p': {avg: 130, lows: 95}, '4K UHD': {avg: 80, lows: 55} },
    'High': { '1080p': {avg: 150, lows: 110}, '1440p': {avg: 110, lows: 80}, '4K UHD': {avg: 65, lows: 45} },
    'Ultra': { '1080p': {avg: 130, lows: 90}, '1440p': {avg: 90, lows: 65}, '4K UHD': {avg: 50, lows: 35} },
  };

  const handleDeepAnalysis = async () => {
    setIsScanning(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/predict-fps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...build.specs, upscaling: 'Off (Native)', frameGen: 'Off' })
      });
      
      const data = await response.json();
      
      if (data.ai_matrix) {
        setAiMatrix(data.ai_matrix);
      } else {
        setAiMatrix(fallbackMatrix);
      }
    } catch (error) {
      console.error("AI Prediction failed:", error);
      setAiMatrix(fallbackMatrix);
    }

    setIsScanning(false);
    setShowAnalysis(true);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  // 🚀 New Function: Save Build
  const handleSaveBuild = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setActionMessage({ type: 'error', text: 'Please log in to save builds to your hangar.' });
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        build_name: "Novice AI Build",
        total_price: build.Total_Price,
        cpu: build.CPU,
        gpu: build.GPU,
        motherboard: build.Motherboard,
        ram: build.RAM,
        psu: build.PSU,
        chassis: build.Case,
        image_url: build.image_url
      };

      const response = await fetch('http://localhost:5000/api/builds/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to save build.");
      
      setActionMessage({ type: 'success', text: 'Build successfully saved to Hangar!' });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  // 🚀 New Function: Share Build
  const handleShare = () => {
    const shareText = `Check out my AI-Generated PC Build!\n\nCPU: ${build.CPU}\nGPU: ${build.GPU}\nRAM: ${build.RAM}\nTotal: $${build.Total_Price}\n\nBuilt with NextGen Builds.`;
    navigator.clipboard.writeText(shareText);
    setActionMessage({ type: 'success', text: 'Build details copied to clipboard!' });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const estCpu = Math.round(build.Total_Price * 0.25);
  const estGpu = Math.round(build.Total_Price * 0.40);
  const estMobo = Math.round(build.Total_Price * 0.12);
  const estRam = Math.round(build.Total_Price * 0.08);
  const estPsu = Math.round(build.Total_Price * 0.08);
  const estCase = build.Total_Price - (estCpu + estGpu + estMobo + estRam + estPsu);

  const majorParts = [
    { id: 'gpu', label: 'Graphics Card', name: build.GPU, price: estGpu, icon: Monitor, color: 'text-cyan-400', bg: 'bg-cyan-500/10', img: build.image_url },
    { id: 'cpu', label: 'Processor', name: build.CPU, price: estCpu, icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'mobo', label: 'Motherboard', name: build.Motherboard, price: estMobo, icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'ram', label: 'Memory', name: build.RAM, price: estRam, icon: Microchip, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'psu', label: 'Power Supply', name: build.PSU, price: estPsu, icon: Zap, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { id: 'case', label: 'Chassis', name: build.Case, price: estCase, icon: Box, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  ];

  if (showPricing) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 mt-4">
        <PricingDashboard 
          build={build} 
          onBack={() => setShowPricing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-3xl font-black text-white tracking-tight drop-shadow-md">AI Recommended Loadout</h3>
            <button onClick={onReset} className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4 font-bold transition-colors">
              Edit Requirements
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {majorParts.map((part) => (
              <div key={part.id} className="p-6 bg-[#0b0f19] border border-[#1e293b] border-t-white/10 rounded-4xl hover:border-purple-500/30 transition-colors flex flex-col h-full shadow-lg group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`relative w-16 h-16 rounded-2xl ${part.bg} border border-[#1e293b] flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden`}>
                    {part.img && part.img !== "NaN" ? (
                      <img src={part.img} alt={part.name} className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    ) : (
                      <part.icon className={`w-8 h-8 ${part.color}`} />
                    )}
                  </div>
                  <span className="text-xs font-black tracking-widest text-slate-500 uppercase bg-[#070815] border border-[#1e293b] px-3 py-1 rounded-full">
                    {part.label}
                  </span>
                </div>
                <div className="grow mb-6">
                  <p className="text-lg font-bold text-white leading-tight">{part.name}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-[#1e293b] flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Est. Price</span>
                  <span className="text-xl font-black text-white">${part.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 p-8 bg-[#0b0f19] border border-[#1e293b] border-t-purple-500/30 rounded-[2.5rem] shadow-2xl flex flex-col h-full">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" /> Build Summary
            </h3>
            
            <div className="mb-8 p-6 bg-[#070815] rounded-3xl border border-[#1e293b] text-center shadow-inner">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Total System Cost</p>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                ${build.Total_Price.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-2 font-medium">
                <Activity className="w-4 h-4 text-cyan-400"/> Under your ${build.User_Budget} budget
              </p>
            </div>

            <div className="space-y-4 mb-8 grow">
              {majorParts.map(part => (
                 <div key={`list-${part.id}`} className="flex justify-between items-start text-sm border-b border-[#1e293b] pb-3">
                    <span className="text-slate-500 shrink-0 mr-4">{part.label}</span>
                    <span className="text-slate-200 font-medium text-right line-clamp-2">{part.name}</span>
                 </div>
              ))}
            </div>

            <div className="space-y-3 mt-auto">
              {/* 🚀 ADDED: Success/Error Message Display */}
              {actionMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold text-center border animate-in fade-in duration-300 ${actionMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                  {actionMessage.text}
                </div>
              )}

              {/* 🚀 ADDED: Save & Share Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handleSaveBuild}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Build'}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 py-3 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              <button 
                onClick={() => setShowPricing(true)} 
                className="w-full py-4 rounded-2xl font-black text-white bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 text-lg mt-2"
              >
                <ShoppingCart className="w-5 h-5" /> Checkout Build
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- THE DEEP ANALYSIS TRIGGER --- */}
      {!showAnalysis && (
        <button 
          onClick={handleDeepAnalysis}
          disabled={isScanning}
          className={`w-full mt-6 py-6 rounded-4xl border-2 transition-all duration-500 flex flex-col items-center justify-center gap-2 ${
            isScanning 
              ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)]' 
              : 'bg-[#0b0f19] border-[#1e293b] hover:border-purple-500/30 hover:bg-[#161a2b] shadow-lg'
          }`}
        >
          {isScanning ? (
            <>
              <Crosshair className="w-8 h-8 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-purple-400 font-black tracking-widest animate-pulse">Scanning Hardware Matrix...</span>
            </>
          ) : (
            <>
              <Server className="w-8 h-8 text-slate-400" />
              <span className="text-white font-black tracking-widest uppercase">Initialize Deep System Analysis</span>
              <span className="text-slate-500 text-sm font-bold">FPS Predictions • Bottleneck Check • Compatibility Matrix</span>
            </>
          )}
        </button>
      )}

      {/* --- THE DEEP ANALYSIS DASHBOARD --- */}
      {showAnalysis && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full mt-4">
          <DeepAnalysisDashboard build={build} initialAiMatrix={aiMatrix} />
        </div>
      )}

    </div>
  );
}

// ==============================================================================
// --- ALL 20 GAMES DATABASE
// ==============================================================================
const ALL_GAMES = [
  { name: "Cyberpunk 2077", baseWeight: 1.0, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Alan Wake 2", baseWeight: 0.85, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Red Dead 2", baseWeight: 0.78, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Starfield", baseWeight: 1.10, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Hogwarts Legacy", baseWeight: 1.15, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Flight Simulator", baseWeight: 0.90, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "GTA V", baseWeight: 1.20, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Warzone 2.0", baseWeight: 1.65, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Elden Ring", baseWeight: 1.05, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Fortnite", baseWeight: 1.20, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "The Witcher 3", baseWeight: 1.70, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Baldur's Gate 3", baseWeight: 1.35, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Rust", baseWeight: 2.10, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Destiny 2", baseWeight: 2.60, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Call of Duty: MW3", baseWeight: 2.10, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Doom Eternal", baseWeight: 4.50, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Valorant", baseWeight: 7.50, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Counter-Strike 2", baseWeight: 2.60, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Apex Legends", baseWeight: 3.20, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Overwatch 2", baseWeight: 4.10, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Rainbow Six", baseWeight: 5.60, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" }
];

const getRandomGames = () => [...ALL_GAMES].sort(() => 0.5 - Math.random()).slice(0, 4);

// ==============================================================================
// --- V4.5 DEEP ANALYSIS DASHBOARD (Matrix Driven + True Bottleneck Logic) ---
// ==============================================================================
function DeepAnalysisDashboard({ build, initialAiMatrix }) {
  const [activeGames, setActiveGames] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  
  // CORE STATES
  const [localMatrix, setLocalMatrix] = useState(initialAiMatrix);
  const [graphicsPreset, setGraphicsPreset] = useState('Ultra');

  // NEW: NEURAL RENDERING STATES
  const [upscaling, setUpscaling] = useState('Off (Native)'); 
  const [frameGen, setFrameGen] = useState('Off'); 

  // --- HARDWARE LOGIC ---
  const gpuName = build.GPU.toLowerCase();
  const isNvidia = gpuName.includes('nvidia') || gpuName.includes('rtx');
  const isIntel = gpuName.includes('intel') || gpuName.includes('arc');
  
  const upscalerName = isNvidia ? 'DLSS 4' : isIntel ? 'XeSS 2' : 'FSR 4';
  const supportsFrameGen = /(rtx [45]0|rx [79]0)/i.test(gpuName);

  useEffect(() => {
    setActiveGames(getRandomGames());
  }, []);

  // --- LIVE RE-FETCH WHEN TOGGLES CHANGE ---
  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    const fetchUpdatedMatrix = async () => {
      setIsRecalculating(true);
      try {
        const response = await fetch('http://localhost:5000/api/predict-fps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...build.specs, 
            upscaling: upscaling, 
            frameGen: frameGen 
          })
        });
        const data = await response.json();
        if (data.ai_matrix) setLocalMatrix(data.ai_matrix);
      } catch (error) {
        console.error("Neural Re-calculation failed:", error);
      }
      setIsRecalculating(false);
    };

    fetchUpdatedMatrix();
  }, [upscaling, frameGen]);

  const shuffleGames = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setActiveGames(getRandomGames());
      setIsRefreshing(false);
    }, 400); 
  };

  // ==========================================
  // DYNAMIC BOTTLENECK ENGINE
  // ==========================================
  const estCpu = Math.round(build.Total_Price * 0.25);
  const estGpu = Math.round(build.Total_Price * 0.40);
  
  const ratio = estCpu / (estGpu || 1); 
  const variance = Math.abs(ratio - 0.55);
  const bottleneckPercent = Math.min(35, Math.max(1, Math.round(variance * 60)));
  const isHealthy = bottleneckPercent < 8;

  let bottleneckLabel = "Perfectly Balanced";
  if (!isHealthy) {
    bottleneckLabel = ratio < 0.55 ? "CPU Bottleneck" : "GPU Bottleneck";
  }
  
  const compatPercent = 98;
  
  const currentAiData = localMatrix ? localMatrix[graphicsPreset] : null;

  const baseFps = currentAiData ? currentAiData['1440p'].avg : 144;
  const lowsFps = currentAiData ? currentAiData['1440p'].lows : 85;

  const stabilityRatio = Math.max(0, Math.min(100, Math.round((lowsFps / baseFps) * 100))) || 75;

  const getStabilityColor = (ratio) => {
    if (ratio >= 80) return "#22c55e"; 
    if (ratio >= 60) return "#eab308"; 
    return "#ef4444"; 
  };
  const stabilityColor = getStabilityColor(stabilityRatio);

  const getGraphY = (fps) => {
    const maxFps = 800;
    const minY = 20;
    const maxY = 180;
    return maxY - (Math.min(fps, maxFps) / maxFps) * (maxY - minY);
  };
  const avgY = getGraphY(baseFps);
  const lowY = getGraphY(lowsFps);

  const renderCircle = (percent, color, radius = 55, delay = "0s") => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * percent) / 100;
    return (
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90 pointer-events-none">
        <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="10" />
        <circle 
          cx="50%" cy="50%" r={radius} fill="transparent" 
          stroke={color} 
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="transition-all ease-out"
          style={{ 
            filter: `drop-shadow(0px 0px 8px ${color})`,
            animation: `drawCircle 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay} forwards` 
          }}
        />
        <style>{`
          @keyframes drawCircle {
            to { stroke-dashoffset: ${offset}; }
          }
        `}</style>
      </svg>
    );
  };

  return (
    <div className="w-full bg-[#060913] border border-purple-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>

      {/* --- HEADER WITH PRESET TOGGLES --- */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b border-[#1e293b] pb-6 relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
        <div className="flex items-center gap-3">
          <Server className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Diagnostic <span className="text-purple-400">Terminal</span></h2>
        </div>

        {/* THE GRAPHICS PRESET SELECTOR */}
        <div className="flex items-center gap-3 bg-[#0b0f19] border border-[#1e293b] p-1.5 rounded-2xl shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <Settings className="w-4 h-4 text-slate-500 ml-2 shrink-0" />
          {['Low', 'Medium', 'High', 'Ultra'].map((p) => (
            <button
              key={p}
              onClick={() => setGraphicsPreset(p)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                graphicsPreset === p
                  ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)] border border-purple-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-[#161a2b]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* --- NEW: NEURAL ENGINE CONTROL PANEL (Purple Accent) --- */}
      <div className="mb-10 bg-[#0b0f19] border border-[#1e293b] border-l-purple-500/50 border-l-4 rounded-2xl p-6 relative z-10 shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Rendering Subsystem</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upscaling Toggle */}
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">AI Super Resolution ({upscalerName})</p>
            <div className="flex gap-2 bg-[#060913] p-1.5 rounded-xl border border-[#1e293b]">
              {['Off (Native)', 'Quality', 'Performance'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setUpscaling(mode)}
                  className={`flex-1 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                    upscaling === mode
                      ? 'bg-purple-600/20 text-purple-400 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)] border border-purple-500/30'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-[#161a2b]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Generation Toggle */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs text-slate-500 font-bold uppercase">AI Frame Generation</p>
              {!supportsFrameGen && (
                <span className="text-[9px] text-red-400 font-bold tracking-widest flex items-center gap-1">
                  <Lock className="w-3 h-3" /> HARDWARE LOCKED
                </span>
              )}
            </div>
            <div className="flex gap-2 bg-[#060913] p-1.5 rounded-xl border border-[#1e293b]">
              {['Off', 'On'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => supportsFrameGen && setFrameGen(mode)}
                  disabled={!supportsFrameGen}
                  className={`flex-1 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                    !supportsFrameGen 
                      ? 'opacity-30 cursor-not-allowed bg-transparent text-slate-600'
                      : frameGen === mode
                        ? 'bg-purple-600/20 text-purple-400 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)] border border-purple-500/30'
                        : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-[#161a2b]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col gap-8 relative z-10 transition-opacity duration-500 ${isRecalculating ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}>
        
        {/* ==================== ROW 1: THE 3 GAUGES ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* UPDATED BOTTLENECK GAUGE */}
          <div className="bg-[#0b0f19] border border-[#1e293b] border-t-cyan-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Bottleneck Status</h3>
            <div className="relative w-32 h-32 flex shrink-0 items-center justify-center mb-4">
              {renderCircle(bottleneckPercent, isHealthy ? "#22d3ee" : "#ef4444", 50, "0.2s")}
              <span className={`text-3xl font-black ${isHealthy ? 'text-cyan-400' : 'text-red-500'}`}>{bottleneckPercent}%</span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isHealthy ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30' : 'bg-red-900/20 text-red-400 border-red-500/30'}`}>
              {bottleneckLabel}
            </p>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] rounded-3xl p-6 flex flex-col items-center text-center shadow-lg" style={{ borderTopColor: `${stabilityColor}40` }}>
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">1% Low Stability</h3>
            <div className="relative w-32 h-32 flex shrink-0 items-center justify-center mb-4">
              {renderCircle(stabilityRatio, stabilityColor, 50, "0.4s")}
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black" style={{ color: stabilityColor }}>{stabilityRatio}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Ratio of 1% Lows to Average Framerate.</p>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] border-t-purple-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Hardware Matrix</h3>
            <div className="relative w-32 h-32 flex shrink-0 items-center justify-center mb-4">
              {renderCircle(compatPercent, "#a855f7", 50, "0.6s")}
              <span className="text-3xl font-black text-purple-400">{compatPercent}%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Socket, chassis, and wattage verified.</p>
          </div>
        </div>

        {/* --- REFRESH DIVIDER --- */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute w-full h-px bg-linear-to-r from-transparent via-[#1e293b] to-transparent"></div>
          <button 
            onClick={shuffleGames}
            className={`relative z-10 bg-[#060913] border border-purple-500/40 p-3 rounded-full hover:bg-purple-900/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all ${isRefreshing ? 'opacity-50 pointer-events-none rotate-180' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ==================== ROW 2: GAMES GRID (AI MATRIX DRIVEN) ==================== */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
          {activeGames.map((game, i) => {
            const delay = 600 + (i * 100); 
            
            const fhd = currentAiData ? Math.round(currentAiData['1080p'].avg * game.baseWeight) : 0;
            const qhd = currentAiData ? Math.round(currentAiData['1440p'].avg * game.baseWeight) : 0;
            const uhd = currentAiData ? Math.round(currentAiData['4K UHD'].avg * game.baseWeight) : 0;
            
            const fhdLows = currentAiData ? Math.round(currentAiData['1080p'].lows * game.baseWeight) : 0;
            const qhdLows = currentAiData ? Math.round(currentAiData['1440p'].lows * game.baseWeight) : 0;
            const uhdLows = currentAiData ? Math.round(currentAiData['4K UHD'].lows * game.baseWeight) : 0;

            return (
              <div key={`${game.name}-${i}`} className="relative bg-[#0b0f19] border border-[#1e293b] rounded-3xl overflow-hidden flex flex-col group shadow-lg hover:border-purple-500/50 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both" style={{ animationDelay: `${delay}ms` }}>
                
                <div className="absolute inset-0 z-0">
                  <img src={game.img} alt={game.name} className="w-full h-full object-cover opacity-15 group-hover:scale-110 group-hover:opacity-25 transition-all duration-700 mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0b0f19] via-[#0b0f19]/90 to-[#0b0f19]/20"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full p-5">
                  
                  {/* 1. TITLE ONLY */}
                  <div className="mb-auto">
                    <h4 className="text-xl font-black text-white drop-shadow-md truncate w-full" title={game.name}>
                      {game.name}
                    </h4>
                  </div>
                  
                  {/* 2. GRID & NEW CENTERED PILL */}
                  <div className="w-full mt-4 flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center bg-[#060913]/80 border border-[#1e293b] rounded-xl py-2">
                        <span className="text-[9px] text-slate-500 font-bold uppercase mb-1">1080p</span>
                        <span className="text-lg font-black text-white">{fhd}</span>
                        <span className="text-[9px] text-slate-500 mt-1">{fhdLows} (1%)</span>
                      </div>

                      <div className="flex flex-col items-center bg-purple-900/20 border border-purple-500/30 rounded-xl py-2 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]">
                        <span className="text-[9px] text-purple-400 font-bold uppercase mb-1">1440p</span>
                        <span className="text-lg font-black text-purple-400 drop-shadow-md">{qhd}</span>
                        <span className="text-[9px] text-purple-400/60 mt-1">{qhdLows} (1%)</span>
                      </div>

                      <div className="flex flex-col items-center bg-[#060913]/80 border border-[#1e293b] rounded-xl py-2">
                        <span className="text-[9px] text-slate-500 font-bold uppercase mb-1">4K UHD</span>
                        <span className="text-lg font-black text-white">{uhd}</span>
                        <span className="text-[9px] text-slate-500 mt-1">{uhdLows} (1%)</span>
                      </div>
                    </div>

                    <div className="flex justify-center w-full">
                      <span className="bg-purple-900/40 border border-purple-500/30 text-purple-300 text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                        {graphicsPreset} PRESET
                      </span>
                    </div>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================== ROW 3: VERIFICATION & GRAPH ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          <div className="lg:col-span-5 bg-[#070815] border border-[#1e293b] rounded-[2.5rem] p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: '1000ms' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              <span className="text-green-500 font-bold tracking-widest text-xs uppercase">Boot Sequence</span>
            </div>
            <ul className="space-y-5 text-sm text-slate-300 font-mono">
              {[
                "Socket architecture aligned.",
                "PSU overhead exceeds 20% margin.",
                "Chassis clearance verified.",
                "RAM Config: Dual-Channel Active."
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both" style={{ animationDelay: `${1200 + (i * 300)}ms` }}>
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 bg-[#0b0f19] border border-[#1e293b] rounded-[2.5rem] p-8 relative overflow-hidden shadow-lg min-h-62.5 flex flex-col justify-start animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: '1200ms' }}>
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-3 relative z-10">
              <Activity className="w-4 h-4 text-purple-400" />
              Frametime Variance Prediction
            </h3>
            
            <div className="absolute bottom-0 left-0 w-full h-4/5 pt-8">
              <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#00f0ff" />
                  </linearGradient>
                </defs>
                
                <line x1="0" y1="50" x2="1000" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                
                <path 
                 d={`M 0,${Math.max(10, avgY - 90) + 10} C 150,${Math.max(10, avgY - 90) - 15} 250,${Math.max(10, avgY - 90) + 20} 400,${Math.max(10, avgY - 90)} S 600,${Math.max(10, avgY - 90) - 25} 750,${Math.max(10, avgY - 90) + 10} S 900,${Math.max(10, avgY - 90) - 15} 1000,${Math.max(10, avgY - 90)}`}
                  fill="none" stroke="url(#lineGrad)" strokeWidth="4" 
                  style={{ filter: 'drop-shadow(0px 0px 8px rgba(34, 211, 238, 0.6))', transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }} 
                />
                
                <path 
                  d={`M 0,${lowY + 10} C 150,${lowY - 15} 250,${lowY + 20} 400,${lowY} S 600,${lowY - 25} 750,${lowY + 10} S 900,${lowY - 15} 1000,${lowY}`} 
                  fill="none" stroke={stabilityColor} strokeWidth="2" strokeDasharray="6,4" opacity="0.8" 
                  style={{ transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />

                <g transform={`translate(400, ${Math.max(10, avgY - 90)})`} style={{ transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <circle cx="0" cy="0" r="4" fill="#00f0ff" style={{ filter: 'drop-shadow(0px 0px 4px #00f0ff)' }} />
                  <rect x="-45" y="-30" width="90" height="20" rx="10" fill="#060913" opacity="0.8" stroke="#00f0ff" strokeWidth="1" />
                  <text x="0" y="-16" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">{baseFps} FPS (Avg)</text>
                </g> 
                
                <g transform={`translate(400, ${lowY})`} style={{ transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <circle cx="0" cy="0" r="3" fill={stabilityColor} style={{ filter: `drop-shadow(0px 0px 4px ${stabilityColor})` }} />
                  <rect x="-45" y="10" width="90" height="20" rx="10" fill="#060913" opacity="0.8" stroke={stabilityColor} strokeWidth="1" />
                  <text x="0" y="24" fill={stabilityColor} fontSize="11" fontWeight="bold" textAnchor="middle">{lowsFps} FPS (1%)</text>
                </g>
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}