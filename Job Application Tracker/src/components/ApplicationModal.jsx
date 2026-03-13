'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function ApplicationModal() {
  const {
    setModalOpen,
    editingApp,
    setEditingApp,
    dispatch,
    STATUSES,
    COUNTRIES,
    TIMEZONES,
  } = useApp();

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    country: 'US',
    dateApplied: new Date().toISOString().split('T')[0],
    jobLink: '',
    status: 'Applied',
    notes: '',
    visaSponsorship: false,
    timezone: '',
  });

  useEffect(() => {
    if (editingApp) {
      setFormData(editingApp);
    }
  }, [editingApp]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingApp(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.position) return;

    if (editingApp) {
      dispatch({ type: 'UPDATE_APPLICATION', payload: formData });
    } else {
      dispatch({ type: 'ADD_APPLICATION', payload: formData });
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {editingApp ? 'Edit Application' : 'New Application'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-1">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
                placeholder="e.g. Acme Corp"
              />
            </div>

            {/* Position */}
            <div className="space-y-1">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="position"
                name="position"
                required
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timezone */}
            <div className="space-y-1">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
              >
                <option value="">Select Timezone</option>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Applied */}
            <div className="space-y-1">
              <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Applied
              </label>
              <input
                type="date"
                id="dateApplied"
                name="dateApplied"
                value={formData.dateApplied}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Job Link */}
          <div className="space-y-1">
            <label htmlFor="jobLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Link
            </label>
            <input
              type="url"
              id="jobLink"
              name="jobLink"
              value={formData.jobLink}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
              placeholder="https://company.com/careers/job-id"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400 resize-none"
              placeholder="Interview details, questions, specific requirements..."
            />
          </div>

          {/* Visa Sponsorship */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="visaSponsorship"
              name="visaSponsorship"
              checked={formData.visaSponsorship}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-900"
            />
            <label htmlFor="visaSponsorship" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Requires Visa Sponsorship
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-colors"
            >
              {editingApp ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
