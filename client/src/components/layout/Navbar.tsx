import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  Shield,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout, quickSwitchDemoUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = async (role: UserRole) => {
    setShowRoleSwitcher(false);
    await quickSwitchDemoUser(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Briefcase className="w-3 h-3" /> Faculty
          </span>
        );
      case 'student':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-campus-100 text-campus-700 border border-campus-200">
            <GraduationCap className="w-3 h-3" /> Student
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 md:px-6">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Toggle navigation"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-campus-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>CAMPUS<span className="text-campus-600">OS</span></span>
        </Link>

        <span className="hidden sm:inline-block text-xs font-medium text-slate-400 border-l border-slate-200 pl-3">
          Apex Institute of Technology
        </span>
      </div>

      {/* Middle: Universal Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars, courses, campus rooms, or ask AI..."
            className="w-full bg-slate-100/80 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Role Switcher, Notification, Profile */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Role Demo Quick-Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
            title="Switch demo persona"
          >
            <span>Role:</span>
            {user ? getRoleBadge(user.role) : null}
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Demo Persona
              </div>
              <button
                onClick={() => handleRoleSwitch('student')}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <GraduationCap className="w-4 h-4 text-campus-600" />
                <div>
                  <div className="font-medium">Student Persona</div>
                  <div className="text-[10px] text-slate-400">Alex Rivera (3rd Yr)</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSwitch('faculty')}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-medium">Faculty Persona</div>
                  <div className="text-[10px] text-slate-400">Dr. Sarah Jenkins</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="font-medium">Administrator Persona</div>
                  <div className="text-[10px] text-slate-400">Dr. Arthur Vance (Dean)</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <Link
          to={user?.role === 'student' ? '/student/notifications' : '#'}
          className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </Link>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-campus-600 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-medium text-slate-800 leading-none">{user?.full_name || 'Member'}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{user?.email || ''}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-semibold text-xs text-slate-900">{user?.full_name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                <div className="mt-1">{user ? getRoleBadge(user.role) : null}</div>
              </div>

              <div className="py-1">
                <Link
                  to={user?.role === 'student' ? '/student/profile' : user?.role === 'faculty' ? '/faculty/profile' : '/admin/settings'}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Profile Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

