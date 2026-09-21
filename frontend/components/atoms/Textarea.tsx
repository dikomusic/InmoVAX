import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = ({ resize = 'vertical', className = '', ...props }: TextareaProps) => {
  return (
    <textarea
      className={`w-full bg-surface-white text-content-main placeholder-content-muted rounded-lg py-3 px-4 outline-none border-2 border-gray-200 focus:border-primary transition-colors ${
        resize === 'none' ? 'resize-none' : resize === 'horizontal' ? 'resize-x' : resize === 'both' ? 'resize' : 'resize-y'
      } ${className}`}
      {...props}
    />
  );
};