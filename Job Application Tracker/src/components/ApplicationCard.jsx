'use client';

import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ExternalLink, Pencil, Trash2, Plane, StickyNote } from 'lucide-react';

const statusBadgeClass = {
  'Applied': 'badge-applied',
  'Screening': 'badge-screening',
  'Technical Test': 'badge-technical',
  'Interview': 'badge-interview',
  'Offer': 'badge-offer',
  'Rejected': 'badge-rejected',
};

export default function ApplicationCard({ app }) {
  const { dispatch, setModalOpen, setEditingApp, COUNTRIES } = useApp();
  const country = COUNTRIES.find((c) => c.code === app.country);

  const handleEdit = () => {
    setEditingApp(app);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete application for ${app.company}?`)) {
      dispatch({ type: 'DELETE_APPLICATION', payload: app.id });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-3.5 group cursor-default"
    >
      {/* Top row: company + actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 className="text-sm font-bold truncate leading-tight">{app.company}</h3>
          <p className="text-xs text-surface-700 dark:text-surface-300 truncate mt-0.5">{app.position}</p>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {app.jobLink && (
            <a
              href={app.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-500/10 text-brand-500 transition-colors"
              title="Open job link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={handleEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-500/10 text-brand-500 transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
        {country && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-200/60 dark:bg-surface-800/60 font-medium">
            {country.flag} {country.name}
          </span>
        )}
        {app.visaSponsorship && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Plane className="w-3 h-3" /> Visa
          </span>
        )}
        {app.notes && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" title={app.notes}>
            <StickyNote className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Bottom: date + status */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-surface-200 dark:border-surface-800">
        <span className="text-[11px] text-surface-700 dark:text-surface-300 font-medium">
          {new Date(app.dateApplied).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${statusBadgeClass[app.status] || 'badge-applied'}`}>
          {app.status}
        </span>
      </div>
    </motion.div>
  );
}
