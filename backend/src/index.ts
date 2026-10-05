import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api';
import { initDatabase } from './db/database';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDatabase();

// Middleware
app.use(cors({
  origin: '*', // Allow Next.js frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files if needed
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AI Campus Copilot Backend' });
});

// Centralized error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error.';
  res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Campus Copilot Backend server running on http://localhost:${PORT}`);
  console.log(`📄 API Endpoints active at http://localhost:${PORT}/api\n`);
});
