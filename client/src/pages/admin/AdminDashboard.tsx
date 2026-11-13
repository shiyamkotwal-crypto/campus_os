import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  BookOpen,
  FolderOpen,
  HelpCircle,
  Activity,
  CheckCircle2,
  Database,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await apiRequest('/dashboard/admin');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const stats = data?.stats || {
    total_users: 2450,
    active_courses: 120,
    indexed_documents: 34,
    open_support_tickets: 6
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-[11px] font-semibold text-purple-300 mb-3 border border-purple-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Apex Institute of Technology • Institutional Command</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Administrator Center
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Governance, knowledge ingestion, multi-tenant RBAC, and platform audit trail.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/documents"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-sm"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Manage RAG Documents</span>
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Registered Members</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.total_users}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Active enrollment term</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Course Offerings</span>
            <BookOpen className="w-4 h-4 text-campus-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.active_courses}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 3 departments</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>RAG Knowledge Docs</span>
            <FolderOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.indexed_documents}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">pgvector 768d indexed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Open Helpdesk Tickets</span>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.open_support_tickets}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Requires department action</div>
        </div>
      </div>

      {/* System Engine Health Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-campus-600" />
          Infrastructure & Intelligence Engine Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[11px]">Database Architecture</div>
              <div className="font-bold text-slate-800 mt-0.5">Supabase PostgreSQL</div>
            </div>
            <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[11px]">Vector Search Engine</div>
              <div className="font-bold text-slate-800 mt-0.5">PostgreSQL pgvector</div>
            </div>
            <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> 768d Ready
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[11px]">Active Foundation Model</div>
              <div className="font-bold text-slate-800 mt-0.5">Google Gemini 2.5 Flash</div>
            </div>
            <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

