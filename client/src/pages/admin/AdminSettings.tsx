import React, { useEffect, useState } from 'react';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  Lock,
  Clock,
  Sliders,
  Server
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    university_name: 'Apex Institute of Technology',
    current_academic_year: '2026-2027',
    active_semester: 'Fall 2026',
    attendance_min_threshold: 75,
    attendance_critical_threshold: 65,
    cie_max_marks: 50,
    see_max_marks: 50,
    passing_grade_percentage: 40,
    rag_similarity_threshold: 0.72,
    max_rag_sources: 4,
    maintenance_mode: false,
    allow_student_leave_applications: true
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await apiRequest('/admin/settings');
        if (res && res.settings) {
          setSettings((prev) => ({ ...prev, ...res.settings }));
        }
      } catch (err: any) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      setSuccessMsg('University system parameters successfully updated and synchronized.');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setError(err.message || 'Failed to update system settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <Settings className="w-3.5 h-3.5" />
              <span>Platform Core • University Configuration</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">System Settings & Policies</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Configure institutional thresholds, evaluation standards, security parameters, and AI model weights.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 self-start md:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Session & Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Institutional Identity & Active Session</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University Name</label>
              <input
                type="text"
                value={settings.university_name}
                onChange={(e) => setSettings({ ...settings, university_name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Academic Year</label>
              <input
                type="text"
                value={settings.current_academic_year}
                onChange={(e) => setSettings({ ...settings, current_academic_year: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Active Academic Semester</label>
              <select
                value={settings.active_semester}
                onChange={(e) => setSettings({ ...settings, active_semester: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="Fall 2026">Fall 2026 (Odd Semesters)</option>
                <option value="Spring 2027">Spring 2027 (Even Semesters)</option>
                <option value="Summer 2027">Summer Term 2027</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attendance & Debarment Policy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Attendance & Condonation Regulations</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Attendance Mandate (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="90"
                  value={settings.attendance_min_threshold}
                  onChange={(e) =>
                    setSettings({ ...settings, attendance_min_threshold: parseInt(e.target.value) || 75 })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Students below this percentage require condonation approval from Dean Academics.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Critical Debarment Threshold (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="40"
                  max="70"
                  value={settings.attendance_critical_threshold}
                  onChange={(e) =>
                    setSettings({ ...settings, attendance_critical_threshold: parseInt(e.target.value) || 65 })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Students below this threshold are strictly debarred from Semester-End Examinations (SEE).
              </p>
            </div>
          </div>
        </div>

        {/* Examination & Marks Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Grading & Evaluation Weightage</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Continuous Internal Evaluation (CIE)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.cie_max_marks}
                  onChange={(e) => setSettings({ ...settings, cie_max_marks: parseInt(e.target.value) || 50 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-500">Marks</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester-End Examination (SEE)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.see_max_marks}
                  onChange={(e) => setSettings({ ...settings, see_max_marks: parseInt(e.target.value) || 50 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-500">Marks</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Passing Grade Minimum (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.passing_grade_percentage}
                  onChange={(e) =>
                    setSettings({ ...settings, passing_grade_percentage: parseInt(e.target.value) || 40 })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Infrastructure Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Knowledge Assistant (RAG Engine)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cosine Similarity Threshold ({settings.rag_similarity_threshold})
              </label>
              <input
                type="range"
                min="0.5"
                max="0.9"
                step="0.02"
                value={settings.rag_similarity_threshold}
                onChange={(e) =>
                  setSettings({ ...settings, rag_similarity_threshold: parseFloat(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.5 (Broad)</span>
                <span>0.72 (Recommended)</span>
                <span>0.9 (Strict)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Retrieved Chunks per Query
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.max_rag_sources}
                onChange={(e) => setSettings({ ...settings, max_rag_sources: parseInt(e.target.value) || 4 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Operational Toggles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Online Student Leave Applications</div>
              <div className="text-[11px] text-slate-500">Allow students to apply for medical and duty leave from portal</div>
            </div>
            <input
              type="checkbox"
              checked={settings.allow_student_leave_applications}
              onChange={(e) =>
                setSettings({ ...settings, allow_student_leave_applications: e.target.checked })
              }
              className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-900">Emergency Maintenance Mode</div>
              <div className="text-[11px] text-rose-500">Restricts student and faculty logins during semester grading cutoff</div>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
