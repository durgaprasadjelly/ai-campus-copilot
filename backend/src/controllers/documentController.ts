import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db/database';
import { extractPdfText } from '../services/pdfService';
import { extractEventsWithAI } from '../services/aiService';

export async function uploadDocument(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const file = req.file;
    if (file.mimetype !== 'application/pdf') {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Invalid file format. Only PDF files are supported.' });
    }

    const originalName = file.originalname;
    const filename = file.filename;
    const filePath = file.path;
    const uploadDate = new Date().toISOString();

    // Insert initial record with status 'processing'
    const stmt = db.prepare(`
      INSERT INTO documents (filename, original_name, upload_date, file_path, processing_status)
      VALUES (?, ?, ?, ?, 'processing')
    `);
    const info = stmt.run(filename, originalName, uploadDate, filePath);
    const documentId = info.lastInsertRowid as number;

    // Read and parse PDF
    const fileBuffer = fs.readFileSync(filePath);
    const parsedPdf = await extractPdfText(fileBuffer);

    // Update document record with text & page count
    db.prepare(`
      UPDATE documents 
      SET extracted_text = ?, page_count = ?, processing_status = 'processed'
      WHERE id = ?
    `).run(parsedPdf.text, parsedPdf.numPages, documentId);

    // Store page chunks in document_pages
    const insertPageStmt = db.prepare(`
      INSERT INTO document_pages (document_id, page_number, text_content)
      VALUES (?, ?, ?)
    `);

    for (const page of parsedPdf.pages) {
      insertPageStmt.run(documentId, page.pageNumber, page.text);
    }

    // Extract events automatically using AI service
    const extractedEvents = await extractEventsWithAI(parsedPdf.text, originalName, parsedPdf.pages);

    const insertEventStmt = db.prepare(`
      INSERT INTO events (document_id, title, type, date, time, location, priority, source_document, page_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const evt of extractedEvents) {
      insertEventStmt.run(
        documentId,
        evt.title,
        evt.type,
        evt.date,
        evt.time,
        evt.location,
        evt.priority,
        originalName,
        evt.pageNumber
      );
    }

    // Fetch updated document
    const updatedDocument = db.prepare('SELECT * FROM documents WHERE id = ?').get(documentId);
    const events = db.prepare('SELECT * FROM events WHERE document_id = ?').all(documentId);

    return res.status(201).json({
      message: 'PDF uploaded and processed successfully.',
      document: updatedDocument,
      eventsExtractedCount: events.length,
      events
    });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return res.status(500).json({ error: error.message || 'Failed to process PDF document.' });
  }
}

export function getDocuments(_req: Request, res: Response) {
  try {
    const docs = db.prepare('SELECT id, filename, original_name as originalName, upload_date as uploadDate, file_path as filePath, page_count as pageCount, processing_status as processingStatus FROM documents ORDER BY id DESC').all();
    return res.json(docs);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch documents.' });
  }
}

export function getDocumentById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);

    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const pages = db.prepare('SELECT page_number as pageNumber, text_content as textContent FROM document_pages WHERE document_id = ? ORDER BY page_number ASC').all(id);
    const events = db.prepare('SELECT * FROM events WHERE document_id = ?').all(id);

    return res.json({
      ...doc,
      pages,
      events
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch document details.' });
  }
}

export async function extractEventsForDocument(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as any;

    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const pages = db.prepare('SELECT page_number as pageNumber, text_content as text FROM document_pages WHERE document_id = ?').all(id) as any[];

    // Re-extract using AI Service
    const extractedEvents = await extractEventsWithAI(doc.extracted_text, doc.original_name, pages);

    // Clear old events for document to avoid duplicates
    db.prepare('DELETE FROM events WHERE document_id = ?').run(id);

    const insertEventStmt = db.prepare(`
      INSERT INTO events (document_id, title, type, date, time, location, priority, source_document, page_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const evt of extractedEvents) {
      insertEventStmt.run(
        id,
        evt.title,
        evt.type,
        evt.date,
        evt.time,
        evt.location,
        evt.priority,
        doc.original_name,
        evt.pageNumber
      );
    }

    const events = db.prepare('SELECT * FROM events WHERE document_id = ?').all(id);

    return res.json({
      message: 'Events re-extracted successfully.',
      eventsCount: events.length,
      events
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to extract events.' });
  }
}
