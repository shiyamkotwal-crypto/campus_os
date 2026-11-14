import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  CheckSquare,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit3,
  Search,
  Filter
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FacultySubmissions: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [marksInput, setMarksInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [savingGrade, setSavingGrade] = useState(false);

  useEffect(() => {
    async function loadAssignments() {
      try {
        const res = await apiRequest('/academics/assignments');
        const list = res.assignments || [];
        setAssignments(list);
        if (list.length > 0) {
          setSelectedAssignmentId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load assignments:', err);
      }
    }
    loadAssignments();
  }, []);

  useEffect(() => {
    if (!selectedAssignmentId) return;
    async function loadSubmissions() {
      try {
        const res = await apiRequest(`/academics/assignments/${selectedAssignmentId}/submissions`);
        setSubmissions(res.submissions || []);
      } catch (err) {
        console.error('Failed to load submissions:', err);
      }
    }
    loadSubmissions();
  }, [selectedAssignmentId]);

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  const handleOpenGradeModal = (sub: any) => {
    setSelectedSubmission(sub);
    setMarksInput(sub.marks || 85);
    setFeedbackInput(sub.feedback || 'Well-structured implementation meeting all specifications.');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setSavingGrade(true);

    try {
      await apiRequest(`/academics/submissions/${selectedSubmission.id}/grade`, {
        method: 'PATCH',
        body: JSON.stringify({
          marks: marksInput,
          feedback: feedbackInput
        })
      });

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id
            ? { ...s, marks: marksInput, feedback: feedbackInput, status: 'graded' }
            : s
        )
      );

      setSelectedSubmission(null);
    } catch (err: any) {
      alert(err.message || 'Failed to grade submission');
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Evaluation & Grading Center</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Assignment Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review code repositories, PDF documents, and issue continuous evaluation grades with rubrics.
          </p>
        </div>
      </div>

      {/* Assignment Selector */}
      <div className="flex flex-wrap gap-2">
        {assignments.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAssignmentId(a.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
              selectedAssignmentId === a.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {a.courses?.course_code || 'Course'}: {a.title}
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Max Score: <span className="font-bold text-slate-800">{activeAssignment?.max_marks || 100} Marks</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {submissions.filter((s) => s.status === 'graded').length} / {submissions.length} Evaluated
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Student Name & Roll No</th>
                <th className="py-3.5 px-6">Artifact / Submission URL</th>
                <th className="py-3.5 px-4 text-center">Submitted At</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{sub.student_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{sub.institutional_id || '22CSE1042'}</div>
                  </td>
                  <td className="py-3.5 px-6">
                    {sub.submission_url ? (
                      <a
                        href={sub.submission_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-campus-600 hover:text-campus-700 font-medium truncate max-w-xs"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{sub.submission_url}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No URL provided</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                    {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-xs">
                    {sub.marks !== undefined && sub.marks !== null ? (
                      <span className="text-emerald-700 font-mono">{sub.marks} / {activeAssignment?.max_marks || 100}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {sub.status === 'graded' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Graded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleOpenGradeModal(sub)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{sub.status === 'graded' ? 'Update Grade' : 'Grade'}</span>
                    </button>
                  </td>
                </tr>
              ))}

              {submissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No submissions recorded yet for this assignment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900">
              Grade Submission: {selectedSubmission.student_name}
            </h2>
            <p className="text-slate-500 mt-0.5 font-mono text-[11px]">
              Roll: {selectedSubmission.institutional_id || '22CSE1042'}
            </p>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Marks Awarded (Max: {activeAssignment?.max_marks || 100})
                </label>
                <input
                  type="number"
                  min={0}
                  max={activeAssignment?.max_marks || 100}
                  required
                  value={marksInput}
                  onChange={(e) => setMarksInput(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Evaluation Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                  placeholder="Provide constructive feedback regarding code quality, design, and rubrics..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGrade}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  {savingGrade ? 'Saving...' : 'Confirm Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

