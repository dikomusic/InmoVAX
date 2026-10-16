/**
 * Esquemas de Validación y Modelos de Entrada para Usuarios y Autenticación
 * InmoVAX Backend - Capa de Modelos (Zod)
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'El nombre completo debe tener al menos 2 caracteres').max(150),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
  phone: z.string().optional().nullable(),
  role: z.enum(['comprador', 'vendedor']).optional().default('comprador'),
  role_id: z.number().int().optional()
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('El correo electrónico no es válido')
});

export const passwordResetConfirmSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  code: z.string().min(1, 'El código de verificación es requerido'),
  newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
  token: z.string().optional()
});

export type LoginModel = z.infer<typeof loginSchema>;
export type RegisterModel = z.infer<typeof registerSchema>;
export type PasswordResetRequestModel = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmModel = z.infer<typeof passwordResetConfirmSchema>;
