"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

interface Error403ForbiddenProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export const Error403Forbidden: React.FC<Error403ForbiddenProps> = ({
  title = "Acceso Prohibido",
  description = "No tienes los permisos necesarios para ingresar a esta sección. Esta área está reservada exclusivamente para el equipo administrativo de InmoVAX.",
  buttonText = "Volver a la página principal",
  buttonHref = "/",
}) => {
  return (
    <main className="min-h-screen w-full bg-[#EBF2FC] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800 selection:bg-sky-200">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
        
        {/* Ilustración 403 inspirada en nubes, candado abierto y rayos celestes */}
        <div className="w-full max-w-md relative select-none">
          <svg
            viewBox="0 0 500 350"
            className="w-full h-auto drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Capa de Nube Trasera 1 */}
            <path
              d="M110 200 C80 180, 70 130, 110 100 C140 70, 200 80, 220 110 C250 85, 310 90, 330 130 C370 120, 410 150, 400 190 C420 220, 390 260, 350 260 L120 260 C80 260, 60 220, 110 200 Z"
              fill="#D4E6FA"
            />

            {/* Capa de Nube Media 2 (Celeste intermedio) */}
            <path
              d="M80 210 C50 190, 60 140, 100 130 C120 90, 180 85, 210 115 C240 95, 290 100, 310 140 C345 135, 380 160, 375 200 C395 230, 370 265, 330 265 L100 265 C70 265, 55 235, 80 210 Z"
              fill="#BFDCFA"
            />

            {/* Capa de Nube Delantera 3 (Puffy Clouds suaves) */}
            <path
              d="M130 270 C100 250, 110 200, 150 190 C170 150, 230 145, 260 175 C290 155, 350 160, 370 200 C405 195, 435 225, 430 260 C445 285, 420 310, 390 310 L150 310 C120 310, 110 285, 130 270 Z"
              fill="#CEE4FC"
            />

            {/* Líneas de Viento Decorativas (Swirls azules) */}
            <path
              d="M140 165 C170 120, 210 190, 250 150 C280 120, 290 170, 320 155 C350 140, 380 160, 360 180"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M70 195 C90 170, 120 185, 140 175 C160 165, 180 180, 200 170"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M270 260 C300 220, 340 280, 380 240 C410 210, 440 250, 460 230"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
            
            {/* Número "403" en Tipografía Gruesa y Estilizada (Azul Marino Profundo) */}
            <text
              x="395"
              y="110"
              textAnchor="middle"
              fill="#0F2A66"
              fontSize="108"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-3px"
              className="drop-shadow-xs"
            >
              403
            </text>

            {/* Rayos / Chispas que irradian del candado */}
            <g stroke="#38BDF8" strokeWidth="3" strokeLinecap="round">
              <line x1="120" y1="210" x2="100" y2="195" />
              <line x1="105" y1="240" x2="80" y2="242" />
              <line x1="115" y1="275" x2="95" y2="290" />
              <line x1="150" y1="315" x2="140" y2="335" />
              <line x1="225" y1="315" x2="235" y2="335" />
              <line x1="260" y1="275" x2="280" y2="290" />
              <line x1="270" y1="240" x2="295" y2="240" />
              <line x1="260" y1="205" x2="280" y2="195" />
            </g>

            {/* Candado Flotante (Con arco abierto y cerradura) */}
            <g transform="translate(145, 175) rotate(-6)">
              {/* Arco metálico abierto del candado */}
              <path
                d="M32 45 V28 C32 12, 44 0, 60 0 C76 0, 88 12, 88 28 V45"
                stroke="#0EA5E9"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              {/* Apertura del arco para mostrar que está abierto */}
              <circle cx="32" cy="45" r="4.5" fill="#0284C7" />

              {/* Cuerpo del candado (Cian / Turquesa con perspectiva) */}
              <rect
                x="15"
                y="42"
                width="88"
                height="75"
                rx="18"
                fill="#38BDF8"
              />
              <rect
                x="15"
                y="42"
                width="88"
                height="75"
                rx="18"
                fill="url(#lockGradient)"
              />

              {/* Cerradura / Ojo de la llave */}
              <ellipse cx="59" cy="74" rx="7" ry="8" fill="#0369A1" />
              <polygon points="55,77 63,77 66,94 52,94" fill="#0369A1" />
            </g>

            {/* Gradientes para el candado */}
            <defs>
              <linearGradient id="lockGradient" x1="15" y1="42" x2="103" y2="117" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="1" stopColor="#0284C7" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Título y Mensaje de Error */}
        <div className="mt-4 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2A66] tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* ÚNICO BOTÓN: Volver a la página principal */}
        <div className="mt-8 w-full max-w-xs">
          <Link
            href={buttonHref}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#0F2A66] hover:bg-[#1A3D8B] text-white font-extrabold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer group"
          >
            <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>{buttonText}</span>
          </Link>
        </div>

        {/* Pequeño pie con marca */}
        <p className="mt-8 text-[11px] font-semibold text-slate-400">
          InmoVAX Plataforma Inmobiliaria • Sistema Seguro
        </p>
      </div>
    </main>
  );
};
