'use client';

import { Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onSeedDemo?: () => void;
  isSeeding?: boolean;
}

export default function Header({
  title = "Good morning 👋",
  subtitle = "Your campus information, simplified.",
  onSeedDemo,
  isSeeding = false,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {onSeedDemo && (
          <button
            onClick={onSeedDemo}
            disabled={isSeeding}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:bg-blue-100/80 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            {isSeeding ? 'Loading Demo Data...' : '⚡ Load Demo Data'}
          </button>
        )}

        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-200/70 transition-colors">
          <Bell className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
