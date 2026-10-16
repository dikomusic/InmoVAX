/**
 * Rutas de Autenticación y Perfiles de Usuario
 * InmoVAX Backend - Enrutador Delgado (Delegación a Controladores)
 */

import { Hono } from 'hono';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { loginRateLimiter, forgotPasswordRateLimiter } from '../middleware/rateLimit';

export const authRouter = new Hono();

// Autenticación y Registro
authRouter.post('/login', loginRateLimiter, AuthController.login);
authRouter.post('/register', AuthController.register);

// Panel Administrativo de Usuarios
authRouter.get('/users', requireAdmin, AuthController.getUsers);
authRouter.patch('/users/:id/status', requireAdmin, AuthController.updateUserStatus);

// Gestión de Perfiles
authRouter.get('/profile/:identifier', AuthController.getProfile);
authRouter.patch('/profile/:identifier', requireAuth, AuthController.updateProfile);

// Recuperación y Cambio de Contraseña
authRouter.post('/change-password', AuthController.changePassword);
authRouter.post('/forgot-password', forgotPasswordRateLimiter, AuthController.forgotPassword);
authRouter.post('/reset-password', AuthController.resetPassword);
