import React, { useEffect, useState } from 'react';
import {
  Clock,
  MapPin,
  BookOpen,
  Calendar,
  Users,
  Download
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FacultyTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const res = await apiRequest('/academics/timetable');
        setTimetable(res.timetable || []);
      } catch (err) {
        console.error('Failed to load faculty timetable:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Weekly Instructional Schedule</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Faculty Teaching Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Weekly allocated lecture hours, laboratory sessions, and assigned seminar halls.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Print Schedule</span>
        </button>
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {days.map((day) => {
          const sessions = timetable.filter((t) => t.day_of_week === day.id);
          return (
            <div key={day.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">{day.name}</span>
                <span className="text-[10px] font-semibold text-slate-400">{sessions.length} Lectures</span>
              </div>

              <div className="p-4 space-y-3 flex-1">
                {sessions.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/30 transition">
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 font-semibold mb-1">
                      <span>{item.start_time?.slice(0, 5)} – {item.end_time?.slice(0, 5)}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-800 text-[10px]">
                        {item.courses?.course_code || 'CS301'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.courses?.course_name || 'Distributed Systems Lecture'}
                    </h4>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.room || 'Hall 204'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Batch A • Sem 5</span>
                    </div>
                  </div>
                ))}

                {sessions.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    No teaching sessions scheduled.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

