import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'urgent';
  bgColor?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'positive',
  bgColor = 'bg-blue-50 text-primary'
}: StatCardProps) => {
  const trendStyles = {
    positive: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
    neutral: 'text-blue-700 bg-blue-50 border border-blue-200',
    urgent: 'text-amber-800 bg-amber-50 border border-amber-200'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${bgColor}`}>
          {icon}
        </span>
        {trend && (
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg ${trendStyles[trendType]}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-bold text-content-muted uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black text-surface-dark mt-1 tracking-tight">{value}</h3>
      {subtitle && (
        <p className="text-[11px] text-content-muted mt-2 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
