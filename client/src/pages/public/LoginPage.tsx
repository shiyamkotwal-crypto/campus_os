import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, quickSwitchDemoUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setLoading(true);

    try {
      await login(email, password || 'CampusOS@2026');
      const currentUser = JSON.parse(localStorage.getItem('campus_os_user') || '{}');
      if (currentUser.role === 'admin') navigate('/admin/dashboard');
      else if (currentUser.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await quickSwitchDemoUser(role);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } catch (err: any) {
      setError('Failed to log in with demonstration account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-campus-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-campus-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-white tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-campus-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>CAMPUS<span className="text-campus-400">OS</span></span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-white">
          Sign In to Institutional Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your university credentials or select a demonstration persona
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-950 border border-slate-800 py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Institutional Email
              </label>
              <div className="mt-1 relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@student.apex.edu"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] text-campus-400 hover:text-campus-300">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-campus-600 hover:bg-campus-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-campus-600/30 transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Personas
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-campus-500 text-center transition flex flex-col items-center gap-1 group"
              >
                <GraduationCap className="w-4 h-4 text-campus-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-semibold text-slate-200">Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('faculty')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-center transition flex flex-col items-center gap-1 group"
              >
                <Briefcase className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-semibold text-slate-200">Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-center transition flex flex-col items-center gap-1 group"
              >
                <Shield className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-semibold text-slate-200">Admin</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            New student?{' '}
            <Link to="/register" className="text-campus-400 hover:underline font-medium">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

