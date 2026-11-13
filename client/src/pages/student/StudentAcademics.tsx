import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  CheckSquare,
  ArrowRight,
  User,
  GraduationCap
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const StudentAcademics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAcademics() {
      try {
        setError(null);
        const res = await apiRequest('/academics/overview');
        setData(res);
      } catch (err: any) {
        console.error('Failed to load academics:', err);
        setError(err.message || 'Failed to load enrolled courses');
      } finally {
        setLoading(false);
      }
    }
    loadAcademics();
  }, []);

  const courses = data?.enrolled_courses || [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Academic Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            B.Tech Computer Science & Engineering • 3rd Year (Semester 5)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/timetable"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-campus-600" />
            <span>Class Timetable</span>
          </Link>
          <Link
            to="/student/attendance"
            className="px-3.5 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Attendance Records</span>
          </Link>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-campus-50 text-campus-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Registered Courses</div>
            <div className="text-xl font-bold text-slate-900">{courses.length} Subjects</div>
            <div className="text-[11px] text-slate-400">18 Total Credit Units</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Academic Performance</div>
            <div className="text-xl font-bold text-slate-900">8.74 CGPA</div>
            <div className="text-[11px] text-emerald-600 font-medium">Graduation on track</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Earned Degree Credits</div>
            <div className="text-xl font-bold text-slate-900">84 / 160</div>
            <div className="text-[11px] text-slate-400">52.5% degree completed</div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Enrolled Courses — Autumn 2026</h2>
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">No Enrolled Courses</h3>
            <p className="text-xs text-slate-400 mt-1">You are not currently enrolled in any academic courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {courses.map((course: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-campus-50 text-campus-700 border border-campus-100">
                      {course.course_code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{course.credits || 4} Credits</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{course.course_name}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-[11px]">{course.faculty_name}</span>
                  </div>
                  <Link
                    to="/student/assignments"
                    className="text-campus-600 hover:text-campus-700 font-semibold flex items-center gap-1"
                  >
                    Assignments <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

