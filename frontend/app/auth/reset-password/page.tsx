"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Lock, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/atoms/BrandLogo';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState<boolean | null>(null);

  useEffect(() => {
    // Escuchar el evento de recuperación que Supabase inyecta al hacer clic en el enlace del correo
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionActive(true);
      } else {
        // En caso de que el enlace traiga los tokens en el hash (#access_token=...)
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'PASSWORD_RECOVERY' || session) {
            setSessionActive(true);
          }
        });
      }
    };

    checkSession();
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);

    try {
      // Llamada oficial y verdadera a Supabase Auth para reescribir la contraseña del usuario autenticado por token
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setErrorMessage(error.message || 'Error al actualizar la contraseña.');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error de conexión con el servicio de autenticación.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-content-main relative overflow-hidden">
      {/* Fondo estético con destellos suaves */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta Central */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 relative z-10 space-y-6">
        {/* Cabecera / Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <BrandLogo />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-surface-dark tracking-tight">
            Restablecer Contraseña
          </h1>
          <p className="text-xs text-content-muted leading-relaxed">
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta de InmoVAX.
          </p>
        </div>

        {/* Banner de Error */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Éxito */}
        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-black text-surface-dark">¡Contraseña Cambiada con Éxito!</h2>
              <p className="text-xs text-content-muted leading-relaxed">
                Tu clave ha sido actualizada de forma segura en Supabase. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Ir al Inicio de Sesión</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Enlace verificado por Supabase Auth. Define una contraseña segura de al menos 6 caracteres.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading || password.length < 6 || password !== confirmPassword}
                className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardando nueva contraseña...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Guardar Nueva Contraseña</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-xs text-content-muted hover:text-surface-dark font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a InmoVAX</span>
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
