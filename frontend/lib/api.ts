// All API calls go to Next.js built-in API routes (/api/...)
// Works both locally (localhost:3000) and on Vercel
const API_BASE_URL = '/api';

export interface DocumentItem {
  id: number;
  filename: string;
  originalName: string;
  uploadDate: string;
  filePath: string;
  pageCount: number;
  processingStatus: 'processing' | 'processed' | 'error';
}

export interface EventItem {
  id: number;
  documentId?: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  sourceDocument: string;
  pageNumber: number;
}

export interface SourceReference {
  document: string;
  page: number;
}

export interface ChatResponse {
  answer: string;
  sources: SourceReference[];
}

export async function fetchDocuments(): Promise<DocumentItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return await res.json();
  } catch (error) {
    console.error('fetchDocuments error:', error);
    return [];
  }
}

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return await res.json();
  } catch (error) {
    console.error('fetchEvents error:', error);
    return [];
  }
}

export async function uploadPdfDocument(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to upload PDF');
  }

  return await res.json();
}

export async function askCampusAI(question: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to get answer from AI');
  }

  return await res.json();
}

export async function seedDemoData(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/demo/seed`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Failed to seed demo data');
  }

  return await res.json();
}
