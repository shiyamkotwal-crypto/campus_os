import React, { useEffect, useState } from 'react';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { TimetableEntry } from '../../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const StudentTimetable: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Monday

  useEffect(() => {
    async function loadTimetable() {
      try {
        const res = await apiRequest<{ timetable: TimetableEntry[] }>('/academics/timetable');
        setEntries(res.timetable || []);
      } catch (err) {
        console.error('Failed to load timetable:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTimetable();
  }, []);

  const dayEntries = entries.filter((e) => e.day_of_week === selectedDay);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Personal Weekly Timetable</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Autumn 2026 Academic Schedule • Computer Science and Engineering
        </p>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[1, 2, 3, 4, 5].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedDay === d
                ? 'bg-campus-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {DAYS[d]}
          </button>
        ))}
      </div>

      {/* Timetable Entries List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : dayEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Classes Scheduled</h3>
          <p className="text-xs text-slate-400 mt-1">There are no lectures or lab sessions scheduled on {DAYS[selectedDay]}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEntries.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-xl bg-campus-50 border border-campus-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-extrabold text-campus-700">{item.courses?.course_code}</span>
                  <span className="text-[9px] text-slate-400 font-medium">Lecture</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.courses?.course_name}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Room: <strong className="text-slate-700">{item.room}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.profiles?.full_name || 'Department Faculty'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-campus-600" />
                <span>{item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

