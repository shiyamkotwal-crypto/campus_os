import React, { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  Search,
  Download,
  AlertCircle,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FacultyClasses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFacultyCourses() {
      try {
        const res = await apiRequest('/academics/courses');
        setCourses(res.courses || []);
        if (res.courses && res.courses.length > 0) {
          setSelectedCourseId(res.courses[0].id);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFacultyCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    async function loadStudents() {
      try {
        const res = await apiRequest(`/academics/courses/${selectedCourseId}/students`);
        setStudents(res.students || []);
      } catch (err) {
        console.error('Failed to load students for course:', err);
      }
    }
    loadStudents();
  }, [selectedCourseId]);

  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.institutional_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Class Supervision & Rosters</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Enrolled Student Rosters
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View student directory, institutional identifiers, and real-time attendance standing.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Roster</span>
        </button>
      </div>

      {/* Course Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourseId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
              selectedCourseId === c.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {c.code} — {c.name}
          </button>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, email, or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filtered.length}</span> enrolled students
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Roll / Student ID</th>
                <th className="py-3.5 px-6">Student Name & Contact</th>
                <th className="py-3.5 px-4 text-center">Semester / Year</th>
                <th className="py-3.5 px-4 text-center">Attendance %</th>
                <th className="py-3.5 px-4 text-center">Sessions Present</th>
                <th className="py-3.5 px-6 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((student) => {
                const isAtRisk = student.attendance_percentage < 75;
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                      {student.institutional_id}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{student.full_name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                      Sem {student.semester} (Yr {student.academic_year})
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-xs">
                      <span className={isAtRisk ? 'text-rose-600' : 'text-emerald-600'}>
                        {student.attendance_percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                      {student.attendance_present} / {student.attendance_total || 24}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {isAtRisk ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> Low Attendance
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Eligible
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
