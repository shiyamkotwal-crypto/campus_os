import React, { useEffect, useState } from 'react';
import {
  Building,
  Plus,
  Search,
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Shield
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { DepartmentItem } from '../../types';

export const AdminDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    head_of_department: '',
    building_location: '',
    total_faculty: 15,
    total_students: 420
  });

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/admin/departments');
      if (res && res.departments) {
        setDepartments(res.departments);
      }
    } catch (err: any) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;
    setSubmitting(true);
    setError('');

    try {
      await apiRequest('/admin/departments', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setSuccessMsg(`Department "${formData.name}" created successfully.`);
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        head_of_department: '',
        building_location: '',
        total_faculty: 15,
        total_students: 420
      });
      loadDepartments();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create department.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.head_of_department && d.head_of_department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <Building className="w-3.5 h-3.5" />
              <span>Academic Governance • Schools & Departments</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Department Management</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Configure academic divisions, departmental chairs, physical faculty wings, and resource allocation.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
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
            placeholder="Search by department name, code, or chair..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Divisions: <span className="font-bold text-slate-800">{departments.length}</span>
        </div>
      </div>

      {/* Department Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading university departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{dept.name}</h3>
                      <div className="text-[11px] text-slate-400">{dept.building_location || 'Main Academic Block'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Active
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span className="text-slate-400">Department Chair:</span>
                    <span className="font-semibold text-slate-800">{dept.head_of_department || 'Dr. Alan Turing'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-600" />
                        <span>Faculty</span>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {dept.total_faculty || 18}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-indigo-600" />
                        <span>Students</span>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {dept.total_students || 480}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Programs: 4 Degree Tracks</span>
                <button className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  <span>Manage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Add Academic Department</h3>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE, EEE, MECH"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Head of Department (Chair)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ada Lovelace, Ph.D."
                  value={formData.head_of_department}
                  onChange={(e) => setFormData({ ...formData, head_of_department: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Building Location</label>
                <input
                  type="text"
                  placeholder="e.g. Block A, Ramanujan Tower, Floors 3-5"
                  value={formData.building_location}
                  onChange={(e) => setFormData({ ...formData, building_location: e.target.value })}
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
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
