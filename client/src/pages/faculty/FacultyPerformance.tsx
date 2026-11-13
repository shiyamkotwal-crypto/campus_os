import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { apiRequest } from '../../lib/api';

export const FacultyPerformance: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiRequest('/academics/courses');
        setCourses(res.courses || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const gradeDistribution = [
    { grade: 'O (90-100)', count: 24, fill: '#059669' },
    { grade: 'A+ (80-89)', count: 48, fill: '#10b981' },
    { grade: 'A (70-79)', count: 36, fill: '#34d399' },
    { grade: 'B+ (60-69)', count: 18, fill: '#f59e0b' },
    { grade: 'B (50-59)', count: 10, fill: '#fbbf24' },
    { grade: 'F (< 50)', count: 4, fill: '#f43f5e' }
  ];

  const attendanceCohorts = [
    { name: '>= 85%', value: 68, color: '#059669' },
    { name: '75% - 84%', value: 22, color: '#3b82f6' },
    { name: '65% - 74% (Condonation)', value: 7, color: '#f59e0b' },
    { name: '< 65% (Critical)', value: 3, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Classroom Analytics & Insights</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Academic Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grade distributions, attendance cohorts, and early intervention alerts for at-risk students.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Class Average CIE</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">41.8 / 50</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">83.6% Mean Score</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pass Projection</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">97.1%</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">138 of 142 Passing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Attendance Cohort Health</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">86.4%</div>
          <p className="text-[11px] text-slate-400 mt-1">Average Course Rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">At-Risk Interventions</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">4 Students</div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Attendance &lt; 65%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Continuous Assessment Grade Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Class Attendance Standing Cohorts</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceCohorts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceCohorts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            {attendanceCohorts.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 truncate">{c.name}: {c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
