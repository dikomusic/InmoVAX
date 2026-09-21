import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl'
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-xs sm:p-4">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className={`relative z-10 max-h-[calc(100vh-1rem)] w-full overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:max-h-[90vh] sm:rounded-3xl sm:p-8 ${maxWidthClasses[maxWidth]}`}>
        
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="min-w-0 pr-3">
            <h3 className="text-lg font-extrabold text-surface-dark sm:text-xl">{title}</h3>
            {subtitle && <p className="mt-1 text-xs font-medium text-content-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mt-6">
          {children}
        </div>

      </div>
    </div>
  );
};
