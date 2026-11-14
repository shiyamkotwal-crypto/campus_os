import React, { useEffect, useState } from 'react';
import {
  FolderUp,
  Plus,
  BookOpen,
  Download,
  Trash2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { StudyMaterial } from '../../types';

export const FacultyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    file_url: '',
    file_type: 'PDF',
    file_size: '3.5 MB'
  });
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [matRes, crsRes] = await Promise.all([
        apiRequest('/academics/materials'),
        apiRequest('/academics/courses')
      ]);
      setMaterials(matRes.materials || []);
      setCourses(crsRes.courses || []);
      if (crsRes.courses?.length > 0 && !formData.course_id) {
        setFormData((prev) => ({ ...prev, course_id: crsRes.courses[0].id }));
      }
    } catch (err) {
      console.error('Failed to load study materials:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const matched = courses.find((c) => c.id === formData.course_id);

    try {
      await apiRequest('/academics/materials', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          course_code: matched?.code || 'CS301',
          course_name: matched?.name || 'Distributed Systems'
        })
      });

      setSuccessMsg('Course handout uploaded and made available to enrolled students.');
      setShowUploadModal(false);
      setFormData({
        course_id: courses[0]?.id || '',
        title: '',
        description: '',
        file_url: '',
        file_type: 'PDF',
        file_size: '3.5 MB'
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <FolderUp className="w-3.5 h-3.5" />
            <span>Digital Knowledge Repository</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Upload & Manage Study Materials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Distribute course slides, lab assignments, sample question banks, and research papers.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900">Upload Course Material</h2>
            <p className="text-slate-500 mt-0.5">Enrolled students will immediately receive access to this document.</p>

            <form onSubmit={handleUpload} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Course</label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Distributed Commit Protocols & 2PC"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of topics covered, references, and relevant reading..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File URL or Cloud Storage Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://docs.apex.edu/materials/lecture-04.pdf"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  {uploading ? 'Publishing...' : 'Upload & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Materials List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {materials.map((m) => (
            <div key={m.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {m.course_code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                </div>
                <p className="text-xs text-slate-500 max-w-xl">{m.description || m.course_name}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                  <span>Size: {m.file_size}</span>
                  <span>•</span>
                  <span>Uploaded: {new Date(m.uploaded_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={m.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Preview / Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

