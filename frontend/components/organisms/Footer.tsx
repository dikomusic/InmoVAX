import React from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export const Footer = () => {
  return (
    // También usa el Azul Medianoche para dar peso visual abajo
    <footer className="bg-surface-dark pt-16 pb-8 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Columna 1: Info de la empresa */}
        <div>
          <div className="text-3xl font-extrabold text-content-inverse mb-4 tracking-tight">
            <span className="text-accent">INMO</span>PAZ
          </div>
          <p className="text-content-inverse/70 leading-relaxed mb-6">
            Tu aliado inmobiliario en La Paz. Revolucionando la forma de encontrar 
            anticréticos, ventas y alquileres con seguridad y tecnología 3D.
          </p>
        </div>

        {/* Columna 2: Links Rápidos */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-lg font-bold text-content-inverse mb-3">Links Rápidos</h4>
          <Link href="/" className="text-content-inverse/70 hover:text-accent transition-colors">Inicio</Link>
          <Link href="/venta" className="text-content-inverse/70 hover:text-accent transition-colors">Propiedades en Venta</Link>
          <Link href="/alquiler" className="text-content-inverse/70 hover:text-accent transition-colors">Alquileres</Link>
          <Link href="/contacto" className="text-content-inverse/70 hover:text-accent transition-colors">Contacto</Link>
        </div>

        {/* Columna 3: Boletín / Contacto rápido */}
        <div>
          <h4 className="text-lg font-bold text-content-inverse mb-4">Hablemos de tu próximo hogar</h4>
          <p className="text-content-inverse/70 mb-4 text-sm">
            Déjanos tu correo y un agente se contactará contigo hoy mismo.
          </p>
          <form className="flex flex-col gap-3">
            <Input type="email" placeholder="Tu correo electrónico" required />
            <Button variant="accent" fullWidth>
              Enviar Mensaje
            </Button>
          </form>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center text-content-inverse/50 text-sm">
        © {new Date().getFullYear()} InmoPaz Bolivia. Todos los derechos reservados.
      </div>
    </footer>
  );
};