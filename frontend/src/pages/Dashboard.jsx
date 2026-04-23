import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  LogOut, Plus, Search, Edit3, Trash2, X, CheckCircle, Clock,
  FileText, Send, AlertCircle, Sparkles, GraduationCap,
  BookOpen, Home, Bus, HelpCircle, Filter
} from 'lucide-react';

const CATEGORIES = ['Academic', 'Hostel', 'Transport', 'Other'];

const CAT_CONFIG = {
  Academic: { icon: BookOpen, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/25', dot: 'bg-blue-400' },
  Hostel: { icon: Home, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25', dot: 'bg-amber-400' },
  Transport: { icon: Bus, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/25', dot: 'bg-emerald-400' },
  Other: { icon: HelpCircle, gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/25', dot: 'bg-purple-400' },
};

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ Title: '', Description: '', Category: 'Academic', Status: 'Pending' });
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); } }, [toast]);

  const loadData = async () => {
    try {
      const [g, s] = await Promise.all([api.get('/grievances'), api.get('/me')]);
      setGrievances(g.data); setStudent(s.data);
    } catch (err) { if (err.response?.status === 401) logout(); }
    finally { setLoading(false); }
  };

  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const doSearch = async () => {
    if (!searchQuery.trim()) return loadData();
    try { const r = await api.get(`/grievances/search?title=${searchQuery}`); setGrievances(r.data); }
    catch { setToast({ t: 'error', m: 'Search failed' }); }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/grievances/${editId}`, formData); setToast({ t: 'success', m: 'Grievance updated successfully!' }); }
      else { await api.post('/grievances', formData); setToast({ t: 'success', m: 'Grievance submitted successfully!' }); }
      resetForm(); loadData();
    } catch (err) { setToast({ t: 'error', m: err.response?.data?.message || 'Operation failed' }); }
  };

  const startEdit = (g) => {
    setFormData({ Title: g.Title, Description: g.Description, Category: g.Category, Status: g.Status });
    setEditId(g._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const doDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grievance?')) return;
    try { await api.delete(`/grievances/${id}`); setToast({ t: 'success', m: 'Grievance deleted!' }); loadData(); }
    catch { setToast({ t: 'error', m: 'Delete failed' }); }
  };

  const resetForm = () => { setFormData({ Title: '', Description: '', Category: 'Academic', Status: 'Pending' }); setEditId(null); setShowForm(false); };

  const displayed = filterCat ? grievances.filter(g => g.Category === filterCat) : grievances;
  const pending = grievances.filter(g => g.Status === 'Pending').length;
  const resolved = grievances.filter(g => g.Status === 'Resolved').length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-14 h-14 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
          <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-slate-400 text-sm mt-4 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
      {/* Ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-700 rounded-full filter blur-[180px] opacity-10 pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-emerald-700 rounded-full filter blur-[180px] opacity-10 pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] animate-slide-down">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            toast.t === 'success' ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' : 'bg-red-500/15 border-red-500/25 text-red-300'}`}>
            {toast.t === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-semibold text-sm">{toast.m}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">Grievance Portal</span>
                <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-semibold -mt-0.5">Student Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {student && (
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                    {student.Name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{student.Name}</span>
                </div>
              )}
              <button onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-red-500/90 hover:text-white transition-all duration-300 border border-white/5 hover:border-red-500 group">
                <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">

        {/* Welcome + Stats */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {student?.Name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-400 text-sm">Manage and track your grievances from one place.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Grievances', val: grievances.length, grad: 'from-indigo-500 to-blue-500', icon: FileText },
            { label: 'Pending', val: pending, grad: 'from-amber-500 to-orange-500', icon: Clock },
            { label: 'Resolved', val: resolved, grad: 'from-emerald-500 to-green-500', icon: CheckCircle },
            { label: 'Categories Used', val: new Set(grievances.map(g => g.Category)).size, grad: 'from-purple-500 to-pink-500', icon: Filter },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4 hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.grad} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <s.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${s.grad}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input type="text" placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()} />
          </div>
          <button onClick={doSearch} className="px-4 py-2.5 glass rounded-xl text-sm font-semibold text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              showForm ? 'bg-slate-700 text-white border border-slate-600' : 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30'}`}>
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Grievance</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-6 animate-scale-in">
            <div className="glass-strong rounded-2xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                {editId ? 'Update Grievance' : 'Submit New Grievance'}
              </h3>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Title</label>
                    <input type="text" required placeholder="Brief title..."
                      className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.Title} onChange={e => setFormData({ ...formData, Title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <select required
                      className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                      value={formData.Category} onChange={e => setFormData({ ...formData, Category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {editId && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                      <select className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                        value={formData.Status} onChange={e => setFormData({ ...formData, Status: e.target.value })}>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea required rows={3} placeholder="Describe your grievance..."
                    className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    value={formData.Description} onChange={e => setFormData({ ...formData, Description: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <button type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-indigo-500 hover:to-emerald-500 shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" /> {editId ? 'Update' : 'Submit'}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-5 py-2.5 bg-slate-700 text-sm text-white font-semibold rounded-xl hover:bg-slate-600 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grievance List */}
        {displayed.length === 0 ? (
          <div className="text-center py-20 animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center">
              <FileText className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-400 mb-2">No grievances found</h3>
            <p className="text-slate-500 text-sm mb-6">Click "New Grievance" to submit your first complaint.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2 hover:from-indigo-500 hover:to-emerald-500 transition-all">
              <Plus className="w-4 h-4" /> New Grievance
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((g, i) => {
              const cfg = CAT_CONFIG[g.Category] || CAT_CONFIG.Other;
              const CatIcon = cfg.icon;
              const isPending = g.Status === 'Pending';
              return (
                <div key={g._id} className="glass rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-all animate-fade-up group" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Category Icon */}
                      <div className={`hidden sm:flex w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${cfg.gradient} items-center justify-center shadow-md`}>
                        <CatIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h4 className="text-base font-bold text-white truncate">{g.Title}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <CatIcon className="w-3 h-3 sm:hidden" />
                            {g.Category}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                            isPending ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'}`}>
                            {isPending ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {g.Status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{g.Description}</p>
                        <p className="text-[11px] text-slate-500 mt-2 font-medium">
                          📅 {new Date(g.Date || g.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(g)} title="Edit"
                        className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => doDelete(g._id)} title="Delete"
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-slate-500">© 2025 Student Grievance Management System — Built with MERN Stack</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
