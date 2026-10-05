import { NextResponse } from 'next/server';
import { seedDemoStore, getStore } from '../../../../lib/serverDb';

export async function POST() {
  try {
    const result = seedDemoStore();
    return NextResponse.json({
      message: result.status === 'already_loaded'
        ? 'Demo data is already loaded.'
        : 'Demo campus circulars and events loaded successfully!',
      status: result.status,
      documentsCount: result.documentsCount,
      eventsCount: result.eventsCount
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to populate demo data.' }, { status: 500 });
  }
}
