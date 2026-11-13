import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  BookOpen,
  CheckSquare,
  Megaphone,
  Users,
  Plus,
  ArrowRight,
  Clock
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await apiRequest('/dashboard/faculty');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const faculty = data?.faculty || {
    full_name: user?.full_name || 'Dr. Sarah Jenkins',
    designation: 'Associate Professor',
    department: 'Computer Science and Engineering'
  };

  const assignedCourses = data?.assigned_courses || [
    { id: '1', course_code: 'CS301', course_name: 'Distributed Systems & Cloud Computing', semester: 5 },
    { id: '3', course_code: 'CS308', course_name: 'Database Engineering & Storage Systems', semester: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Faculty Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-emerald-400 mb-3 border border-white/10">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty & Academic Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome, {faculty.full_name}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
            {faculty.designation} • Department of {faculty.department}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/faculty/announcements"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white text-xs font-semibold transition shadow-sm"
            >
              <Megaphone className="w-4 h-4" />
              <span>Publish Circular</span>
            </Link>
            <Link
              to="/faculty/assignments"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Create Assignment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-campus-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">142</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 2 assigned courses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Pending Submissions</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">18</div>
          <div className="text-[11px] text-amber-600 mt-1">Awaiting evaluation</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Upcoming Lectures</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">2 Today</div>
          <div className="text-[11px] text-emerald-600 mt-1">LH-204 at 09:00 AM</div>
        </div>
      </div>

      {/* Assigned Courses */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-campus-600" />
            <h2 className="text-sm font-bold text-slate-900">Your Assigned Courses</h2>
          </div>
          <Link to="/faculty/courses" className="text-xs text-campus-600 hover:text-campus-700 font-semibold">
            View All Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedCourses.map((c: any) => (
            <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-campus-100 text-campus-700">
                    {c.course_code}
                  </span>
                  <span className="text-[11px] text-slate-400">Semester {c.semester}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{c.course_name}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <Link to="/faculty/assignments" className="text-campus-600 hover:text-campus-700 font-semibold flex items-center gap-1">
                  Manage Assignments <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

