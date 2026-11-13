import React, { useEffect, useState } from 'react';
import { CheckSquare, Plus, Clock, Users, X } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { Assignment } from '../../types';

export const FacultyAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_id: 'c0000000-0000-0000-0000-000000000001',
    title: '',
    description: '',
    due_at: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
    max_marks: 100
  });
  const [submitting, setSubmitting] = useState(false);

  const loadAssignments = async () => {
    try {
      const res = await apiRequest<{ assignments: Assignment[] }>('/academics/assignments');
      setAssignments(res.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/academics/assignments', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          due_at: new Date(formData.due_at).toISOString(),
          max_marks: Number(formData.max_marks)
        })
      });
      setShowModal(false);
      setFormData({
        course_id: 'c0000000-0000-0000-0000-000000000001',
        title: '',
        description: '',
        due_at: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
        max_marks: 100
      });
      await loadAssignments();
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Assignment Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Author coursework assessments, deadlines, and grade student submissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-campus-50 text-campus-700">
                    {a.courses?.course_code || 'CS301'}
                  </span>
                  <span className="text-[11px] text-slate-400">Max Marks: {a.max_marks}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{a.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-1">{a.description}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due: {new Date(a.due_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-xs font-semibold text-campus-700 bg-campus-50 px-3 py-1 rounded-lg">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-150">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-slate-900">Create New Course Assignment</h3>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course</label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                >
                  <option value="c0000000-0000-0000-0000-000000000001">CS301 - Distributed Systems</option>
                  <option value="c0000000-0000-0000-0000-000000000003">CS308 - Database Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Consensus Engine"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    required
                    value={formData.max_marks}
                    onChange={(e) => setFormData({ ...formData, max_marks: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.due_at}
                    onChange={(e) => setFormData({ ...formData, due_at: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Problem Statement & Rubric</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Instructions, guidelines, test criteria..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-campus-600 hover:bg-campus-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
                >
                  {submitting ? 'Creating...' : 'Assign Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

