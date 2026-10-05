'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { fetchEvents, seedDemoData, EventItem } from '../../lib/api';
import { Calendar, FileText, MapPin, Clock, ArrowUpDown, Filter, Sparkles } from 'lucide-react';

export default function DeadlinesPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await loadEvents();
    } catch (err) {
      console.error('Failed to seed demo data:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Filtering
  const filteredEvents = events.filter((evt) => {
    if (filterType === 'all') return true;
    return evt.type.toLowerCase() === filterType.toLowerCase();
  });

  // Sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.date.localeCompare(b.date);
    } else {
      return b.date.localeCompare(a.date);
    }
  });

  const getPriorityBadgeClass = (priority: string, type: string) => {
    if (type.toLowerCase().includes('exam') || priority.toLowerCase() === 'high') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (type.toLowerCase().includes('assignment') || priority.toLowerCase() === 'medium') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        title="Campus Deadlines & Events 📅"
        subtitle="Automatically extracted exam schedules, assignment submission deadlines, and lab dates."
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
      />

      <div className="p-8 max-w-7xl space-y-6">
        {/* Filter & Sort Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter:
            </span>
            {['all', 'Exam', 'Assignment', 'Lab'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                  filterType.toLowerCase() === t.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by Date ({sortOrder === 'asc' ? 'Nearest First' : 'Farthest First'})
          </button>
        </div>

        {/* Events Table / Card List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {sortedEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Event</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Time</th>
                    <th className="py-4 px-4">Location</th>
                    <th className="py-4 px-4">Priority</th>
                    <th className="py-4 px-6">Source Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {sortedEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {evt.title}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {evt.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>{evt.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                        {evt.time ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.time}</span>
                          </div>
                        ) : 'TBD'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                        {evt.location ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.location}</span>
                          </div>
                        ) : 'Campus'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getPriorityBadgeClass(evt.priority, evt.type)}`}>
                          {evt.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-slate-700">{evt.sourceDocument}</span>
                          {evt.pageNumber && (
                            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">
                              p.{evt.pageNumber}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-base font-semibold text-slate-700">No events or deadlines extracted yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload a campus PDF in the Documents page or click "Load Demo Data" to automatically extract upcoming deadlines.
              </p>
              <button
                onClick={handleSeedDemo}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                {isSeeding ? 'Loading Demo Data...' : '⚡ Load Demo Circulars'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
