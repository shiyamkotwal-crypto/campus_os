import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Mail,
  MapPin,
  Clock,
  GraduationCap,
  BookOpen,
  Award,
  Save,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const FacultyProfile: React.FC = () => {
  const { user } = useAuth();
  const [officeLocation, setOfficeLocation] = useState('Academic Block B, Room 304');
  const [officeHours, setOfficeHours] = useState('Mon, Wed 2:00 PM – 4:00 PM');
  const [specialization, setSpecialization] = useState('Distributed Systems, Cloud Native Computing & pgvector RAG');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Academic Credentials & Appointment</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Faculty Member Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your verified institutional contact information, research specializations, and student consultation hours.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Faculty profile and student office hours updated successfully.</span>
        </div>
      )}

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.full_name?.charAt(0) || 'F'}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{user?.full_name || 'Dr. Sarah Jenkins'}</h2>
            <p className="text-xs font-semibold text-emerald-700">Associate Professor of Computer Science</p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Department</label>
              <input
                type="text"
                disabled
                value={user?.department_name || 'Computer Science and Engineering'}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Institutional Identifier / Faculty Code</label>
              <input
                type="text"
                disabled
                value={user?.institutional_id || 'FAC-CSE-042'}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Campus Office Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Consultation / Office Hours</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Research Specializations & Core Competencies</label>
            <textarea
              rows={2}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
