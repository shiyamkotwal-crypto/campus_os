import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Users,
  Monitor,
  Wifi,
  Sparkles
} from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  type: 'Lecture Hall' | 'Computing Lab' | 'Auditorium' | 'Seminar Hall' | 'Library Wing';
  capacity: number;
  has_projector: boolean;
  has_ac: boolean;
  status: 'Operational' | 'Maintenance' | 'Reserved';
}

export const AdminServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: 'fac-1',
      name: 'Alan Turing Memorial Lecture Hall',
      code: 'LH-302',
      building: 'Turing Block',
      floor: '3rd Floor',
      type: 'Lecture Hall',
      capacity: 120,
      has_projector: true,
      has_ac: true,
      status: 'Operational'
    },
    {
      id: 'fac-2',
      name: 'Advanced Cloud & AI Computing Lab',
      code: 'LAB-204',
      building: 'Computing Wing B',
      floor: '2nd Floor',
      type: 'Computing Lab',
      capacity: 60,
      has_projector: true,
      has_ac: true,
      status: 'Operational'
    },
    {
      id: 'fac-3',
      name: 'Sir C.V. Raman Grand Auditorium',
      code: 'AUD-001',
      building: 'Central Administration Block',
      floor: 'Ground Floor',
      type: 'Auditorium',
      capacity: 850,
      has_projector: true,
      has_ac: true,
      status: 'Reserved'
    },
    {
      id: 'fac-4',
      name: 'VLSI & Embedded Systems Hardware Lab',
      code: 'LAB-102',
      building: 'ECE Block',
      floor: '1st Floor',
      type: 'Computing Lab',
      capacity: 45,
      has_projector: false,
      has_ac: true,
      status: 'Maintenance'
    },
    {
      id: 'fac-5',
      name: 'Dennis Ritchie Seminar Hall',
      code: 'SH-401',
      building: 'Turing Block',
      floor: '4th Floor',
      type: 'Seminar Hall',
      capacity: 80,
      has_projector: true,
      has_ac: true,
      status: 'Operational'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    building: 'Turing Block',
    floor: '1st Floor',
    type: 'Lecture Hall' as Facility['type'],
    capacity: 60,
    has_projector: true,
    has_ac: true,
    status: 'Operational' as Facility['status']
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newF: Facility = {
      id: `fac-${Date.now()}`,
      ...formData
    };

    setFacilities([...facilities, newF]);
    setShowAddModal(false);
    setSuccessMsg(`Facility "${formData.name}" added to campus directory.`);
    setFormData({
      name: '',
      code: '',
      building: 'Turing Block',
      floor: '1st Floor',
      type: 'Lecture Hall',
      capacity: 60,
      has_projector: true,
      has_ac: true,
      status: 'Operational'
    });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || f.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-premium border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>Estate & Infrastructure • Campus Venues</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Campus Facilities Directory</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Manage physical lecture halls, computing clusters, seminar spaces, capacity limits, and maintenance logs.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Venue</span>
          </button>
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
            placeholder="Search venue name, code, or block..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="Lecture Hall">Lecture Halls</option>
            <option value="Computing Lab">Computing Labs</option>
            <option value="Auditorium">Auditoriums</option>
            <option value="Seminar Hall">Seminar Halls</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-purple-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  {f.code}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    f.status === 'Operational'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : f.status === 'Maintenance'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {f.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2">{f.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {f.building} • {f.floor}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Capacity: {f.capacity} Seats</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  {f.has_projector && (
                    <span title="High-definition Projector Installed" className="text-purple-600 font-medium text-[11px]">
                      AV Tech
                    </span>
                  )}
                  {f.has_ac && (
                    <span title="Air Conditioned" className="text-cyan-600 font-medium text-[11px]">
                      AC
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{f.type}</span>
              <button className="text-xs font-bold text-purple-600 hover:text-purple-700">
                View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Add Campus Facility</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LH-401"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computing Lab">Computing Lab</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Seminar Hall">Seminar Hall</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. von Neumann Seminar Hall"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Building</label>
                  <input
                    type="text"
                    required
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Floor</label>
                  <input
                    type="text"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.has_projector}
                    onChange={(e) => setFormData({ ...formData, has_projector: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>AV Projector</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.has_ac}
                    onChange={(e) => setFormData({ ...formData, has_ac: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Air Conditioned</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Add Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

