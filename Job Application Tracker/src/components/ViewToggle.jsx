'use client';

import { useApp } from '../context/AppContext';
import { LayoutGrid, Table } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ViewToggle() {
  const { viewMode, setViewMode } = useApp();

  return (
    <div className="flex items-center glass-card rounded-xl p-1 shrink-0">
      {[
        { mode: 'kanban', icon: LayoutGrid, label: 'Board' },
        { mode: 'table', icon: Table, label: 'Table' },
      ].map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`relative flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            viewMode === mode ? 'text-white' : 'text-surface-700 dark:text-surface-300 hover:text-surface-950 dark:hover:text-white'
          }`}
        >
          {viewMode === mode && (
            <motion.div
              layoutId="viewToggle"
              className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
