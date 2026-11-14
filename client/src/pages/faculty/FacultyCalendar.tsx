import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { CalendarMilestone } from '../../types';

export const FacultyCalendar: React.FC = () => {
  const [milestones, setMilestones] = useState<CalendarMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const res = await apiRequest('/academics/calendar');
        setMilestones(res.calendar || []);
      } catch (err) {
        console.error('Failed to load academic calendar:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, []);

  const facultyDuties = [
    {
      date: '2026-11-24',
      time: '09:30 AM – 12:30 PM',
      duty: 'Midterm Examination Invigilation',
      room: 'Examination Hall 102',
      course: 'CS301 Distributed Systems'
    },
    {
      date: '2026-11-27',
      time: '02:00 PM – 05:00 PM',
      duty: 'Midterm Examination Invigilation',
      room: 'Examination Hall 204',
      course: 'CS308 Database Engineering'
    },
    {
      date: '2026-12-08',
      time: '05:00 PM Deadline',
      duty: 'Continuous Internal Evaluation (CIE) Marks Final Submission',
      room: 'Academic Portal Submission',
      course: 'All Assigned Courses'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Institutional Calendar & Assigned Duties</span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Faculty Academic Calendar & Examination Duties
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor institutional term dates, assigned examination invigilation shifts, and CIE submission deadlines.
        </p>
      </div>

      {/* Faculty Duty Callouts */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-premium border border-emerald-900">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold">Assigned Faculty Examination & Evaluation Duties</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {facultyDuties.map((d, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/10 text-xs">
              <div className="text-emerald-400 font-bold font-mono text-[11px] mb-1">{d.date} • {d.time}</div>
              <div className="font-bold text-white text-sm">{d.duty}</div>
              <div className="text-slate-300 mt-1 font-medium">{d.course}</div>
              <div className="text-slate-400 text-[11px] mt-2 font-mono">{d.room}</div>
            </div>
          ))}
        </div>
      </div>

      {/* University Master Milestones */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-sm text-slate-800">
          Institutional Milestones 2026–2027
        </div>
        <div className="divide-y divide-slate-100">
          {milestones.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                  <span>From: {item.start_date}</span>
                  <span>→</span>
                  <span>To: {item.end_date}</span>
                  <span>•</span>
                  <span>{item.applies_to}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {item.event_type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

