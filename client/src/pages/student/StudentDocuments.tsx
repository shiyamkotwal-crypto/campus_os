import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  FileText,
  Sparkles,
  Download,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const StudentDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await apiRequest<{ documents: any[] }>('/documents');
        setDocuments(res.documents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Institutional Knowledge Base</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified academic handbooks, syllabi, grading codes, and departmental policies indexed by CAMPUS OS.
          </p>
        </div>

        <Link
          to="/student/assistant"
          className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI from Docs</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Documents Available</h3>
          <p className="text-xs text-slate-400 mt-1">There are no institutional documents currently uploaded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Vector Indexed (768d)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-campus-600 shrink-0" />
                  <span>{doc.title}</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Access Scope: <strong className="capitalize text-slate-700">{doc.access_scope}</strong>
                </span>

                <Link
                  to="/student/assistant"
                  className="text-campus-600 hover:text-campus-700 font-semibold flex items-center gap-1"
                >
                  Query Document <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

