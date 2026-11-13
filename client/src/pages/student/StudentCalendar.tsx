import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Tag
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { CalendarMilestone } from '../../types';

export const StudentCalendar: React.FC = () => {
  const [milestones, setMilestones] = useState<CalendarMilestone[]>([]);
  const [filterType, setFilterType] = useState('all');
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

  const filtered = milestones.filter(
    (m) => filterType === 'all' || m.event_type === filterType
  );

  const getTagBadge = (type: string) => {
    switch (type) {
      case 'exam':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Examinations</span>;
      case 'holiday':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Recess / Holiday</span>;
      case 'registration':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Deadline</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-campus-50 text-campus-700 border border-campus-200">Academic</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-campus-50 text-campus-700 border border-campus-200/80 mb-2">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Institutional Schedules</span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          University Academic Calendar 2026–2027
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Key institutional dates including continuous assessments, end-semester exams, registration deadlines, and holidays.
        </p>

        {/* Filter buttons */}
        <div className="mt-5 flex flex-wrap gap-2">
          {['all', 'exam', 'academic', 'holiday', 'registration'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition capitalize ${
                filterType === type
                  ? 'bg-campus-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {type === 'all' ? 'All Milestones' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-center shrink-0 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {new Date(item.start_date || item.event_date || new Date().toISOString()).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-base font-extrabold text-slate-900 leading-none">
                  {new Date(item.start_date || item.event_date || new Date().toISOString()).getDate()}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  {getTagBadge(item.event_type || item.category || 'academic')}
                </div>
                <p className="text-xs text-slate-500 max-w-2xl">{item.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-mono">
                  <span>From: {item.start_date}</span>
                  <span>→</span>
                  <span>To: {item.end_date}</span>
                  <span>•</span>
                  <span>{item.applies_to}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
