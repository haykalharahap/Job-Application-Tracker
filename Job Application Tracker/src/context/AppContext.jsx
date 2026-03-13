'use client';

import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'job-tracker-apps';

const STATUSES = ['Applied', 'Screening', 'Technical Test', 'Interview', 'Offer', 'Rejected'];

const COUNTRIES = [
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'OTHER', name: 'Other', flag: '🌍' },
];

const TIMEZONES = [
  'UTC-8 (PST)', 'UTC-7 (MST)', 'UTC-6 (CST)', 'UTC-5 (EST)',
  'UTC+0 (GMT)', 'UTC+1 (CET)', 'UTC+2 (EET)', 'UTC+3 (MSK)',
  'UTC+5:30 (IST)', 'UTC+7 (WIB)', 'UTC+8 (SGT/MYT)',
  'UTC+9 (JST)', 'UTC+10 (AEST)', 'UTC+12 (NZST)',
];

const SAMPLE_APPS = [
  {
    id: '1',
    company: 'Grab',
    position: 'Frontend Engineer',
    country: 'SG',
    dateApplied: '2026-03-01',
    jobLink: 'https://grab.careers',
    status: 'Interview',
    notes: 'Had initial call. Technical round next week.',
    visaSponsorship: true,
    timezone: 'UTC+8 (SGT/MYT)',
  },
  {
    id: '2',
    company: 'Xero',
    position: 'React Developer',
    country: 'NZ',
    dateApplied: '2026-03-03',
    jobLink: 'https://xero.com/careers',
    status: 'Screening',
    notes: 'Recruiter reached out on LinkedIn.',
    visaSponsorship: true,
    timezone: 'UTC+12 (NZST)',
  },
  {
    id: '3',
    company: 'Petronas Digital',
    position: 'Full Stack Developer',
    country: 'MY',
    dateApplied: '2026-02-28',
    jobLink: 'https://petronasdigital.com',
    status: 'Applied',
    notes: '',
    visaSponsorship: false,
    timezone: 'UTC+8 (SGT/MYT)',
  },
  {
    id: '4',
    company: 'Canva',
    position: 'UI Engineer',
    country: 'AU',
    dateApplied: '2026-02-25',
    jobLink: 'https://canva.com/careers',
    status: 'Technical Test',
    notes: 'Take-home assignment due Friday.',
    visaSponsorship: true,
    timezone: 'UTC+10 (AEST)',
  },
  {
    id: '5',
    company: 'Wise',
    position: 'Software Engineer',
    country: 'UK',
    dateApplied: '2026-02-20',
    jobLink: 'https://wise.com/careers',
    status: 'Rejected',
    notes: 'Position filled internally.',
    visaSponsorship: true,
    timezone: 'UTC+0 (GMT)',
  },
  {
    id: '6',
    company: 'Shopify',
    position: 'Senior Frontend Developer',
    country: 'CA',
    dateApplied: '2026-03-05',
    jobLink: 'https://shopify.com/careers',
    status: 'Applied',
    notes: '',
    visaSponsorship: true,
    timezone: 'UTC-5 (EST)',
  },
  {
    id: '7',
    company: 'GoTo Group',
    position: 'Web Developer',
    country: 'ID',
    dateApplied: '2026-03-08',
    jobLink: 'https://gotogroup.com/careers',
    status: 'Offer',
    notes: 'Offer letter received! Reviewing compensation package.',
    visaSponsorship: false,
    timezone: 'UTC+7 (WIB)',
  },
];

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_APPLICATION':
      return [...state, { ...action.payload, id: Date.now().toString() }];
    case 'UPDATE_APPLICATION':
      return state.map((app) => (app.id === action.payload.id ? { ...app, ...action.payload } : app));
    case 'DELETE_APPLICATION':
      return state.filter((app) => app.id !== action.payload);
    case 'UPDATE_STATUS':
      return state.map((app) => (app.id === action.payload.id ? { ...app, status: action.payload.status } : app));
    case 'MOVE_APPLICATION': {
      const { source, destination, draggableId } = action.payload;
      const newState = [...state];
      const itemIndex = newState.findIndex(a => a.id === draggableId);
      if (itemIndex === -1) return state;
      
      const [item] = newState.splice(itemIndex, 1);
      item.status = destination.droppableId;
      
      const destItems = newState.filter(a => a.status === destination.droppableId);
      
      if (destItems.length === 0 || destination.index >= destItems.length) {
        newState.push(item);
      } else {
        const targetItem = destItems[destination.index];
        const targetIndex = newState.findIndex(a => a.id === targetItem.id);
        newState.splice(targetIndex, 0, item);
      }
      return newState;
    }
    case 'SET_APPLICATIONS':
      return action.payload;
    default:
      return state;
  }
}

function loadFromStorage() {
  if (typeof window === 'undefined') return SAMPLE_APPS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return SAMPLE_APPS;
}

export function AppProvider({ children }) {
  const [applications, dispatch] = useReducer(appReducer, null, loadFromStorage);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('job-tracker-dark');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window === 'undefined') return 'kanban';
    return localStorage.getItem('job-tracker-view') || 'kanban';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Persist applications
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('job-tracker-dark', JSON.stringify(darkMode));
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('job-tracker-view', viewMode);
  }, [viewMode]);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !filterCountry || app.country === filterCountry;
    const matchesStatus = !filterStatus || app.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Stats
  const stats = {
    total: applications.length,
    interviews: applications.filter((a) => a.status === 'Interview').length,
    offers: applications.filter((a) => a.status === 'Offer').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
    active: applications.filter((a) => !['Rejected', 'Offer'].includes(a.status)).length,
  };

  const value = {
    applications,
    filteredApps,
    stats,
    dispatch,
    darkMode,
    setDarkMode,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filterCountry,
    setFilterCountry,
    filterStatus,
    setFilterStatus,
    modalOpen,
    setModalOpen,
    editingApp,
    setEditingApp,
    STATUSES,
    COUNTRIES,
    TIMEZONES,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
