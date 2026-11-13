import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Clock,
  Award,
  Upload,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { Assignment } from '../../types';

export const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadAssignments = async () => {
    try {
      const res = await apiRequest<{ assignments: Assignment[] }>('/academics/assignments');
      setAssignments(res.assignments || []);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleOpenSubmit = (a: Assignment) => {
    setSelectedAssignment(a);
    setSubmissionUrl(a.my_submission?.status ? 'https://github.com/alexrivera/campus-assignment' : '');
    setMessage(null);
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionUrl) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await apiRequest('/academics/submissions', {
        method: 'POST',
        body: JSON.stringify({
          assignment_id: selectedAssignment.id,
          submission_url: submissionUrl
        })
      });

      setMessage({ type: 'success', text: 'Work submitted successfully!' });
      setTimeout(() => {
        setSelectedAssignment(null);
        loadAssignments();
      }, 1200);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Assignments & Deadlines</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track upcoming coursework assessments, submit solutions, and review faculty feedback.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Assignments Available</h3>
          <p className="text-xs text-slate-400 mt-1">There are no coursework assignments currently assigned.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((item) => {
            const hasSubmitted = !!item.my_submission;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-campus-50 text-campus-700 border border-campus-100">
                      {item.courses?.course_code || 'Course'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Max Marks: {item.max_marks}
                    </span>
                    {hasSubmitted ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Submitted
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Due: <strong className="text-slate-700">{new Date(item.due_at).toLocaleDateString()}</strong>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => handleOpenSubmit(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      hasSubmitted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-campus-600 hover:bg-campus-500 text-white shadow-xs'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{hasSubmitted ? 'Resubmit Work' : 'Submit Work'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-150">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-slate-900">Submit Assignment Work</h3>
            <p className="text-xs text-slate-500 mt-1">{selectedAssignment.title}</p>

            {message && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmitWork} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Repository or Storage URL
                </label>
                <input
                  type="url"
                  required
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://github.com/username/project or Cloud Link"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-100">
                Institutional integrity check: Authenticated student submission record will be stamped with timestamp and user ID.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !submissionUrl}
                  className="px-4 py-2 bg-campus-600 hover:bg-campus-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {submitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

