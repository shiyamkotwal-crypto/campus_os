import React, { useEffect, useState } from 'react';
import {
  FolderOpen,
  FileText,
  Download,
  Search,
  BookOpen,
  User,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { StudyMaterial } from '../../types';

export const StudentMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMaterials() {
      try {
        const res = await apiRequest('/academics/materials');
        setMaterials(res.materials || []);
      } catch (err) {
        console.error('Failed to load study materials:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const courses = Array.from(new Set(materials.map((m) => m.course_code)));

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || m.course_code === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-campus-50 text-campus-700 border border-campus-200/80 mb-2">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Course Handouts & Resources</span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Study Materials & Lecture Slides
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access official faculty lecture slides, laboratory manuals, and problem sets.
        </p>

        {/* Filter controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
            />
          </div>

          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
            >
              <option value="all">All Enrolled Courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mat) => (
          <div key={mat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-campus-50 text-campus-700 border border-campus-200">
                  {mat.course_code}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{mat.file_type} • {mat.file_size}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {mat.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {mat.description || mat.course_name}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{mat.uploaded_by_name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(mat.uploaded_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3">
              <a
                href={mat.file_url}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Handout</span>
              </a>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No study materials found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your search terms or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

