import React, { useEffect, useState } from 'react';
import {
  FolderOpen,
  Plus,
  FileText,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const AdminDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'handbook',
    access_scope: 'institution',
    raw_content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadDocuments = async () => {
    try {
      const res = await apiRequest<{ documents: any[] }>('/documents');
      setDocuments(res.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/documents/upload', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'handbook',
        access_scope: 'institution',
        raw_content: ''
      });
      await loadDocuments();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete document and cascade its vector embeddings?')) return;
    try {
      await apiRequest(`/documents/${id}`, { method: 'DELETE' });
      await loadDocuments();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Institutional Knowledge & RAG Indexing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload institutional guidelines, circulars, and handbooks to be chunked and indexed into pgvector for Gemini grounding.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload & Vectorize Document</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Indexed in pgvector
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>{doc.title}</span>
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1">{doc.description}</p>
                <div className="text-[11px] text-slate-400">
                  Access: <strong className="text-slate-700 capitalize">{doc.access_scope}</strong> • Uploaded by {doc.profiles?.full_name || 'Dean Arthur Vance'}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Remove from knowledge base"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-150">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              RAG Knowledge Ingestion
            </div>
            <h3 className="text-sm font-bold text-slate-900">Upload & Vectorize Institutional Document</h3>

            <form onSubmit={handleUpload} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Apex Examination Grading Code 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="handbook">Student Handbook</option>
                    <option value="policy">Academic Policy</option>
                    <option value="syllabus">Course Syllabus</option>
                    <option value="notice">Official Circular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Access Scope</label>
                  <select
                    value={formData.access_scope}
                    onChange={(e) => setFormData({ ...formData, access_scope: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="institution">Whole Institution</option>
                    <option value="public">Public</option>
                    <option value="department">Department Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Brief Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Official evaluation rules, grade boundaries, and condonation clauses"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document Text for Vector Chunking</label>
                <textarea
                  rows={5}
                  required
                  value={formData.raw_content}
                  onChange={(e) => setFormData({ ...formData, raw_content: e.target.value })}
                  placeholder="Paste institutional policy paragraphs, examination rules, or syllabus text..."
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
                >
                  {submitting ? 'Indexing Embeddings...' : 'Ingest Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

