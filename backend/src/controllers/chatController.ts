import { Request, Response } from 'express';
import { answerQuestionWithRAG } from '../services/ragService';
import { db } from '../db/database';

export async function handleChat(req: Request, res: Response) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const result = await answerQuestionWithRAG(question.trim());

    // Optionally save to chat history
    try {
      db.prepare(`
        INSERT INTO chat_history (question, answer, sources_json, created_at)
        VALUES (?, ?, ?, ?)
      `).run(question.trim(), result.answer, JSON.stringify(result.sources), new Date().toISOString());
    } catch (e) {
      console.warn('Failed to store chat history:', e);
    }

    return res.json(result);
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request.',
      answer: "I encountered an error processing your query. Please check your document upload or try again.",
      sources: []
    });
  }
}
