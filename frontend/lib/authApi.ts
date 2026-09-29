/**
 * Cliente de API para Autenticación y Registro de Usuarios en InmoVAX
 * Conecta con el Backend Bun (http://localhost:4000/api/auth) y Supabase Auth / PostgreSQL
 */

const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:4000/api';

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'comprador' | 'vendedor';
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: 'comprador' | 'vendedor';
    role_id: number;
    is_verified: boolean;
    created_at: string;
  };
  error?: string;
  details?: any;
}

/**
 * REQ-01: Registrar usuario en el sistema
 * REQ-06: Asignar rol al usuario durante su registro
 */
export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `Error ${res.status}: No se pudo completar el registro.`,
        details: data.details
      };
    }

    return {
      success: true,
      message: data.message || 'Usuario registrado exitosamente',
      user: data.user
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Error de conexión con el servidor de autenticación.'
    };
  }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  session?: {
    id: string;
    name: string;
    email: string;
    hasPublishedProperties: boolean;
    role: 'admin' | 'vendedor' | 'comprador';
    phone?: string | null;
  };
  token?: string;
  error?: string;
}

/**
 * REQ-02: Autenticar usuario mediante correo y contraseña
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `Error ${res.status}: Credenciales inválidas.`
      };
    }

    return {
      success: true,
      message: data.message || 'Inicio de sesión exitoso.',
      session: data.session,
      token: data.token
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Error de conexión con el servidor de autenticación.'
    };
  }
}

/**
 * REQ-04: Solicitar código de recuperación de contraseña
 */
export async function requestPasswordRecovery(email: string): Promise<{ success: boolean; message?: string; error?: string; devCode?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || 'No se pudo procesar la solicitud de recuperación.' };
    }
    return { success: true, message: data.message, devCode: data.devCode };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error de conexión con el servidor.' };
  }
}

/**
 * REQ-04: Restablecer contraseña con código de verificación
 */
export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || 'No se pudo restablecer la contraseña.' };
    }
    return { success: true, message: data.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error de conexión con el servidor.' };
  }
}

