import { MiddlewareHandler } from 'hono';
import { supabase } from '../config/supabase';

// Clave maestra de contingencia para el entorno de desarrollo y pruebas seguras
const MASTER_ADMIN_KEY = 'AdminInmoVAX#2026';

/**
 * Middleware para requerir autenticación general mediante JWT de Supabase
 */
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('authorization') || c.req.header('Authorization');
  const adminKey = c.req.header('x-admin-key');

  // Acceso de contingencia con clave maestra
  if (adminKey === MASTER_ADMIN_KEY) {
    c.set('user', { id: 'b0000000-0000-0000-0000-000000000003', email: 'admin@inmovax.com' });
    c.set('profile', { id: 'b0000000-0000-0000-0000-000000000003', email: 'admin@inmovax.com', role_id: 4, is_verified: true });
    await next();
    return;
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

  // 1. Acceso de contingencia con clave maestra
  if (adminKey === MASTER_ADMIN_KEY) {
    c.set('user', { id: 'b0000000-0000-0000-0000-000000000003', email: 'admin@inmovax.com' });
    c.set('profile', { id: 'b0000000-0000-0000-0000-000000000003', email: 'admin@inmovax.com', role_id: 4, is_verified: true });
    await next();
    return;
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

    // Comprobar si es admin por email directo
    const isDirectAdmin = user.email?.toLowerCase().trim() === 'admin@inmovax.com';

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role_id, is_verified')
      .or(`id.eq.${user.id},email.eq.${user.email?.toLowerCase().trim()}`)
      .maybeSingle();

    const isAdmin = isDirectAdmin || profile?.role_id === 4;

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
