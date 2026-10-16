/**
 * Servicio de Autenticación y Gestión de Usuarios (Capa de Lógica de Negocio)
 * InmoVAX Backend - Patrón Servicio
 */

import { UserRepository } from '../repositories/user.repository';
import { IRegisterUserDTO, ILoginUserDTO, IUserProfile, IUserSession } from '../interfaces/user.interface';
import { supabase } from '../config/supabase';

export class AuthService {
  /**
   * REQ-02: Autenticar usuario con validación criptográfica en Supabase Auth y resolución de rol en DB
   */
  static async login(dto: ILoginUserDTO): Promise<{ session: IUserSession; token?: string }> {
    const cleanEmail = dto.email.trim().toLowerCase();

    // 1. Validar credenciales criptográficas mediante Supabase Auth
    const { data: authData, error: authError } = await UserRepository.signInWithPassword(cleanEmail, dto.password);

    if (authError || !authData.user) {
      throw new Error('Credenciales inválidas: correo electrónico o contraseña incorrectos.');
    }

    const userId = authData.user.id;

    // 2. Obtener perfil de la base de datos PostgreSQL
    let profile = await UserRepository.findByIdOrEmail(userId, cleanEmail);

    // Si el usuario existe en auth pero no en profiles, asegurar su perfil
    if (!profile) {
      const { data: newProf } = await UserRepository.upsertProfile({
        id: userId,
        email: cleanEmail,
        full_name: authData.user.user_metadata?.full_name || 'Usuario InmoVAX',
        role_id: 2, // Rol por defecto: comprador
        is_verified: true
      });
      profile = newProf as IUserProfile;
    }

    // 3. Verificar si la cuenta está suspendida
    if (profile && profile.is_verified === false) {
      const suspendedError: any = new Error('Tu cuenta se encuentra suspendida. Comunícate con soporte legal de InmoVAX.');
      suspendedError.statusCode = 403;
      throw suspendedError;
    }

    // 4. Resolver el rol del usuario estrictamente desde la base de datos (2 = comprador, 3 = vendedor, 4 = admin)
    const roleId = profile?.role_id ?? 2;
    let roleName: 'admin' | 'vendedor' | 'comprador' = 'comprador';
    if (roleId === 4) {
      roleName = 'admin';
    } else if (roleId === 3) {
      roleName = 'vendedor';
    }

    // 5. Verificar si tiene inmuebles publicados
    const propsCount = await UserRepository.countProperties(userId, profile?.id);
    const hasPublished = propsCount > 0 || roleName === 'vendedor';

    const session: IUserSession = {
      id: profile?.id || userId,
      name: profile?.full_name || 'Usuario InmoVAX',
      email: cleanEmail,
      hasPublishedProperties: Boolean(hasPublished),
      role: roleName,
      phone: profile?.phone || null
    };

    return {
      session,
      token: authData.session?.access_token
    };
  }

  /**
   * REQ-01 / REQ-06: Registrar nuevo usuario y asignar rol
   */
  static async register(dto: IRegisterUserDTO) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanName = dto.full_name.trim();

    // Resolver rol (2 = comprador, 3 = vendedor)
    const roleName = dto.role || (dto.role_id === 3 ? 'vendedor' : 'comprador');
    const roleId = roleName === 'vendedor' ? 3 : 2;

    // 1. Verificar si el usuario ya existe en profiles
    const existing = await UserRepository.findByEmail(cleanEmail);
    if (existing) {
      const conflictError: any = new Error('El correo electrónico ya se encuentra registrado en InmoVAX.');
      conflictError.statusCode = 409;
      throw conflictError;
    }

    // 2. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await UserRepository.createAuthUser(dto, roleName);

    if (authError) {
      if (authError.message?.toLowerCase().includes('already registered') || (authError as any).status === 422) {
        const conflictError: any = new Error('El correo electrónico ya se encuentra registrado en InmoVAX.');
        conflictError.statusCode = 409;
        throw conflictError;
      }
      throw new Error(`Error al crear credenciales: ${authError.message}`);
    }

