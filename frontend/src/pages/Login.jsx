import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, ArrowRight, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ Email: '', Password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message || '';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" />
      <div className="absolute top-[25%] right-[-8%] w-[40%] h-[40%] bg-emerald-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-25 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-15%] left-[25%] w-[35%] h-[35%] bg-violet-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-25 animate-blob animation-delay-4000" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-lg text-center animate-fade-up">
          <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/25 animate-float">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            Student Grievance
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              Management System
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mt-6">
            A secure platform to submit, track, and resolve student complaints efficiently. Built for transparency and accountability.
          </p>
          <div className="mt-10 flex justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Secure & Encrypted
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Real-time Tracking
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Grievance Portal</h2>
          </div>

          <div className="glass-strong rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-1">Sign In</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to access the dashboard</p>
            </div>

            {successMsg && (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down">
                <CheckCircle className="w-5 h-5 shrink-0" /> {successMsg}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down">
                <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="login-email">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input id="login-email" name="Email" type="email" required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="you@college.edu" value={formData.Email} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="login-password">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input id="login-password" name="Password" type="password" required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••" value={formData.Password} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-xl hover:from-indigo-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group animate-gradient">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
