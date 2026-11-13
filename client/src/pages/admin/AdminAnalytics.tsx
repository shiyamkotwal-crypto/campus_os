import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Users, Sparkles } from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await apiRequest('/admin/analytics');
        setAnalytics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const engagementData = analytics?.engagement || [
    { month: 'Jun', active_students: 1820, ai_queries: 4100 },
    { month: 'Jul', active_students: 1940, ai_queries: 5200 },
    { month: 'Aug', active_students: 2150, ai_queries: 7800 },
    { month: 'Sep', active_students: 2280, ai_queries: 9400 },
    { month: 'Oct', active_students: 2310, ai_queries: 11200 },
    { month: 'Nov', active_students: 2345, ai_queries: 13500 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Institutional Platform Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Student adoption metrics, Gemini assistant utilization, and departmental course activity.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: AI Assistant Query Growth */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Monthly AI Assistant Grounded Queries
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Total questions answered with source citations</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +229% Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="ai_queries" fill="#7c3aed" radius={[6, 6, 0, 0]} name="AI Queries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Active Student Engagement */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-campus-600" />
                Monthly Active Student Enrollment
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Active daily platform logins and assignment actions</p>
            </div>
            <span className="text-xs font-bold text-campus-600 bg-campus-50 px-2 py-0.5 rounded-full">
              98.2% Campus Retention
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[1500, 2500]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="active_students" stroke="#3855ea" strokeWidth={3} dot={{ r: 4 }} name="Active Students" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

