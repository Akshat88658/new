import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Lock, ArrowRight, AlertTriangle, UserPlus, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ Name: '', Email: '', Password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/register', formData);
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute top-[30%] left-[30%] w-[35%] h-[35%] bg-violet-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-lg text-center animate-fade-up">
          <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 animate-float">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            Join the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
              Grievance Portal
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mt-6">
            Register to submit and track your grievances. Your voice matters — let us help resolve your concerns quickly.
          </p>
          <div className="mt-10 flex justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Easy Registration
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Password Protected
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Grievance Portal</h2>
          </div>

          <div className="glass-strong rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-1">Create Account</h2>
              <p className="text-slate-400 text-sm">Register to start submitting grievances</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down">
                <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="reg-name">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input id="reg-name" name="Name" type="text" required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Akshat Shandilya" value={formData.Name} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="reg-email">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input id="reg-email" name="Email" type="email" required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="you@college.edu" value={formData.Email} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="reg-password">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input id="reg-password" name="Password" type="password" required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••" value={formData.Password} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-xl hover:from-emerald-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group animate-gradient">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <>Sign Up <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
