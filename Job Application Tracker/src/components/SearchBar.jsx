'use client';

import { useApp } from '../context/AppContext';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const {
    searchQuery, setSearchQuery,
    filterCountry, setFilterCountry,
    filterStatus, setFilterStatus,
    COUNTRIES, STATUSES,
  } = useApp();

  const hasFilters = searchQuery || filterCountry || filterStatus;

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700 dark:text-surface-300" />
        <input
          type="text"
          placeholder="Search company or position…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl text-sm glass-card focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all placeholder:text-surface-700/50 dark:placeholder:text-surface-300/50 bg-transparent"
        />
      </div>

      {/* Country filter */}
      <select
        value={filterCountry}
        onChange={(e) => setFilterCountry(e.target.value)}
        className="h-10 px-3 rounded-xl text-sm glass-card focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer bg-transparent appearance-none min-w-[130px]"
      >
        <option value="">🌍 All Countries</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="h-10 px-3 rounded-xl text-sm glass-card focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer bg-transparent appearance-none min-w-[130px]"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => { setSearchQuery(''); setFilterCountry(''); setFilterStatus(''); }}
          className="h-10 px-3 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
