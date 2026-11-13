import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Search,
  Building,
  Navigation,
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { CampusLocation } from '../../types';

export const StudentNavigation: React.FC = () => {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLocations = async () => {
    try {
      let query = '/campus/locations?';
      if (category !== 'all') query += `category=${category}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const res = await apiRequest<{ locations: CampusLocation[] }>(query);
      setLocations(res.locations || []);
    } catch (err) {
      console.error('Failed to load locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, [category]);

  const categories = [
    { id: 'all', label: 'All Facilities' },
    { id: 'academic', label: 'Academic Halls' },
    { id: 'library', label: 'Libraries' },
    { id: 'laboratory', label: 'Research Labs' },
    { id: 'administrative', label: 'Administration' },
    { id: 'cafeteria', label: 'Dining & Cafes' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Campus Directory & Navigation</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified directory of lecture halls, research facilities, laboratories, and administrative offices.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadLocations()}
            placeholder="Search facility name, room code, or building..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                category === c.id
                  ? 'bg-campus-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Facilities Found</h3>
          <p className="text-xs text-slate-400 mt-1">Please try modifying your search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {loc.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Building className="w-3.5 h-3.5" />
                    <span>{loc.building}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{loc.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {loc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-campus-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-campus-500" />
                  Floor / Room: <strong className="text-slate-900">{loc.floor}</strong>
                </span>

                <div className="text-[11px] text-slate-400">
                  Apex Campus Main Quad
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

