'use client';

import { useApp } from '../context/AppContext';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function DashboardCharts() {
  const { applications, STATUSES, darkMode } = useApp();

  // 1. Status Distribution Data
  const statusData = STATUSES.map(status => ({
    name: status,
    value: applications.filter(app => app.status === status).length
  })).filter(d => d.value > 0);

  const COLORS = {
    'Applied': '#6366f1',
    'Screening': '#f59e0b',
    'Technical Test': '#ec4899',
    'Interview': '#06b6d4',
    'Offer': '#10b981',
    'Rejected': '#f43f5e',
  };

  // 2. Timeline Data
  const timelineMap = applications.reduce((acc, app) => {
    if (!app.dateApplied) return acc;
    const date = new Date(app.dateApplied);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const timelineData = Object.entries(timelineMap).map(([month, count]) => ({
    name: month,
    Applications: count
  }));

  if (applications.length === 0) return null;

  const tooltipBg = darkMode ? 'rgba(30, 30, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipColor = darkMode ? '#fff' : '#000';
  const gridColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Status Distribution */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden min-h-[350px]">
        <h3 className="text-sm font-bold opacity-80 mb-6 uppercase tracking-wider">Status Distribution</h3>
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(120,120,120,0.2)', background: tooltipBg, color: tooltipColor }}
                itemStyle={{ color: tooltipColor }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Application Timeline */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden min-h-[350px]">
        <h3 className="text-sm font-bold opacity-80 mb-6 uppercase tracking-wider">Application Timeline</h3>
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: gridColor }}
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(120,120,120,0.2)', background: tooltipBg, color: tooltipColor }}
                itemStyle={{ color: tooltipColor }}
              />
              <Bar dataKey="Applications" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {timelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
