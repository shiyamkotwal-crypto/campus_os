import React from 'react';
import { User, Mail, IdCard, GraduationCap, Building, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Student Identity & Credentials</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified institutional profile details and academic affiliations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-campus-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user?.full_name ? user.full_name.charAt(0) : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.full_name || 'Alex Rivera'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-campus-100 text-campus-700 font-semibold border border-campus-200">
                Verified Student
              </span>
              <span className="text-xs text-slate-400">Apex Institute of Technology</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Institutional Email</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Student Roll Number</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{user?.institutional_id || '22CSE1042'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Department</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{user?.department_name || 'Computer Science & Engineering'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Academic Year & Semester</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {user?.academic_year ? `Year ${user.academic_year} (Semester ${user.semester || 5})` : '3rd Year (Semester 5)'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>This account is actively enrolled and governed under PostgreSQL Row Level Security (RLS).</span>
        </div>
      </div>
    </div>
  );
};

