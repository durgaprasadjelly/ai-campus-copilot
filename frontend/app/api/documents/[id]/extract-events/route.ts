import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '../../../../../lib/serverDb';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = getStore();
    const doc = store.documents.find(d => d.id === parseInt(params.id, 10));

    if (!doc) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    const events = store.events.filter(e => e.documentId === doc.id);
    return NextResponse.json({
      message: 'Events extracted successfully.',
      eventsCount: events.length,
      events
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to extract events.' }, { status: 500 });
  }
}
