'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ExternalLink, Edit2, Trash2, ArrowUpDown, Globe2, Clock, MapPin } from 'lucide-react';

const getStatusBadgeClass = (status) => {
  const map = {
    'Applied': 'badge-applied',
    'Screening': 'badge-screening',
    'Technical Test': 'badge-technical',
    'Interview': 'badge-interview',
    'Offer': 'badge-offer',
    'Rejected': 'badge-rejected',
  };
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

export default function DataTable() {
  const { filteredApps, STATUSES, dispatch, setEditingApp, setModalOpen, COUNTRIES } = useApp();
  const [sortConfig, setSortConfig] = useState({ key: 'dateApplied', direction: 'desc' });

  const sortedApps = useMemo(() => {
    let sortableApps = [...filteredApps];
    if (sortConfig.key !== null) {
      sortableApps.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableApps;
  }, [filteredApps, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = (app, newStatus) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id: app.id, status: newStatus } });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      dispatch({ type: 'DELETE_APPLICATION', payload: id });
    }
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setModalOpen(true);
  };

  const getCountryFlag = (code) => {
    const country = COUNTRIES.find((c) => c.code === code);
    return country ? country.flag : '🌍';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800/60 glass-card"
    >
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
              <th className="px-5 py-4 font-semibold text-sm text-gray-700 dark:text-gray-300">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                  onClick={() => requestSort('company')}
                >
                  Company
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                </button>
              </th>
              <th className="px-5 py-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Position</th>
              <th className="px-5 py-4 font-semibold text-sm text-gray-700 dark:text-gray-300">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                  onClick={() => requestSort('dateApplied')}
                >
                  Date Applied
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                </button>
              </th>
              <th className="px-5 py-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Location</th>
              <th className="px-5 py-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-5 py-4 text-right font-semibold text-sm text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {sortedApps.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                  No applications found.
                </td>
              </tr>
            ) : (
              sortedApps.map((app) => (
                <motion.tr
                  key={app.id}
                  layout
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{app.company}</span>
                      {app.jobLink && (
                        <a
                          href={app.jobLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1 mt-0.5"
                        >
                          <ExternalLink className="w-3 h-3" /> Job Link
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{app.position}</div>
                    {app.visaSponsorship && (
                      <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        <Globe2 className="w-3 h-3" /> Visa
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(app.dateApplied).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="text-base">{getCountryFlag(app.country)}</span>
                        {app.country}
                      </span>
                      {app.timezone && (
                        <span className="flex items-center gap-1 text-xs mt-1 text-gray-500">
                          <Clock className="w-3 h-3" /> {app.timezone.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      className={`text-sm rounded-full px-2.5 py-1 font-medium border-none cursor-pointer focus:ring-2 focus:ring-blue-500 appearance-none outline-none ${getStatusBadgeClass(
                        app.status
                      )}`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(app)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-blue-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
