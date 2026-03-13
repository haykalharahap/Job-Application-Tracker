import { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Sun, Moon, Plus, LogOut, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { darkMode, setDarkMode, setModalOpen, setEditingApp, applications, dispatch } = useApp();
  const { user, logout } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleAdd = () => {
    setEditingApp(null);
    setModalOpen(true);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(applications, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `job_tracker_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'SET_APPLICATIONS', payload: parsed });
          alert('Data berhasil di-restore!');
        } else {
          alert('Format file tidak valid. Pastikan file backup JSON dari aplikasi ini.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = null;
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
            {user && (
              <span className="hidden sm:inline-block text-sm font-medium opacity-80 mr-1">
                Hi, {user.name}
              </span>
            )}

            {/* Hidden File Input for Import */}
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImportJSON} 
            />

            {/* Import Data */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-700 dark:text-surface-300 hover:bg-brand-500/10 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
              title="Restore Data (JSON)"
            >
              <Upload className="w-[18px] h-[18px]" />
            </motion.button>

            {/* Export data */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleExportJSON}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-700 dark:text-surface-300 hover:bg-brand-500/10 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
              title="Backup Data (JSON)"
            >
              <Download className="w-[18px] h-[18px]" />
            </motion.button>

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

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-status-rejected hover:bg-status-rejected/10 transition-colors cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
