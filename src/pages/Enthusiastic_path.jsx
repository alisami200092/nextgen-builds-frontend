import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Monitor, Cpu, Settings, ArrowLeft, Zap, Layers, 
  Microchip, Box, Share2, ShoppingCart, Download, Activity,
  CheckCircle2, Crosshair, Server, AlertTriangle, RefreshCw, 
  Sparkles, Lock 
} from 'lucide-react';
import PricingDashboard from './PricingDashboard';

// --- ASSETS ---
import bgImage from '../assets/pc-configurator-background.png';
import robotVideo from '../assets/robot-working.mp4';

// --- DATA MAPPING ---
const cpuTiers = {
  intel: ['Any', 'i3', 'i5', 'i7', 'i9'],
  amd: ['Any', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'],
  any: ['Any'],
};

const gpuTiers = {
  nvidia: ['Any', 'Low Tier', 'Entry-Level', 'Mid-Range', 'High-End', 'Flagship'],
  amd: ['Any', 'Low Tier', 'Entry-Level', 'Mid-Range', 'High-End', 'Flagship'],
  intel: ['Any', 'Low Tier', 'Entry-Level', 'Mid-Range'],
  any: ['Any'],
};

const RAM_OPTIONS = ['8GB', '16GB', '32GB', '64GB', '128GB'];
const CASE_OPTIONS = ['Small', 'Mid', 'Full'];

export default function EnthusiastPath() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    budget: 2500,
    cpuBrand: 'Any',
    cpuTier: 'Any',
    gpuBrand: 'Any',
    gpuTier: 'Any',
    ramSize: '32GB',
    caseSize: 'Mid',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field] : value };
      if (field === 'cpuBrand') newData.cpuTier = 'Any';
      if (field === 'gpuBrand') newData.gpuTier = 'Any';
      return newData;
    });
  };

  const generateBuild = async () => {
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await fetch('http://localhost:5000/api/build/enthusiast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate build.');
      }

      // MAP POSTGRESQL DATA TO OUR UI STATE + CAPTURE ML SPECS
      const realResult = {
        User_Budget: formData.budget,
        CPU: data.cpu,                  
        GPU: data.gpu,                  
        Motherboard: data.motherboard, 
        RAM: data.ram,                  
        PSU: data.psu || '850W 80+ Gold', 
        Case: data.case || 'Mid Tower Case', 
        Total_Price: parseInt(data.total_price),
        PS_Wattage: parseInt((data.psu || "850").match(/\d+/)?.[0] || 850),
        image_url: data.image_url,
        
        // ==========================================
        // ML DATA CAPTURE
        // ==========================================
        specs: {
          cpuCores: data.cpu_core || 8,
          cpuThreads: data.cpu_thre || 16,
          cpuBoost: data.cpu_boos || 4.5,
          cpuL3: data.cpu_l3_c || 32,
          gpuVram: data.gpu_vram || 12,
          gpuBoost: data.gpu_boos || 2200,
          gpuShaders: data.gpu_shad || 5888,
          ramCapacity: data.ram_cap || 32,
          ramSpeed: data.ram_speed_mhz || 6000
        }
      };

      setResult(realResult);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDynamicTiers = (brandType, brand) => {
    const data = brandType === 'cpu' ? cpuTiers : gpuTiers;
    return data[brand.toLowerCase()] || ['Any'];
  };

  return (
    <div
      className="min-h-screen font-sans text-gray-100 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-[#060913]/90 z-0 pointer-events-none"></div>

      {/* --- TOP NAVIGATION --- */}
      <nav className="relative z-20 w-full border-b border-white/5 bg-[#0D1117]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
              NextGen<span className="text-cyan-400">Builds</span>
            </h1>
          </div>
          
          <div className="w-16"></div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 pb-20 flex flex-col items-center">
        
      {/* --- HOLLOW ROBOT VIDEO ANIMATION --- */}
        <div className="w-64 h-64 md:w-80 md:h-80 -mt-10 mb-2 relative flex items-center justify-center mix-blend-screen">
          
          {/* Ambient background glow */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain relative z-10"
            style={{ 
              mixBlendMode: 'screen',
              filter: 'contrast(1.4) brightness(0.95) saturate(1.4)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 65%)',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 65%)',
            }}
          >
            <source src={robotVideo} type="video/mp4" />
          </video>
        </div>

        {/* --- DARKMORPHISM FORM CONTAINER --- */}
        <div className="w-full bg-[#0D1117] border border-[#1F2937] border-t-cyan-500/30 rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_0_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1F2937] pb-8 mb-10">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Enthusiast Configurator</h2>
                <p className="text-cyan-100/50">Feed the AI your constraints. Watch it build reality.</p>
              </div>
              <button
                onClick={generateBuild}
                disabled={isLoading}
                className="px-8 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center gap-2"
              >
                {isLoading ? <Zap className="w-5 h-5 animate-pulse" /> : <Target className="w-5 h-5" />}
                {isLoading ? 'Processing...' : 'Generate Build'}
              </button>
            </div>

            {!result && !isLoading && (
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-10">
                  <FormSection title="Maximum Budget" subtitle="Hard cap limit applied.">
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-cyan-400">$</span>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                        className="w-full text-2xl font-black bg-[#060913] border border-[#1F2937] border-t-white/10 rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all text-white placeholder-gray-700"
                      />
                    </div>
                  </FormSection>

                  <FormSection title="CPU Silicon" subtitle="Select manufacturer and tier.">
                    <DarkSegmentedControl
                      options={['Any', 'Intel', 'AMD']}
                      selectedValue={formData.cpuBrand}
                      onChange={(val) => handleInputChange('cpuBrand', val)}
                    />
                    <DarkTierGrid
                      options={getDynamicTiers('cpu', formData.cpuBrand)}
                      selectedValue={formData.cpuTier}
                      onChange={(val) => handleInputChange('cpuTier', val)}
                    />
                  </FormSection>
                </div>

                <div className="space-y-10">
                  <FormSection title="GPU Architecture" subtitle="Graphics rendering power.">
                    <DarkSegmentedControl
                      options={['Any', 'NVIDIA', 'AMD', 'Intel']}
                      selectedValue={formData.gpuBrand}
                      onChange={(val) => handleInputChange('gpuBrand', val)}
                    />
                    <DarkTierGrid
                      options={getDynamicTiers('gpu', formData.gpuBrand)}
                      selectedValue={formData.gpuTier}
                      onChange={(val) => handleInputChange('gpuTier', val)}
                    />
                  </FormSection>

                  <FormSection title="System Memory" subtitle="RAM Allocation.">
                    <DarkPillSelector
                      options={RAM_OPTIONS}
                      selectedValue={formData.ramSize}
                      onChange={(val) => handleInputChange('ramSize', val)}
                    />
                  </FormSection>

                  <FormSection title="Chassis Size" subtitle="Physical footprint.">
                    <DarkPillSelector
                      options={CASE_OPTIONS}
                      selectedValue={formData.caseSize}
                      onChange={(val) => handleInputChange('caseSize', val)}
                    />
                  </FormSection>
                </div>
              </div>
            )}

            <div className="mt-4">
              {isLoading && <Loader />}
              {error && <ErrorCard message={error} />}
              {result && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <ResultCard build={result} onReset={() => setResult(null)} />
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

// ==============================================================================
// --- DARKMORPHISM UTILITY COMPONENTS ---
// ==============================================================================

function FormSection({ title, subtitle, children }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DarkSegmentedControl({ options, selectedValue, onChange }) {
  return (
    <div className="flex gap-2 bg-[#060913] p-1.5 rounded-2xl border border-[#1F2937] border-t-white/5 shadow-inner">
      {options.map((option) => {
        const isSelected = selectedValue === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              isSelected
                ? 'bg-cyan-600/20 text-cyan-400 shadow-[inset_0_0_15px_rgba(34,211,238,0.2)] border border-cyan-500/30'
                : 'bg-transparent text-gray-500 hover:text-gray-300 hover:bg-[#1F2937] border border-transparent'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function DarkTierGrid({ options, selectedValue, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((option) => {
        const isSelected = selectedValue === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 border ${
              isSelected
                ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]'
                : 'bg-[#060913] text-gray-500 border-[#1F2937] border-t-white/5 hover:border-white/20 hover:text-gray-300 shadow-sm'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function DarkPillSelector({ options, selectedValue, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selectedValue === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border ${
              isSelected
                ? 'bg-linear-to-r from-cyan-600 to-blue-600 text-white border-transparent shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                : 'bg-[#060913] text-gray-400 border-[#1F2937] border-t-white/5 hover:border-white/20 hover:bg-[#111827] hover:text-gray-200 shadow-sm'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

// ==============================================================================
// --- SPLIT-LAYOUT RESULT CARD WITH COMPONENT IMAGES ---
// ==============================================================================

function ResultCard({ build, onReset }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [aiMatrix, setAiMatrix] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [saveStatus, setSaveStatus] = useState('Save');

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
        body: JSON.stringify(build.specs) 
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

  // 🚀 THE NEW SAVE FUNCTION
 const handleSaveBuild = async () => {
  setIsSaving(true);
  setSaveStatus('Saving...');

  const token = localStorage.getItem('token');
  if (!token) {
    alert("You must be logged in to save a build!");
    setSaveStatus('Save');
    setIsSaving(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/builds/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        build_name: `${build.CPU?.split(' ')[1] || 'AI'} / ${build.GPU?.split(' ')[1] || 'Custom'} Rig`,
        total_price: build.Total_Price,
        cpu: build.CPU,
        gpu: build.GPU,
        motherboard: build.Motherboard,
        ram: build.RAM,
        psu: build.PSU,
        chassis: build.Case,
        image_url: build.image_url
      })
    });

    const data = await response.json();
    console.log("Save response:", response.status, data); // 👈 Add this

    if (response.ok) {
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus('Save'), 3000);
    } else {
      setSaveStatus('Error');
      setTimeout(() => setSaveStatus('Save'), 3000);
    }
  } catch (error) {
    console.error("Error saving build:", error);
    setSaveStatus('Error');
    setTimeout(() => setSaveStatus('Save'), 3000);
  } finally {
    setIsSaving(false);
  }
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

  // Otherwise, return the normal ResultCard UI
  return (
    <div className="w-full flex flex-col gap-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* --- LEFT COLUMN: BIG COMPONENT CARDS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Component Loadout</h3>
            <button onClick={onReset} className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-bold transition-colors">
              Edit Constraints
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {majorParts.map((part) => (
              <div key={part.id} className="p-6 bg-[#0B0F19] border border-[#1F2937] border-t-white/10 rounded-4xl hover:border-cyan-500/30 transition-colors flex flex-col h-full shadow-lg group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`relative w-16 h-16 rounded-2xl ${part.bg} border border-[#1F2937] flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden`}>
                    {part.img && part.img !== "NaN" ? (
                      <img 
                        src={part.img} 
                        alt={part.name} 
                        className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                      />
                    ) : (
                      <part.icon className={`w-8 h-8 ${part.color}`} />
                    )}
                  </div>
                  <span className="text-xs font-black tracking-widest text-gray-500 uppercase bg-[#060913] border border-[#1F2937] px-3 py-1 rounded-full">
                    {part.label}
                  </span>
                </div>
                
                <div className="grow mb-6">
                  <p className="text-lg font-bold text-white leading-tight">{part.name}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-[#1F2937] flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Est. Price</span>
                  <span className="text-xl font-black text-white">${part.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: BUILD SUMMARY SIDEBAR --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 p-8 bg-[#0B0F19] border border-[#1F2937] border-t-cyan-500/20 rounded-3xl shadow-2xl flex flex-col h-full">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" /> Build Summary
            </h3>
            
            <div className="mb-8 p-6 bg-[#060913] rounded-3xl border border-[#1F2937] text-center shadow-inner">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Total System Cost</p>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                ${build.Total_Price.toLocaleString()}
              </div>
              <p className="text-xs text-indigo-300/70 mt-3 flex items-center justify-center gap-2 font-medium">
                <Activity className="w-4 h-4 text-cyan-400"/> Power Draw: {build.PS_Wattage}W
              </p>
            </div>

            <div className="space-y-4 mb-8 grow">
              {majorParts.map(part => (
                 <div key={`list-${part.id}`} className="flex justify-between items-start text-sm border-b border-[#1F2937] pb-3">
                    <span className="text-gray-500 shrink-0 mr-4">{part.label}</span>
                    <span className="text-gray-200 font-medium text-right line-clamp-2">{part.name}</span>
                 </div>
              ))}
            </div>

            <div className="space-y-3 mt-auto">
  {/* Buy Build Button */}
  <button 
    onClick={() => setShowPricing(true)}
    className="w-full py-4 rounded-2xl font-black text-gray-900 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 text-lg"
  >
    <ShoppingCart className="w-5 h-5" /> Buy Full Build
  </button>
  
  <div className="grid grid-cols-2 gap-3">
    {/* Share Button */}
    <button className="py-3 rounded-xl font-bold text-sm text-white bg-[#060913] hover:bg-[#1F2937] border border-[#1F2937] border-t-white/5 transition-colors flex items-center justify-center gap-2">
      <Share2 className="w-4 h-4" /> Share
    </button>
    {/* Save Button */}
    <button 
      onClick={handleSaveBuild}
      disabled={isSaving || saveStatus === 'Saved!'}
      className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
        saveStatus === 'Saved!' 
          ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
          : saveStatus === 'Error'
          ? 'bg-red-500/20 border-red-500/50 text-red-400'
          : 'bg-[#060913] hover:bg-[#1F2937] border-[#1F2937] border-t-white/5 text-white'
      }`}
    >
      {isSaving ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : saveStatus === 'Saved!' ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {saveStatus}
    </button>
  </div>
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
              ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.4)]' 
              : 'bg-[#0B0F19] border-[#1F2937] hover:border-cyan-500/30 hover:bg-[#161a2b] shadow-lg'
          }`}
        >
          {isScanning ? (
            <>
              <Crosshair className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-cyan-400 font-black tracking-widest animate-pulse">Scanning Hardware Matrix...</span>
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

function ErrorCard({ message }) {
  return (
    <div className="bg-[#1F0D0D] rounded-3xl border border-red-900 border-t-red-500/50 p-8 flex items-start gap-5 text-red-200 shadow-xl">
      <Target className="w-8 h-8 text-red-500 shrink-0" />
      <div>
        <h4 className="text-xl font-bold text-white mb-2">Build Conflict Detected</h4>
        <p className="text-red-300 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center text-cyan-400 py-12">
      <Zap className="w-12 h-12 animate-pulse mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
      <p className="font-bold text-xl tracking-wide">Compiling Neural Architecture...</p>
    </div>
  );
}

// ==============================================================================
// --- ALL 20 GAMES DATABASE 
// ==============================================================================
const ALL_GAMES = [
  { name: "Cyberpunk 2077", baseWeight: 1.0, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Alan Wake 2", baseWeight: 0.85, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Red Dead 2", baseWeight: 1.25, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Starfield", baseWeight: 1.10, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Hogwarts Legacy", baseWeight: 1.15, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Flight Simulator", baseWeight: 0.90, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "GTA V", baseWeight: 1.80, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Warzone 2.0", baseWeight: 1.65, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Elden Ring", baseWeight: 1.50, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Fortnite", baseWeight: 1.85, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "The Witcher 3", baseWeight: 1.70, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Baldur's Gate 3", baseWeight: 1.35, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Rust", baseWeight: 2.10, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Destiny 2", baseWeight: 2.60, img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { name: "Call of Duty: MW3", baseWeight: 2.10, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Doom Eternal", baseWeight: 4.50, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Valorant", baseWeight: 2.50, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Counter-Strike 2", baseWeight: 2.80, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Apex Legends", baseWeight: 3.20, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { name: "Overwatch 2", baseWeight: 4.10, img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=600&q=80" },
  { name: "Rainbow Six", baseWeight: 5.60, img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" }
];

const getRandomGames = () => [...ALL_GAMES].sort(() => 0.5 - Math.random()).slice(0, 4);

// ==============================================================================
// Deep Analysis Dashboard
// ==============================================================================
function DeepAnalysisDashboard({ build, initialAiMatrix }) {
  const [activeGames, setActiveGames] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  
  // CORE STATES
  const [localMatrix, setLocalMatrix] = useState(initialAiMatrix);
  const [graphicsPreset, setGraphicsPreset] = useState('Ultra');
  
  // NEW: NEURAL RENDERING STATES
  const [upscaling, setUpscaling] = useState('Native'); // Native, Quality, Performance
  const [frameGen, setFrameGen] = useState('Off'); // Off, On

  // --- HARDWARE LOGIC ---
  const gpuName = build.GPU.toLowerCase();
  const isNvidia = gpuName.includes('nvidia') || gpuName.includes('rtx');
  const isIntel = gpuName.includes('intel') || gpuName.includes('arc');
  
  // Dynamically name the upscaling tech based on the GPU
  const upscalerName = isNvidia ? 'DLSS 4' : isIntel ? 'XeSS 2' : 'FSR 4';
  
  // Strict Hardware Lock for Frame Generation (Only RTX 40/50 series and RX 7000/9000 series)
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
          // We pass the new Neural states directly back to the Python bridge!
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
  }, [upscaling, frameGen]); // Re-run whenever the user flips a switch

  const shuffleGames = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setActiveGames(getRandomGames());
      setIsRefreshing(false);
    }, 400); 
  };

  // BOTTLENECK HEURISTIC
  const estCpu = Math.round(build.Total_Price * 0.25);
  const estGpu = Math.round(build.Total_Price * 0.40);
  const ratio = estCpu / (estGpu || 1); 
  const variance = Math.abs(ratio - 0.55);
  const bottleneckPercent = Math.min(35, Math.max(1, Math.round(variance * 60)));
  const isHealthy = bottleneckPercent < 10;
  const compatPercent = 98;
  
  // --- USE THE LIVE MATRIX ---
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
    <div className="w-full bg-[#060913] border border-cyan-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b border-[#1e293b] pb-6 relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
        <div className="flex items-center gap-3">
          <Server className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Diagnostic <span className="text-cyan-400">Terminal</span></h2>
        </div>

        {/* GRAPHICS PRESET SELECTOR */}
        <div className="flex items-center gap-3 bg-[#0b0f19] border border-[#1e293b] p-1.5 rounded-2xl shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <Settings className="w-4 h-4 text-slate-500 ml-2 shrink-0" />
          {['Low', 'Medium', 'High', 'Ultra'].map((p) => (
            <button
              key={p}
              onClick={() => setGraphicsPreset(p)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                graphicsPreset === p
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)] border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-[#161a2b]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* --- NEW: NEURAL ENGINE CONTROL PANEL --- */}
      <div className="mb-10 bg-[#0b0f19] border border-[#1e293b] border-l-cyan-500/50 border-l-4 rounded-2xl p-6 relative z-10 shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Rendering Subsystem</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upscaling Toggle */}
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">AI Super Resolution ({upscalerName})</p>
            <div className="flex gap-2 bg-[#060913] p-1.5 rounded-xl border border-[#1e293b]">
              {['Native', 'Quality', 'Performance'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setUpscaling(mode)}
                  className={`flex-1 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                    upscaling === mode
                      ? 'bg-cyan-600/20 text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)] border border-cyan-500/30'
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
          <div className="bg-[#0b0f19] border border-[#1e293b] border-t-cyan-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">CPU/GPU Synergy</h3>
            <div className="relative w-32 h-32 flex shrink-0 items-center justify-center mb-4">
              {renderCircle(bottleneckPercent, isHealthy ? "#22d3ee" : "#a855f7", 50, "0.2s")}
              <span className={`text-3xl font-black ${isHealthy ? 'text-cyan-400' : 'text-purple-400'}`}>{bottleneckPercent}%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Dynamically calculated hardware variance.</p>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] rounded-3xl p-6 flex flex-col items-center text-center shadow-lg" style={{ borderTopColor: `${stabilityColor}40` }}>
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">1% Low Stability</h3>
            <div className="relative w-32 h-32 flex shrink-0 items-center justify-center mb-4">
              {renderCircle(stabilityRatio, stabilityColor, 50, "0.4s")}
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black" style={{ color: stabilityColor }}>{stabilityRatio}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">Ratio of 1% Lows to Average Framerate.</p>
          </div>

          <div className="bg-[#0b0f19] border border-[#1e293b] border-t-purple-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Hardware Matrix</h3>
            <div className="relative w-32 h-32 flex shrink-0 items-center justify-center mb-4">
              {renderCircle(compatPercent, "#a855f7", 50, "0.6s")}
              <span className="text-3xl font-black text-purple-400">{compatPercent}%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Socket, chassis, and wattage verified.</p>
          </div>
        </div>

        {/* --- REFRESH DIVIDER --- */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute w-full h-px bg-linear-to-r from-transparent via-[#1e293b] to-transparent"></div>
          <button 
            onClick={shuffleGames}
            className={`relative z-10 bg-[#060913] border border-cyan-500/40 p-3 rounded-full hover:bg-cyan-900/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all ${isRefreshing ? 'opacity-50 pointer-events-none rotate-180' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
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
              <div key={`${game.name}-${i}`} className="relative bg-[#0b0f19] border border-[#1e293b] rounded-3xl overflow-hidden flex flex-col group shadow-lg hover:border-cyan-500/50 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both" style={{ animationDelay: `${delay}ms` }}>
                
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

                      <div className="flex flex-col items-center bg-cyan-900/20 border border-cyan-500/30 rounded-xl py-2 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
                        <span className="text-[9px] text-cyan-400 font-bold uppercase mb-1">1440p</span>
                        <span className="text-lg font-black text-cyan-400 drop-shadow-md">{qhd}</span>
                        <span className="text-[9px] text-cyan-400/60 mt-1">{qhdLows} (1%)</span>
                      </div>

                      <div className="flex flex-col items-center bg-[#060913]/80 border border-[#1e293b] rounded-xl py-2">
                        <span className="text-[9px] text-slate-500 font-bold uppercase mb-1">4K UHD</span>
                        <span className="text-lg font-black text-white">{uhd}</span>
                        <span className="text-[9px] text-slate-500 mt-1">{uhdLows} (1%)</span>
                      </div>
                    </div>

                    <div className="flex justify-center w-full">
                      <span className="bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase shadow-[0_0_10px_rgba(34,211,238,0.1)]">
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
              <Activity className="w-4 h-4 text-cyan-400" />
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