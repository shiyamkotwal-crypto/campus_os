import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

export const FacultyCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setError(null);
        const res = await apiRequest<{ courses: any[] }>('/academics/courses');
        setCourses(res.courses || []);
      } catch (err: any) {
        console.error('Failed to load faculty courses:', err);
        setError(err.message || 'Unable to load assigned courses from database');
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Assigned Course Offerings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified academic curriculum ledger • Real-time enrollment and timetable schedules.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Courses Assigned</h3>
          <p className="text-xs text-slate-400 mt-1">
            You do not currently have any active course sections assigned for this academic term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((c) => (
            <div key={c.id || c.code} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-campus-50 text-campus-700 border border-campus-100">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-400">Year {c.year} • Sem {c.semester}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-2">{c.name}</h2>
                {c.description && (
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{c.description}</p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.students} Students Enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.hall}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{c.time}</span>
                <Link to="/faculty/assignments" className="text-campus-600 hover:text-campus-700 font-semibold flex items-center gap-1">
                  View Assessments <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


