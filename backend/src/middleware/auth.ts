import { MiddlewareHandler } from 'hono';
import { supabase } from '../config/supabase';
import { config } from '../config/env';

/**
 * Middleware para requerir autenticación general mediante JWT de Supabase
 */
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('authorization') || c.req.header('Authorization');
  const adminKey = c.req.header('x-admin-key');

  // Acceso de administración mediante clave de entorno segura (sin credenciales hardcodeadas)
  if (config.adminKey && adminKey === config.adminKey) {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role_id, is_verified')
      .eq('role_id', 4)
      .limit(1)
      .maybeSingle();

    if (adminProfile) {
      c.set('user', { id: adminProfile.id, email: adminProfile.email });
      c.set('profile', adminProfile);
      await next();
      return;
    }
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: 'Autenticación requerida: No se proporcionó el token de acceso (Authorization: Bearer <token>).'
    }, 401);
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  try {
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) {
      return c.json({
        success: false,
        error: 'Sesión inválida o expirada. Por favor inicia sesión nuevamente.'
      }, 401);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role_id, is_verified')
      .or(`id.eq.${user.id},email.eq.${user.email?.toLowerCase().trim()}`)
      .maybeSingle();

    if (profile && profile.is_verified === false) {
      return c.json({
        success: false,
        error: 'Tu cuenta se encuentra suspendida por el departamento legal de InmoVAX.'
      }, 403);
    }

    c.set('user', user);
    c.set('profile', profile || { id: user.id, email: user.email, role_id: 2, is_verified: true });

    await next();
  } catch (err: any) {
    return c.json({
      success: false,
      error: `Error de verificación de credenciales: ${err.message}`
    }, 401);
  }
};

/**
 * Middleware para requerir privilegios estrictos de Super Administrador (role_id === 4)
 */
export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('authorization') || c.req.header('Authorization');
  const adminKey = c.req.header('x-admin-key');

  // 1. Acceso de administración mediante clave de entorno segura (sin credenciales hardcodeadas)
  if (config.adminKey && adminKey === config.adminKey) {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role_id, is_verified')
      .eq('role_id', 4)
      .limit(1)
      .maybeSingle();

    if (adminProfile) {
      c.set('user', { id: adminProfile.id, email: adminProfile.email });
      c.set('profile', adminProfile);
      await next();
      return;
    }
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: 'Acceso restringido: Se requieren privilegios de Administrador para realizar esta acción.'
    }, 403);
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  try {
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) {
      return c.json({
        success: false,
        error: 'Sesión no autorizada: Token inválido o expirado.'
      }, 403);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role_id, is_verified')
      .or(`id.eq.${user.id},email.eq.${user.email?.toLowerCase().trim()}`)
      .maybeSingle();

    const isAdmin = profile?.role_id === 4;

    if (!isAdmin) {
      return c.json({
        success: false,
        error: 'Acceso denegado: Tu cuenta no posee permisos de Administrador (role_id 4).'
      }, 403);
    }

    c.set('user', user);
    c.set('profile', profile);

    await next();
  } catch (err: any) {
    return c.json({
      success: false,
      error: 'Acceso denegado por fallo de autorización.'
    }, 403);
  }
};
