"use client";
import React from 'react';

interface SettingsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const SettingsCard = ({
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  title,
  description,
  children,
  headerAction,
  footer,
  className = ''
}: SettingsCardProps) => {
  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden transition-all duration-200 hover:border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${iconBg} ${iconColor} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-surface-dark tracking-tight">{title}</h3>
            {description && (
              <p className="text-xs text-content-muted mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {headerAction && (
          <div className="self-end sm:self-auto shrink-0">
            {headerAction}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 space-y-5">
        {children}
      </div>

      {/* Optional Footer */}
      {footer && (
        <div className="px-5 sm:px-6 py-4 bg-gray-50/70 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};
