import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { Announcement } from '../../types';

export const StudentAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [summaryModal, setSummaryModal] = useState<{ title: string; content: string; summary?: any } | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      let query = '/announcements?';
      if (category !== 'all') query += `category=${category}&`;
      if (priority !== 'all') query += `priority=${priority}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const res = await apiRequest<{ announcements: Announcement[] }>(query);
      setAnnouncements(res.announcements || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [category, priority]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiRequest(`/announcements/${id}/read`, { method: 'POST' });
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleSummarize = async (ann: Announcement) => {
    setSummaryModal({ title: ann.title, content: ann.content });
    setSummarizing(true);
    try {
      const res = await apiRequest<{ summary: any }>('/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ text: ann.content, title: ann.title })
      });
      setSummaryModal({ title: ann.title, content: ann.content, summary: res.summary });
    } catch (err) {
      console.error('Summarize error:', err);
    } finally {
      setSummarizing(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">High Priority</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">Low</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-campus-100 text-campus-700 border border-campus-200">Normal</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Institutional Announcement Hub</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official academic circulars, examination orders, and university updates.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAnnouncements()}
            placeholder="Search circulars by keywords..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-500/20"
          >
            <option value="all">All Categories</option>
            <option value="examination">Examination</option>
            <option value="academic">Academic</option>
            <option value="event">Event</option>
            <option value="emergency">Emergency</option>
            <option value="department">Department</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-500/20"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Announcements Found</h3>
          <p className="text-xs text-slate-400 mt-1">There are no circulars matching your current filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                ann.is_read ? 'border-slate-200/80 bg-white' : 'border-campus-200 bg-campus-50/20'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {ann.category}
                  </span>
                  {getPriorityBadge(ann.priority)}
                  {!ann.is_read && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-campus-600 text-white">
                      New
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(ann.published_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <h2 className="text-sm md:text-base font-bold text-slate-900 mt-1">
                {ann.title}
              </h2>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-400 text-[11px]">
                  Issued by: <strong className="text-slate-700">{ann.author_name || 'Academic Dean'}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSummarize(ann)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-campus-200 bg-campus-50 text-campus-700 hover:bg-campus-100 text-xs font-semibold transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-campus-600" />
                    <span>AI Summarize</span>
                  </button>

                  {!ann.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(ann.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark as Read</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Summary Modal */}
      {summaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-150">
            <button
              onClick={() => setSummaryModal(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-campus-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-campus-600" />
              Gemini AI Summary
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">{summaryModal.title}</h3>

            {summarizing ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-campus-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">Extracting key dates & actions with Gemini...</p>
              </div>
            ) : summaryModal.summary ? (
              <div className="space-y-3 text-xs text-slate-700">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                  {summaryModal.summary.summary}
                </div>

                {summaryModal.summary.key_points && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Key Points:</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {summaryModal.summary.key_points.map((pt: string, idx: number) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSummaryModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

