import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

export default function TrabajaConNosotrosPage() {
  return (
    <div className="min-h-screen bg-surface-light py-16 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Información Izquierda */}
        <div className="w-full md:w-1/2">
          <span className="bg-accent/20 text-accent font-extrabold text-sm px-4 py-2 rounded-full uppercase tracking-wider mb-6 inline-block">
            Únete al equipo
          </span>
          <h1 className="text-4xl font-extrabold text-content-main mb-6">
            Desarrolla tu carrera en el sector inmobiliario
          </h1>
          <p className="text-content-muted font-medium mb-8 text-lg">
            Buscamos personas proactivas. Te ofrecemos las mejores comisiones del mercado, capacitación constante y el respaldo de la plataforma tecnológica más avanzada de Bolivia.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-center gap-3 font-bold text-content-main">
              <span className="text-primary text-xl">✓</span> Altas comisiones por ventas y anticréticos.
            </li>
            <li className="flex items-center gap-3 font-bold text-content-main">
              <span className="text-primary text-xl">✓</span> Horarios flexibles e independencia.
            </li>
            <li className="flex items-center gap-3 font-bold text-content-main">
              <span className="text-primary text-xl">✓</span> Cartera de clientes verificada.
            </li>
          </ul>
        </div>

        {/* Formulario Derecha */}
        <div className="w-full md:w-1/2 bg-surface-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-extrabold text-content-main mb-6">Postula hoy mismo</h3>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Nombre y Apellidos</label>
              <Input type="text" placeholder="Ej. Ana Lucía Pérez" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Celular</label>
                <Input type="tel" placeholder="Ej. 70011223" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Correo</label>
                <Input type="email" placeholder="correo@ejemplo.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Enlace a tu LinkedIn o CV (Opcional)</label>
              <Input type="url" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-content-main mb-2">¿Por qué te gustaría unirte?</label>
              <textarea 
                className="w-full bg-surface-light text-content-main rounded-lg py-3 px-4 outline-none border-2 border-transparent focus:border-primary resize-none h-24 transition-colors"
                placeholder="Cuéntanos brevemente sobre tu experiencia..."
                required
              ></textarea>
            </div>
            <div className="pt-2">
              <Button type="button" variant="primary" fullWidth>
                Enviar Postulación
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}