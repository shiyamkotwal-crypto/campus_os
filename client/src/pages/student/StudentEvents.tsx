import React, { useEffect, useState } from 'react';
import {
  Compass,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { CampusEvent } from '../../types';

export const StudentEvents: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      const res = await apiRequest<{ events: CampusEvent[] }>('/events');
      setEvents(res.events || []);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    setProcessingId(eventId);
    try {
      await apiRequest(`/events/${eventId}/register`, { method: 'POST' });
      await loadEvents();
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (eventId: string) => {
    setProcessingId(eventId);
    try {
      await apiRequest(`/events/${eventId}/register`, { method: 'DELETE' });
      await loadEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel registration');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Campus Events & Activities</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Conferences, technical hackathons, symposiums, and cultural festivals.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Upcoming Events</h3>
          <p className="text-xs text-slate-400 mt-1">Check back later for newly announced institutional events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                {event.image_url && (
                  <div className="h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-campus-50 text-campus-700 border border-campus-100">
                      {event.category}
                    </span>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.current_registrations || 0} / {event.capacity} seats</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{event.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(event.start_at).toLocaleDateString()} at {new Date(event.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                {event.is_registered ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Confirmed Ticket
                    </span>
                    <button
                      onClick={() => handleCancel(event.id)}
                      disabled={processingId === event.id}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      {processingId === event.id ? 'Processing...' : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={processingId === event.id || (event.current_registrations || 0) >= event.capacity}
                    className="w-full py-2.5 bg-campus-600 hover:bg-campus-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-xs"
                  >
                    {processingId === event.id
                      ? 'Registering...'
                      : (event.current_registrations || 0) >= event.capacity
                      ? 'Event Full'
                      : 'Register for Event'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

