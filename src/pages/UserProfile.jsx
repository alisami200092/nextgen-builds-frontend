import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, HardDrive, Settings, LogOut, 
  Trash2, ExternalLink, Cpu, Monitor, Zap, ChevronLeft, Loader2,
  Globe, Lock, AlertTriangle, ChevronRight, CheckSquare, Square, Swords, X
} from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saved');
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 NEW: State to hold builds selected for comparison
  const [selectedBuilds, setSelectedBuilds] = useState([]);
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const response = await fetch('https://prod-main-api-ddd22f-003w64y1xh9.compute.instacloud-edge.com/api/builds/my-hangar', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setSavedBuilds(data);
        }
      } catch (error) {
        console.error("Failed to fetch builds:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchBuilds();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://prod-main-api-ddd22f-003w64y1xh9.compute.instacloud-edge.com/api/builds/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSavedBuilds(savedBuilds.filter(build => build.id !== id));
        // Remove from comparison array if deleted
        setSelectedBuilds(selectedBuilds.filter(build => build.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete build:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // 🚀 NEW: Selection Logic
  const toggleSelection = (build) => {
    if (selectedBuilds.find(b => b.id === build.id)) {
      setSelectedBuilds(selectedBuilds.filter(b => b.id !== build.id));
    } else {
      if (selectedBuilds.length < 2) {
        setSelectedBuilds([...selectedBuilds, build]);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#070815] text-slate-300 font-sans relative overflow-hidden flex flex-col pt-24 pb-32 px-6">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-150 h-150 bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Top Navbar Area */}
      <div className="max-w-7xl mx-auto w-full relative z-10 flex justify-between items-center mb-10">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Engine</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-cyan-400 to-purple-600 p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <div className="w-full h-full bg-[#0b0f19] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-white font-black text-lg leading-tight">{user.username}</p>
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em]">Neural Architect</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* --- LEFT COLUMN: NAVIGATION --- */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-[#0b0f19] border border-[#1e293b] rounded-3xl p-4 flex flex-col gap-2 shadow-xl">
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'saved' 
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]' 
                : 'text-slate-400 hover:bg-[#161a2b] hover:text-slate-200 border border-transparent'
              }`}
            >
              <HardDrive className="w-5 h-5" /> Saved Builds
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'settings' 
                ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]' 
                : 'text-slate-400 hover:bg-[#161a2b] hover:text-slate-200 border border-transparent'
              }`}
            >
              <Settings className="w-5 h-5" /> Account Settings
            </button>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all mt-auto group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>

        {/* --- RIGHT COLUMN: MAIN CONTENT AREA --- */}
        <div className="lg:col-span-3">
          <div className="bg-[#0b0f19] border border-[#1e293b] border-t-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl min-h-162.5">
            
            {/* ==========================================================
                TAB 1: SAVED BUILDS (THE HANGAR)
            ========================================================== */}
            {activeTab === 'saved' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Saved Builds</h2>
                    <p className="text-slate-400 text-sm">Select up to 2 builds to initiate the Versus Matrix.</p>
                  </div>
                  {savedBuilds.length > 0 && (
                    <div className="bg-[#060913] border border-[#1e293b] px-4 py-2 rounded-2xl flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {savedBuilds.length} Configs Ready
                      </span>
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Accessing Database...</p>
                  </div>
                ) : savedBuilds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[#1e293b] rounded-4xl bg-[#060913]/30">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                       <HardDrive className="w-10 h-10 text-slate-600" />
                    </div>
                    <p className="text-xl font-bold text-white mb-2">Hangar is Empty</p>
                    <p className="text-slate-500 text-sm max-w-xs mb-8">You haven't saved any configurations yet.</p>
                    <Link to="/get-started" className="bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] uppercase tracking-widest text-sm">
                      Start Building
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {savedBuilds.map((build) => {
                      const isSelected = selectedBuilds.some(b => b.id === build.id);
                      
                      return (
                        <div 
                          key={build.id} 
                          className={`group relative bg-[#060913] border rounded-4xl overflow-hidden transition-all duration-500 shadow-xl flex flex-col ${
                            isSelected ? 'border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-[#1e293b] hover:border-purple-500/50'
                          }`}
                        >
                          {/* 🚀 NEW: Selection Checkbox Area */}
                          <div 
                            onClick={() => toggleSelection(build)}
                            className="absolute top-4 right-4 z-20 cursor-pointer bg-slate-900/60 p-2 rounded-xl backdrop-blur-md border border-white/10 hover:bg-slate-800/80 transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            ) : (
                              <Square size={24} className="text-slate-400 group-hover:text-purple-400" />
                            )}
                          </div>

                          {/* Card Header: Image & Price */}
                          <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                            <img 
                              src={build.image_url && build.image_url !== "NaN" ? build.image_url : "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80"} 
                              alt="Hardware" 
                              className={`w-full h-full object-cover transition-all duration-700 mix-blend-luminosity ${isSelected ? 'opacity-50 scale-105' : 'opacity-30 group-hover:scale-110 group-hover:opacity-50'}`} 
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#060913] via-[#060913]/40 to-transparent pointer-events-none"></div>
                            
                            <div className="absolute top-5 left-5 pointer-events-none">
                              <span className="bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg backdrop-blur-md">
                                v.{build.id + 100}
                              </span>
                            </div>

                            <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end pointer-events-none">
                              <div className="max-w-[70%]">
                                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1">
                                  {new Date(build.saved_at).toLocaleDateString()}
                                </p>
                                <h3 className="text-2xl font-black text-white leading-tight truncate">
                                  {build.build_name}
                                </h3>
                              </div>
                              <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
                                ${build.total_price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Specs */}
                          <div className="p-6 grow space-y-4">
                            <div className="flex items-center gap-4 bg-[#0b0f19] border border-[#1e293b] p-3 rounded-2xl transition-colors group-hover:border-purple-500/20">
                              <Cpu className="w-5 h-5 text-purple-400" />
                              <div className="truncate">
                                <p className="text-[9px] text-slate-500 font-black uppercase">Processor</p>
                                <p className="text-xs font-bold text-slate-200 truncate">{build.cpu}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 bg-[#0b0f19] border border-[#1e293b] p-3 rounded-2xl transition-colors group-hover:border-cyan-500/20">
                              <Monitor className="w-5 h-5 text-cyan-400" />
                              <div className="truncate">
                                <p className="text-[9px] text-slate-500 font-black uppercase">Graphics</p>
                                <p className="text-xs font-bold text-slate-200 truncate">{build.gpu}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="px-6 pb-6 pt-2 flex gap-3">
                            <button 
                              onClick={() => navigate(`/build/${build.id}`)} // 🚀 WIRED UP TO STEP 2
                              className="flex-1 bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 text-white text-xs font-black uppercase py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <ExternalLink size={16} /> Load Build
                            </button>
                            <button 
                              onClick={() => handleDelete(build.id)}
                              className="w-14 bg-red-500/5 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-2xl transition-all duration-300 flex items-center justify-center"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ==========================================================
                TAB 2: ACCOUNT SETTINGS
            ========================================================== */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black text-white mb-2">Account Settings</h2>
                <p className="text-slate-400 text-sm mb-10">Manage your credentials, preferences, and security protocols.</p>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  <div className="bg-[#060913] border border-[#1e293b] rounded-3xl p-6 shadow-lg flex flex-col">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                      <User size={18} className="text-cyan-400"/> Personal Details
                    </h3>
                    <div className="space-y-4 grow">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Username</label>
                        <input type="text" defaultValue={user?.username} className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
                        <input type="email" defaultValue={user?.email} className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed" disabled />
                      </div>
                    </div>
                    <button className="w-full mt-6 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-bold py-3 rounded-xl transition-all">Update Profile</button>
                  </div>

                  <div className="bg-[#060913] border border-[#1e293b] rounded-3xl p-6 shadow-lg flex flex-col">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                      <Globe size={18} className="text-purple-400"/> Region & Currency
                    </h3>
                    <div className="space-y-4 grow">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Currency</label>
                        <select className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-xl px-4 py-3 text-white cursor-pointer outline-none">
                          <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Retailer Source</label>
                        <select className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-xl px-4 py-3 text-white cursor-pointer outline-none">
                          <option>North America</option><option>Europe</option><option>Global</option>
                        </select>
                      </div>
                    </div>
                    <button className="w-full mt-6 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 font-bold py-3 rounded-xl transition-all">Save Changes</button>
                  </div>

                  <div className="bg-[#060913] border border-[#1e293b] rounded-3xl p-6 shadow-lg">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                      <Lock size={18} className="text-pink-400"/> Security
                    </h3>
                    <div className="space-y-3">
                       <button className="w-full flex items-center justify-between bg-[#0b0f19] hover:bg-[#161a2b] border border-[#1e293b] px-5 py-4 rounded-xl transition-all group">
                         <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Change Password</span>
                         <ChevronRight size={16} className="text-slate-500 group-hover:text-pink-400" />
                       </button>
                       <button className="w-full flex items-center justify-between bg-[#0b0f19] border border-[#1e293b] px-5 py-4 rounded-xl opacity-50 cursor-not-allowed">
                         <span className="text-sm font-semibold text-slate-500">2-Factor Auth</span>
                         <span className="text-[8px] font-black bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-widest border border-slate-700">Locked</span>
                       </button>
                    </div>
                  </div>

                  <div className="bg-linear-to-b from-[#1a0f0a] to-[#0b0f19] border border-red-900/30 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                    <div>
                      <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Alert</h3>
                      <p className="text-[11px] text-red-200/40 leading-relaxed mb-6">This will delete all of your account settings and your saved builds.<br/> This cannot be undone.</p>
                    </div>
                    <button className="w-full bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/30 font-bold py-3 rounded-xl transition-all">Deactivate Account</button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* 🚀 NEW: FLOATING ACTION BAR FOR VERSUS MATRIX */}
      {selectedBuilds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#0b0f19]/95 backdrop-blur-xl border-2 border-cyan-500/50 p-3 pr-4 rounded-full shadow-[0_10px_50px_rgba(34,211,238,0.2)] z-50 flex items-center gap-6 animate-in slide-in-from-bottom-20 duration-500">
          
          <div className="flex items-center gap-4 pl-4">
            <div className="flex -space-x-3">
              {selectedBuilds.map((b, i) => (
                <div key={b.id} className={`w-10 h-10 rounded-full border-2 border-[#0b0f19] overflow-hidden ${i === 0 ? 'bg-cyan-900/50' : 'bg-purple-900/50'} flex items-center justify-center shadow-lg relative z-${20 - i}`}>
                  <span className="text-[10px] font-black text-white">V.{b.id + 100}</span>
                </div>
              ))}
              {selectedBuilds.length === 1 && (
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-600 bg-slate-900/50 flex items-center justify-center z-10 relative">
                  <span className="text-[10px] text-slate-500 font-bold">?</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-sm uppercase tracking-wider">{selectedBuilds.length}/2 Selected</span>
              <span className="text-cyan-400 text-[10px] font-bold">Awaiting Target Data</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={selectedBuilds.length !== 2}
              onClick={() => navigate('/compare', { state: { builds: selectedBuilds } })} // 🚀 WIRED UP TO STEP 3
              className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black px-6 py-3 rounded-full text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Swords size={18} /> Initiate Comparison
            </button>
            <button 
              onClick={() => setSelectedBuilds([])} 
              className="w-10 h-10 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/50 rounded-full flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>
          </div>
          
        </div>
      )}

    </div>
  );
}