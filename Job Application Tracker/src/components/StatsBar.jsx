'use client';

import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { FileText, Users, Trophy, XCircle } from 'lucide-react';

const statCards = [
  { key: 'total', label: 'Total Apps', icon: FileText, gradient: 'from-brand-500 to-brand-700', shadowColor: 'shadow-brand-500/15' },
  { key: 'interviews', label: 'Interviews', icon: Users, gradient: 'from-teal-500 to-cyan-600', shadowColor: 'shadow-teal-500/15' },
  { key: 'offers', label: 'Offers', icon: Trophy, gradient: 'from-emerald-500 to-green-600', shadowColor: 'shadow-emerald-500/15' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, gradient: 'from-rose-500 to-red-600', shadowColor: 'shadow-rose-500/15' },
];

export default function StatsBar() {
  const { stats } = useApp();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 mb-6">
      {statCards.map(({ key, label, icon: Icon, gradient, shadowColor }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className={`glass-card rounded-2xl p-4 ${shadowColor}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300">
              {label}
            </span>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <motion.p
            key={stats[key]}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-extrabold tracking-tight"
          >
            {stats[key]}
          </motion.p>
          {key === 'total' && (
            <p className="text-xs text-surface-700 dark:text-surface-300 mt-0.5">
              {stats.active} active
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
