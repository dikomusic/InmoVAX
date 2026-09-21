import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { PublicSplitTemplate } from '@/components/templates/PublicSplitTemplate';

export default function TrabajaConNosotrosPage() {
  return (
    <PublicSplitTemplate
      tone="light"
      form={(
        <div className="bg-surface-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-extrabold text-content-main mb-6">Postula hoy mismo</h3>
          <form className="space-y-5">
            <FormField label="Nombre y Apellidos">
              <Input type="text" placeholder="Ej. Ana Lucía Pérez" required />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Celular">
                <Input type="tel" placeholder="Ej. 70011223" required />
              </FormField>
              <FormField label="Correo">
                <Input type="email" placeholder="correo@ejemplo.com" required />
              </FormField>
            </div>
            <FormField label="Enlace a tu LinkedIn o CV (Opcional)">
              <Input type="url" placeholder="https://linkedin.com/in/..." />
            </FormField>
            <FormField label="¿Por qué te gustaría unirte?"><Textarea className="h-24" placeholder="Cuéntanos brevemente sobre tu experiencia..." required /></FormField>
            <div className="pt-2"><Button type="button" variant="primary" fullWidth>Enviar Postulación</Button></div>
          </form>
        </div>
      )}
    >
        <div>
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
    </PublicSplitTemplate>
  );
}