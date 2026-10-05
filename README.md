# AI CAMPUS COPILOT 🎓🤖

> **Your campus information, simplified.**  
> An AI-powered student assistant to centralize scattered college documents (exam circulars, timetables, syllabi, assignment notices) with natural language Q&A, source citations, and automatic deadline extraction.

---

## 1. What is AI Campus Copilot?

**AI Campus Copilot** is a real, runnable hackathon MVP built for college students. It allows students to upload official college PDFs and instantly ask natural language questions (e.g. *"When is my DBMS exam?"* or *"What should I prepare for DBMS?"*). The system answers strictly based on the uploaded campus documents, cites the source filename & page number, and automatically extracts deadlines into an organized student dashboard.

---

## 2. Problem Statement

College information is scattered across messy PDFs, circulars, WhatsApp group forwards, notice boards, and timetables. Students waste valuable time searching for information and frequently miss crucial assignment submission deadlines or exam dates.

---

## 3. Our Solution

An intelligent, simple, local-first RAG (Retrieval-Augmented Generation) copilot where:
1. **Students upload PDF circulars** (e.g., `DBMS_Exam_Circular.pdf`).
2. **PDF Text & Pages are extracted** and indexed locally in SQLite.
3. **AI automatically identifies events & deadlines** (Exams, Assignments, Labs, Room Numbers, Times).
4. **Students ask questions in plain English** and receive grounded answers with exact source references (`DBMS_Exam_Circular.pdf • Page 2`).

---

## 4. Key Features

- 📊 **Smart Dashboard**: Displays upcoming exams, assignment deadlines, recent documents, and stats.
- 📄 **PDF Upload & Processing**: Drag-and-drop uploader with validation, progress indicator, and text extraction.
- 🤖 **Ask Campus AI (RAG Q&A)**: Grounded AI search using Gemini LLM with page-level source citations.
- 🚫 **Anti-Hallucination Safeguard**: If an answer isn't in uploaded documents, the AI replies: *"I couldn't find this information in the uploaded campus documents."*
- 📅 **Extracted Deadlines View**: Filterable and sortable timeline of extracted campus events with priority tags.
- ⚡ **Demo Mode**: One-click demo seed to populate sample circulars for fast 5-minute hackathon live demos.

---

## 5. Architecture

```text
                               ┌─────────────────────────┐
                               │   Student User (Web)    │
                               └────────────┬────────────┘
                                            │
                                  HTTP / JSON (REST)
                                            │
                               ┌────────────▼────────────┐
                               │   Next.js 14 Frontend   │
                               │  (React, TS, Tailwind)  │
                               └────────────┬────────────┘
                                            │
                                            │ REST API
                                            ▼
                               ┌─────────────────────────┐
                               │   Node.js + Express     │
                               │     Backend Server      │
                               └──────┬─────┬─────┬──────┘
                                      │     │     │
                 ┌────────────────────┘     │     └──────────────────┐
                 ▼                          ▼                        ▼
       ┌───────────────────┐      ┌──────────────────┐     ┌──────────────────┐
       │ PDF Text Extract  │      │ SQLite Database  │     │ Google Gemini AI │
       │   (pdf-parse)     │      │ (better-sqlite3) │     │ (RAG & Extraction│
       └───────────────────┘      └──────────────────┘     └──────────────────┘
```

---

## 6. Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, TypeScript, Multer, CORS
- **Database**: SQLite (`better-sqlite3`) - zero infrastructure, local file `campus_copilot.db`
- **PDF Processing**: `pdf-parse` (Page-by-page text extraction)
- **AI Integration**: `@google/genai` (Gemini API with fallback parsing)

---

## 7. Project Structure

