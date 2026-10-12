import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronLeft, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Which api to to use 
    const endpoint = isRecoveryMode ? '/api/forgot-password' : '/api/login';
    
    try {
      const response = await fetch(`https://prod-main-api-ddd22f-003w64y1xh9.compute.instacloud-edge.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRecoveryMode ? { email: formData.email } : formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      if (isRecoveryMode) {
        setSuccess("Recovery link sent to your inbox!");
        // Optional: Auto-switch back to login after 5 seconds
        setTimeout(() => setIsRecoveryMode(false), 5000);
      } else {
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/'); 
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b14] flex flex-col justify-center items-center relative overflow-hidden text-slate-300 font-sans px-6">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Back Button Toggle */}
        <button 
          onClick={() => isRecoveryMode ? setIsRecoveryMode(false) : navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 mb-8 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft size={16} /> {isRecoveryMode ? 'Back to Login' : 'Back to Home'}
        </button>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              {isRecoveryMode ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-sm px-4">
              {isRecoveryMode 
                ? "Enter your email and we'll send you a neural recovery link." 
                : "Log in to access your saved PC builds."}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm p-4 rounded-lg mb-6 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={24} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-500" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/50 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="gamer@nextgen.com"
                />
              </div>
            </div>

            {!isRecoveryMode && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  <button 
                    type="button"
                    onClick={() => setIsRecoveryMode(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors bg-transparent border-none cursor-pointer p-0"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-500" />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isRecoveryMode}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full font-bold py-3 px-4 rounded-lg mt-4 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 ${
                isRecoveryMode 
                ? 'bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white shadow-purple-500/20'
                : 'bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
              }`}
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> {isRecoveryMode ? 'Locating Account...' : 'Verifying...'}</>
              ) : (
                isRecoveryMode ? <><RefreshCw size={18} /> Send Recovery Link</> : 'Sign In'
              )}
            </button>
          </form>

          {!isRecoveryMode && (
            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account? <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Sign up</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;