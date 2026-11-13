import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  BookOpen,
  Calendar,
  Compass,
  ArrowRight,
  CheckCircle,
  Database,
  Cpu,
  Layers,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col selection:bg-campus-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-campus-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xl tracking-tight text-white">
              CAMPUS<span className="text-campus-400">OS</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Architecture</a>
            <a href="#intelligence" className="hover:text-white transition">AI Grounding</a>
            <a href="#security" className="hover:text-white transition">Multi-Tenant Security</a>
            <a href="#demo" className="hover:text-white transition">Demonstration</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-campus-600 hover:bg-campus-500 text-white shadow-sm transition"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-campus-600/20 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-campus-400 mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Unified Campus Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Entire Campus.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-400 via-indigo-300 to-purple-400">
              One Intelligent Platform.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Eliminate fragmented student portals, lost circulars, and disconnected academic records.
            CAMPUS OS unifies timetables, assignments, attendance, campus events, and Gemini-powered RAG intelligence into a single institutional layer.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-campus-600 hover:bg-campus-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-campus-600/30 transition"
            >
              <span>Explore Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
            >
              Create Student Account
            </Link>
          </div>

          {/* Quick Demo Persona Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span>Instant Demo Logins:</span>
            <Link to="/login" className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 hover:border-campus-500 text-slate-300">
              🎓 Student (Alex Rivera)
            </Link>
            <Link to="/login" className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 hover:border-campus-500 text-slate-300">
              💼 Faculty (Dr. Sarah Jenkins)
            </Link>
            <Link to="/login" className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 hover:border-campus-500 text-slate-300">
              🛡️ Admin (Dr. Vance - Dean)
            </Link>
          </div>
        </div>

        {/* Product Visual Mockup */}
        <div className="max-w-6xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl ring-1 ring-slate-800/80">
            <div className="rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Visual Card 1 */}
                <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-campus-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    RAG Grounded Intelligence
                  </div>
                  <h3 className="text-sm font-semibold text-white">Grounded Institutional Q&A</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Answers grounded directly in verified PDF handbooks and college notices with page-numbered source citations.
                  </p>
                </div>

                {/* Visual Card 2 */}
                <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4" />
                    Unified Academics
                  </div>
                  <h3 className="text-sm font-semibold text-white">Schedules & Attendance</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Personalized weekly timetables, real-time attendance percentage tracking, and assignment submission pipelines.
                  </p>
                </div>

                {/* Visual Card 3 */}
                <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Shield className="w-4 h-4" />
                    Multi-Tenant RLS
                  </div>
                  <h3 className="text-sm font-semibold text-white">Enterprise Data Isolation</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Enforced at the PostgreSQL level via Supabase Row Level Security across 24 relational tables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-slate-800 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Engineered for Modern Higher Education
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              One platform addressing every academic, administrative, and operational workflow.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-campus-500/10 text-campus-400 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Academic Workspace</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Semester course registration, weekly timetable grids, assignment tracking, and atomic submission reviews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Campus Digital Services</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Interactive campus facility directory, privacy-protected lost and found registry, and student support helpdesk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Gemini 2.5 Flash Engine</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Notice information extraction, document summarization, dynamic study schedule generation, and query intent routing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 CAMPUS OS. All rights reserved. Enterprise Higher Education Platform.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/login" className="hover:text-slate-300">Demo Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