    const userId = authData.user.id;

    // 3. Crear el perfil en public.profiles
    const { data: newProfile, error: profileError } = await UserRepository.upsertProfile({
      id: userId,
      email: cleanEmail,
      full_name: cleanName,
      phone: dto.phone || null,
      role_id: roleId,
      is_verified: true
    });

    if (profileError || !newProfile) {
      throw new Error(`Error al crear perfil en base de datos: ${profileError?.message}`);
    }

    return {
      id: newProfile.id,
      email: newProfile.email,
      full_name: newProfile.full_name,
      phone: newProfile.phone,
      role: roleName,
      role_id: newProfile.role_id,
      is_verified: newProfile.is_verified,
      created_at: newProfile.created_at
    };
  }

  /**
   * Listar todos los usuarios para el panel de administración
   */
  static async getUsersList() {
    const { data: profiles, error } = await UserRepository.findAll();
    if (error) throw new Error(error.message);

    // Contar cuántos inmuebles tiene cada usuario
    const { data: props } = await supabase.from('properties').select('created_by, id');
    const propsCountByUser: Record<string, number> = {};
    if (props) {
      for (const p of props) {
        if (p.created_by) {
          propsCountByUser[p.created_by] = (propsCountByUser[p.created_by] || 0) + 1;
        }
      }
    }

    const users = (profiles || []).map((p: any) => ({
      id: p.id,
      email: p.email,
      fullName: p.full_name || 'Usuario InmoVAX',
      phone: p.phone || 'Sin registrar',
      role: p.role_id === 4 ? 'Administrador' : (p.role_id === 3 ? 'Vendedor' : 'Cliente'),
      status: p.is_verified ? 'Activo' : 'Suspendido',
      propertiesCount: propsCountByUser[p.id] || 0,
      createdAt: p.created_at
    }));

    return users;
  }

  /**
   * Alternar estado activo / suspendido de un usuario
   */
  static async updateUserStatus(userId: string, status: string) {
    const isVerified = status === 'Activo';
    const { error } = await UserRepository.updateStatus(userId, isVerified);
    if (error) throw new Error(error.message);
    return isVerified;
  }

  /**
   * Obtener perfil por ID o Email
   */
  static async getProfile(identifier: string) {
    const cleanIdent = decodeURIComponent(identifier).trim().toLowerCase();
    const isEmail = cleanIdent.includes('@');

    const profile = isEmail
      ? await UserRepository.findByEmail(cleanIdent)
      : await UserRepository.findById(cleanIdent);

    if (!profile) {
      return {
        email: cleanIdent,
        fullName: 'Usuario InmoVAX',
        phone: '',
        companyName: '',
        whatsappSales: '',
        bio: '',
        notifyEmailOffers: true,
        notifyWhatsappAlerts: true
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      phone: profile.phone || '',
      companyName: profile.company_name || '',
      whatsappSales: profile.whatsapp_sales || profile.phone || '',
      bio: profile.bio || '',
      notifyEmailOffers: profile.notify_email_offers !== false,
      notifyWhatsappAlerts: profile.notify_whatsapp_alerts !== false,
      roleId: profile.role_id,
      isVerified: profile.is_verified
    };
  }

  /**
   * Actualizar perfil con protección IDOR / BOLA
   */
  static async updateProfile(identifier: string, updates: Record<string, any>, authUser: any, authProfile: any) {
    const cleanIdent = decodeURIComponent(identifier).trim().toLowerCase();

    // Verificación estricta de propiedad o rol de Super Administrador (role_id === 4)
    const isOwner = authUser?.email?.toLowerCase().trim() === cleanIdent ||
                    authUser?.id === cleanIdent ||
                    authProfile?.id === cleanIdent ||
                    authProfile?.email?.toLowerCase().trim() === cleanIdent;
    const isAdmin = authProfile?.role_id === 4;

    if (!isOwner && !isAdmin) {
      const forbiddenError: any = new Error('No tienes autorización para modificar el perfil de otro usuario (Protección IDOR activa).');
      forbiddenError.statusCode = 403;
      throw forbiddenError;
    }

    const isEmail = cleanIdent.includes('@');
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (updates.fullName !== undefined) updatePayload.full_name = updates.fullName.trim();
    if (updates.phone !== undefined) updatePayload.phone = updates.phone?.trim() || null;
    if (updates.companyName !== undefined) updatePayload.company_name = updates.companyName?.trim() || null;
    if (updates.whatsappSales !== undefined) updatePayload.whatsapp_sales = updates.whatsappSales?.trim() || null;
    if (updates.bio !== undefined) updatePayload.bio = updates.bio?.trim() || null;
    if (updates.notifyEmailOffers !== undefined) updatePayload.notify_email_offers = updates.notifyEmailOffers;
    if (updates.notifyWhatsappAlerts !== undefined) updatePayload.notify_whatsapp_alerts = updates.notifyWhatsappAlerts;

    const query = supabase.from('profiles').update(updatePayload);
    const { error } = await (isEmail ? query.eq('email', cleanIdent) : query.eq('id', cleanIdent));

    if (error) throw new Error(error.message);
  }

  /**
   * Cambiar contraseña de un usuario
   */
  static async changePassword(email: string, newPassword: string) {
    const profile = await UserRepository.findByEmail(email);
    if (!profile?.id) {
      throw new Error('Usuario no encontrado.');
    }

    const { error } = await UserRepository.updatePassword(profile.id, newPassword);
    if (error) throw new Error(error.message);
  }

  /**
   * REQ-04: Generar código de recuperación de contraseña (15 minutos de vigencia)
   */
  static async requestForgotPassword(email: string): Promise<string> {
    const cleanEmail = email.trim().toLowerCase();
    const profile = await UserRepository.findByEmail(cleanEmail);

    if (!profile) {
      const notFoundError: any = new Error('No se encontró ninguna cuenta registrada con este correo en InmoVAX.');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    UserRepository.savePasswordRecovery(cleanEmail, { email: cleanEmail, code, expiresAt });

    try {
      await supabase.auth.resetPasswordForEmail(cleanEmail);
    } catch {}

    return code;
  }

  /**
   * REQ-04: Confirmar restablecimiento de contraseña con código de verificación
   */
  static async resetPassword(email: string, code: string, newPassword: string) {
    const cleanEmail = email.trim().toLowerCase();
    const record = UserRepository.getPasswordRecovery(cleanEmail);

    if (!record || record.code !== code.trim()) {
      throw new Error('El código de verificación es inválido o incorrecto.');
    }

    if (Date.now() > record.expiresAt) {
      UserRepository.deletePasswordRecovery(cleanEmail);
      throw new Error('El código de verificación ha expirado (validez: 15 minutos).');
    }

    const profile = await UserRepository.findByEmail(cleanEmail);
    if (!profile) {
      const notFoundError: any = new Error('Usuario no encontrado.');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    let authUpdated = false;
    try {
      const { error: directErr } = await UserRepository.updatePassword(profile.id, newPassword);
      if (!directErr) authUpdated = true;
    } catch {}

    if (!authUpdated) {
      const { data: usersList } = await supabase.auth.admin.listUsers();
      const matched = usersList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
      if (matched) {
        const { error: matchErr } = await UserRepository.updatePassword(matched.id, newPassword);
        if (matchErr) throw new Error(matchErr.message);
      } else {
        await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: newPassword,
          email_confirm: true,
          user_metadata: { full_name: profile.full_name || 'Usuario InmoVAX' }
        });
      }
    }

    UserRepository.deletePasswordRecovery(cleanEmail);
  }
}
