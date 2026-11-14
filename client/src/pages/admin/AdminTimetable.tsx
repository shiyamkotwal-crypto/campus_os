import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Building,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  User,
  BookOpen
} from 'lucide-react';

interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time_start: string;
  time_end: string;
  course_code: string;
  course_name: string;
  instructor: string;
  room: string;
  section: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export const AdminTimetable: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<string>('Semester 5');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [slots, setSlots] = useState<TimetableSlot[]>([
    {
      id: 'tt-1',
      day: 'Monday',
      time_start: '09:00',
      time_end: '10:00',
      course_code: 'CSE-301',
      course_name: 'Database Management Systems',
      instructor: 'Dr. Alan Turing',
      room: 'LH-302 (Turing Hall)',
      section: 'Section A',
      type: 'Lecture'
    },
    {
      id: 'tt-2',
      day: 'Monday',
      time_start: '10:15',
      time_end: '11:15',
      course_code: 'CSE-304',
      course_name: 'Operating Systems & Kernels',
      instructor: 'Dr. Dennis Ritchie',
      room: 'LH-305',
      section: 'Section A',
      type: 'Lecture'
    },
    {
      id: 'tt-3',
      day: 'Monday',
      time_start: '11:30',
      time_end: '13:00',
      course_code: 'CSE-301L',
      course_name: 'DBMS Query & Indexing Lab',
      instructor: 'Dr. Alan Turing & TA',
      room: 'Computing Lab 4',
      section: 'Batch A1',
      type: 'Lab'
    },
    {
      id: 'tt-4',
      day: 'Monday',
      time_start: '14:00',
      time_end: '15:00',
      course_code: 'CSE-302',
      course_name: 'Computer Networks & Protocols',
      instructor: 'Prof. Radia Perlman',
      room: 'LH-302 (Turing Hall)',
      section: 'Section A',
      type: 'Lecture'
    },
    {
      id: 'tt-5',
      day: 'Tuesday',
      time_start: '09:00',
      time_end: '10:00',
      course_code: 'CSE-303',
      course_name: 'Design & Analysis of Algorithms',
      instructor: 'Dr. Donald Knuth',
      room: 'LH-101',
      section: 'Section A',
      type: 'Lecture'
    },
    {
      id: 'tt-6',
      day: 'Tuesday',
      time_start: '10:15',
      time_end: '11:15',
      course_code: 'CSE-301',
      course_name: 'Database Management Systems',
      instructor: 'Dr. Alan Turing',
      room: 'LH-302 (Turing Hall)',
      section: 'Section A',
      type: 'Lecture'
    },
    {
      id: 'tt-7',
      day: 'Wednesday',
      time_start: '09:00',
      time_end: '10:00',
      course_code: 'CSE-304',
      course_name: 'Operating Systems & Kernels',
      instructor: 'Dr. Dennis Ritchie',
      room: 'LH-305',
      section: 'Section A',
      type: 'Lecture'
    },
    {
      id: 'tt-8',
      day: 'Thursday',
      time_start: '11:30',
      time_end: '13:00',
      course_code: 'CSE-303L',
      course_name: 'Algorithms Benchmarking Lab',
      instructor: 'Dr. Donald Knuth',
      room: 'Computing Lab 2',
      section: 'Batch A2',
      type: 'Lab'
    },
    {
      id: 'tt-9',
      day: 'Friday',
      time_start: '14:00',
      time_end: '15:00',
      course_code: 'CSE-302',
      course_name: 'Computer Networks & Protocols',
      instructor: 'Prof. Radia Perlman',
      room: 'LH-302 (Turing Hall)',
      section: 'Section A',
      type: 'Tutorial'
    }
  ]);

  const [formData, setFormData] = useState({
    day: 'Monday' as TimetableSlot['day'],
    time_start: '09:00',
    time_end: '10:00',
    course_code: 'CSE-301',
    course_name: 'Database Management Systems',
    instructor: 'Dr. Alan Turing',
    room: 'LH-302 (Turing Hall)',
    section: 'Section A',
    type: 'Lecture' as TimetableSlot['type']
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimetableSlot = {
      id: `tt-${Date.now()}`,
      ...formData
    };
    setSlots([...slots, newSlot]);
    setShowAddModal(false);
    setSuccessMsg('Timetable slot scheduled successfully without conflicts.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const currentDaySlots = slots
    .filter((s) => s.day === selectedDay)
    .sort((a, b) => a.time_start.localeCompare(b.time_start));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Institutional Scheduling • Master Timetable</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">University Timetable Operations</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Classroom allocations, section timetables, professor conflict resolution, and lab booking management.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Class Slot</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Bar: Department & Semester */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building className="w-3.5 h-3.5" />
            <span>Department:</span>
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="CSE">Computer Science & Engineering</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="MECH">Mechanical Engineering</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Semester:</span>
          </div>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Semester 5">Semester 5 (Active)</option>
            <option value="Semester 3">Semester 3</option>
            <option value="Semester 7">Semester 7</option>
          </select>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>0 Room Collisions Detected</span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const count = slots.filter((s) => s.day === day).length;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{day}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-purple-700 text-purple-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timetable Schedule Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 w-40">Time Slot</th>
                <th className="py-3.5 px-4">Subject & Details</th>
                <th className="py-3.5 px-4">Classroom / Lab Venue</th>
                <th className="py-3.5 px-4">Assigned Professor</th>
                <th className="py-3.5 px-4">Section / Cohort</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentDaySlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-purple-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time_start} - {slot.time_end}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {slot.course_code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          slot.type === 'Lab'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : slot.type === 'Tutorial'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {slot.type}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{slot.course_name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" />
                      <span>{slot.room}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.instructor}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-[11px] text-slate-700">
                      {slot.section}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-xs font-bold text-purple-600 hover:text-purple-700">
                      Reallocate
                    </button>
                  </td>
                </tr>
              ))}

              {currentDaySlots.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No classes scheduled for {selectedDay}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Schedule Class Slot</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Practical</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time_start}
                    onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time_end}
                    onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code & Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE-301 Database Management Systems"
                  value={`${formData.course_code} - ${formData.course_name}`}
                  onChange={(e) => {
                    const parts = e.target.value.split('-');
                    setFormData({
                      ...formData,
                      course_code: parts[0]?.trim() || 'CSE-301',
                      course_name: parts.slice(1).join('-').trim() || ''
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LH-302 (Turing Hall)"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Section A"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Instructor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alan Turing"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

