import React, { useEffect, useState } from 'react';
import {
  Users,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  Search,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { FacultyMember } from '../../types';

export const StudentFaculty: React.FC = () => {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaculty() {
      try {
        const res = await apiRequest('/academics/faculty-directory');
        setFacultyList(res.faculty || []);
      } catch (err) {
        console.error('Failed to load faculty directory:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFaculty();
  }, []);

  const filtered = facultyList.filter(
    (f) =>
      (f.full_name || f.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.department_name || f.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.specialization && f.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-campus-50 text-campus-700 border border-campus-200/80 mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Department Faculty Information</span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Faculty Directory & Office Hours
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Connect with your professors, research advisors, and course instructors for academic office hours.
        </p>

        <div className="mt-5 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search professors by name, specialization, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fac) => (
          <div key={fac.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-campus-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                  {(fac.full_name || fac.name || 'P').charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{fac.full_name || fac.name}</h3>
                  <p className="text-xs text-slate-500">{fac.designation}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{fac.department_name || fac.department || 'Academic Department'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{fac.office_location || 'Academic Block B'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-emerald-700 font-medium">{fac.office_hours || 'Mon, Wed 2:00 PM - 4:00 PM'}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`mailto:${fac.email}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-campus-600 hover:text-campus-700 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
              <span className="text-[10px] text-slate-400 font-mono truncate">{fac.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