```text
AI CAMPUS COPILOT/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── documentController.ts
│   │   │   ├── eventController.ts
│   │   │   ├── chatController.ts
│   │   │   └── demoController.ts
│   │   ├── services/
│   │   │   ├── pdfService.ts
│   │   │   ├── aiService.ts
│   │   │   └── ragService.ts
│   │   ├── db/
│   │   │   └── database.ts
│   │   ├── routes/
│   │   │   └── api.ts
│   │   ├── scripts/
│   │   │   └── generateSamplePdfs.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── documents/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── deadlines/page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── FileUpload.tsx
│   │   ├── EventCard.tsx
│   │   └── ChatBox.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── package.json
│   └── tailwind.config.js
├── sample_docs/
│   ├── DBMS_Exam_Circular.pdf
│   └── Java_Assignment_Notice.pdf
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## 8. Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
AI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

> **Note**: If no API key is set, the application automatically uses intelligent heuristic fallbacks so the complete UI flow can still be tested and demonstrated live.

---

## 9. Installation Instructions

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or yarn

### Step 1: Clone / Navigate to project folder
```powershell
cd "c:\Users\jalli\OneDrive\Documents\Desktop\AI CAMPUS COPILOT"
```

### Step 2: Install dependencies for both Backend & Frontend
Using root script:
```powershell
npm run install:all
```
Or manually:
```powershell
# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### Step 3: Generate Sample PDF files (Optional but recommended)
```powershell
cd backend
npm run generate:pdfs
```

---

## 10. How to Start the Application

### Start the Backend (Port 5000)
```powershell
cd backend
npm run dev
```

### Start the Frontend (Port 3000)
In a new terminal window:
```powershell
cd frontend
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 11. Database Setup

The database uses SQLite (`better-sqlite3`). It requires **zero setup or cloud database configuration**. When the backend starts (`npm run dev`), it automatically creates `backend/campus_copilot.db` and sets up all required tables:
- `documents`
- `document_pages`
- `events`
- `chat_history`

---

## 12. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/documents/upload` | Upload and process a PDF file |
| `GET` | `/api/documents` | List all uploaded documents |
| `GET` | `/api/documents/:id` | Get details & page contents of a document |
| `POST` | `/api/documents/:id/extract-events` | Re-run event extraction on document |
| `GET` | `/api/events` | List all extracted campus events & deadlines |
| `POST` | `/api/chat` | Send a question `{ "question": "..." }` and get answer + sources |
| `POST` | `/api/demo/seed` | Seed demo circulars (`DBMS_Exam_Circular.pdf`, etc.) |

---

## 13. How AI / RAG & PDF Processing Work

1. **PDF Text Extraction**: Upon upload, `pdfService.ts` extracts raw text page-by-page and stores page text into `document_pages`.
2. **Event Extraction**: `aiService.ts` analyzes page text using Gemini (or rule-based parser) to output structured event JSON (title, type, date, time, location, priority, source document, page number).
3. **RAG Context Search**: When a question is submitted to `/api/chat`, `ragService.ts` scores page chunks, retrieves top matching pages, constructs context, and prompts Gemini to answer strictly based on source snippets.
4. **Source Attribution**: Returns source citations (`document`, `page`) so students can verify the information against the original PDF.

---

## 14. Demo Test Procedure (Step-by-Step Scenario)

1. Open **`http://localhost:3000`**.
2. Click **"⚡ Load Demo Data"** on the header OR go to **Documents** and upload `sample_docs/DBMS_Exam_Circular.pdf`.
3. Check status changes to **"✓ Processed"** and notice **DBMS Examination** appears on the **Dashboard** (October 10, 10:00 AM, Room 204).
4. Go to **Ask Campus AI** page.
5. Ask: `"When is my DBMS exam?"`
   - AI answers: `"Your DBMS exam is on October 10 at 10:00 AM in Room 204."`
   - Shows source pill: `DBMS_Exam_Circular.pdf • Page 2`.
6. Ask: `"What should I prepare for DBMS?"`
   - AI answers using the syllabus section (Relational Algebra, SQL Queries, Normalization 1NF-BCNF, ER Diagrams, ACID Properties).
7. Ask: `"When is the Python exam?"`
   - AI replies: `"I couldn't find this information in the uploaded campus documents."`
8. Go to **Deadlines** page to view sortable and filterable events table.

---

## 15. Known Limitations & Future Roadmap

- **Current Limitations**: Handles text-based PDF circulars; image-only scanned PDFs require OCR extension (tesseract.js).
- **Future Roadmap**:
  - Push notifications / WhatsApp SMS alerts before deadlines.
  - Multi-college document filtering.
  - Calendar export (`.ics` file generation for Google Calendar / Apple Calendar).
