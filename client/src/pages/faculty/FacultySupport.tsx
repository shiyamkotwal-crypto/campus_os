import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Wrench,
  BookOpen,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface FacultyTicket {
  id: string;
  ticket_number: string;
  category: 'Classroom Tech' | 'Lab Equipment' | 'Academic System' | 'Exam Logistics' | 'General';
  subject: string;
  description: string;
  room_or_venue?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
  response?: string;
}

export const FacultySupport: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'new'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    category: 'Classroom Tech' as FacultyTicket['category'],
    subject: '',
    room_or_venue: '',
    priority: 'medium' as FacultyTicket['priority'],
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [tickets, setTickets] = useState<FacultyTicket[]>([
    {
      id: 'ft-101',
      ticket_number: 'TCK-FAC-2026-081',
      category: 'Classroom Tech',
      subject: 'Projector HDMI port loose in Turing Hall LH-302',
      room_or_venue: 'LH-302',
      description: 'The projector keeps flickering during CSE-301 lecture. Audio sync is also delayed.',
      priority: 'high',
      status: 'in_progress',
      created_at: '2026-11-12T09:30:00Z',
      updated_at: '2026-11-12T14:15:00Z',
      response: 'AV Tech team dispatched. Replacement HDMI switchbox being installed today.'
    },
    {
      id: 'ft-102',
      ticket_number: 'TCK-FAC-2026-064',
      category: 'Lab Equipment',
      subject: 'Need PyTorch / CUDA runtime update on Cloud AI Lab workstations (Workstations 12-24)',
      room_or_venue: 'Lab Block B, Room 204',
      description: 'Student neural network training scripts failing with missing cuDNN v9.2 libraries.',
      priority: 'medium',
      status: 'resolved',
      created_at: '2026-11-08T11:00:00Z',
      updated_at: '2026-11-09T16:00:00Z',
      response: 'SysAdmin deployed CUDA 12.4 and PyTorch 2.4 image across all Lab B nodes.'
    },
    {
      id: 'ft-103',
      ticket_number: 'TCK-FAC-2026-092',
      category: 'Exam Logistics',
      subject: 'Request extra answer booklet bundles for Midterm-II on Nov 18',
      room_or_venue: 'Exam Cell / Dean Office',
      description: 'CSE-301 has 145 registered students. We require 160 booklets and 40 drawing sheets.',
      priority: 'medium',
      status: 'open',
      created_at: '2026-11-13T10:00:00Z',
      updated_at: '2026-11-13T10:00:00Z'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;
    setSubmitting(true);

    setTimeout(() => {
      const newTicket: FacultyTicket = {
        id: `ft-${Date.now()}`,
        ticket_number: `TCK-FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        category: formData.category,
        subject: formData.subject,
        room_or_venue: formData.room_or_venue || undefined,
        priority: formData.priority,
        status: 'open',
        description: formData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTickets([newTicket, ...tickets]);
      setSubmitting(false);
      setSuccessMsg('Ticket submitted successfully. IT & Facilities team has been notified.');
      setFormData({
        category: 'Classroom Tech',
        subject: '',
        room_or_venue: '',
        priority: 'medium',
        description: ''
      });
      setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('tickets');
      }, 1500);
    }, 600);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.room_or_venue && t.room_or_venue.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-premium border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Faculty IT & Academic Facilities Helpdesk</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Support & Escalations</h1>
            <p className="text-xs md:text-sm text-emerald-100/80 mt-1">
              Direct line to university IT systems, classroom audio-visual infrastructure, and examination cell.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'tickets'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-700/50'
              }`}
            >
              My Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'new'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-700/50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Classroom AV Emergency</div>
            <div className="text-sm font-bold text-slate-800">Ext: 4401 (Direct Line)</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Campus Facilities & Power</div>
            <div className="text-sm font-bold text-slate-800">Ext: 3310 (24/7 Desk)</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Controller of Examinations</div>
            <div className="text-sm font-bold text-slate-800">coe@apex.edu • Ext: 1008</div>
          </div>
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Send className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Submit New Support Ticket</h2>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Classroom Tech">Classroom Audio/Visual Tech</option>
                  <option value="Lab Equipment">Lab Equipment / Hardware</option>
                  <option value="Academic System">Campus OS Academic Portal</option>
                  <option value="Exam Logistics">Examination Cell / Stationery</option>
                  <option value="General">General Administrative Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="low">Low (General inquiry)</option>
                  <option value="medium">Medium (Standard request)</option>
                  <option value="high">High (Upcoming lecture affected)</option>
                  <option value="urgent">Urgent (Live lecture / exam halted)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Venue / Lab Location</label>
              <input
                type="text"
                placeholder="e.g. Lecture Hall LH-302, Computing Lab 3, Turing Block"
                value={formData.room_or_venue}
                onChange={(e) => setFormData({ ...formData, room_or_venue: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Summary *</label>
              <input
                type="text"
                required
                placeholder="Brief summary of the issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Provide details of what occurred, error messages, or equipment specifics..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket # or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {ticket.ticket_number}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      {ticket.category}
                    </span>
                    {ticket.room_or_venue && (
                      <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                        📍 {ticket.room_or_venue}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        ticket.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : ticket.priority === 'high'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ticket.priority} priority
                    </span>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : ticket.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {ticket.status === 'resolved' && <CheckCircle2 className="w-3 h-3" />}
                      {ticket.status === 'in_progress' && <Clock className="w-3 h-3" />}
                      {ticket.status === 'open' && <AlertCircle className="w-3 h-3" />}
                      <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{ticket.subject}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ticket.description}</p>
                </div>

                {ticket.response && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>IT Operations Dispatch Note:</span>
                    </div>
                    <p className="text-slate-600 pl-5">{ticket.response}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Logged: {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>Updated: {new Date(ticket.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No tickets matching your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

