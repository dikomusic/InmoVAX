import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { PublicSplitTemplate } from '@/components/templates/PublicSplitTemplate';

export default function ContactoPage() {
  return (
    <PublicSplitTemplate
      form={(
        <div className="bg-surface-light p-8 rounded-2xl border border-gray-100 shadow-sm">
          <form className="space-y-6">
            <FormField label="Nombre Completo">
              <Input type="text" placeholder="Ej. Juan Pérez" required />
            </FormField>
            <FormField label="Celular / WhatsApp">
              <Input type="tel" placeholder="Ej. 70012345" required />
            </FormField>
            <FormField label="¿En qué podemos ayudarte?">
              <Textarea className="h-32" placeholder="Escribe tu mensaje aquí..." required />
            </FormField>
            <Button type="button" variant="primary" fullWidth>Enviar Mensaje</Button>
          </form>
        </div>
      )}
    >
        <div>
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
    </PublicSplitTemplate>
  );
}