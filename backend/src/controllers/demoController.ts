import { Request, Response } from 'express';
import { db } from '../db/database';

export function seedDemoData(_req: Request, res: Response) {
  try {
    // Check if demo documents already exist
    const existing = db.prepare('SELECT id FROM documents WHERE filename LIKE ?').get('%DBMS_Exam_Circular.pdf%');

    if (existing) {
      return res.json({ message: 'Demo data is already loaded.', status: 'already_loaded' });
    }

    const now = new Date().toISOString();

    // 1. Seed DBMS Exam Circular document
    const dbmsText = `OFFICIAL COLLEGE CIRCULAR
Department of Computer Science & Engineering
Date: October 1, 2026

SUBJECT: MID-TERM EXAMINATION NOTICE FOR DBMS (CS-501)

This is to inform all 3rd Year B.Tech Computer Science students that the Database Management Systems (DBMS) mid-term examination has been scheduled as per the details below:

Examination Date: October 10, 2026
Time: 10:00 AM - 12:00 PM
Venue: Room 204 (Academic Block B)
Faculty In-Charge: Prof. R. Sharma

SYLLABUS & TOPICS TO PREPARE:
Students should prepare the following modules for the examination:
1. Relational Algebra & Tuple Relational Calculus
2. SQL Queries (Joins, Subqueries, Group By, Aggregations)
3. Database Normalization (1NF, 2NF, 3NF, BCNF)
4. ER & EER Diagrams
5. Transaction Management & ACID Properties (Concurrency Control & Locking)

RULES:
- Students must arrive 15 minutes before exam start time.
- Physical college ID cards are mandatory.
- Electronic gadgets and smart watches are strictly prohibited.`;

    const stmt1 = db.prepare(`
      INSERT INTO documents (filename, original_name, upload_date, file_path, extracted_text, page_count, processing_status)
      VALUES (?, ?, ?, ?, ?, ?, 'processed')
    `);
    const doc1Info = stmt1.run('DBMS_Exam_Circular.pdf', 'DBMS_Exam_Circular.pdf', now, 'demo/DBMS_Exam_Circular.pdf', dbmsText, 2);
    const doc1Id = doc1Info.lastInsertRowid as number;

    // Pages for doc 1
    db.prepare(`
      INSERT INTO document_pages (document_id, page_number, text_content)
      VALUES (?, ?, ?)
    `).run(doc1Id, 1, dbmsText.substring(0, 450));

    db.prepare(`
      INSERT INTO document_pages (document_id, page_number, text_content)
      VALUES (?, ?, ?)
    `).run(doc1Id, 2, dbmsText.substring(451));

    // Events for doc 1
    db.prepare(`
      INSERT INTO events (document_id, title, type, date, time, location, priority, source_document, page_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(doc1Id, 'DBMS Examination', 'Exam', 'Oct 10, 2026', '10:00 AM', 'Room 204', 'High', 'DBMS_Exam_Circular.pdf', 2);

    // 2. Seed Java Assignment Notice
    const javaText = `DEPARTMENT OF COMPUTER SCIENCE
JAVA PROGRAMMING ASSIGNMENT NOTICE

Assignment #3: Multithreading & Exception Handling
Deadline Date: October 8, 2026
Submission Time: By 6:00 PM (Online Portal)
Course Code: CS-304

Task Description:
Implement a producer-consumer problem using Java synchronized blocks and ReentrantLock. Ensure proper custom exception handling for buffer overflow.

Submission Guidelines:
- Upload code as zip file to college LMS.
- Late submissions will face 20% mark deduction per day.`;

    const doc2Info = stmt1.run('Java_Assignment_Notice.pdf', 'Java_Assignment_Notice.pdf', now, 'demo/Java_Assignment_Notice.pdf', javaText, 1);
    const doc2Id = doc2Info.lastInsertRowid as number;

    db.prepare(`
      INSERT INTO document_pages (document_id, page_number, text_content)
      VALUES (?, ?, ?)
    `).run(doc2Id, 1, javaText);

    db.prepare(`
      INSERT INTO events (document_id, title, type, date, time, location, priority, source_document, page_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(doc2Id, 'Java Assignment Submission', 'Assignment', 'Oct 8, 2026', '6:00 PM', 'Online Portal', 'High', 'Java_Assignment_Notice.pdf', 1);

    // 3. Seed AI Lab Notice
    const aiText = `DEPARTMENT OF AI & DATA SCIENCE
AI LAB PRACTICAL EVALUATION NOTICE

Evaluation Date: October 9, 2026
Time: 2:00 PM - 4:00 PM
Venue: Lab 3 (CS Building)

Topics: Search algorithms (A*, BFS, DFS) and Neural Network basics in Python.
Bring lab record books duly signed.`;

    const doc3Info = stmt1.run('AI_Lab_Notice.pdf', 'AI_Lab_Notice.pdf', now, 'demo/AI_Lab_Notice.pdf', aiText, 1);
    const doc3Id = doc3Info.lastInsertRowid as number;

    db.prepare(`
      INSERT INTO document_pages (document_id, page_number, text_content)
      VALUES (?, ?, ?)
    `).run(doc3Id, 1, aiText);

    db.prepare(`
      INSERT INTO events (document_id, title, type, date, time, location, priority, source_document, page_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(doc3Id, 'AI Lab Practical Evaluation', 'Lab', 'Oct 9, 2026', '2:00 PM', 'Lab 3', 'Medium', 'AI_Lab_Notice.pdf', 1);

    return res.json({
      message: 'Demo campus circulars and events loaded successfully!',
      status: 'loaded',
      documentsCount: 3,
      eventsCount: 3
    });
  } catch (error: any) {
    console.error('Failed to seed demo data:', error);
    return res.status(500).json({ error: 'Failed to populate demo data.' });
  }
}
