"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Input2FA } from '../molecules/Input2FA';

export const LoginForm = () => {
  const router = useRouter();
  const [paso, setPaso] = useState<1 | 2>(1);
  const [email, setEmail] = useState('admin@inmovax.com');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPaso(2);
    }, 400);
  };

  const manejarVerificacion2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 500);
  };

  const accesoRapidoAdmin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 300);
  };

  const accesoRapidoVendedor = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/vendedor');
    }, 300);
  };

  return (
    <div className="bg-surface-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 w-full">
      {/* Banner de accesos autorizados */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Accesos Directos Autorizados</span>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Perfiles Activos</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={accesoRapidoAdmin}
            disabled={isLoading}
            className="text-xs font-extrabold bg-surface-dark hover:bg-[#121c4d] text-white px-3 py-2.5 rounded-xl transition-all shadow-xs hover:shadow active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>🛡️</span> {isLoading ? 'Ingresando...' : 'Portal Admin'}
          </button>

          <button
            type="button"
            onClick={accesoRapidoVendedor}
            disabled={isLoading}
            className="text-xs font-extrabold bg-primary hover:bg-primary-hover text-white px-3 py-2.5 rounded-xl transition-all shadow-xs hover:shadow active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>🏠</span> {isLoading ? 'Ingresando...' : 'Portal Vendedor'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main mb-2">
          {paso === 1 ? 'Panel de Acceso' : 'Seguridad 2FA'}
        </h2>
        <p className="text-content-muted text-sm">
          {paso === 1 
            ? 'Ingresa tus credenciales administrativas para gestionar InmoVax.' 
            : 'Ingresa el código de 6 dígitos enviado a tu dispositivo autorizado.'}
        </p>
      </div>

      {paso === 1 && (
        <form onSubmit={manejarLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-content-main mb-2">Correo Electrónico</label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inmovax.com" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-content-main mb-2">Contraseña</label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
            
            <div className="text-right mt-2">
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Contacte a soporte de sistemas para restablecer sus credenciales."); }} className="text-xs font-bold text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Continuar con 2FA →'}
            </Button>
          </div>
        </form>
      )}

      {paso === 2 && (
        <form onSubmit={manejarVerificacion2FA} className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center mb-2">
            <p className="text-xs text-blue-900 font-medium">
              🔒 Ingrese el código generado por su aplicación autenticadora o presione verificar.
            </p>
          </div>

          <Input2FA />
          
          <div className="pt-4">
            <Button type="submit" variant="accent" fullWidth disabled={isLoading}>
              {isLoading ? 'Accediendo al Panel...' : 'Verificar y Entrar al Panel Admin'}
            </Button>
          </div>
          <button 
            type="button" 
            onClick={() => setPaso(1)} 
            className="w-full text-center mt-6 text-sm text-content-muted hover:text-primary font-bold transition-colors cursor-pointer"
          >
            ← Volver al paso anterior
          </button>
        </form>
      )}
    </div>
  );
};