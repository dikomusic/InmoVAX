/**
 * Middleware para Control de Acceso Basado en Roles (RBAC - Role-Based Access Control)
 * InmoVAX Backend - Capa de Seguridad y Autorización
 */

import { MiddlewareHandler } from 'hono';
import { UserRole } from '../interfaces/user.interface';

// Mapeo oficial de roles en PostgreSQL (Tabla roles/profiles)
export const ROLE_IDS: Record<UserRole, number> = {
  comprador: 2,
  vendedor: 3,
  admin: 4
};

export const ID_TO_ROLE: Record<number, UserRole> = {
  2: 'comprador',
  3: 'vendedor',
  4: 'admin'
};

/**
 * Middleware de orden superior para exigir uno o más roles específicos.
 * Se encadena después de requireAuth.
 * 
 * Ejemplo de uso en rutas:
 * authRouter.get('/admin-only', requireAuth, requireRole(['admin']), handler);
 * propertiesRouter.post('/', requireAuth, requireRole(['admin', 'vendedor']), handler);
 */
export function requireRole(allowedRoles: UserRole[]): MiddlewareHandler {
  return async (c, next) => {
    const profile = c.get('profile');

    if (!profile) {
      return c.json({
        success: false,
        error: 'Autenticación previa requerida: No se encontró el perfil del usuario para validar permisos.'
      }, 401);
    }

    const userRoleId = profile.role_id;
    const userRoleName: UserRole = ID_TO_ROLE[userRoleId] || 'comprador';

    if (!allowedRoles.includes(userRoleName)) {
      return c.json({
        success: false,
        error: `Acceso denegado: Esta acción requiere privilegios de [${allowedRoles.join(' o ')}]. Tu rol registrado es: "${userRoleName}" (role_id: ${userRoleId}).`
      }, 403);
    }

    await next();
  };
}
