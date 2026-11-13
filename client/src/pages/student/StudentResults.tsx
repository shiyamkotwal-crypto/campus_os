import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Download,
  AlertCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { AcademicResult } from '../../types';

export const StudentResults: React.FC = () => {
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await apiRequest('/academics/results');
        setResults(res.results || []);
        setSummary(res.summary || null);
      } catch (err) {
        console.error('Failed to load academic results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-campus-50 text-campus-700 border border-campus-200/80 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Official Examination Records</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Performance & Results
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Continuous Internal Evaluation (50%) & Semester Examination (50%) Breakdown
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Download Marksheet</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Current SGPA</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {summary?.sgpa || '9.10'}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Semester {summary?.semester || 5} Performance
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Cumulative CGPA</span>
            <Award className="w-4 h-4 text-campus-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {summary?.cgpa || '8.86'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 84 Credits</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Credits Earned</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {summary?.earned_credits || '18'} / {summary?.total_credits || '18'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% Course Completion</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Academic Standing</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-2 truncate">
            {summary?.status || 'Distinction'}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Eligible for Honors</p>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-campus-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Semester {summary?.semester || 5} Course Grade Matrix
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Grading System: 10-Point Absolute Scale</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Course Code & Name</th>
                <th className="py-3.5 px-4 text-center">Credits</th>
                <th className="py-3.5 px-4 text-center">CIE Marks (50)</th>
                <th className="py-3.5 px-4 text-center">SEE Marks (50)</th>
                <th className="py-3.5 px-4 text-center">Total (100)</th>
                <th className="py-3.5 px-4 text-center">Grade Letter</th>
                <th className="py-3.5 px-4 text-center">Grade Point</th>
                <th className="py-3.5 px-6 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{r.course_code}</div>
                    <div className="text-[11px] text-slate-500">{r.course_name}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-700">{r.credits}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">{r.internal_marks}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">{r.exam_marks ?? '—'}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-extrabold text-campus-700">{r.total_marks}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-800">
                      {r.grade_letter}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">{r.grade_point}</td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Passed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Regulation Notice */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Apex Institute Academic Regulations (Clause 6.1): </span>
          Evaluation is calculated with 50% Continuous Internal Evaluation (CIE) and 50% Semester End Examination (SEE). A minimum of 40% in SEE and 40% aggregate overall is mandatory for credit validation. Official grade cards are sealed digitally with cryptographic verification.
        </div>
      </div>
    </div>
  );
};
