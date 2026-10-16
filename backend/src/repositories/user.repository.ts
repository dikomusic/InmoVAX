/**
 * Repositorio de Usuarios y Perfiles (Capa de Acceso a Datos - DAL)
 * InmoVAX Backend - Patrón Repositorio
 */

import { supabase } from '../config/supabase';
import { IUserProfile, IRegisterUserDTO } from '../interfaces/user.interface';

export interface PasswordRecoveryRecord {
  email: string;
  code: string;
  expiresAt: number;
}

// Almacén seguro para tokens de recuperación
const passwordRecoveryMap = new Map<string, PasswordRecoveryRecord>();

export class UserRepository {
  /**
   * Buscar perfil por ID de Supabase
   */
  static async findById(id: string): Promise<IUserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return data as IUserProfile;
  }

  /**
   * Buscar perfil por correo electrónico (insensible a mayúsculas)
   */
  static async findByEmail(email: string): Promise<IUserProfile | null> {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (error || !data) return null;
    return data as IUserProfile;
  }

  /**
   * Buscar perfil por ID o Email
   */
  static async findByIdOrEmail(id: string, email: string): Promise<IUserProfile | null> {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .or(`id.eq.${id},email.ilike.${cleanEmail}`)
      .maybeSingle();

    if (error || !data) return null;
    return data as IUserProfile;
  }

  /**
   * Iniciar sesión mediante Supabase Auth
   */
  static async signInWithPassword(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
  }

  /**
   * Crear usuario en Supabase Auth
   */
  static async createAuthUser(dto: IRegisterUserDTO, roleName: string) {
    return await supabase.auth.admin.createUser({
      email: dto.email.trim().toLowerCase(),
      password: dto.password,
      email_confirm: true,
      user_metadata: {
        full_name: dto.full_name.trim(),
        phone: dto.phone || null,
        role: roleName
      }
    });
  }

  /**
   * Crear o actualizar perfil en la tabla profiles
   */
  static async upsertProfile(profile: Partial<IUserProfile> & { id: string; email: string }) {
    return await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        email: profile.email.trim().toLowerCase(),
        full_name: profile.full_name || 'Usuario InmoVAX',
        phone: profile.phone || null,
        role_id: profile.role_id ?? 2,
        is_verified: profile.is_verified ?? true,
        updated_at: new Date().toISOString()
      })
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .single();
  }

  /**
   * Obtener todos los perfiles de usuarios (solo para panel administrativo)
   */
  static async findAll() {
    return await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .order('created_at', { ascending: false });
  }

  /**
   * Modificar el estado de activación/suspensión de un usuario
   */
  static async updateStatus(id: string, isVerified: boolean) {
    return await supabase
      .from('profiles')
      .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, full_name, role_id, is_verified')
      .single();
  }

  /**
   * Actualizar contraseña de un usuario mediante Supabase Auth
   */
  static async updatePassword(userId: string, newPassword: string) {
    return await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });
  }

  /**
   * Contar cuántas propiedades tiene asignadas un usuario
   */
  static async countProperties(userId: string, profileId?: string): Promise<number> {
    const filter = profileId
      ? `user_id.eq.${userId},user_id.eq.${profileId}`
      : `user_id.eq.${userId}`;

    const { count } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .or(filter);

    return count || 0;
  }

  // Métodos de recuperación de contraseña
  static savePasswordRecovery(email: string, record: PasswordRecoveryRecord): void {
    passwordRecoveryMap.set(email.toLowerCase().trim(), record);
  }

  static getPasswordRecovery(email: string): PasswordRecoveryRecord | undefined {
    return passwordRecoveryMap.get(email.toLowerCase().trim());
  }

  static deletePasswordRecovery(email: string): void {
    passwordRecoveryMap.delete(email.toLowerCase().trim());
  }
}
