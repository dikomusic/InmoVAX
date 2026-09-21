import { Hono } from 'hono';
import { config } from '../config/env';
import { supabase } from '../config/supabase';
import { serverAuditLogs } from '../middleware/audit';

export const healthRouter = new Hono();

healthRouter.get('/', async (c) => {
  const startTime = performance.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = -1;
  let dbError: string | null = null;
  let storageStatus = 'unknown';

  try {
    const { error: queryError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    dbLatencyMs = Math.round(performance.now() - startTime);

    if (queryError) {
      dbStatus = 'error';
      dbError = queryError.message;
    } else {
      dbStatus = 'connected';
    }

    const { error: bucketError } = await supabase.storage.getBucket('property-images');
    storageStatus = bucketError ? 'error' : 'connected';
  } catch (err: any) {
    dbStatus = 'exception';
    dbError = err?.message || 'Error de conexión';
  }

  return c.json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    service: 'InmoVAX API Server',
    runtime: 'Bun',
    bunVersion: Bun.version,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase (PostgreSQL)',
      status: dbStatus,
      latencyMs: dbLatencyMs,
      error: dbError
    },
    storage: {
      provider: 'Supabase Storage',
      bucket: 'property-images',
      status: storageStatus
    },
    auditedRequestsCount: serverAuditLogs.length
  });
});

healthRouter.get('/audit-logs', (c) => {
  return c.json({
    total: serverAuditLogs.length,
    recent: serverAuditLogs.slice(0, 50)
  });
});
