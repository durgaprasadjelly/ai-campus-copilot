'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadPdfDocument } from '../lib/api';

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage('');
    setSuccessInfo('');

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setStatus('error');
      setErrorMessage('Only PDF files are supported. Please select a valid campus PDF document.');
      return false;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setStatus('error');
      setErrorMessage('File size exceeds the 15 MB limit.');
      return false;
    }

    setFile(selectedFile);
    setStatus('idle');
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateAndSetFile(droppedFile)) {
        processUpload(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateAndSetFile(selectedFile)) {
        processUpload(selectedFile);
      }
    }
  };

  const processUpload = async (pdfFile: File) => {
    setStatus('uploading');
    try {
      const res = await uploadPdfDocument(pdfFile);
      setStatus('success');
      setSuccessInfo(`✓ Processed "${pdfFile.name}" and extracted ${res.eventsExtractedCount || 0} campus events.`);
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to upload and process PDF file.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-1">Upload Campus Document</h2>
      <p className="text-xs text-slate-500 mb-4">
        Upload exam circulars, assignment notices, timetables, or syllabi (PDF up to 15MB).
      </p>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,application/pdf"
          className="hidden"
        />

        {status === 'uploading' ? (
          <div className="flex flex-col items-center py-2">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-800">Processing PDF & extracting text...</p>
            <p className="text-xs text-slate-500 mt-1">AI is parsing events, dates, and syllabus topics</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 border border-blue-100 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>

            <p className="text-sm font-semibold text-slate-800">
              Drag & drop your PDF here, or <span className="text-blue-600 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Supports DBMS_Exam_Circular.pdf, assignment notices, circulars</p>
          </>
        )}
      </div>

      {/* Status Notifications */}
      {status === 'success' && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
