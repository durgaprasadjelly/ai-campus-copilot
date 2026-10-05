import { Request, Response } from 'express';
import { db } from '../db/database';

export function getEvents(_req: Request, res: Response) {
  try {
    const events = db.prepare(`
      SELECT 
        id, 
        document_id as documentId, 
        title, 
        type, 
        date, 
        time, 
        location, 
        priority, 
        source_document as sourceDocument,
        page_number as pageNumber
      FROM events 
      ORDER BY id DESC
    `).all();

    return res.json(events);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch events.' });
  }
}
