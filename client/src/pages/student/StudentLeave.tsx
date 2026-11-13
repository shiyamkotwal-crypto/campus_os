import React, { useEffect, useState } from 'react';
import {
  FileCheck,
  Calendar,
  Clock,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { LeaveApplication } from '../../types';

export const StudentLeave: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'medical',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadLeaves = async () => {
    try {
      const res = await apiRequest('/academics/leave');
      setLeaves(res.leaves || []);
    } catch (err) {
      console.error('Failed to load leave records:', err);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/academics/leave', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setStatusMessage('Leave application submitted successfully for faculty review.');
      setShowApplyModal(false);
      setFormData({ leave_type: 'medical', start_date: '', end_date: '', reason: '' });
      await loadLeaves();
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-campus-50 text-campus-700 border border-campus-200/80 mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Attendance & Exigency Protocol</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Leave & Absence Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply for documented medical, academic, or on-duty leaves for attendance condonation.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Leave Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">New Leave Application</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your absence request for review by your designated department mentor.
            </p>

            <form onSubmit={handleApply} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                >
                  <option value="medical">Medical Exigency</option>
                  <option value="duty">Official Institutional Duty / Hackathon</option>
                  <option value="academic">Academic Conference / Seminar</option>
                  <option value="personal">Personal / Family Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Reason & Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the circumstances and mention any attached medical/duty proof..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-campus-600 text-white font-semibold hover:bg-campus-700"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">My Leave History</h2>
          <span className="text-xs text-slate-400">{leaves.length} Submissions recorded</span>
        </div>

        <div className="divide-y divide-slate-100">
          {leaves.map((leave) => (
            <div key={leave.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                    {leave.leave_type} Leave
                  </span>
                  {getStatusBadge(leave.status)}
                </div>
                <p className="text-xs text-slate-600 max-w-xl">
                  {leave.reason}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>Duration: {leave.start_date} to {leave.end_date}</span>
                  <span>•</span>
                  <span>Applied: {new Date(leave.applied_at).toLocaleDateString()}</span>
                </div>
                {leave.remarks && (
                  <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">{leave.reviewed_by}: </span>
                    {leave.remarks}
                  </p>
                )}
              </div>
            </div>
          ))}

          {leaves.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No leave applications on record. Use the button above to request absence condonation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
