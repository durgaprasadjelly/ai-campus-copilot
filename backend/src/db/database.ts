import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(__dirname, '../../campus_copilot_db.json');

interface SchemaState {
  documents: any[];
  document_pages: any[];
  events: any[];
  chat_history: any[];
  autoIds: {
    documents: number;
    document_pages: number;
    events: number;
    chat_history: number;
  };
}

let data: SchemaState = {
  documents: [],
  document_pages: [],
  events: [],
  chat_history: [],
  autoIds: {
    documents: 0,
    document_pages: 0,
    events: 0,
    chat_history: 0,
  }
};

function loadDatabase() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf-8');
      if (content.trim()) {
        data = JSON.parse(content);
      }
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error('Error loading database file:', err);
  }
}

function saveDatabase() {
  try {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

export function initDatabase() {
  loadDatabase();
  console.log('✅ Local Database initialized at:', dbFilePath);
}

// Lightweight SQLite compatibility layer
export const db = {
  exec(_sql: string) {
    loadDatabase();
  },

  prepare(sql: string) {
    const normalizedSql = sql.trim().replace(/\s+/g, ' ');

    return {
      run(...args: any[]) {
        loadDatabase();

        // 1. INSERT INTO documents
        if (/INSERT INTO documents/i.test(normalizedSql)) {
          data.autoIds.documents += 1;
          const id = data.autoIds.documents;

          // Check if seed vs upload
          if (args.length === 6) {
            // Seed insertion
            const [filename, original_name, upload_date, file_path, extracted_text, page_count] = args;
            data.documents.push({
              id,
              filename,
              original_name,
              upload_date,
              file_path,
              extracted_text,
              page_count,
              processing_status: 'processed'
            });
          } else {
            // Upload insertion
            const [filename, original_name, upload_date, file_path, processing_status] = args;
            data.documents.push({
              id,
              filename,
              original_name,
              upload_date,
              file_path,
              extracted_text: '',
              page_count: 1,
              processing_status: processing_status || 'processing'
            });
          }

          saveDatabase();
          return { lastInsertRowid: id };
        }

        // 2. UPDATE documents
        if (/UPDATE documents/i.test(normalizedSql)) {
          const [extracted_text, page_count, id] = args;
          const doc = data.documents.find(d => d.id === Number(id));
          if (doc) {
            doc.extracted_text = extracted_text;
            doc.page_count = page_count;
            doc.processing_status = 'processed';
            saveDatabase();
          }
          return { changes: doc ? 1 : 0 };
        }

        // 3. INSERT INTO document_pages
        if (/INSERT INTO document_pages/i.test(normalizedSql)) {
          data.autoIds.document_pages += 1;
          const id = data.autoIds.document_pages;
          const [document_id, page_number, text_content] = args;
          data.document_pages.push({
            id,
            document_id: Number(document_id),
            page_number: Number(page_number),
            text_content
          });
          saveDatabase();
          return { lastInsertRowid: id };
        }

        // 4. INSERT INTO events
        if (/INSERT INTO events/i.test(normalizedSql)) {
          data.autoIds.events += 1;
          const id = data.autoIds.events;
          const [document_id, title, type, date, time, location, priority, source_document, page_number] = args;
          data.events.push({
            id,
            document_id: Number(document_id),
            title,
            type,
            date,
            time,
            location,
            priority,
            source_document,
            page_number: Number(page_number) || 1
          });
          saveDatabase();
          return { lastInsertRowid: id };
        }

        // 5. DELETE FROM events WHERE document_id = ?
        if (/DELETE FROM events WHERE document_id/i.test(normalizedSql)) {
          const docId = Number(args[0]);
          const initialLen = data.events.length;
          data.events = data.events.filter(e => e.document_id !== docId);
          saveDatabase();
          return { changes: initialLen - data.events.length };
        }

        // 6. INSERT INTO chat_history
        if (/INSERT INTO chat_history/i.test(normalizedSql)) {
          data.autoIds.chat_history += 1;
          const id = data.autoIds.chat_history;
          const [question, answer, sources_json, created_at] = args;
          data.chat_history.push({
            id,
            question,
            answer,
            sources_json,
            created_at
          });
          saveDatabase();
          return { lastInsertRowid: id };
        }

        return { lastInsertRowid: 0, changes: 0 };
      },

      all(...args: any[]) {
        loadDatabase();

        // SELECT document_pages JOIN documents
        if (/FROM document_pages/i.test(normalizedSql)) {
          return data.document_pages.map(dp => {
            const doc = data.documents.find(d => d.id === dp.document_id);
            return {
              documentId: dp.document_id,
              filename: doc ? doc.original_name || doc.filename : 'document.pdf',
              pageNumber: dp.page_number,
              textContent: dp.text_content
            };
          });
        }

        // SELECT FROM documents
        if (/FROM documents/i.test(normalizedSql)) {
          return data.documents.map(d => ({
            id: d.id,
            filename: d.filename,
            originalName: d.original_name,
            uploadDate: d.upload_date,
            filePath: d.file_path,
            extractedText: d.extracted_text,
            pageCount: d.page_count,
            processingStatus: d.processing_status
          }));
        }

        // SELECT FROM events
        if (/FROM events/i.test(normalizedSql)) {
          let evts = [...data.events];
          if (args.length > 0) {
            evts = evts.filter(e => e.document_id === Number(args[0]));
          }
          return evts.map(e => ({
            id: e.id,
            documentId: e.document_id,
            title: e.title,
            type: e.type,
            date: e.date,
            time: e.time,
            location: e.location,
            priority: e.priority,
            sourceDocument: e.source_document,
            pageNumber: e.page_number
          }));
        }

        return [];
      },

      get(...args: any[]) {
        loadDatabase();

        if (/FROM documents WHERE filename LIKE/i.test(normalizedSql)) {
          const searchPattern = args[0].replace(/%/g, '').toLowerCase();
          return data.documents.find(d => d.filename.toLowerCase().includes(searchPattern));
        }

        if (/FROM documents WHERE id/i.test(normalizedSql)) {
          const id = Number(args[0]);
          return data.documents.find(d => d.id === id);
        }

        return undefined;
      }
    };
  }
};
