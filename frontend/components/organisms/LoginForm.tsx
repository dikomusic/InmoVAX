"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Input2FA } from '../molecules/Input2FA';

export const LoginForm = () => {
  const [paso, setPaso] = useState<1 | 2>(1);

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(2);
  };

  return (
    <div className="bg-surface-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-content-main mb-2">
          {paso === 1 ? 'Bienvenido de vuelta' : 'Seguridad 2FA'}
        </h2>
        <p className="text-content-muted">
          {paso === 1 
            ? 'Ingresa tus datos para acceder a tu cuenta.' 
            : 'Ingresa el código de 6 dígitos enviado a tu celular.'}
        </p>
      </div>

      {paso === 1 && (
        <form onSubmit={manejarLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-content-main mb-2">Correo Electrónico</label>
            <Input type="email" placeholder="ejemplo@correo.com" required />
          </div>
          
          <div className="mb-6">
              <label className="block text-sm font-bold text-content-main mb-2">Contraseña</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
              />
              
              {/* Enlace movido a la parte de abajo */}
              <div className="text-right mt-2">
                <a href="/recuperar" className="text-sm font-bold text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          <div className="pt-4">
            <Button type="submit" variant="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </div>
        </form>
      )}

      {paso === 2 && (
        <form className="space-y-2">
          <Input2FA />
          <div className="pt-4">
            <Button type="submit" variant="accent" fullWidth>
              Verificar y Entrar
            </Button>
          </div>
          <button 
            type="button" 
            onClick={() => setPaso(1)} 
            className="w-full text-center mt-6 text-sm text-content-muted hover:text-primary font-bold transition-colors"
          >
            ← Volver al login normal
          </button>
        </form>
      )}
    </div>
  );
};