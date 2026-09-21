import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'navbar' | 'footer' | 'sidebar';
  hideTextOnMobile?: boolean;
  className?: string;
}

export const BrandLogo = ({
  variant = 'navbar',
  hideTextOnMobile = true,
  className = ''
}: BrandLogoProps) => {
  const isFooter = variant === 'footer';
  const isNavbar = variant === 'navbar';

  // En el footer o en el sidebar el texto siempre es visible; en el navbar se adapta a móvil
  const showTextClasses = isFooter || variant === 'sidebar' || !hideTextOnMobile
    ? 'inline-flex'
    : 'hidden sm:inline-flex';

  return (
    <span
      className={`inline-flex items-center gap-2 sm:gap-2.5 shrink-0 select-none ${className}`}
      aria-label="InmoVAX"
    >
      <Image
        src="/logo-icon.png"
        alt="InmoVAX"
        width={184}
        height={240}
        priority={isNavbar}
        className={`w-auto object-contain shrink-0 ${
          isFooter
            ? 'h-10 sm:h-12 drop-shadow-md'
            : 'h-8 sm:h-9 md:h-10 drop-shadow-sm'
        }`}
      />
      <span
        className={`items-center tracking-tight font-black leading-none ${showTextClasses} ${
          isFooter
            ? 'text-2xl sm:text-3xl'
            : 'text-xl sm:text-2xl md:text-[26px]'
        }`}
      >
        <span className="text-accent">Inmo</span>
        <span className="text-white">VAX</span>
      </span>
    </span>
  );
};