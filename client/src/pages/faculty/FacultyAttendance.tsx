import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Calendar,
  Users,
  Clock,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FacultyAttendance: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent' | 'excused'>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await apiRequest('/academics/courses');
        setCourses(res.courses || []);
        if (res.courses && res.courses.length > 0) {
          setSelectedCourseId(res.courses[0].id);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    async function loadCourseStudents() {
      try {
        const res = await apiRequest(`/academics/courses/${selectedCourseId}/students`);
        const list = res.students || [];
        setStudents(list);
        // Default all students to present
        const initialState: Record<string, 'present' | 'absent' | 'excused'> = {};
        list.forEach((s: any) => {
          initialState[s.id] = 'present';
        });
        setAttendanceState(initialState);
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    }
    loadCourseStudents();
  }, [selectedCourseId]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'excused') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'present' | 'absent' | 'excused'> = {};
    students.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourseId || students.length === 0) return;
    setSaving(true);
    setSaveSuccess(null);

    const records = students.map((s) => ({
      student_id: s.id,
      status: attendanceState[s.id] || 'present'
    }));

    try {
      await apiRequest('/academics/attendance/mark', {
        method: 'POST',
        body: JSON.stringify({
          course_id: selectedCourseId,
          attendance_date: attendanceDate,
          records
        })
      });

      setSaveSuccess(`Attendance for ${records.length} students recorded successfully.`);
    } catch (err: any) {
      alert(err.message || 'Failed to submit attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendanceState).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendanceState).filter((s) => s === 'absent').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Daily Academic Accountability</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record lecture session attendance and maintain compliance with the 75% attendance threshold.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Control Panel: Course & Date Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Select Assigned Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Lecture Session Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
          >
          </input>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Present</span>
            <div className="text-base font-extrabold text-emerald-600">{presentCount}</div>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Absent</span>
            <div className="text-base font-extrabold text-rose-600">{absentCount}</div>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Roster</span>
            <div className="text-base font-extrabold text-slate-800">{students.length}</div>
          </div>
        </div>
      </div>

      {/* Attendance Marking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Roll No</th>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-4 text-center">Current Aggregate %</th>
                <th className="py-3.5 px-6 text-center">Attendance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const currentStatus = attendanceState[st.id] || 'present';
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                      {st.institutional_id}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{st.full_name}</div>
                      <div className="text-[11px] text-slate-400">{st.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-bold ${st.attendance_percentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {st.attendance_percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'excused')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'excused'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
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

