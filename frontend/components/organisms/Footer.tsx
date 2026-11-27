"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
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
          <p className="text-content-inverse/70 leading-relaxed mb-6 text-sm">
            Plataforma tecnológica de servicios inmobiliarios directos en Bolivia. Conectamos propietarios y compradores sin comisiones abusivas y con verificación en Derechos Reales.
          </p>
        </div>

        {/* Columna 2: Links Rápidos */}
        <div className="flex flex-col space-y-2.5 text-sm">
          <h4 className="text-base font-bold text-content-inverse mb-2">Servicios y Comunidad</h4>
          <Link href="/" className="text-content-inverse/70 hover:text-accent transition-colors">Inicio</Link>
          <Link href="/foro" className="text-content-inverse/70 hover:text-accent transition-colors">Foro de la Comunidad</Link>
          <Link href="/asesores" className="text-content-inverse/70 hover:text-accent transition-colors">Servicios Notariales y Legales</Link>
          <Link href="/publicar" className="text-content-inverse/70 hover:text-accent transition-colors">Publicar con Cartel QR</Link>
          <Link href="/anticretico/todos" className="text-content-inverse/70 hover:text-accent transition-colors">Anticréticos Verificados</Link>
          <Link href="/contacto" className="text-content-inverse/70 hover:text-accent transition-colors">Contacto y Soporte</Link>
        </div>

        {/* Columna 3: Boletín / Contacto rápido */}
        <div>
          <h4 className="text-base font-bold text-content-inverse mb-3">Soporte y Orientación</h4>
          <p className="text-content-inverse/70 mb-4 text-xs leading-relaxed">
            Escríbenos y nuestro equipo de soporte resolverá tus dudas sobre la plataforma o trámites legales.
          </p>
          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>¡Mensaje recibido! Nos pondremos en contacto contigo a la brevedad.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="accent" fullWidth className="text-xs font-bold py-2.5">
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