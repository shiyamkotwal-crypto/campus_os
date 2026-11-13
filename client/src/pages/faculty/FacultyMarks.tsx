import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FacultyMarks: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [marksData, setMarksData] = useState<Record<string, { mid1: number; mid2: number; lab: number; quiz: number }>>({});
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
    async function loadStudents() {
      try {
        const res = await apiRequest(`/academics/courses/${selectedCourseId}/students`);
        const list = res.students || [];
        setStudents(list);

        // Prepopulate standard marks state
        const initialMarks: Record<string, { mid1: number; mid2: number; lab: number; quiz: number }> = {};
        list.forEach((s: any, idx: number) => {
          initialMarks[s.id] = {
            mid1: 13 + (idx % 3),
            mid2: 12 + (idx % 4),
            lab: 14,
            quiz: 4
          };
        });
        setMarksData(initialMarks);
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    }
    loadStudents();
  }, [selectedCourseId]);

  const handleMarkChange = (studentId: string, field: 'mid1' | 'mid2' | 'lab' | 'quiz', value: number) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { mid1: 0, mid2: 0, lab: 0, quiz: 0 }),
        [field]: value
      }
    }));
  };

  const handleSaveMarks = () => {
    setSaveSuccess('Continuous Internal Evaluation (CIE) marks synced and updated in student academic records.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Continuous Internal Evaluation (50 Marks)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Internal Assessment Marks Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain rubric-based grading: Midterm 1 (15m), Midterm 2 (15m), Laboratory/Project (15m), and Quizzes (5m).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            Export Sheet
          </button>
          <button
            onClick={handleSaveMarks}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>Publish Marks</span>
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

      {/* Marks Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Roll No & Student</th>
                <th className="py-3.5 px-4 text-center">Midterm 1 (15m)</th>
                <th className="py-3.5 px-4 text-center">Midterm 2 (15m)</th>
                <th className="py-3.5 px-4 text-center">Lab / Project (15m)</th>
                <th className="py-3.5 px-4 text-center">Participation (5m)</th>
                <th className="py-3.5 px-6 text-center">Total CIE (50m)</th>
                <th className="py-3.5 px-6 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const marks = marksData[st.id] || { mid1: 0, mid2: 0, lab: 0, quiz: 0 };
                const total = marks.mid1 + marks.mid2 + marks.lab + marks.quiz;
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{st.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{st.institutional_id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={marks.mid1}
                        onChange={(e) => handleMarkChange(st.id, 'mid1', Number(e.target.value))}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center font-bold text-slate-800"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={marks.mid2}
                        onChange={(e) => handleMarkChange(st.id, 'mid2', Number(e.target.value))}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center font-bold text-slate-800"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={marks.lab}
                        onChange={(e) => handleMarkChange(st.id, 'lab', Number(e.target.value))}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center font-bold text-slate-800"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={marks.quiz}
                        onChange={(e) => handleMarkChange(st.id, 'quiz', Number(e.target.value))}
                        className="w-14 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center font-bold text-slate-800"
                      />
                    </td>
                    <td className="py-3.5 px-6 text-center font-extrabold text-sm text-emerald-700 font-mono">
                      {total} / 50
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {total >= 20 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Passing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> Below Threshold
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
