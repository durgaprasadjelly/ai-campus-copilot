// Serverless-friendly data store for Vercel deployment

export interface DocumentRecord {
  id: number;
  filename: string;
  originalName: string;
  uploadDate: string;
  filePath: string;
  extractedText: string;
  pageCount: number;
  processingStatus: string;
  pages: { pageNumber: number; text: string }[];
}

export interface EventRecord {
  id: number;
  documentId?: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  priority: string;
  sourceDocument: string;
  pageNumber: number;
}

export interface ChatRecord {
  id: number;
  question: string;
  answer: string;
  sources: { document: string; page: number }[];
  createdAt: string;
}

// Global state in serverless memory
const globalStore = global as unknown as {
  __documents?: DocumentRecord[];
  __events?: EventRecord[];
  __chatHistory?: ChatRecord[];
};

if (!globalStore.__documents) {
  globalStore.__documents = [];
}
if (!globalStore.__events) {
  globalStore.__events = [];
}
if (!globalStore.__chatHistory) {
  globalStore.__chatHistory = [];
}

export function getStore() {
  return {
    documents: globalStore.__documents!,
    events: globalStore.__events!,
    chatHistory: globalStore.__chatHistory!
  };
}

export function seedDemoStore() {
  const store = getStore();

  if (store.documents.some(d => d.filename.includes('DBMS_Exam_Circular.pdf'))) {
    return { status: 'already_loaded', documentsCount: store.documents.length, eventsCount: store.events.length };
  }

  const now = new Date().toISOString();

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

  const aiText = `DEPARTMENT OF AI & DATA SCIENCE
AI LAB PRACTICAL EVALUATION NOTICE

Evaluation Date: October 9, 2026
Time: 2:00 PM - 4:00 PM
Venue: Lab 3 (CS Building)

Topics: Search algorithms (A*, BFS, DFS) and Neural Network basics in Python.
Bring lab record books duly signed.`;

  const doc1: DocumentRecord = {
    id: 1,
    filename: 'DBMS_Exam_Circular.pdf',
    originalName: 'DBMS_Exam_Circular.pdf',
    uploadDate: now,
    filePath: 'demo/DBMS_Exam_Circular.pdf',
    extractedText: dbmsText,
    pageCount: 2,
    processingStatus: 'processed',
    pages: [
      { pageNumber: 1, text: dbmsText.substring(0, 450) },
      { pageNumber: 2, text: dbmsText.substring(451) }
    ]
  };

  const doc2: DocumentRecord = {
    id: 2,
    filename: 'Java_Assignment_Notice.pdf',
    originalName: 'Java_Assignment_Notice.pdf',
    uploadDate: now,
    filePath: 'demo/Java_Assignment_Notice.pdf',
    extractedText: javaText,
    pageCount: 1,
    processingStatus: 'processed',
    pages: [
      { pageNumber: 1, text: javaText }
    ]
  };

  const doc3: DocumentRecord = {
    id: 3,
    filename: 'AI_Lab_Notice.pdf',
    originalName: 'AI_Lab_Notice.pdf',
    uploadDate: now,
    filePath: 'demo/AI_Lab_Notice.pdf',
    extractedText: aiText,
    pageCount: 1,
    processingStatus: 'processed',
    pages: [
      { pageNumber: 1, text: aiText }
    ]
  };

  store.documents.push(doc1, doc2, doc3);

  const evt1: EventRecord = {
    id: 1,
    documentId: 1,
    title: 'DBMS Examination',
    type: 'Exam',
    date: 'Oct 10, 2026',
    time: '10:00 AM',
    location: 'Room 204',
    priority: 'High',
    sourceDocument: 'DBMS_Exam_Circular.pdf',
    pageNumber: 1
  };

  const evt2: EventRecord = {
    id: 2,
    documentId: 2,
    title: 'Java Assignment Submission',
    type: 'Assignment',
    date: 'Oct 8, 2026',
    time: '6:00 PM',
    location: 'Online Portal',
    priority: 'High',
    sourceDocument: 'Java_Assignment_Notice.pdf',
    pageNumber: 1
  };

  const evt3: EventRecord = {
    id: 3,
    documentId: 3,
    title: 'AI Lab Practical Evaluation',
    type: 'Lab',
    date: 'Oct 9, 2026',
    time: '2:00 PM',
    location: 'Lab 3',
    priority: 'Medium',
    sourceDocument: 'AI_Lab_Notice.pdf',
    pageNumber: 1
  };

  store.events.push(evt1, evt2, evt3);

  return { status: 'loaded', documentsCount: 3, eventsCount: 3 };
}
