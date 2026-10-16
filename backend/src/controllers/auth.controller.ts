/**
 * Controlador de Autenticación y Perfiles de Usuario
 * InmoVAX Backend - Patrón Controlador (Capa de Presentación / HTTP)
 */

import { Context } from 'hono';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { loginSchema, registerSchema, passwordResetRequestSchema, passwordResetConfirmSchema } from '../models/user.model';

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  whatsappSales: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  notifyEmailOffers: z.boolean().optional(),
  notifyWhatsappAlerts: z.boolean().optional()
});

export class AuthController {
  /**
   * POST /api/auth/login
   */
  static async login(c: Context) {
    try {
      const body = await c.req.json();
      const validated = loginSchema.parse(body);
      const result = await AuthService.login(validated);

      return c.json({
        success: true,
        message: 'Inicio de sesión exitoso.',
        session: result.session,
        token: result.token
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({
          success: false,
          error: err.errors[0]?.message || 'Datos de inicio de sesión inválidos.'
        }, 400);
      }
      const status = err.statusCode || 401;
      return c.json({
        success: false,
        error: err.message || 'Error al iniciar sesión.'
      }, status);
    }
  }

  /**
   * POST /api/auth/register
   */
  static async register(c: Context) {
    try {
      const body = await c.req.json();
      const validated = registerSchema.parse(body);
      const user = await AuthService.register(validated);

      return c.json({
        success: true,
        message: 'Usuario registrado exitosamente en InmoVAX.',
        user
      }, 201);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({
          success: false,
          error: 'Datos de registro inválidos.',
          details: err.errors
        }, 400);
      }
      const status = err.statusCode || 400;
      return c.json({
        success: false,
        error: err.message || 'Error al registrar usuario.'
      }, status);
    }
  }

  /**
   * GET /api/auth/users
   */
  static async getUsers(c: Context) {
    try {
      const users = await AuthService.getUsersList();
      return c.json({ success: true, total: users.length, users });
    } catch (err: any) {
      return c.json({ success: false, error: err.message, users: [] }, 500);
    }
  }

  /**
   * PATCH /api/auth/users/:id/status
   */
  static async updateUserStatus(c: Context) {
    const userId = c.req.param('id') || '';
    try {
      const body = await c.req.json();
      await AuthService.updateUserStatus(userId, body.status);
      return c.json({ success: true, message: `Estado de usuario actualizado a ${body.status}` });
    } catch (err: any) {
      return c.json({ success: false, error: err.message }, 500);
    }
  }

  /**
   * GET /api/auth/profile/:identifier
   */
  static async getProfile(c: Context) {
    const identifier = c.req.param('identifier') || '';
    try {
      const profile = await AuthService.getProfile(identifier);
      return c.json({ success: true, profile });
    } catch (err: any) {
      return c.json({ success: false, error: err.message }, 500);
    }
  }

  /**
   * PATCH /api/auth/profile/:identifier
   */
  static async updateProfile(c: Context) {
    const identifier = c.req.param('identifier') || '';
    try {
      const authUser = c.get('user');
      const authProfile = c.get('profile');
      const body = await c.req.json();
      const validated = updateProfileSchema.parse(body);

      await AuthService.updateProfile(identifier, validated, authUser, authProfile);
      return c.json({
        success: true,
        message: 'Perfil comercial actualizado exitosamente.'
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Datos de perfil inválidos.', details: err.errors }, 400);
      }
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message }, status);
    }
  }

  /**
   * POST /api/auth/change-password
   */
  static async changePassword(c: Context) {
    try {
      const body = await c.req.json();
      const { email, newPassword } = body;

      if (!email || !newPassword || newPassword.length < 6) {
        return c.json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' }, 400);
      }

      await AuthService.changePassword(email, newPassword);
      return c.json({
        success: true,
        message: 'Contraseña actualizada de forma segura.'
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message }, 500);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(c: Context) {
    try {
      const body = await c.req.json();
      const validated = passwordResetRequestSchema.parse(body);
      const code = await AuthService.requestForgotPassword(validated.email);

      return c.json({
        success: true,
        message: `Hemos enviado el código de verificación para ${validated.email}.`,
        devCode: code
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Por favor ingresa un correo electrónico válido.' }, 400);
      }
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message || 'Error al procesar recuperación.' }, status);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  static async resetPassword(c: Context) {
    try {
      const body = await c.req.json();
      const validated = passwordResetConfirmSchema.parse(body);
      await AuthService.resetPassword(validated.email, validated.code, validated.newPassword);

      return c.json({
        success: true,
        message: '¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión.'
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: err.errors[0]?.message || 'Datos inválidos.' }, 400);
      }
      const status = err.statusCode || 400;
      return c.json({ success: false, error: err.message || 'Error al restablecer contraseña.' }, status);
    }
  }
}
