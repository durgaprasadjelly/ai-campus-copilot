import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'AI Campus Copilot - Student Information Assistant',
  description: 'AI-powered campus copilot to upload college documents, extract deadlines, and ask natural language questions with source citations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
