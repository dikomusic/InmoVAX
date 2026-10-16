/**
 * Entrypoint Principal - InmoVAX Backend API
 * Arquitectura Limpia por Capas | Runtime: Bun + Hono
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from './config/env';
import { auditMiddleware } from './middleware/audit';
import { registerRoutes } from './routes';

export const app = new Hono();

// 1. Configuración de CORS Restringido
app.use('*', cors({
  origin: [config.corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'x-admin-key', 'X-Admin-Key'],
  credentials: true,
}));

// 2. Cabeceras de Seguridad HTTP
app.use('*', async (c, next) => {
  await next();
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// 3. Auditoría y Trazabilidad
app.use('*', auditMiddleware);

// 4. Montaje Modular de Rutas
registerRoutes(app);

// 5. Manejo Centralizado de Errores y Rutas No Encontradas
app.notFound((c) => {
  return c.json({ success: false, error: 'Endpoint no encontrado' }, 404);
});

app.onError((err, c) => {
  console.error('[GLOBAL ERROR]:', err);
  return c.json({
    success: false,
    error: err.message || 'Error interno del servidor',
  }, 500);
});

// 6. Estado y Versión
app.get('/', (c) => c.json({ name: 'InmoVAX API', version: '1.0.0', runtime: 'Bun' }));

console.log(`\n=== INMOVAX API ===\nPuerto: http://localhost:${config.port}\nRuntime: Bun v${Bun.version}\n`);

export default {
  port: config.port,
  fetch: app.fetch,
};
