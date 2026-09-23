import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from './config/env';
import { auditMiddleware } from './middleware/audit';
import { healthRouter } from './routes/health';
import { propertiesRouter } from './routes/properties';
import { offersRouter } from './routes/offers';
import { appointmentsRouter } from './routes/appointments';
import { notificationsRouter } from './routes/notifications';
import { advisorsRouter } from './routes/advisors';
import { legalRouter } from './routes/legal';
import { consultationsRouter } from './routes/consultations';

export const app = new Hono();

// 1. CONFIGURACIÓN DE CORS RESTRINGIDO (Solo localhost:3000)
app.use('*', cors({
  origin: [config.corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-user-email'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
  credentials: true,
}));

// 2. HEADERS DE SEGURIDAD
app.use('*', async (c, next) => {
  await next();
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// 3. MIDDLEWARE DE AUDITORÍA Y TRAZABILIDAD
app.use('*', auditMiddleware);

// 4. RUTAS DEL SISTEMA
app.route('/health', healthRouter);
app.route('/api/properties', propertiesRouter);
app.route('/api/offers', offersRouter);
app.route('/api/appointments', appointmentsRouter);
app.route('/api/notifications', notificationsRouter);
app.route('/api/advisors', advisorsRouter);
app.route('/api/legal-audits', legalRouter);
app.route('/api/consultations', consultationsRouter);

// 5. RUTA RAÍZ INFORMATIVA
app.get('/', (c) => {
  return c.json({
    name: 'InmoVAX Backend API',
    runtime: 'Bun',
    version: '1.0.0',
    database: 'Supabase (PostgreSQL)',
    endpoints: {
      health: '/health',
      properties: '/api/properties',
      offers: '/api/offers',
      appointments: '/api/appointments',
      notifications: '/api/notifications',
      advisors: '/api/advisors',
      legalAudits: '/api/legal-audits',
      audit: '/health/audit-logs'
    }
  });
});

// 6. INICIO DEL SERVIDOR NATIVO BUN
console.log(`
======================================================
  INMOVAX BACKEND API (Bun + Hono)
======================================================
  Puerto:        http://localhost:${config.port}
  Healthcheck:   http://localhost:${config.port}/health
  CORS Permitido: ${config.corsOrigin}
  Runtime:       Bun v${Bun.version}
======================================================
`);

export default {
  port: config.port,
  fetch: app.fetch,
};
