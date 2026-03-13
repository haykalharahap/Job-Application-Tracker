'use client';

import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Sun, Moon, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { darkMode, setDarkMode, setModalOpen, setEditingApp } = useApp();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleAdd = () => {
    setEditingApp(null);
    setModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 glass-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Briefcase className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">
                Job<span className="text-brand-500">Tracker</span>
              </h1>
              <p className="text-[10px] font-medium text-surface-700 dark:text-surface-300 -mt-0.5 tracking-wide uppercase">
                Application Manager
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            {hydrated && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-[18px] h-[18px] text-amber-400" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-surface-700" />
                )}
              </motion.button>
            )}

            {/* Add button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
