'use client';

import Header from '../../components/Header';
import ChatBox from '../../components/ChatBox';

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header
        title="Ask Campus AI 🤖"
        subtitle="Search and chat with your uploaded circulars, syllabi, and timetables using RAG."
      />

      <div className="p-8 max-w-5xl mx-auto w-full">
        <ChatBox />
      </div>
    </div>
  );
}
