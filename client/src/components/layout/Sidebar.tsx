import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Megaphone,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  MapPin,
  HelpCircle,
  FolderOpen,
  Users,
  Building,
  BarChart3,
  FileText,
  Compass,
  Search,
  Settings,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  to: string;
  icon: any;
  label: string;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const studentLinks: NavItem[] = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/assistant', icon: Sparkles, label: 'Campus AI Assistant', badge: 'AI' },
    { to: '/student/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/student/academics', icon: BookOpen, label: 'Academic Overview' },
    { to: '/student/timetable', icon: Clock, label: 'Weekly Timetable' },
    { to: '/student/assignments', icon: CheckSquare, label: 'Assignments' },
    { to: '/student/attendance', icon: Calendar, label: 'Attendance Records' },
    { to: '/student/events', icon: Compass, label: 'Campus Events' },
    { to: '/student/lost-found', icon: Search, label: 'Lost & Found' },
    { to: '/student/navigation', icon: MapPin, label: 'Campus Directory' },
    { to: '/student/support', icon: HelpCircle, label: 'Helpdesk & Support' },
    { to: '/student/documents', icon: FolderOpen, label: 'Institutional Docs' }
  ];

  const facultyLinks: NavItem[] = [
    { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Faculty Dashboard' },
    { to: '/faculty/announcements', icon: Megaphone, label: 'Publish Circulars' },
    { to: '/faculty/courses', icon: BookOpen, label: 'Assigned Courses' },
    { to: '/faculty/assignments', icon: CheckSquare, label: 'Assignments' },
    { to: '/faculty/students', icon: Users, label: 'Student Directory' },
    { to: '/faculty/timetable', icon: Clock, label: 'Schedule' },
    { to: '/faculty/support', icon: HelpCircle, label: 'Assigned Tickets' }
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Overview' },
    { to: '/admin/users', icon: Users, label: 'User Directory' },
    { to: '/admin/announcements', icon: Megaphone, label: 'Circular Management' },
    { to: '/admin/documents', icon: FolderOpen, label: 'Knowledge & RAG' },
    { to: '/admin/departments', icon: Building, label: 'Departments' },
    { to: '/admin/programs', icon: GraduationCap, label: 'Academic Programs' },
    { to: '/admin/courses', icon: BookOpen, label: 'Course Catalog' },
    { to: '/admin/events', icon: Compass, label: 'Campus Events' },
    { to: '/admin/services', icon: MapPin, label: 'Locations & Services' },
    { to: '/admin/support', icon: HelpCircle, label: 'Support Queue' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Platform Analytics' },
    { to: '/admin/audit-logs', icon: FileText, label: 'Security Audit Logs' },
    { to: '/admin/settings', icon: Settings, label: 'System Settings' }
  ];

  const links = role === 'admin' ? adminLinks : role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="py-4 px-3 space-y-6">
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {role === 'admin' ? 'Institutional Control' : role === 'faculty' ? 'Faculty Portal' : 'Student Workspace'}
            </div>
            <nav className="space-y-0.5">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-campus-50 text-campus-700 font-semibold border-r-2 border-campus-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
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
        </div>

        {/* Bottom Banner */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 m-2 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-campus-600" />
            <span>CAMPUS OS v1.0</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Grounded on Google Gemini & pgvector
          </p>
        </div>
      </aside>
    </>
  );
};
