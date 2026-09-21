import { MiddlewareHandler } from 'hono';

export interface AuditRecord {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ip: string;
  userAgent?: string;
  userEmail?: string;
}

// Registro en memoria de auditorías del servidor (además del registro en base de datos)
export const serverAuditLogs: AuditRecord[] = [];

export const auditMiddleware: MiddlewareHandler = async (c, next) => {
  const start = performance.now();
  const method = c.req.method;
  const path = c.req.path;
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';
  const userAgent = c.req.header('user-agent');
  const userEmail = c.req.header('x-user-email');

  await next();

  const durationMs = Math.round(performance.now() - start);
  const status = c.res.status;

  const record: AuditRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    method,
    path,
    status,
    durationMs,
    ip,
    userAgent,
    userEmail
  };

  serverAuditLogs.unshift(record);
  // Mantener últimos 500 registros en memoria
  if (serverAuditLogs.length > 500) {
    serverAuditLogs.pop();
  }

  // Log formateado en consola del servidor
  const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
  console.log(`${color}[AUDIT] ${method} ${path} -> ${status} (${durationMs}ms) | IP: ${ip}\x1b[0m`);
};
