"use client";

import React, { useState, useEffect } from 'react';
import { LogIn, Heart, UserPlus, Phone, Mail, Lock, User, Building2, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { FormField } from './FormField';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { FrontendSession, saveStoredSession, hasUserPublishedProperties } from '@/lib/frontendStore';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { registerUser, loginUser } from '@/lib/authApi';
import { DEMO_USERS } from '@/lib/propertiesStore';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: FrontendSession) => void;
  reason?: 'favorites' | 'history' | 'consultations' | 'general';
  initialMode?: 'login' | 'register';
  customTitle?: string;
  customSubtitle?: string;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const LoginDialog = ({
  isOpen,
  onClose,
  onLogin,
  reason = 'general',
  initialMode = 'login',
  customTitle,
  customSubtitle
}: LoginDialogProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields (REQ-01 & REQ-06)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'comprador' | 'vendedor'>('comprador');

  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const title = customTitle || (
    mode === 'login'
      ? (reason === 'favorites' ? 'Guarda en tus favoritos' : 'Iniciar sesión en InmoVAX')
      : 'Crear una cuenta nueva'
  );

  const subtitle = customSubtitle || (
    mode === 'login'
      ? (reason === 'favorites'
          ? 'Como visitante requieres una cuenta activa para guardar inmuebles en tus favoritos.'
          : 'Accede a tus favoritos, historial de visitas y consultas con asesores.')
      : 'Regístrate en segundos para contactar propietarios, publicar y guardar inmuebles.'
  );

  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleAuthDirect = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setAuthError(error.message.includes('not enabled')
          ? 'Google OAuth no está activado aún en tu panel de Supabase. Habilítalo en Authentication -> Providers -> Google.'
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
      setAuthError(err?.message || 'Error al conectar con Google');
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!password) {
      setAuthError('Por favor ingresa tu contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser({
        email: cleanEmail,
        password: password
      });

      if (!result.success || !result.session) {
        setAuthError(result.error || 'Credenciales incorrectas: correo o contraseña inválidos.');
        setIsLoading(false);
        return;
      }

      const session: FrontendSession = {
        name: result.session.name,
        email: result.session.email,
        hasPublishedProperties: result.session.hasPublishedProperties,
        role: result.session.role,
        phone: result.session.phone || undefined
      };

      if (hasUserPublishedProperties(session)) {
        session.hasPublishedProperties = true;
        session.role = 'vendedor';
      }

      saveStoredSession(session);
      setIsLoading(false);
      onLogin(session);
      onClose();
    } catch (err: any) {
      setAuthError(err?.message || 'Error de conexión con el servidor de autenticación.');
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);

    if (regPassword !== regConfirmPassword) {
      setAuthError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanName = regName.trim() || 'Usuario InmoVAX';

    try {
      const result = await registerUser({
        full_name: cleanName,
        email: cleanEmail,
        phone: regPhone,
        password: regPassword,
        role: regRole,
      });

      if (!result.success) {
        setAuthError(result.error || 'Error al registrar usuario');
        setIsLoading(false);
        return;
      }

      const session: FrontendSession = {
        name: cleanName,
        email: cleanEmail,
        hasPublishedProperties: regRole === 'vendedor',
        role: regRole,
      };

      saveStoredSession(session);
      setIsLoading(false);
      onLogin(session);
      onClose();
    } catch (err: any) {
      setAuthError(err?.message || 'Error inesperado durante el registro');
      setIsLoading(false);
    }
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle} maxWidth="md">
      <div className="space-y-4">
        {reason === 'favorites' && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-semibold">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500 shrink-0" />
            <span>Los visitantes no pueden dar me gusta. Inicia sesión para activar tus favoritos.</span>
          </div>
        )}

        {/* Pestañas Flotantes: Iniciar Sesión / Crear Cuenta */}
        <div className="flex rounded-xl bg-surface-light p-1 border border-gray-200/70">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-surface-dark shadow-xs border border-gray-200/60'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-surface-dark shadow-xs border border-gray-200/60'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{authError}</span>
          </div>
        )}

        {/* Botón Rápido Oficial de Google */}
        <button
          type="button"
          onClick={handleGoogleAuthDirect}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-surface-dark border border-gray-300 rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm active:scale-98 transition-all cursor-pointer"
        >
          <GoogleIcon />
          <span>{isLoading ? 'Conectando con Google...' : (mode === 'login' ? 'Continuar con Google' : 'Registrarme con Google')}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <span className="relative bg-white px-3 text-[11px] uppercase font-extrabold text-content-muted">
            O con tu correo
          </span>
        </div>

        {/* FORMULARIO DE INICIO DE SESIÓN */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <FormField label="Correo electrónico">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
              />
            </FormField>
            <FormField label="Contraseña">
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
              />
            </FormField>

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              <LogIn aria-hidden="true" className="h-4 w-4" />
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        ) : (
          /* FORMULARIO DE REGISTRO (REQ-01 y REQ-06) */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            {/* Selección de Rol - REQ-06 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-dark">
                ¿Cuál es tu objetivo principal?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('comprador')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    regRole === 'comprador'
                      ? 'border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary'
                      : 'border-gray-200 hover:border-gray-300 text-content-main bg-white'
                  }`}
                >
                  <Search className="h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-bold leading-none">Busco Inmueble</p>
                    <p className="text-[10px] text-content-muted mt-0.5">Comprar o Alquilar</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('vendedor')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    regRole === 'vendedor'
                      ? 'border-accent bg-accent/5 text-accent shadow-xs ring-1 ring-accent'
                      : 'border-gray-200 hover:border-gray-300 text-content-main bg-white'
                  }`}
                >
                  <Building2 className="h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-bold leading-none">Soy Propietario</p>
                    <p className="text-[10px] text-content-muted mt-0.5">Publicar propiedades</p>
                  </div>
                </button>
              </div>
            </div>

            <FormField label="Nombre y Apellidos">
              <Input
                type="text"
                value={regName}
                onChange={(event) => setRegName(event.target.value)}
                placeholder="Ej. Carlos Mendoza"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Correo electrónico">
                <Input
                  type="email"
                  value={regEmail}
                  onChange={(event) => setRegEmail(event.target.value)}
                  placeholder="tu@correo.com"
                  required
                />
              </FormField>

              <FormField label="WhatsApp / Celular">
                <Input
                  type="tel"
                  value={regPhone}
                  onChange={(event) => setRegPhone(event.target.value)}
                  placeholder="+591 70012345"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Contraseña">
                <Input
                  type="password"
                  value={regPassword}
                  onChange={(event) => setRegPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </FormField>

              <FormField label="Confirmar Contraseña">
                <Input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(event) => setRegConfirmPassword(event.target.value)}
                  placeholder="Repite la contraseña"
                  required
                />
              </FormField>
            </div>

            <Button type="submit" variant="accent" fullWidth disabled={isLoading}>
              <UserPlus aria-hidden="true" className="h-4 w-4" />
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-content-muted pt-1">
          {mode === 'login' ? (
            <>
              ¿No tienes una cuenta aún?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setAuthError(null); }}
                className="font-extrabold text-primary hover:underline cursor-pointer"
              >
                Crear cuenta
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setAuthError(null); }}
                className="font-extrabold text-primary hover:underline cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>

    <ForgotPasswordModal
      isOpen={isForgotModalOpen}
      onClose={() => setIsForgotModalOpen(false)}
      initialEmail={email}
      onSuccessReset={(resEmail) => {
        setEmail(resEmail);
        setIsForgotModalOpen(false);
      }}
    />
    </>
  );
};

