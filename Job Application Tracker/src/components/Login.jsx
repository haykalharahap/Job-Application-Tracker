import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Masukan sembarang email dan password untuk testing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10 w-full overflow-hidden">
      {/* Decorative gradient orb for the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md glass-card rounded-2xl p-8 sm:p-10 relative overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Subtle border top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-brand-500/30">
            <Activity fill="currentColor" strokeWidth={1} className="w-8 h-8 text-white/90" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm opacity-60">Log in to track your applications</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium opacity-80" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-surface-200/50 dark:bg-surface-900/50 border border-surface-300 dark:border-surface-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium opacity-80" htmlFor="password">Password</label>
              <a href="#" className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors">Forgot details?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                required
                className="w-full bg-surface-200/50 dark:bg-surface-900/50 border border-surface-300 dark:border-surface-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(var(--color-brand-500),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-brand-400),0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs opacity-50 font-medium">
          Note: Input sembarang email & password untuk masuk
        </div>
      </div>
    </div>
  );
}
