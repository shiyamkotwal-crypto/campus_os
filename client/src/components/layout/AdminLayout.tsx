import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Award,
  CalendarDays,
  Megaphone,
  FolderOpen,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  MapPin,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
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
      title: 'Institutional Command',
      links: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Control Center' },
        { to: '/admin/analytics', icon: BarChart3, label: 'Platform Analytics' },
        { to: '/admin/audit-logs', icon: FileText, label: 'Security Audit Logs' }
      ]
    },
    {
      title: 'Academic Governance',
      links: [
        { to: '/admin/departments', icon: Building, label: 'Departments' },
        { to: '/admin/programs', icon: GraduationCap, label: 'Degree Programs' },
        { to: '/admin/courses', icon: BookOpen, label: 'Course Catalog' },
        { to: '/admin/timetable', icon: Clock, label: 'Timetable Scheduling' },
        { to: '/admin/attendance', icon: Calendar, label: 'Attendance Monitoring', badge: 'Alerts' },
        { to: '/admin/examinations', icon: Award, label: 'Examination Operations' },
        { to: '/admin/calendar', icon: CalendarDays, label: 'Academic Calendar' }
      ]
    },
    {
      title: 'Identity & Operations',
      links: [
        { to: '/admin/users', icon: Users, label: 'User Directory & Roles' },
        { to: '/admin/announcements', icon: Megaphone, label: 'Circular Management' },
        { to: '/admin/documents', icon: FolderOpen, label: 'Knowledge Base (RAG)' },
        { to: '/admin/support', icon: HelpCircle, label: 'Support Ticket Queue' },
        { to: '/admin/services', icon: MapPin, label: 'Campus Facilities' },
        { to: '/admin/settings', icon: Settings, label: 'System Configuration' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Administrator Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <span>CAMPUS<span className="text-purple-600">OS</span></span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
            University Administration Console
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            to="/admin/audit-logs"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Audit Trail</span>
          </Link>

          <Link
            to="/admin/support"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition"
            aria-label="Support Queue"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.full_name || 'Dr. Arthur Vance'}
                </div>
                <div className="text-[10px] text-purple-600 font-semibold">
                  Dean / Institutional Admin
                </div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-1 inline-block text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    Institutional Governance • Super Admin
                  </div>
                </div>

                <Link
                  to="/admin/users"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>User Directory</span>
                </Link>

                <Link
                  to="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>System Settings</span>
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

        {/* Dedicated Admin Sidebar */}
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
                              ? 'bg-purple-50 text-purple-700 font-semibold border-r-2 border-purple-600'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-600 text-white shadow-xs">
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
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Institutional Governance</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Apex Institute of Technology • v1.0
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

