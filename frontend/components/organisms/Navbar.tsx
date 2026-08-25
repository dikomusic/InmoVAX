"use client"; // 1. Agregamos esto para poder usar "estados" (clics)
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { NavDropdown, DropdownItem } from '../molecules/NavDropdown';

export const Navbar = () => {
  // 2. Estado para saber si el menú del celular está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  const menuComprar: DropdownItem[] = [
    { label: 'Comprar', isHeader: true },
    { label: '', isDivider: true },
    { label: 'Casas', href: '/comprar/casas' },
    { label: 'Departamentos', href: '/comprar/departamentos' },
    { label: 'Terrenos', href: '/comprar/terrenos' },
    { label: 'Oficinas', href: '/comprar/oficinas' },
    { label: 'Locales comerciales', href: '/comprar/locales' },
    { label: 'Todos los inmuebles', href: '/comprar/todos' },
  ];

  const menuAlquilar: DropdownItem[] = [
    { label: 'Alquilar', isHeader: true },
    { label: '', isDivider: true },
    { label: 'Casas', href: '/alquilar/casas' },
    { label: 'Departamentos', href: '/alquilar/departamentos' },
    { label: 'Oficinas', href: '/alquilar/oficinas' },
    { label: 'Locales comerciales', href: '/alquilar/locales' },
    { label: 'Todos los inmuebles', href: '/alquilar/todos' },
  ];

  const menuAnticretico: DropdownItem[] = [
    { label: 'Anticrético', isHeader: true },
    { label: '', isDivider: true },
    { label: 'Casas', href: '/anticretico/casas' },
    { label: 'Departamentos', href: '/anticretico/departamentos' },
    { label: 'Oficinas', href: '/anticretico/oficinas' },
    { label: 'Locales comerciales', href: '/anticretico/locales' },
    { label: 'Todos los inmuebles', href: '/anticretico/todos' },
  ];

  const menuMas: DropdownItem[] = [
    { label: 'Más', isHeader: true },
    { label: '', isDivider: true },
    { label: ' Nuestros asesores', href: '/asesores' },
    { label: ' Oficinas', href: '/oficinas' },
    { label: ' Nosotros', href: '/nosotros' },
    { label: ' Trabaja con nosotros', href: '/empleo ' },
    { label: ' Contacto', href: '/contacto' },
  ];

  return (
    <nav className="bg-surface-dark w-full sticky top-0 z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 xl:px-8 h-20 flex items-center justify-between">
        
        {/* 1. LOGO */}
        <Link href="/" className="text-2xl font-extrabold text-content-inverse tracking-tight shrink-0">
          <span className="text-accent">INMO</span>PAZ
        </Link>

        {/* 2. ENLACES CENTRALES (Desktop) */}
        <div className="hidden lg:flex space-x-6 items-center">
          <NavDropdown title="Comprar" items={menuComprar} />
          <NavDropdown title="Alquilar" items={menuAlquilar} />
          <NavDropdown title="Anticrético" items={menuAnticretico} />
          
          <Link href="/proyectos" className="text-content-inverse hover:text-accent font-medium transition-colors">
            Proyectos
          </Link>
          
          <NavDropdown title="Más" items={menuMas} />
        </div>

        {/* 3. BOTONES DE ACCIÓN Y MENÚ HAMBURGUESA */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <Link href="/publicar" className="hidden sm:block">
            <Button variant="accent">Publicar</Button>
          </Link>
          
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost">Iniciar Sesión</Button>
          </Link>

          {/* Botón de 3 Rayas (Solo visible en celular lg:hidden) */}
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="lg:hidden text-content-inverse hover:text-accent p-2 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                // Ícono de "X" cuando está abierto
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Ícono de 3 rayas cuando está cerrado
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 4. MENÚ DESPLEGABLE MÓVIL (Solo se muestra si le diste clic a las 3 rayas) */}
      {menuAbierto && (
        <div className="lg:hidden bg-surface-dark border-t border-gray-800 absolute w-full left-0 shadow-xl overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="flex flex-col px-6 py-6 space-y-6">
            
            {/* Función Combobox adaptada a Móvil (Acordeón) */}
            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-xl cursor-pointer list-none">
                Comprar <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-4 space-y-3 border-l-2 border-gray-700">
                {menuComprar.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-xl cursor-pointer list-none">
                Alquilar <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-4 space-y-3 border-l-2 border-gray-700">
                {menuAlquilar.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-xl cursor-pointer list-none">
                Anticrético <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-4 space-y-3 border-l-2 border-gray-700">
                {menuAnticretico.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            <Link href="/proyectos" onClick={() => setMenuAbierto(false)} className="text-content-inverse font-bold text-xl hover:text-accent">
              Proyectos
            </Link>

            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-xl cursor-pointer list-none">
                Más <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-4 space-y-3 border-l-2 border-gray-700">
                {menuMas.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            {/* Separador */}
            <div className="h-px bg-gray-800 my-2"></div>

            {/* Botones principales para móvil */}
            <Link href="/publicar" onClick={() => setMenuAbierto(false)}>
              <Button variant="accent" fullWidth>Publicar mi Propiedad</Button>
            </Link>
            <Link href="/login" onClick={() => setMenuAbierto(false)}>
              <Button variant="outline" fullWidth className="border-white text-white hover:bg-white/10">Iniciar Sesión</Button>
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};