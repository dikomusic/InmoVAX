import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'accent' | 'primary';
}

export const Badge = ({ text, variant = 'accent' }: BadgeProps) => {
  const variants = {
    accent: "bg-accent text-content-main",
    primary: "bg-primary text-content-inverse"
  };

  return (
    <span className={`px-3 py-1 text-xs font-extrabold uppercase rounded-md tracking-wider shadow-sm ${variants[variant]}`}>
      {text}
    </span>
  );
};