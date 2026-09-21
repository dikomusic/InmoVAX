"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { BrandLogo } from '../atoms/BrandLogo';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    // También usa el Azul Medianoche para dar peso visual abajo
    <footer className="bg-surface-dark pt-16 pb-8 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Columna 1: Info de la empresa */}
        <div>
          <BrandLogo variant="footer" className="mb-4" />
          <p className="text-content-inverse/70 leading-relaxed mb-6">
            Tu aliado inmobiliario en La Paz. Revolucionando la forma de encontrar 
            anticréticos, ventas y alquileres con seguridad y tecnología 3D.
          </p>
        </div>

        {/* Columna 2: Links Rápidos */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-lg font-bold text-content-inverse mb-3">Links Rápidos</h4>
          <Link href="/" className="text-content-inverse/70 hover:text-accent transition-colors">Inicio</Link>
          <Link href="/comprar/todos" className="text-content-inverse/70 hover:text-accent transition-colors">Propiedades en Venta</Link>
          <Link href="/alquilar/todos" className="text-content-inverse/70 hover:text-accent transition-colors">Alquileres</Link>
          <Link href="/anticretico/todos" className="text-content-inverse/70 hover:text-accent transition-colors">Anticréticos</Link>
          <Link href="/contacto" className="text-content-inverse/70 hover:text-accent transition-colors">Contacto</Link>
        </div>

        {/* Columna 3: Boletín / Contacto rápido */}
        <div>
          <h4 className="text-lg font-bold text-content-inverse mb-4">Hablemos de tu próximo hogar</h4>
          <p className="text-content-inverse/70 mb-4 text-sm">
            Déjanos tu correo y un agente se contactará contigo hoy mismo.
          </p>
          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm font-semibold animate-in fade-in">
              ✓ ¡Mensaje recibido! Un asesor de InmoVAX te contactará hoy mismo.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="accent" fullWidth>
                Enviar Mensaje
              </Button>
            </form>
          )}
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center text-content-inverse/50 text-sm">
        © {new Date().getFullYear()} InmoVax Bolivia. Todos los derechos reservados.
      </div>
    </footer>
  );
};