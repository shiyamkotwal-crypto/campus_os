import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Shield,
  Send
} from 'lucide-react';

interface SupportTicket {
  id: string;
  ticket_number: string;
  requester_name: string;
  requester_role: 'student' | 'faculty';
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  assigned_to?: string;
  created_at: string;
}

export const AdminSupport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 't-1',
      ticket_number: 'TCK-2026-104',
      requester_name: 'Priya Sharma',
      requester_role: 'student',
      category: 'Attendance Correction',
      subject: 'Medical certificate submitted for Oct 24-28 absence',
      description: 'I was hospitalized with viral fever and had submitted the medical fitness form to HOD office. Need 6 excused absences updated in CSE-301.',
      priority: 'high',
      status: 'in_progress',
      assigned_to: 'Academic Affairs Admin',
      created_at: '2026-11-10T11:20:00Z'
    },
    {
      id: 't-2',
      ticket_number: 'TCK-2026-098',
      requester_name: 'Dr. Alan Turing',
      requester_role: 'faculty',
      category: 'Classroom Tech',
      subject: 'HDMI switcher not syncing with projector in LH-302',
      description: 'Audio is stuttering and video blanks out every 10 minutes during morning lectures.',
      priority: 'urgent',
      status: 'open',
      assigned_to: 'Hardware Infrastructure Team',
      created_at: '2026-11-12T08:45:00Z'
    },
    {
      id: 't-3',
      ticket_number: 'TCK-2026-088',
      requester_name: 'Rahul Verma',
      requester_role: 'student',
      category: 'Fee Receipt',
      subject: 'Duplicate transaction debit for Semester 5 tuition fee',
      description: 'Bank account was charged twice via UPI gateway. Transaction ID: UPI-8492048291.',
      priority: 'high',
      status: 'open',
      assigned_to: 'Finance & Accounts',
      created_at: '2026-11-11T16:10:00Z'
    },
    {
      id: 't-4',
      ticket_number: 'TCK-2026-074',
      requester_name: 'Dr. Dennis Ritchie',
      requester_role: 'faculty',
      category: 'Lab Equipment',
      subject: 'Workstation 14 in Lab 3 SSD failure',
      description: 'Disk I/O error during compiler optimization benchmark test.',
      priority: 'medium',
      status: 'resolved',
      assigned_to: 'Lab Administrator',
      created_at: '2026-11-05T14:00:00Z'
    }
  ]);

  const handleUpdateStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    setSuccessMsg(`Ticket status updated to ${newStatus}.`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedTicket) return;
    setSuccessMsg(`Resolution note dispatched to ${selectedTicket.requester_name}.`);
    setReplyText('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.requester_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesRole = roleFilter === 'all' || t.requester_role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Campus Operations • Centralized Helpdesk Queue</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Institutional Support Desk</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Triage, assign, and resolve student and faculty tickets across academic, financial, and facilities domains.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-700/50 text-center">
              <div className="text-[10px] text-purple-300 uppercase font-semibold">Open Tickets</div>
              <div className="text-xl font-bold text-white">
                {tickets.filter((t) => t.status === 'open').length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-700/50 text-center">
              <div className="text-[10px] text-purple-300 uppercase font-semibold">Avg. Resolution</div>
              <div className="text-xl font-bold text-white">4.2h</div>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ticket #, student, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Requesters</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
      </div>

      {/* Tickets Layout: Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-5 rounded-2xl bg-white border cursor-pointer transition shadow-sm hover:border-purple-300 ${
                selectedTicket?.id === t.id ? 'border-purple-600 ring-2 ring-purple-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {t.ticket_number}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-600">
                    {t.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      t.requester_role === 'faculty'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {t.requester_role}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    t.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : t.priority === 'high'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.priority}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{t.subject}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{t.requester_name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      t.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : t.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail / Action Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <div className="text-[11px] text-slate-400 font-mono font-bold">{selectedTicket.ticket_number}</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedTicket.subject}</h3>
                <div className="text-xs text-slate-500 mt-1">
                  Submitted by <span className="font-bold text-slate-800">{selectedTicket.requester_name}</span> ({selectedTicket.requester_role})
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Ticket Details
                </label>
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100">
                  {selectedTicket.description}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Change Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'open')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedTicket.status === 'open'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedTicket.status === 'in_progress'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedTicket.status === 'resolved'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendReply} className="pt-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Dispatch Official Resolution Note
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter message for requester or resolution explanation..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Resolution Note</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a ticket from the left queue to view full details and update triage status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
