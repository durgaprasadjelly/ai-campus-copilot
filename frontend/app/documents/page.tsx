'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import FileUpload from '../../components/FileUpload';
import { fetchDocuments, seedDemoData, DocumentItem } from '../../lib/api';
import { FileText, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const loadDocs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await loadDocs();
    } catch (err) {
      console.error('Failed to seed demo data:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        title="Campus Documents 📄"
        subtitle="Upload and manage exam circulars, assignment notices, timetables, and syllabi."
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
      />

      <div className="p-8 max-w-7xl space-y-8">
        {/* PDF File Upload Zone */}
        <FileUpload onUploadSuccess={loadDocs} />

        {/* Document List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Uploaded PDF Documents ({documents.length})
            </h2>

            <button
              onClick={loadDocs}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {documents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{doc.originalName || doc.filename}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span>Uploaded {new Date(doc.uploadDate).toLocaleString()}</span>
                          <span>•</span>
                          <span>{doc.pageCount} {doc.pageCount === 1 ? 'Page' : 'Pages'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ✓ Processed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-base font-semibold text-slate-700">No documents uploaded yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Drag and drop a PDF file above (e.g. DBMS_Exam_Circular.pdf) or click "Load Demo Data" to get started instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
