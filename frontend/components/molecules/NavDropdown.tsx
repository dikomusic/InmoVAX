import React from 'react';
import Link from 'next/link';

export interface DropdownItem {
  label: string;
  href?: string;
  isHeader?: boolean;
  isDivider?: boolean;
}

interface NavDropdownProps {
  title: string;
  items: DropdownItem[];
}

export const NavDropdown = ({ title, items }: NavDropdownProps) => {
  return (
    <div className="relative group">
      {/* Botón principal del Navbar */}
      <button className="flex items-center gap-1 text-content-inverse hover:text-accent transition-colors font-medium py-2">
        {title}
        <span className="text-[10px] opacity-70 group-hover:rotate-180 transition-transform duration-200">
          ▼
        </span>
      </button>

      {/* Contenedor desplegable (Oculto por defecto, visible en hover) */}
      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 z-50 overflow-hidden">
        <ul className="py-2 flex flex-col">
          {items.map((item, index) => {
            
            if (item.isHeader) {
              return (
                <li key={index} className="px-4 py-2 font-extrabold text-gray-900 text-sm uppercase tracking-wider bg-gray-50">
                  {item.label}
                </li>
              );
            }
            
            if (item.isDivider) {
              return <li key={index} className="border-b border-gray-100 my-1"></li>;
            }

            return (
              <li key={index}>
                <Link 
                  href={item.href || '#'} 
                  className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};