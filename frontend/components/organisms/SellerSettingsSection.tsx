"use client";
import React, { useState, useEffect } from 'react';
import { SettingsCard } from '../molecules/SettingsCard';
import { ToggleSwitch } from '../atoms/ToggleSwitch';
import {
  User,
  Building,
  Phone,
  Mail,
  FileText,
  Bell,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Save,
  KeyRound,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  fetchSellerProfile,
  updateSellerProfile,
  changeSellerPassword,
  SellerProfileData
} from '@/lib/settingsApi';

interface SellerSettingsSectionProps {
  userEmail: string;
  userName?: string;
  onProfileUpdated?: (name: string) => void;
}

export const SellerSettingsSection = ({
  userEmail,
  userName = 'Usuario InmoVAX',
  onProfileUpdated
}: SellerSettingsSectionProps) => {
  const [profile, setProfile] = useState<SellerProfileData>({
    email: userEmail,
    fullName: userName,
    phone: '',
    companyName: '',
    whatsappSales: '',
    bio: '',
    notifyEmailOffers: true,
    notifyWhatsappAlerts: true
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);

  // Estados para cambio de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ error?: string; success?: string } | null>(null);

  useEffect(() => {
    if (userEmail) {
      loadProfile();
    }
  }, [userEmail]);

  const loadProfile = async () => {
    setLoading(true);
    const data = await fetchSellerProfile(userEmail);
    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    const res = await updateSellerProfile(userEmail, profile);
    setSavingProfile(false);

    if (res.success) {
      setProfileFeedback('Perfil comercial actualizado exitosamente.');
      if (onProfileUpdated && profile.fullName) {
        onProfileUpdated(profile.fullName);
      }
      setTimeout(() => setProfileFeedback(null), 4000);
    } else {
      setProfileFeedback(res.message || 'Error al guardar los cambios.');
      setTimeout(() => setProfileFeedback(null), 4000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      setPasswordFeedback({ error: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ error: 'Las contraseñas ingresadas no coinciden.' });
      return;
    }

    setSavingPassword(true);
    const res = await changeSellerPassword(userEmail, newPassword);
    setSavingPassword(false);

    if (res.success) {
      setPasswordFeedback({ success: 'Contraseña actualizada de forma segura.' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordFeedback(null), 4000);
    } else {
      setPasswordFeedback({ error: res.message || 'Error al actualizar contraseña.' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* CABECERA PRINCIPAL */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-xl text-surface-dark tracking-tight">Configuración de Mi Cuenta</h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Vendedor Verificado
            </span>
          </div>
          <p className="text-xs text-content-muted mt-1">
            Administra tu perfil comercial visible ante compradores, canales de contacto y seguridad de acceso.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {profileFeedback && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{profileFeedback}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => handleSaveProfile()}
            disabled={savingProfile}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {savingProfile ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{savingProfile ? 'Guardando...' : 'Guardar Perfil'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECCIÓN 1: PERFIL COMERCIAL Y CONTACTO */}
        <SettingsCard
          icon={User}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          title="Perfil Comercial y Datos de Contacto"
          description="Información de contacto directa que se muestra a los compradores interesados"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                Nombre Completo o Titular
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Ej. Arq. Gonzalo Benítez"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                Empresa o Nombre Comercial (Opcional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  placeholder="Ej. Benítez & Asociados Inmobiliaria"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                  WhatsApp de Contacto Directo
                </label>
                <input
                  type="text"
                  value={profile.whatsappSales}
                  onChange={(e) => setProfile({ ...profile, whatsappSales: e.target.value })}
                  placeholder="+591 71234567"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                  Correo Electrónico (Solo Lectura)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                Presentación o Reseña Profesional
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Breve descripción de tu trayectoria o garantías que ofreces a los interesados..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none resize-none"
              />
            </div>
          </div>
        </SettingsCard>

        {/* SECCIÓN 2: PREFERENCIAS DE NOTIFICACIÓN */}
        <div className="space-y-6">
          <SettingsCard
            icon={Bell}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
            title="Preferencias de Notificaciones"
            description="Controla cómo y cuándo deseas recibir alertas sobre tus inmuebles"
          >
            <div className="space-y-4">
              <ToggleSwitch
                checked={profile.notifyWhatsappAlerts}
                onChange={(checked) => setProfile({ ...profile, notifyWhatsappAlerts: checked })}
                label="Alertas por WhatsApp ante Nuevas Consultas"
                description="Recibe un mensaje en tu WhatsApp cada vez que un comprador consulte por uno de tus inmuebles."
              />

              <ToggleSwitch
                checked={profile.notifyEmailOffers}
                onChange={(checked) => setProfile({ ...profile, notifyEmailOffers: checked })}
                label="Notificaciones por Correo ante Ofertas"
                description="Recibe confirmaciones por email cuando se presenten ofertas o contraofertas formales."
              />
            </div>
          </SettingsCard>

          {/* SECCIÓN 3: CAMBIO DE CONTRASEÑA */}
          <SettingsCard
            icon={KeyRound}
            iconColor="text-rose-600"
            iconBg="bg-rose-50"
            title="Seguridad y Cambio de Contraseña"
            description="Protege el acceso a tu cuenta de propietario en InmoVAX"
          >
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordFeedback?.error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in">
                  {passwordFeedback.error}
                </div>
              )}
              {passwordFeedback?.success && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 animate-in fade-in">
                  {passwordFeedback.success}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingPassword || !newPassword}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-40 cursor-pointer"
                >
                  {savingPassword ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  <span>{savingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}</span>
                </button>
              </div>
            </form>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
};
