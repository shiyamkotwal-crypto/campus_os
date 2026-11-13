import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Tag,
  BookOpen
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { CalendarMilestone } from '../../types';

export const AdminCalendar: React.FC = () => {
  const [milestones, setMilestones] = useState<CalendarMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    end_date: '',
    category: 'academic' as CalendarMilestone['category'],
    semester: 'Fall 2026',
    description: '',
    is_holiday: false
  });

  const loadCalendar = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/academics/calendar');
      if (res && res.milestones) {
        setMilestones(res.milestones);
      }
    } catch (err: any) {
      console.error('Error fetching calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date) return;
    setSubmitting(true);

    const newM: CalendarMilestone = {
      id: `cal-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      event_type: formData.category || 'academic',
      start_date: formData.event_date,
      event_date: formData.event_date,
      end_date: formData.end_date,
      applies_to: 'all',
      category: formData.category,
      semester: formData.semester,
      is_holiday: formData.is_holiday
    };

    setMilestones([...milestones, newM]);
    setShowAddModal(false);
    setSubmitting(false);
    setSuccessMsg(`Milestone "${formData.title}" published to university academic calendar.`);
    setFormData({
      title: '',
      event_date: '',
      end_date: '',
      category: 'academic',
      semester: 'Fall 2026',
      description: '',
      is_holiday: false
    });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = milestones.filter(
    (m) => categoryFilter === 'all' || m.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Academic Secretariat • Institutional Schedule</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Academic Calendar Governance</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Publish semester commencement dates, examination periods, recesses, and institutional gazetted holidays.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Calendar Event</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic Milestones</option>
            <option value="examination">Examinations</option>
            <option value="holiday">Holidays & Recess</option>
            <option value="event">Campus Cultural / Tech</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filtered.length}</span> published events
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const dateStr = item.event_date || item.start_date || new Date().toISOString();
          const d = new Date(dateStr);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                    item.category === 'examination'
                      ? 'bg-purple-100 text-purple-700'
                      : item.category === 'holiday'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider">
                    {d.toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-base font-extrabold leading-none">
                    {d.getDate()}
                  </span>
                </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.category === 'examination'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : item.category === 'holiday'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {item.category}
                  </span>
                  {item.is_holiday && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Campus Closed
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1">{item.description}</p>

                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
                  <span>Semester: {item.semester || 'Fall 2026'}</span>
                  {item.end_date && <span>• Through: {item.end_date}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                Visible to Students & Faculty
              </span>
            </div>
          </div>
        );
      })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Add Academic Milestone</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commencement of Classes / Semester Exams"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="academic">Academic Milestone</option>
                    <option value="examination">Examination</option>
                    <option value="holiday">Holiday / Recess</option>
                    <option value="event">Campus Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2027">Spring 2027</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details regarding attendance requirements, hall tickets, or holiday observance..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_holiday"
                  checked={formData.is_holiday}
                  onChange={(e) => setFormData({ ...formData, is_holiday: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="is_holiday" className="text-xs text-slate-700 font-medium">
                  Mark as Gazetted Holiday (Campus Closed)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                >
                  {submitting ? 'Publishing...' : 'Publish to Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
