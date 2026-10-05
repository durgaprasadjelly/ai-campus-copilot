import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateSamplePdfs() {
  const sampleDir = path.join(__dirname, '../../sample_docs');
  if (!fs.existsSync(sampleDir)) {
    fs.mkdirSync(sampleDir, { recursive: true });
  }

  // 1. Generate DBMS_Exam_Circular.pdf
  const pdfDoc1 = await PDFDocument.create();
  const font = await pdfDoc1.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc1.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Circular Header & Details
  const page1 = pdfDoc1.addPage([600, 750]);
  page1.drawText('OFFICIAL CAMPUS CIRCULAR', { x: 50, y: 700, size: 20, font: fontBold, color: rgb(0.1, 0.2, 0.6) });
  page1.drawText('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING', { x: 50, y: 675, size: 12, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
  page1.drawText('Date: October 1, 2026', { x: 450, y: 675, size: 10, font, color: rgb(0.4, 0.4, 0.4) });

  page1.drawText('SUBJECT: MID-TERM EXAMINATION NOTICE FOR DBMS (CS-501)', { x: 50, y: 630, size: 14, font: fontBold });

  const textPage1 = [
    'This is to inform all 3rd Year B.Tech Computer Science students that the Database',
    'Management Systems (DBMS) mid-term examination has been scheduled as detailed below:',
    '',
    '• Event: DBMS Examination',
    '• Date: October 10, 2026',
    '• Time: 10:00 AM - 12:00 PM',
    '• Location: Room 204 (Academic Block B)',
    '• Priority: High',
    '',
    'Attendance is mandatory. Students failing to appear will be marked absent.',
    'Please refer to Page 2 for detailed syllabus coverage.'
  ];

  let yPos = 580;
  for (const line of textPage1) {
    page1.drawText(line, { x: 50, y: yPos, size: 11, font: line.startsWith('•') ? fontBold : font });
    yPos -= 22;
  }

  // Page 2: Syllabus & Guidelines
  const page2 = pdfDoc1.addPage([600, 750]);
  page2.drawText('DBMS (CS-501) EXAM SYLLABUS & PREPARATION GUIDE', { x: 50, y: 700, size: 16, font: fontBold, color: rgb(0.1, 0.2, 0.6) });
  page2.drawText('Source Document: DBMS_Exam_Circular.pdf • Page 2', { x: 50, y: 680, size: 9, font, color: rgb(0.5, 0.5, 0.5) });

  const textPage2 = [
    'SYLLABUS TOPICS TO PREPARE:',
    '1. Relational Algebra & Tuple Relational Calculus',
    '2. SQL Queries (Joins, Subqueries, Group By, Aggregations)',
    '3. Database Normalization (1NF, 2NF, 3NF, BCNF)',
    '4. Entity-Relationship (ER) & EER Diagrams',
    '5. Transaction Management & ACID Properties (Concurrency Control & Locking)',
    '',
    'IMPORTANT GUIDELINES:',
    '- Arrive at Room 204 at least 15 minutes before 10:00 AM.',
    '- Carry physical College ID Cards.',
    '- Electronic devices are strictly prohibited inside Room 204.'
  ];

  yPos = 640;
  for (const line of textPage2) {
    const isHeading = line.endsWith(':');
    page2.drawText(line, { x: 50, y: yPos, size: isHeading ? 12 : 11, font: isHeading ? fontBold : font });
    yPos -= 24;
  }

  const pdfBytes1 = await pdfDoc1.save();
  fs.writeFileSync(path.join(sampleDir, 'DBMS_Exam_Circular.pdf'), pdfBytes1);

  // 2. Generate Java_Assignment_Notice.pdf
  const pdfDoc2 = await PDFDocument.create();
  const p1 = pdfDoc2.addPage([600, 750]);

  p1.drawText('JAVA PROGRAMMING ASSIGNMENT NOTICE', { x: 50, y: 700, size: 18, font: fontBold, color: rgb(0.8, 0.2, 0.1) });
  p1.drawText('DEPARTMENT OF COMPUTER SCIENCE', { x: 50, y: 678, size: 11, font: fontBold, color: rgb(0.4, 0.4, 0.4) });

  const javaLines = [
    '• Event: Java Assignment Submission',
    '• Date: October 8, 2026',
    '• Time: 6:00 PM',
    '• Location: Online Portal',
    '• Priority: High',
    '',
    'TASK DESCRIPTION:',
    'Implement a Producer-Consumer multi-threaded application using Java synchronized blocks',
    'and ReentrantLock. Ensure custom exception handling for buffer overflow condition.',
    '',
    'SUBMISSION RULES:',
    '- Submit source code as zip file on college LMS.',
    '- Late submissions will face 20% mark deduction per day.'
  ];

  yPos = 630;
  for (const line of javaLines) {
    p1.drawText(line, { x: 50, y: yPos, size: 11, font: line.startsWith('•') || line.endsWith(':') ? fontBold : font });
    yPos -= 22;
  }

  const pdfBytes2 = await pdfDoc2.save();
  fs.writeFileSync(path.join(sampleDir, 'Java_Assignment_Notice.pdf'), pdfBytes2);

  console.log('✅ Generated sample PDFs in sample_docs/ directory:');
  console.log('   - DBMS_Exam_Circular.pdf');
  console.log('   - Java_Assignment_Notice.pdf');
}

generateSamplePdfs().catch(console.error);
