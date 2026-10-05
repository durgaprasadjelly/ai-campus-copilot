import { NextResponse } from 'next/server';
import { getStore } from '../../../lib/serverDb';

export async function GET() {
  try {
    const store = getStore();
    const events = store.events.map(e => ({
      id: e.id,
      documentId: e.documentId,
      title: e.title,
      type: e.type,
      date: e.date,
      time: e.time,
      location: e.location,
      priority: e.priority,
      sourceDocument: e.sourceDocument,
      pageNumber: e.pageNumber
    }));
    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch events.' }, { status: 500 });
  }
}
