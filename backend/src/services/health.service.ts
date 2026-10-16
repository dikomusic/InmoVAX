import { supabase } from '../config/supabase';
import { serverAuditLogs } from '../middleware/audit';

export interface HealthCheckResult {
  status: 'ok' | 'degraded';
  service: string;
  runtime: string;
  bunVersion: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    provider: string;
    status: string;
    latencyMs: number;
    error: string | null;
  };
  storage: {
    provider: string;
    bucket: string;
    status: string;
  };
  auditedRequestsCount: number;
}

export class HealthService {
  static async checkHealth(): Promise<HealthCheckResult> {
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

    return {
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
        error: dbError,
      },
      storage: {
        provider: 'Supabase Storage',
        bucket: 'property-images',
        status: storageStatus,
      },
      auditedRequestsCount: serverAuditLogs.length,
    };
  }

  static getAuditLogs() {
    return {
      total: serverAuditLogs.length,
      recent: serverAuditLogs.slice(0, 50),
    };
  }
}
