import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Cpu, Monitor, MemoryStick, Layers, Zap, Box, 
  Terminal, Activity, ShieldCheck, ShoppingCart, Share2
} from 'lucide-react';

import PricingDashboard from './PricingDashboard'; // 🚀 IMPORTED

export default function BuildViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [build, setBuild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 NEW: State to trigger the Checkout/Pricing screen
  const [showCheckout, setShowCheckout] = useState(false);

  // AI Report States
  const [fullReport, setFullReport] = useState('');
  const [displayedReport, setDisplayedReport] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Fetch the specific build
  useEffect(() => {
    const fetchBuild = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const response = await fetch('https://prod-main-api-ddd22f-003w64y1xh9.compute.instacloud-edge.com/api/builds/my-hangar', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          const targetBuild = data.find(b => b.id === parseInt(id));
          
          if (targetBuild) {
            setBuild(targetBuild);
            generateNeuralReport(targetBuild);
          } else {
            navigate('/profile');
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuild();
  }, [id, navigate]);

  // Generate the text for the AI to type
  const generateNeuralReport = (b) => {
    const isAmdCpu = b.cpu.toLowerCase().includes('ryzen');
    const isNvidiaGpu = b.gpu.toLowerCase().includes('rtx') || b.gpu.toLowerCase().includes('nvidia');
    const isHighEnd = b.total_price > 2000;

    let report = `INITIALIZING NEURAL ANALYSIS FOR [${b.build_name.toUpperCase()}]...\n\n`;
    
    report += `> ARCHITECTURE: Utilizing the ${b.cpu}, this system is optimized for ${isAmdCpu ? 'high-efficiency multi-threading and benefits from the AM5 socket longevity' : 'blistering single-core speeds and robust multi-tasking'}. `;
    
    report += `Paired with the ${b.gpu}, you are unlocking ${isHighEnd ? 'uncompromised 4K UHD rendering' : 'flawless 1440p high-refresh gaming'}. `;
    
    report += isNvidiaGpu 
      ? 'The inclusion of an NVIDIA neural processor grants access to DLSS Frame Generation and premium Ray Tracing fidelity.\n\n' 
      : 'This Radeon-class accelerator provides massive raw rasterization power and excellent VRAM overhead for modern titles.\n\n';

    report += `> SYNERGY VERDICT: The ${b.ram} ensures zero memory bottlenecks during heavy asset streaming. Power delivery via the ${b.psu} maintains a highly stable thermal equilibrium within the ${b.chassis} chassis.\n\n`;
    
    report += `> CONCLUSION: A highly optimized build with a ${Math.floor(Math.random() * 5 + 94)}% hardware compatibility score. Ready for immediate deployment.`;

    setFullReport(report);
  };

  // The Neural Typewriter Engine
  useEffect(() => {
    if (!fullReport) return;
    
    setIsTyping(true);
    setDisplayedReport('');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      setDisplayedReport((prev) => prev + fullReport.charAt(currentIndex));
      currentIndex++;

      if (currentIndex >= fullReport.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 15); 

    return () => clearInterval(typingInterval);
  }, [fullReport]);

  const formatReportText = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('>') && line.includes(':')) {
        const splitPoint = line.indexOf(':') + 1;
        const heading = line.slice(0, splitPoint);
        const restOfLine = line.slice(splitPoint);
        return (
          <React.Fragment key={index}>
            <span className="text-cyan-400 font-black tracking-widest">{heading}</span>
            <span className="text-slate-300">{restOfLine}</span>
            <br />
          </React.Fragment>
        );
      }
      return (
        <React.Fragment key={index}>
          <span className="text-slate-300">{line}</span>
          <br />
        </React.Fragment>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070815] flex flex-col items-center justify-center text-cyan-400">
        <Activity className="w-12 h-12 animate-pulse mb-4" />
        <p className="tracking-widest font-bold text-sm">DECRYPTING BUILD DATA...</p>
      </div>
    );
  }

  if (!build) return null;

  // 🚀 NEW: Render the Checkout Dashboard if the button is clicked!
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-[#070815] text-slate-300 font-sans pt-24 pb-20 px-6 flex justify-center">
        <div className="max-w-6xl w-full animate-in fade-in zoom-in duration-500">
          <PricingDashboard 
            build={build} 
            onBack={() => setShowCheckout(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070815] text-slate-300 font-sans relative overflow-x-hidden pt-24 pb-20 px-6">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/profile" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Hangar</span>
          </Link>
          <div className="bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            ARCHIVE V.{build.id + 100}
          </div>
        </div>

        <div className="bg-[#0b0f19] border border-[#1e293b] border-t-cyan-500/50 rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          <div className="p-10 border-b border-[#1e293b] flex flex-col md:flex-row md:items-end justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
               {build.image_url && build.image_url !== "NaN" && (
                 <img src={build.image_url} alt="PC" className="w-full h-full object-cover object-top-right mix-blend-luminosity mask-image-gradient" />
               )}
            </div>
            
            <div className="relative z-10">
              <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-2">Stored Configuration</p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{build.build_name}</h1>
            </div>
            <div className="relative z-10 text-left md:text-right">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Total System Value</p>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 drop-shadow-md">
                ${build.total_price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            <div className="lg:col-span-5 p-10 bg-[#060913]/50 border-r border-[#1e293b]">
              <h3 className="text-white font-black text-xl mb-8 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> Hardware Loadout
              </h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Processor', name: build.cpu, icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Graphics', name: build.gpu, icon: Monitor, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { label: 'Motherboard', name: build.motherboard, icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                  { label: 'Memory', name: build.ram, icon: MemoryStick, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Power Supply', name: build.psu, icon: Zap, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                  { label: 'Chassis', name: build.chassis, icon: Box, color: 'text-slate-400', bg: 'bg-slate-500/10' },
                ].map((part, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${part.bg} border border-[#1e293b] shrink-0`}>
                      <part.icon className={`w-5 h-5 ${part.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{part.label}</p>
                      <p className="text-sm font-bold text-slate-200">{part.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 p-10 flex flex-col">
              <h3 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" /> Neural Architect Report
              </h3>
              
              <div className="grow bg-[#060913] border border-[#1e293b] rounded-2xl p-6 font-mono text-sm leading-relaxed shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                
                <div className="whitespace-pre-wrap">
                  {formatReportText(displayedReport)}
                  <span className={`inline-block w-2 h-4 ml-1 bg-cyan-400 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                </div>
                
                {!isTyping && displayedReport.length > 0 && (
                  <div className="mt-6 flex items-center gap-2 text-green-400 font-bold text-xs animate-in fade-in duration-500">
                    <ShieldCheck className="w-4 h-4" /> ANALYSIS COMPLETE
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setShowCheckout(true)} // 🚀 WIRED UP!
                  className="flex-1 py-4 rounded-2xl font-black text-white bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" /> Proceed to Checkout
                </button>
                <button className="w-16 shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-2xl flex items-center justify-center transition-colors text-slate-300 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}