import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { ProgramItem, DepartmentItem } from '../../types';

export const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department_id: '',
    degree_type: 'B.Tech',
    duration_years: 4,
    total_credits: 160
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [progRes, deptRes] = await Promise.all([
        apiRequest('/admin/programs'),
        apiRequest('/admin/departments')
      ]);
      if (progRes && progRes.programs) setPrograms(progRes.programs);
      if (deptRes && deptRes.departments) {
        setDepartments(deptRes.departments);
        if (deptRes.departments.length > 0 && !formData.department_id) {
          setFormData((prev) => ({ ...prev, department_id: deptRes.departments[0].id }));
        }
      }
    } catch (err: any) {
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;
    setSubmitting(true);
    setError('');

    try {
      await apiRequest('/admin/programs', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setSuccessMsg(`Program "${formData.name}" added successfully.`);
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        department_id: departments[0]?.id || '',
        degree_type: 'B.Tech',
        duration_years: 4,
        total_credits: 160
      });
      loadData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create degree program.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = programs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDegree = degreeFilter === 'all' || p.degree_type === degreeFilter;
    return matchesSearch && matchesDegree;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Curriculum Architecture • Degree Programs</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Academic Degree Programs</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Curate undergraduate, postgraduate, and doctoral degree tracks, graduation credits, and accreditation status.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Degree Program</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search programs by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Degree Level:</label>
          <select
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Degrees</option>
            <option value="B.Tech">B.Tech (Undergraduate)</option>
            <option value="M.Tech">M.Tech (Postgraduate)</option>
            <option value="MBA">MBA (Management)</option>
            <option value="Ph.D.">Ph.D. (Doctoral)</option>
          </select>
        </div>
      </div>

      {/* Programs Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading degree programs...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Program Code</th>
                  <th className="py-3 px-4">Program Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Degree Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Credits Required</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700">{prog.code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{prog.name}</div>
                      <div className="text-[11px] text-slate-400">Accredited by NBA / ABET Tier-1</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {prog.department_name || departments.find(d => d.id === prog.department_id)?.name || 'Engineering'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {prog.degree_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{prog.duration_years} Years (8 Semesters)</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{prog.total_credits} Credits</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs font-bold text-purple-600 hover:text-purple-700">
                        Edit Syllabus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Add Academic Degree Program</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BT-CSE, BT-AIML, MT-SE"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Technology in Computer Science"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Type</label>
                  <select
                    value={formData.degree_type}
                    onChange={(e) => setFormData({ ...formData, degree_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="Ph.D.">Ph.D.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.duration_years}
                    onChange={(e) => setFormData({ ...formData, duration_years: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Graduation Credits</label>
                  <input
                    type="number"
                    min="60"
                    max="240"
                    value={formData.total_credits}
                    onChange={(e) => setFormData({ ...formData, total_credits: parseInt(e.target.value) || 160 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
