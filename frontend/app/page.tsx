'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { fetchDocuments, fetchEvents, seedDemoData, DocumentItem, EventItem } from '../lib/api';

export default function Dashboard() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docsData, eventsData] = await Promise.all([
        fetchDocuments(),
        fetchEvents()
      ]);
      setDocuments(docsData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await loadData();
    } catch (err) {
      console.error('Failed to seed demo data:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        title="Good morning 👋"
        subtitle="Your campus information, simplified."
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
      />

      <div className="p-8 space-y-8 max-w-7xl">
        {/* Stat Overview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uploaded Documents</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{documents.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Processed campus circulars & PDFs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Events</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{events.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Exams, assignments & practicals</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">AI Campus Assistant</p>
              <h3 className="text-lg font-bold text-white mt-1">RAG Q&A Engine</h3>
              <p className="text-xs text-slate-300 mt-1">Answer with page citations</p>
            </div>
            <Link
              href="/chat"
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Demo Mode Quick Banner if no documents uploaded */}
        {documents.length === 0 && !isLoading && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Quick Hackathon Presentation Demo</h3>
              </div>
              <p className="text-xs text-blue-100">
                Click <span className="font-semibold text-white">"Load Demo Data"</span> to automatically populate DBMS Exam Circular and Java Assignment Notice for testing.
              </p>
            </div>
            <button
              onClick={handleSeedDemo}
              disabled={isSeeding}
              className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow transition-all shrink-0"
            >
              {isSeeding ? 'Populating...' : '⚡ Load Demo Circulars'}
            </button>
          </div>
        )}

        {/* Main Grid: Upcoming Events & Quick Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Upcoming Events & Deadlines
              </h2>
              <Link href="/deadlines" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.slice(0, 4).map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-700">No extracted events yet</p>
                <p className="text-xs text-slate-400">
                  Upload a campus PDF in the Documents page or load demo data to automatically detect exam dates and assignment deadlines.
                </p>
              </div>
            )}
          </div>

          {/* Ask Campus AI Quick Card */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Ask Campus AI
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Instant Document Q&A</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ask questions like <span className="text-slate-800 font-medium">"When is my DBMS exam?"</span> or <span className="text-slate-800 font-medium">"What is the Java assignment topic?"</span>
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span>"When is my DBMS exam?"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span>"What should I prepare for DBMS?"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <Link
                href="/chat"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Open Ask Campus AI</span>
                <MessageSquare className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Documents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              Recent Campus Documents
            </h2>
            <Link href="/documents" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
              Manage documents <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {documents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{doc.originalName || doc.filename}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Uploaded {new Date(doc.uploadDate).toLocaleDateString()} • {doc.pageCount} Pages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Processed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No documents uploaded yet. Go to <Link href="/documents" className="text-blue-600 underline font-semibold">Documents</Link> to upload your first PDF.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
