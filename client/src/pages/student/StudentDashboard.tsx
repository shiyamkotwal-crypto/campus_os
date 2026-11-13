import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  CheckSquare,
  AlertCircle,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  Compass
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await apiRequest('/dashboard/student');
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const student = data?.student || {
    full_name: user?.full_name || 'Alex Rivera',
    semester: user?.semester || 5,
    academic_year: user?.academic_year || 3,
    department: user?.department_name || 'Computer Science and Engineering',
    attendance_percentage: data?.student?.attendance_percentage ?? 80
  };

  const todayClasses = data?.today_classes || [];
  const upcomingAssignments = data?.upcoming_assignments || [];
  const announcements = data?.recent_announcements || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-campus-900 via-campus-800 to-indigo-900 p-6 md:p-8 text-white shadow-premium">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-campus-200 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-campus-300" />
            <span>Academic Term 2026 — Semester {student.semester}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {student.full_name}
          </h1>
          <p className="text-xs md:text-sm text-campus-100/90 mt-1.5 font-normal">
            {student.department} • Year {student.academic_year}, Semester {student.semester}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/student/assistant"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-campus-900 text-xs font-semibold hover:bg-campus-50 transition shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-campus-600" />
              <span>Ask Campus AI</span>
            </Link>
            <Link
              to="/student/timetable"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-campus-700/60 hover:bg-campus-700 text-white text-xs font-semibold border border-campus-500/30 transition"
            >
              <Clock className="w-4 h-4" />
              <span>View Timetable</span>
            </Link>
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-campus-600/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cumulative GPA</span>
            <Award className="w-4 h-4 text-campus-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">8.74</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Top 5% in CSE cohort
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overall Attendance</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{student.attendance_percentage}%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Above 75% mandatory threshold
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">5</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            18 Credit Units registered
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Due Assignments</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{upcomingAssignments.length}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            Next due in 4 days
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Schedule & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-campus-600" />
                <h2 className="text-sm font-bold text-slate-900">Today's Class Schedule</h2>
              </div>
              <Link to="/student/timetable" className="text-xs text-campus-600 hover:text-campus-700 font-semibold flex items-center gap-1">
                Full Week <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {todayClasses.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No lectures or labs scheduled for today.
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center text-xs font-bold text-campus-700 bg-campus-100/60 rounded-lg py-1">
                        {item.courses?.course_code || 'CS301'}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{item.courses?.course_name || 'Class'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Room: <strong className="text-slate-700">{item.room}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Institutional Circulars Hub preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-campus-600" />
                <h2 className="text-sm font-bold text-slate-900">Latest Campus Circulars</h2>
              </div>
              <Link to="/student/announcements" className="text-xs text-campus-600 hover:text-campus-700 font-semibold flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {announcements.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No recent circulars published.
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann: any) => (
                  <div key={ann.id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        {ann.category}
                      </span>
                      <span className="text-[11px] text-slate-400">Official Notice</span>
                    </div>
                    <h3 className="text-xs md:text-sm font-semibold text-slate-900">{ann.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Assignments & Quick AI */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-campus-600" />
                <h2 className="text-sm font-bold text-slate-900">Assignments Due</h2>
              </div>
              <Link to="/student/assignments" className="text-xs text-campus-600 hover:text-campus-700 font-semibold flex items-center gap-1">
                Workspace <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingAssignments.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                All assignments submitted or none due.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((a: any) => (
                  <div key={a.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-campus-700">{a.courses?.course_code || 'Course'}</span>
                      <span className="text-rose-600 font-medium">Due in 4 days</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{a.title}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick AI Assistance Box */}
          <div className="rounded-2xl border border-campus-200 bg-gradient-to-br from-campus-50 via-white to-indigo-50/40 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-campus-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-campus-600" />
              Instant Intelligence
            </div>
            <h3 className="text-sm font-bold text-slate-900">Ask campus questions</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Verify examination condonation rules, lab schedules, or ask for a personalized study plan.
            </p>
            <Link
              to="/student/assistant"
              className="mt-4 w-full py-2.5 bg-campus-600 hover:bg-campus-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs"
            >
              <span>Launch Campus AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

