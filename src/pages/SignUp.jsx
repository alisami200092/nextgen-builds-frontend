import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronLeft, Loader2 } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  
  // State to hold user input and UI status
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle typing in the inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://prod-main-api-ddd22f-003w64y1xh9.compute.instacloud-edge.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success! Save the token and redirect to the home page
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b14] flex flex-col justify-center items-center relative overflow-hidden text-slate-300 font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Home
        </Link>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Join NextGen</h2>
            <p className="text-slate-400 text-sm">Start building your AI-optimized rig today.</p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-500" />
                </div>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/50 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="GamerX"
                />
              </div>
            </div>

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
                  className="w-full bg-slate-800/50 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="gamer@nextgen.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-500" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/50 border border-white/5 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;