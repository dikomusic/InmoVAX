"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { FormField } from './FormField';
import {
  KeyRound,
  Mail,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { requestPasswordRecovery, resetPasswordWithCode } from '@/lib/authApi';
import { createClient } from '@/lib/supabase/client';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccessReset?: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccessReset
}) => {
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setStep('request');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setDevCode(null);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  // Paso 1: Enviar solicitud con correo electrónico
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    try {
      const redirectUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/reset-password`;
      await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl
      });
    } catch {}

    const res = await requestPasswordRecovery(cleanEmail);
    setIsLoading(false);

    if (res.success) {
      if (res.devCode) {
        setDevCode(res.devCode);
        setCode(res.devCode);
      }
      setStep('reset');
    } else {
      setErrorMessage(res.error || 'No se pudo enviar el correo de recuperación.');
    }
  };

  // Paso 2: Validar código y cambiar contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!code || code.trim().length !== 6) {
      setErrorMessage('El código debe ser de 6 dígitos numéricos.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);
    const res = await resetPasswordWithCode(email.trim().toLowerCase(), code.trim(), newPassword);
    setIsLoading(false);

    if (res.success) {
      setStep('success');
      if (onSuccessReset) {
        onSuccessReset(email.trim().toLowerCase());
      }
    } else {
      setErrorMessage(res.error || 'No se pudo restablecer la contraseña.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'success' ? 'Contraseña Restablecida' : 'Recuperar Contraseña'}
      subtitle={
        step === 'request'
          ? 'Ingresa tu correo para recibir un código de seguridad'
          : step === 'reset'
          ? 'Introduce el código de 6 dígitos y define tu nueva clave'
          : 'Acceso actualizado con éxito'
      }
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {/* Banner de Error */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PASO 1: SOLICITAR CÓDIGO */}
        {step === 'request' && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Te enviaremos un código de seguridad de 6 dígitos a tu dirección de correo registrada en InmoVAX para verificar tu identidad.
              </span>
            </div>

            <FormField label="Correo electrónico de tu cuenta">
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@inmovax.com"
                  required
                  autoFocus
                />
              </div>
            </FormField>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 text-content-muted hover:text-surface-dark hover:bg-gray-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
                    <span>Verificando cuenta...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-1.5" />
                    <span>Enviar Código de Recuperación</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* PASO 2: INTRODUCIR CÓDIGO Y NUEVA CONTRASEÑA */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Código enviado a {email}</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Revisa tu bandeja de entrada o spam. El código es válido por 15 minutos.
              </p>
              {devCode && (
                <div className="mt-1 pt-1 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-800">Código de prueba generado:</span>
                  <span className="font-mono font-black text-xs px-2 py-0.5 bg-emerald-200 text-emerald-950 rounded-md">
                    {devCode}
                  </span>
                </div>
              )}
            </div>

            <FormField label="Código de verificación (6 dígitos)">
              <Input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="font-mono text-center tracking-widest text-base font-bold"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Nueva contraseña">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </FormField>

              <FormField label="Confirmar contraseña">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la clave"
                  required
                />
              </FormField>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 text-content-muted hover:text-surface-dark hover:bg-gray-50 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading || code.length !== 6 || newPassword.length < 6}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-1.5" />
                    <span>Restablecer Contraseña</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 'success' && (
          <div className="text-center py-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-surface-dark">¡Contraseña Actualizada!</h4>
              <p className="text-xs text-content-muted max-w-sm mx-auto">
                Tu clave ha sido reescrita de forma segura en la base de datos. Ya puedes iniciar sesión con tus nuevas credenciales.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={() => {
                  onClose();
                }}
              >
                <Lock className="w-4 h-4 mr-1.5" />
                <span>Continuar a Iniciar Sesión</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
