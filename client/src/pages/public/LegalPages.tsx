import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => (
  <div className="min-h-screen bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-campus-400 hover:text-campus-300">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-extrabold text-white">Institutional Privacy Policy</h1>
      <p className="text-xs text-slate-400">Effective Date: November 2026</p>
      <div className="space-y-4 text-xs text-slate-300 leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <p>
          CAMPUS OS strictly adheres to institutional student privacy standards and data protection guidelines. Academic records, attendance records, and personal identifiers are isolated via PostgreSQL Row Level Security (RLS) policies.
        </p>
        <h2 className="text-sm font-semibold text-white pt-2">Data Processing & AI Grounds</h2>
        <p>
          Private student data is never used to train public AI models. Interactions with the Google Gemini models are handled through server-side encrypted connections exclusively utilizing retrieved institutional context authorized for the user's role and departmental scope.
        </p>
      </div>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="min-h-screen bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-campus-400 hover:text-campus-300">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-extrabold text-white">Terms of Institutional Service</h1>
      <p className="text-xs text-slate-400">Effective Date: November 2026</p>
      <div className="space-y-4 text-xs text-slate-300 leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <p>
          CAMPUS OS is provided for authorized university students, faculty members, and administrators. Unauthorized access, account spoofing, or attempts to bypass Row Level Security or prompt boundaries are subject to institutional disciplinary and academic integrity policies.
        </p>
      </div>
    </div>
  </div>
);

export const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h1 className="text-xl font-bold text-white">Access Denied</h1>
      <p className="text-xs text-slate-400 mt-2">
        You do not possess the required institutional role or departmental permissions to view this resource.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-white transition"
        >
          Return Home
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 bg-campus-600 hover:bg-campus-500 text-xs font-semibold rounded-xl text-white transition"
        >
          Switch Account
        </Link>
      </div>
    </div>
  </div>
);

export const ForgotPasswordPage: React.FC = () => (
  <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl">
      <h2 className="text-lg font-bold text-white">Password Recovery</h2>
      <p className="text-xs text-slate-400 mt-1">
        Please contact your institutional IT Helpdesk or Dean of Academic Affairs to reset your university account credentials.
      </p>
      <div className="mt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-campus-400 hover:text-campus-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  </div>
);

