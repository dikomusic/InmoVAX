/**
 * Interfaces y Contratos de Datos para Usuarios y Autenticación en InmoVAX
 * Arquitectura en Capas - Capa de Interfaces
 */

export type UserRole = 'admin' | 'vendedor' | 'comprador';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  roleId: number;
  role: UserRole;
  isVerified: boolean;
  createdAt?: string;
}

export interface IUserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  company_name?: string | null;
  whatsapp_sales?: string | null;
  bio?: string | null;
  notify_email_offers?: boolean;
  notify_whatsapp_alerts?: boolean;
  role_id: number;
  is_verified: boolean;
  created_at?: string;
}

export interface IUserSession {
  id: string;
  name: string;
  email: string;
  hasPublishedProperties: boolean;
  role: UserRole;
  phone?: string | null;
}

export interface IRegisterUserDTO {
  full_name: string;
  email: string;
  password: string;
  phone?: string | null;
  role?: 'comprador' | 'vendedor';
  role_id?: number;
}

export interface ILoginUserDTO {
  email: string;
  password: string;
}

export interface IResetPasswordRequestDTO {
  email: string;
}

export interface IResetPasswordConfirmDTO {
  email: string;
  code: string;
  newPassword: string;
  token?: string;
}
