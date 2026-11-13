import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  TrendingUp
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { AttendanceRecord, AttendanceSummary } from '../../types';

export const StudentAttendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttendance() {
      try {
        setError(null);
        const res = await apiRequest<{ records: AttendanceRecord[]; summary: AttendanceSummary[] }>('/academics/attendance');
        setRecords(res.records || []);
        setSummary(res.summary || []);
      } catch (err: any) {
        console.error('Failed to load attendance:', err);
        setError(err.message || 'Unable to fetch verified attendance ledger');
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const totalSessions = summary.reduce((acc, curr) => acc + curr.total_sessions, 0);
  const totalAttended = summary.reduce((acc, curr) => acc + curr.attended_sessions, 0);
  const aggregatePercentage = totalSessions > 0 ? Math.round((totalAttended / totalSessions) * 100) : (records.length > 0 ? 100 : 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-xl"></div>
        <div className="h-36 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-48 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Authorized Attendance Records</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified subject-wise attendance ledger • Minimum institutional eligibility requirement is 75%.
        </p>
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Term Aggregate
          </div>
          <div className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span>{aggregatePercentage}%</span>
            {aggregatePercentage >= 75 ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Exam Eligible
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Below Requirement
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Total of {totalAttended} sessions attended out of {totalSessions} conducted classes.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Progress to 100%</span>
            <span>{aggregatePercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${aggregatePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              style={{ width: `${aggregatePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Breakdown Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Course Attendance Breakdown</h2>
        {summary.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No course attendance breakdown recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-campus-50 text-campus-700 border border-campus-100">
                    {item.course_code}
                  </span>
                  <span className={`text-xs font-bold ${item.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.percentage}%
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.course_name}</h3>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {item.attended_sessions} / {item.total_sessions} Classes Attended
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Daily Session Log
          </h3>
          <span className="text-[11px] text-slate-400">Past 30 Days</span>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No attendance ledger records found for this academic period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Course Code</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {new Date(r.attendance_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-campus-700">
                      {r.courses?.course_code}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {r.courses?.course_name}
                    </td>
                    <td className="py-3 px-4">
                      {r.status === 'present' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Present
                        </span>
                      ) : r.status === 'excused' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Excused
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3" /> Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

