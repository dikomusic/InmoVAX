import { MiddlewareHandler } from 'hono';

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// Almacén en memoria por clave (IP o Email)
const loginAttempts = new Map<string, RateLimitEntry>();
const recoveryAttempts = new Map<string, RateLimitEntry>();

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos
const LOGIN_WINDOW = 15 * 60 * 1000; // Ventana de 15 minutos

const MAX_RECOVERY_ATTEMPTS = 3;
const RECOVERY_BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos

/**
 * Middleware de Rate Limiting para Login (Protección contra Fuerza Bruta)
 */
export const loginRateLimiter: MiddlewareHandler = async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';
  const now = Date.now();

  const entry = loginAttempts.get(ip);

  if (entry) {
    if (entry.blockedUntil && now < entry.blockedUntil) {
      const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000);
      return c.json({
        success: false,
        error: `Has superado el límite de intentos de inicio de sesión fallidos. Tu dirección IP está bloqueada por ${remainingMinutes} minuto(s).`
      }, 429);
    }

    // Reiniciar si pasó la ventana
    if (now - entry.firstAttempt > LOGIN_WINDOW) {
      loginAttempts.delete(ip);
    }
  }

  await next();

  // Si la petición resultó en 401 (credenciales incorrectas), registrar el fallo
  if (c.res.status === 401) {
    const current = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
    current.count += 1;

    if (current.count >= MAX_LOGIN_ATTEMPTS) {
      current.blockedUntil = now + LOGIN_BLOCK_DURATION;
    }

    loginAttempts.set(ip, current);
  } else if (c.res.status === 200) {
    // Si el login fue exitoso, limpiar el contador para esa IP
    loginAttempts.delete(ip);
  }
};

/**
 * Middleware de Rate Limiting para Recuperación de Contraseña (Protección SMTP)
 */
export const forgotPasswordRateLimiter: MiddlewareHandler = async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';
  const now = Date.now();

  const entry = recoveryAttempts.get(ip);

  if (entry) {
    if (entry.blockedUntil && now < entry.blockedUntil) {
      const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000);
      return c.json({
        success: false,
        error: `Has realizado demasiadas solicitudes de recuperación de contraseña. Inténtalo de nuevo en ${remainingMinutes} minuto(s).`
      }, 429);
    }

    if (now - entry.firstAttempt > RECOVERY_BLOCK_DURATION) {
      recoveryAttempts.delete(ip);
    }
  }

  const current = recoveryAttempts.get(ip) || { count: 0, firstAttempt: now };
  current.count += 1;

  if (current.count > MAX_RECOVERY_ATTEMPTS) {
    current.blockedUntil = now + RECOVERY_BLOCK_DURATION;
    recoveryAttempts.set(ip, current);
    return c.json({
      success: false,
      error: 'Has alcanzado el límite de solicitudes de recuperación de contraseña. Por favor, espera 15 minutos.'
    }, 429);
  }

  recoveryAttempts.set(ip, current);

  await next();
};
