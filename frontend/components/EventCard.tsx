'use client';

import { Calendar, Clock, MapPin, FileText, AlertCircle } from 'lucide-react';
import { EventItem } from '../lib/api';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  // Priority indicator color
  const getPriorityBadge = (priority: string, type: string) => {
    const isExam = type.toLowerCase().includes('exam');
    const isAssignment = type.toLowerCase().includes('assignment');

    if (isExam || priority.toLowerCase() === 'high') {
      return { dot: '🔴', bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'High Priority' };
    }
    if (isAssignment || priority.toLowerCase() === 'medium') {
      return { dot: '🟡', bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Medium Priority' };
    }
    return { dot: '🟢', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Normal' };
  };

  const badge = getPriorityBadge(event.priority, event.type);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{badge.dot}</span>
            <h3 className="font-bold text-slate-900 text-base leading-snug">{event.title}</h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
            {event.type}
          </span>
        </div>

        <div className="space-y-2 mt-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{event.date}</span>
          </div>

          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{event.time}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 truncate max-w-[200px]" title={event.sourceDocument}>
          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{event.sourceDocument}</span>
        </div>
        {event.pageNumber && (
          <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
            Page {event.pageNumber}
          </span>
        )}
      </div>
    </div>
  );
}
