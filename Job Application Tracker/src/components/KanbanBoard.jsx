'use client';

import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import ApplicationCard from './ApplicationCard';

const columnMeta = {
  'Applied': { accent: 'col-applied', dot: 'bg-status-applied' },
  'Screening': { accent: 'col-screening', dot: 'bg-status-screening' },
  'Technical Test': { accent: 'col-technical', dot: 'bg-status-technical' },
  'Interview': { accent: 'col-interview', dot: 'bg-status-interview' },
  'Offer': { accent: 'col-offer', dot: 'bg-status-offer' },
  'Rejected': { accent: 'col-rejected', dot: 'bg-status-rejected' },
};

export default function KanbanBoard() {
  const { filteredApps, STATUSES, dispatch } = useApp();

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      dispatch({ type: 'UPDATE_STATUS', payload: { id, status: newStatus } });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 auto-rows-min"
    >
      {STATUSES.map((status) => {
        const apps = filteredApps.filter((a) => a.status === status);
        const meta = columnMeta[status];

        return (
          <div
            key={status}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
            className={`flex flex-col rounded-2xl border-t-[3px] ${meta.accent} bg-surface-200/40 dark:bg-surface-900/40 min-h-[200px]`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3.5 py-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface-200 dark:bg-surface-800">
                {apps.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 px-2.5 pb-3 flex-1">
              <AnimatePresence mode="popLayout">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', app.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <ApplicationCard app={app} />
                  </div>
                ))}
              </AnimatePresence>

              {apps.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-xs text-surface-700/40 dark:text-surface-300/30 min-h-[80px]">
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
