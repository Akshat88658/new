import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, Mail, BookOpen, KeyRound, Settings, RefreshCw, Sparkles, GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
  const [courseData, setCourseData] = useState({ Course: '' });
  
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await api.get('/me');
      setStudent(response.data);
      setCourseData({ Course: response.data.Course });
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load student details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setActionMessage({ type: '', text: '' });
    try {
      await api.put('/update-password', pwdData);
      setActionMessage({ type: 'success', text: 'Password updated successfully!' });
      setPwdData({ oldPassword: '', newPassword: '' });
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    }
  };

  const handleCourseUpdate = async (e) => {
    e.preventDefault();
    setActionMessage({ type: '', text: '' });
    try {
      const response = await api.put('/update-course', courseData);
      setStudent(response.data.student);
      setActionMessage({ type: 'success', text: 'Course updated successfully!' });
      setTimeout(() => setShowCourseForm(false), 2000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update course.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <div className="text-red-300 bg-red-900/30 p-6 rounded-2xl border border-red-500/30 backdrop-blur-md max-w-md w-full text-center shadow-2xl">
          <p className="font-semibold text-lg mb-4">{error}</p>
          <button onClick={handleLogout} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-12 font-sans relative overflow-hidden text-slate-200">
      
      {/* Background glow effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Portal</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-red-500 hover:text-white transition-all duration-300 border border-white/5 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] group"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
        
        {actionMessage.text && (
          <div className={`mb-8 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ${
            actionMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <Sparkles className="w-5 h-5" />
            {actionMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Profile Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-8 relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-6 p-1 relative">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {student?.Name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-1">{student?.Name}</h2>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-8 inline-block">
                    <p className="text-blue-300 text-xs font-mono tracking-widest uppercase">ID: {student?._id?.slice(-6)}</p>
                  </div>
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <Mail className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-400 font-medium mb-0.5">Email Address</p>
                        <p className="font-semibold text-white truncate">{student?.Email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <BookOpen className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-400 font-medium mb-0.5">Enrolled Course</p>
                        <p className="font-semibold text-white truncate">{student?.Course}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
              <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                <Settings className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white tracking-wide">Account Settings</h3>
              </div>
              
              <div className="p-8 space-y-10">
                {/* Course Management */}
                <div className="group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        Academic Program
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">Transfer to a different course curriculum</p>
                    </div>
                    <button 
                      onClick={() => { setShowCourseForm(!showCourseForm); setShowPasswordForm(false); }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${showCourseForm ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}
                    >
                      {showCourseForm ? 'Cancel' : 'Change Course'}
                    </button>
                  </div>
                  
                  {showCourseForm && (
                    <form onSubmit={handleCourseUpdate} className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Select New Program</label>
                      <select
                        required
                        className="block w-full px-4 py-3.5 bg-slate-800 border border-white/10 rounded-xl text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={courseData.Course}
                        onChange={(e) => setCourseData({ Course: e.target.value })}
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Engineering">Engineering</option>
                      </select>
                      <button type="submit" className="mt-5 w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] transition-all">
                        <RefreshCw className="h-4 w-4" /> Save Changes
                      </button>
                    </form>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* Password Management */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-white">Security Settings</h4>
                      <p className="text-sm text-slate-400 mt-1">Update your password to keep your account secure</p>
                    </div>
                    <button 
                      onClick={() => { setShowPasswordForm(!showPasswordForm); setShowCourseForm(false); }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${showPasswordForm ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : 'bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_15px_rgba(147,51,234,0.4)]'}`}
                    >
                      {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  
                  {showPasswordForm && (
                    <form onSubmit={handlePasswordUpdate} className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300 space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Current Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                            <KeyRound className="h-5 w-5" />
                          </div>
                          <input
                            type="password"
                            required
                            className="block w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={pwdData.oldPassword}
                            onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">New Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                            <Lock className="h-5 w-5" />
                          </div>
                          <input
                            type="password"
                            required
                            className="block w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={pwdData.newPassword}
                            onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 px-4 mt-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] transition-all">
                        Update Password
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
