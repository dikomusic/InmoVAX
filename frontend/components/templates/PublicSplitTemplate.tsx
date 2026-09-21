import React from 'react';

interface PublicSplitTemplateProps {
  children: React.ReactNode;
  form: React.ReactNode;
  tone?: 'white' | 'light';
  className?: string;
}

export const PublicSplitTemplate = ({ children, form, tone = 'white', className = '' }: PublicSplitTemplateProps) => {
  const background = tone === 'light' ? 'bg-surface-light' : 'bg-surface-white';

  return (
    <div className={`min-h-screen ${background} py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        <div className="w-full md:w-1/2">{children}</div>
        <div className="w-full md:w-1/2">{form}</div>
      </div>
    </div>
  );
};