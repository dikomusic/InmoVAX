import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-surface-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        
        {/* Columna Izquierda: Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-extrabold text-content-main mb-6">
            Hablemos de tu <span className="text-accent">próximo hogar</span>
          </h1>
          <p className="text-content-muted mb-8 text-lg font-medium">
            ¿Tienes dudas sobre un anticrético? ¿Quieres vender tu casa rápido? Nuestro equipo de expertos legales y comerciales está listo para asesorarte.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📍</span>
              <p className="font-bold text-content-main">Av. Ballivián, Edificio Torre Sur, Piso 5, Calacoto.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">📱</span>
              <p className="font-bold text-content-main">+591 700-00000</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="w-full md:w-1/2 bg-surface-light p-8 rounded-2xl border border-gray-100 shadow-sm">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Nombre Completo</label>
              <Input type="text" placeholder="Ej. Juan Pérez" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Celular / WhatsApp</label>
              <Input type="tel" placeholder="Ej. 70012345" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-content-main mb-2">¿En qué podemos ayudarte?</label>
              <textarea 
                className="w-full bg-surface-white text-content-main rounded-lg py-3 px-4 outline-none border-2 border-gray-200 focus:border-primary resize-none h-32 transition-colors"
                placeholder="Escribe tu mensaje aquí..."
                required
              ></textarea>
            </div>
            <Button type="button" variant="primary" fullWidth>Enviar Mensaje</Button>
          </form>
        </div>

      </div>
    </div>
  );
}