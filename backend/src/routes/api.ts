import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  extractEventsForDocument
} from '../controllers/documentController';
import { getEvents } from '../controllers/eventController';
import { handleChat } from '../controllers/chatController';
import { seedDemoData } from '../controllers/demoController';

const router = Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  }
});

// Document Routes
router.post('/documents/upload', upload.single('file'), uploadDocument);
router.get('/documents', getDocuments);
router.get('/documents/:id', getDocumentById);
router.post('/documents/:id/extract-events', extractEventsForDocument);

// Event Routes
router.get('/events', getEvents);

// Chat Route
router.post('/chat', handleChat);

// Demo Seed Route
router.post('/demo/seed', seedDemoData);

export default router;
