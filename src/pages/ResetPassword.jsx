import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ChevronLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 🚀 This grabs the email automatically from the URL link in your inbox
  const email = searchParams.get('email'); 

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
        return setError("Neural passkey must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passkeys do not match.");
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://prod-main-api-ddd22f-003w64y1xh9.compute.instacloud-edge.com/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Reset failed");

      setSuccess(true);
      // Send them to login after 3 seconds of showing the success checkmark
      setTimeout(() => navigate('/login'), 3500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b14] flex flex-col justify-center items-center relative overflow-hidden text-slate-300 font-sans px-6">
      
      {/* Background Aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                <ShieldCheck className="text-cyan-400" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">New Credentials</h2>
            <p className="text-slate-400 text-sm">Updating access for: <br/> 
                <span className="text-cyan-400 font-bold font-mono text-xs uppercase tracking-widest">{email}</span>
            </p>
          </div>

          {success ? (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-700">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle2 size={40} className="text-green-400" />
              </div>
              <p className="text-white font-black text-xl mb-2">Sync Complete!</p>
              <p className="text-slate-400 text-sm">Neural passkey has been overwritten. <br/> Redirecting to Login Terminal...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs font-bold text-center uppercase tracking-wider">
                    {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Passkey</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                        type="password" 
                        required 
                        className="w-full bg-[#060913] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-slate-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Passkey</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                        type="password" 
                        required 
                        className="w-full bg-[#060913] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-slate-700"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-linear-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-cyan-900/20 transition-all flex justify-center items-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Update Credentials"}
              </button>
            </form>
          )}
        </div>
        
        {!success && (
            <Link to="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors mt-8 text-sm font-bold">
                <ChevronLeft size={16} /> Abort Recovery
            </Link>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;