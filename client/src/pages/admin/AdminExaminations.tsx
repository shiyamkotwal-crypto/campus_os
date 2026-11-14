import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  FileText,
  AlertCircle,
  Download,
  Send,
  Eye
} from 'lucide-react';

interface ExamSchedule {
  id: string;
  course_code: string;
  course_name: string;
  exam_type: 'Midterm I' | 'Midterm II' | 'Semester-End (SEE)' | 'Lab Practical';
  exam_date: string;
  time_slot: string;
  venue_halls: string;
  total_candidates: number;
  hall_tickets_generated: boolean;
  status: 'Scheduled' | 'In Progress' | 'Evaluated' | 'Published';
}

export const AdminExaminations: React.FC = () => {
  const [examTypeFilter, setExamTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [schedules, setSchedules] = useState<ExamSchedule[]>([
    {
      id: 'ex-1',
      course_code: 'CSE-301',
      course_name: 'Database Management Systems',
      exam_type: 'Semester-End (SEE)',
      exam_date: '2026-12-05',
      time_slot: '09:30 AM - 12:30 PM',
      venue_halls: 'Exam Hall 1, Hall 2, Ramanujan Block',
      total_candidates: 180,
      hall_tickets_generated: true,
      status: 'Scheduled'
    },
    {
      id: 'ex-2',
      course_code: 'CSE-302',
      course_name: 'Computer Networks & Protocols',
      exam_type: 'Semester-End (SEE)',
      exam_date: '2026-12-08',
      time_slot: '09:30 AM - 12:30 PM',
      venue_halls: 'Exam Hall 1, Hall 3',
      total_candidates: 175,
      hall_tickets_generated: true,
      status: 'Scheduled'
    },
    {
      id: 'ex-3',
      course_code: 'CSE-304',
      course_name: 'Operating Systems & Kernels',
      exam_type: 'Semester-End (SEE)',
      exam_date: '2026-12-12',
      time_slot: '09:30 AM - 12:30 PM',
      venue_halls: 'Exam Hall 2, Hall 4',
      total_candidates: 185,
      hall_tickets_generated: false,
      status: 'Scheduled'
    },
    {
      id: 'ex-4',
      course_code: 'CSE-301L',
      course_name: 'DBMS Query & Indexing Lab Practical',
      exam_type: 'Lab Practical',
      exam_date: '2026-11-28',
      time_slot: '09:00 AM - 01:00 PM',
      venue_halls: 'Computing Lab 3 & 4',
      total_candidates: 180,
      hall_tickets_generated: true,
      status: 'Scheduled'
    },
    {
      id: 'ex-5',
      course_code: 'CSE-303',
      course_name: 'Design & Analysis of Algorithms',
      exam_type: 'Midterm II',
      exam_date: '2026-11-02',
      time_slot: '10:00 AM - 11:30 AM',
      venue_halls: 'LH-301, LH-302',
      total_candidates: 180,
      hall_tickets_generated: true,
      status: 'Published'
    }
  ]);

  const [formData, setFormData] = useState({
    course_code: 'CSE-305',
    course_name: 'Software Engineering Principles',
    exam_type: 'Semester-End (SEE)' as ExamSchedule['exam_type'],
    exam_date: '2026-12-15',
    time_slot: '09:30 AM - 12:30 PM',
    venue_halls: 'Exam Hall 1 & 2',
    total_candidates: 170
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEx: ExamSchedule = {
      id: `ex-${Date.now()}`,
      ...formData,
      hall_tickets_generated: false,
      status: 'Scheduled'
    };
    setSchedules([...schedules, newEx]);
    setShowScheduleModal(false);
    setSuccessMsg(`Examination slot for ${formData.course_code} created.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePublishResults = (id: string, courseCode: string) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, status: 'Published' } : s))
    );
    setSuccessMsg(`Results for ${courseCode} published to student portal.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDispatchHallTickets = () => {
    setSchedules(schedules.map((s) => ({ ...s, hall_tickets_generated: true })));
    setSuccessMsg('Digital hall tickets generated and dispatched for all scheduled exams.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = schedules.filter((s) => {
    const matchesSearch =
      s.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = examTypeFilter === 'all' || s.exam_type === examTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>Controller of Examinations • Institutional Evaluation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Examination Operations & Results</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Administer semester-end exams, hall ticket releases, invigilation duties, and result publication workflows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDispatchHallTickets}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Release Hall Tickets</span>
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Exam</span>
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search exam by course code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={examTypeFilter}
            onChange={(e) => setExamTypeFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Examination Types</option>
            <option value="Semester-End (SEE)">Semester-End (SEE)</option>
            <option value="Midterm II">Midterm II</option>
            <option value="Lab Practical">Lab Practical</option>
          </select>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Examination Type</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Assigned Venue</th>
                <th className="py-3 px-4">Candidates</th>
                <th className="py-3 px-4">Hall Tickets</th>
                <th className="py-3 px-4">Result Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {item.course_code}
                    </span>
                    <div className="font-bold text-slate-900 mt-1">{item.course_name}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{item.exam_type}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.exam_date}</div>
                    <div className="text-[11px] text-slate-500">{item.time_slot}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{item.venue_halls}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.total_candidates} students</td>
                  <td className="py-3.5 px-4">
                    {item.hall_tickets_generated ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Issued</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Pending Generation
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Published'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status !== 'Published' ? (
                      <button
                        onClick={() => handlePublishResults(item.id, item.course_code)}
                        className="text-xs font-bold text-purple-600 hover:text-purple-700"
                      >
                        Publish Results
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Published Live</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Schedule Examination</h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Type</label>
                  <select
                    value={formData.exam_type}
                    onChange={(e) => setFormData({ ...formData, exam_type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Semester-End (SEE)">Semester-End (SEE)</option>
                    <option value="Midterm II">Midterm II</option>
                    <option value="Lab Practical">Lab Practical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    placeholder="09:30 AM - 12:30 PM"
                    value={formData.time_slot}
                    onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Venues / Examination Halls</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exam Hall 1, Hall 2, Ramanujan Block"
                  value={formData.venue_halls}
                  onChange={(e) => setFormData({ ...formData, venue_halls: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Confirm Exam Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

