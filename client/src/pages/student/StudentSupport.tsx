import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { SupportTicket } from '../../types';

export const StudentSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'academic',
    priority: 'normal'
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = async () => {
    try {
      const res = await apiRequest<{ tickets: SupportTicket[] }>('/support/tickets');
      setTickets(res.tickets || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openTicketThread = async (ticket: SupportTicket) => {
    try {
      const res = await apiRequest<{ ticket: any; messages: any[] }>(`/support/tickets/${ticket.id}`);
      setActiveTicket(res.ticket);
      setMessages(res.messages || []);
    } catch (err) {
      console.error('Failed to load ticket thread:', err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowCreateModal(false);
      setFormData({ subject: '', description: '', category: 'academic', priority: 'normal' });
      await loadTickets();
    } catch (err: any) {
      alert(err.message || 'Ticket creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    try {
      const res = await apiRequest(`/support/tickets/${activeTicket.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText })
      });
      setMessages((prev) => [...prev, res.entry]);
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Student Support Helpdesk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit academic, technical, or facility inquiries directly to campus administration.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List (1 Col) */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            My Open Tickets ({tickets.length})
          </h2>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              No support tickets submitted.
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => openTicketThread(t)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  activeTicket?.id === t.id
                    ? 'border-campus-500 bg-campus-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {t.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'open'
                        ? 'bg-amber-100 text-amber-700'
                        : t.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{t.subject}</h3>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ticket Thread Discussion (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
          {activeTicket ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeTicket.subject}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Category: <strong className="text-slate-600 capitalize">{activeTicket.category}</strong> • Status: <strong className="text-slate-600 uppercase">{activeTicket.status}</strong>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                      m.sender?.role === 'student' || !m.sender
                        ? 'ml-auto bg-campus-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    <div className="font-semibold text-[10px] opacity-75 mb-0.5">
                      {m.sender?.full_name || 'You'} ({m.sender?.role || 'student'})
                    </div>
                    <div>{m.message}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type reply message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-campus-600 hover:bg-campus-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
              <div className="text-xs font-medium">Select a ticket from the left to view conversation thread</div>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-150">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-slate-900">Open Support Ticket</h3>
            <p className="text-xs text-slate-500 mt-0.5">Submit request to institutional helpdesk</p>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Schedule clash between CS301 and CS305"
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
                    <option value="academic">Academic Inquiries</option>
                    <option value="technical">IT & WiFi Support</option>
                    <option value="administrative">Fee & Transcripts</option>
                    <option value="facilities">Classroom & Labs</option>
                    <option value="general">General Help</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide context, affected course codes, or room details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-campus-600 hover:bg-campus-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

