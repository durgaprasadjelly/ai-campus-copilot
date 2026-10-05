import { NextResponse } from 'next/server';
import { getStore } from '../../../lib/serverDb';

export async function GET() {
  try {
    const store = getStore();
    const docs = store.documents.map(d => ({
      id: d.id,
      filename: d.filename,
      originalName: d.originalName,
      uploadDate: d.uploadDate,
      filePath: d.filePath,
      pageCount: d.pageCount,
      processingStatus: d.processingStatus
    }));
    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch documents.' }, { status: 500 });
  }
}
