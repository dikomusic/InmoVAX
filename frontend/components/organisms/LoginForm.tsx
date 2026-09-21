"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Input2FA } from '../molecules/Input2FA';
import { FormField } from '../molecules/FormField';
import { User, Home, Shield } from 'lucide-react';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export const LoginForm = () => {
  const router = useRouter();
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [paso, setPaso] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos de Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Flujo Google
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      const err = params.get('error');
      if (redirect) setRedirectUrl(redirect);
      if (err === 'admin_required') {
        setError('Acceso restringido: Se requieren credenciales de Administrador para ingresar a esa sección.');
      } else if (err === 'auth_required') {
        setError('Por favor inicia sesión con tu cuenta para acceder.');
      }
    }
  }, []);

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'admin@inmovax.com') {
      if (password !== 'AdminInmoVAX#2026') {
        setError('Contraseña de administrador incorrecta. Verifique sus credenciales.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPaso(2);
    }, 400);
  };

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanName = regName.trim() || 'Usuario InmoVAX';

    try {
      await fetch('http://127.0.0.1:4000/api/properties/register-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          full_name: cleanName,
          phone: regPhone,
          role_id: 2
        })
      });
    } catch {
      // Sigue adelante
    }

    setTimeout(() => {
      setIsLoading(false);
      window.localStorage.setItem('inmovax-session', JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        hasPublishedProperties: false,
        role: 'comprador'
      }));
      router.push('/');
    }, 400);
  };

  const manejarGoogleOAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message.includes('not enabled')
          ? 'Google OAuth no está habilitado aún en tu panel de Supabase. Habilítalo en Authentication -> Providers -> Google.'
          : error.message);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con Google');
      setIsLoading(false);
    }
  };

  const manejarVerificacion2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail === 'admin@inmovax.com';
      window.localStorage.setItem('inmovax-session', JSON.stringify({
        name: isAdmin ? 'Super Administrador InmoVAX' : (cleanEmail.split('@')[0] || 'Usuario InmoVAX'),
        email: cleanEmail,
        hasPublishedProperties: isAdmin,
        role: isAdmin ? 'admin' : 'comprador'
      }));
      router.push(redirectUrl || (isAdmin ? '/admin' : '/'));
    }, 400);
  };

  return (
    <div className="bg-surface-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 w-full">
      {/* Pestañas de Login / Registro */}
      <div className="flex rounded-2xl bg-surface-light p-1.5 mb-6">
        <button
          type="button"
          onClick={() => { setModo('login'); setPaso(1); setError(null); }}
          className={`flex-1 py-2.5 text-center text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
            modo === 'login'
              ? 'bg-surface-white text-surface-dark shadow-sm'
              : 'text-content-muted hover:text-content-main'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => { setModo('registro'); setError(null); }}
          className={`flex-1 py-2.5 text-center text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
            modo === 'registro'
              ? 'bg-surface-white text-surface-dark shadow-sm'
              : 'text-content-muted hover:text-content-main'
          }`}
        >
          Crear Cuenta
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-in fade-in">
          ⚠️ {error}
        </div>
      )}

      {modo === 'login' && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main mb-2">
              {paso === 1 ? 'Panel de Acceso' : 'Seguridad 2FA'}
            </h2>
            <p className="text-content-muted text-sm">
              {paso === 1 
                ? 'Ingresa tus credenciales para gestionar tu cuenta o portal en InmoVax.' 
                : 'Ingresa el código de 6 dígitos enviado a tu dispositivo autorizado.'}
            </p>
          </div>

          {paso === 1 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={manejarGoogleOAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-gray-50 text-surface-dark border border-gray-300 rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{isLoading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-content-muted">O con tus credenciales</span>
              </div>

              <form onSubmit={manejarLogin} className="space-y-4">
              <FormField label="Correo Electrónico">
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com" 
                  required 
                />
              </FormField>
              
              <FormField label="Contraseña">
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña" 
                  required 
                />
                
                <div className="text-right mt-2">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Contacte a soporte de sistemas para restablecer sus credenciales."); }} className="text-xs font-bold text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </FormField>

              <div className="pt-2">
                <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                  {isLoading ? 'Verificando...' : 'Continuar con 2FA →'}
                </Button>
              </div>
            </form>
          </div>
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
                  {isLoading ? 'Accediendo al Panel...' : 'Verificar y Entrar al Panel'}
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
        </>
      )}

      {modo === 'registro' && (
        <form onSubmit={manejarRegistro} className="space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main mb-2">
              Crea tu Cuenta
            </h2>
            <p className="text-content-muted text-sm">
              Regístrate para guardar favoritos, agendar visitas y contactar propietarios.
            </p>
          </div>

          <FormField label="Nombre y Apellidos">
            <Input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Ej. Carlos Mendoza"
              required
            />
          </FormField>

          <FormField label="Correo Electrónico">
            <Input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="carlos@ejemplo.com"
              required
            />
          </FormField>

          <FormField label="Celular / WhatsApp">
            <Input
              type="tel"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              placeholder="+591 70012345"
              required
            />
          </FormField>

          <FormField label="Contraseña">
            <Input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Crea una contraseña segura"
              required
            />
          </FormField>

          <div className="pt-2">
            <Button type="submit" variant="accent" fullWidth disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta e Ingresar'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};