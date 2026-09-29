"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { FormField } from './FormField';
import { 
  User, Mail, Phone, Lock, ShieldCheck, 
  CheckCircle2, AlertCircle, RefreshCw, KeyRound 
} from 'lucide-react';
import { FrontendSession, readStoredSession, saveStoredSession } from '@/lib/frontendStore';
import { fetchSellerProfile, updateSellerProfile, changeSellerPassword } from '@/lib/settingsApi';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (session: FrontendSession) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const [session, setSession] = useState<FrontendSession | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  // Datos personales
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('comprador');

  // Cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de carga y mensajes
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const curSession = readStoredSession();
      setSession(curSession);
      setStatusMessage(null);
      setActiveTab('info');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (curSession?.email) {
        setEmail(curSession.email);
        setFullName(curSession.name || '');
        setPhone(curSession.phone || '');
        setRole(curSession.role || 'comprador');

        // Cargar datos frescos desde el backend
        fetchSellerProfile(curSession.email).then(profile => {
          if (profile) {
            setFullName(profile.fullName || curSession.name);
            setPhone(profile.phone || '');
          }
        });
      }
    }
  }, [isOpen]);

  if (!isOpen || !session) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setStatusMessage({ type: 'error', text: 'El nombre completo debe tener al menos 2 caracteres.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await updateSellerProfile(email, {
        fullName: fullName.trim(),
        phone: phone.trim() || undefined
      });

      if (res.success) {
        const updatedSession: FrontendSession = {
          ...session,
          name: fullName.trim(),
          phone: phone.trim() || null
        };
        saveStoredSession(updatedSession);
        setSession(updatedSession);
        onProfileUpdated?.(updatedSession);

        setStatusMessage({ type: 'success', text: 'Tu información de perfil ha sido actualizada exitosamente.' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'No se pudo actualizar el perfil.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await changeSellerPassword(email, newPassword);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Tu contraseña de acceso ha sido cambiada exitosamente.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'No se pudo cambiar la contraseña.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error al cambiar contraseña.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mi Perfil de Usuario"
      subtitle="Gestiona tu información personal de cuenta y credenciales de acceso (REQ-05)."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Pestañas estilizadas */}
        <div className="flex rounded-xl bg-surface-light p-1 border border-gray-200/70">
          <button
            type="button"
            onClick={() => { setActiveTab('info'); setStatusMessage(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-white text-surface-dark shadow-xs border border-gray-200/60'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Datos Personales</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('password'); setStatusMessage(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-white text-surface-dark shadow-xs border border-gray-200/60'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Seguridad y Clave</span>
          </button>
        </div>

        {/* Notificación de estado */}
        {statusMessage && (
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Pestaña 1: Información Personal */}
        {activeTab === 'info' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <FormField label="Nombre Completo">
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </FormField>

            <FormField label="Correo Electrónico (Principal)">
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Verificado
                </span>
              </div>
            </FormField>

            <FormField label="Teléfono / WhatsApp de Contacto">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+591 7XXXXXXX"
              />
            </FormField>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/70 text-xs">
              <div className="flex items-center gap-2 text-content-muted font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Rol de Cuenta:</span>
              </div>
              <span className="font-extrabold capitalize text-surface-dark px-2 py-0.5 rounded bg-white border border-gray-200">
                {role}
              </span>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Guardando cambios...</span>
                  </span>
                ) : (
                  'Guardar Datos de Perfil'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Pestaña 2: Seguridad y Cambio de Contraseña */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
              Tu contraseña debe tener al menos 6 caracteres para proteger tu cuenta en InmoVAX.
            </div>

            <FormField label="Nueva Contraseña">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </FormField>

            <FormField label="Confirmar Nueva Contraseña">
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu nueva contraseña"
                required
              />
            </FormField>

            <div className="pt-2">
              <Button type="submit" variant="accent" fullWidth disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Actualizando contraseña...</span>
                  </span>
                ) : (
                  'Actualizar Contraseña de Acceso'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
