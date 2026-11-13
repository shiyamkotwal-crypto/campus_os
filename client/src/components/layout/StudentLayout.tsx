import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  CheckSquare,
  Award,
  FolderOpen,
  Users,
  Megaphone,
  CalendarDays,
  FileCheck,
  CreditCard,
  Sparkles,
  Compass,
  MapPin,
  Search,
  HelpCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const StudentLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'Academic Core',
      links: [
        { to: '/student/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { to: '/student/academics', icon: BookOpen, label: 'My Courses' },
        { to: '/student/attendance', icon: Calendar, label: 'My Attendance' },
        { to: '/student/timetable', icon: Clock, label: 'Weekly Timetable' },
        { to: '/student/assignments', icon: CheckSquare, label: 'Assignments' },
        { to: '/student/results', icon: Award, label: 'Exam & Results', badge: 'New' },
        { to: '/student/materials', icon: FolderOpen, label: 'Study Materials' },
        { to: '/student/faculty', icon: Users, label: 'Faculty Directory' }
      ]
    },
    {
      title: 'Campus Life & Requests',
      links: [
        { to: '/student/announcements', icon: Megaphone, label: 'Announcements' },
        { to: '/student/leave', icon: FileCheck, label: 'Leave Applications' },
        { to: '/student/fees', icon: CreditCard, label: 'Fee Information' },
        { to: '/student/calendar', icon: CalendarDays, label: 'Academic Calendar' },
        { to: '/student/assistant', icon: Sparkles, label: 'AI Campus Guide', badge: 'AI' },
        { to: '/student/events', icon: Compass, label: 'Campus Events' },
        { to: '/student/navigation', icon: MapPin, label: 'Campus Map' },
        { to: '/student/lost-found', icon: Search, label: 'Lost & Found' }
      ]
    },
    {
      title: 'Account & Support',
      links: [
        { to: '/student/support', icon: HelpCircle, label: 'Helpdesk & Support' },
        { to: '/student/notifications', icon: Bell, label: 'Notifications' },
        { to: '/student/profile', icon: User, label: 'Profile & Settings' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Student Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/student/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-campus-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span>CAMPUS<span className="text-campus-600">OS</span></span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-campus-50 text-campus-700 border border-campus-200/80">
            Student Portal
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            to="/student/assistant"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-campus-50 to-indigo-50 hover:from-campus-100 hover:to-indigo-100 text-campus-700 border border-campus-200 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-campus-600" />
            <span>Ask AI</span>
          </Link>

          <Link
            to="/student/notifications"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-campus-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.full_name?.charAt(0) || 'S'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.full_name || 'Student Member'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {user?.institutional_id || '22CSE1042'}
                </div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-1 inline-block text-[10px] font-semibold text-campus-700 bg-campus-50 px-2 py-0.5 rounded-md">
                    Semester {user?.semester || 5} • {user?.department_name || 'CSE'}
                  </div>
                </div>

                <Link
                  to="/student/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile & ID</span>
                </Link>

                <Link
                  to="/student/results"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Transcript</span>
                </Link>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* Dedicated Student Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col justify-between overflow-y-auto`}
        >
          <div className="py-4 px-3 space-y-5">
            {navSections.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>
                <nav className="space-y-0.5">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-campus-50 text-campus-700 font-semibold border-r-2 border-campus-600'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-campus-500 to-indigo-600 text-white shadow-xs">
                            {link.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/70 m-3 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <GraduationCap className="w-4 h-4 text-campus-600" />
              <span>Apex Institute of Tech</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Student ID: {user?.institutional_id || '22CSE1042'}
            </p>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
