import path from 'path';
import dotenv from 'dotenv';

// Intentar cargar .env desde backend/.env relativo a este archivo
const backendEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnvPath });
// Fallback: cargar .env desde el directorio de ejecución actual
dotenv.config();

const DEFAULT_SUPABASE_URL = 'https://ftebnxosnjyofiakhfap.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZWJueG9zbmp5b2ZpYWtoZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTMzMjMsImV4cCI6MjEwNTQ4OTMyM30.RjPOqQMzInQ0Zv_EmJqQ9Mjlz0ES2bqweKd7-HSoj_E';
const DEFAULT_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZWJueG9zbmp5b2ZpYWtoZmFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkxMzMyMywiZXhwIjoyMTA1NDg5MzIzfQ.MGIsXPuxSBqA_ZP0KlWqTlEu3jNU_Fiwiu20WvzEY5A';

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY || DEFAULT_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE,
  },
  isConfigured: () => {
    const url = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
    return !!url && !url.includes('your-project.supabase.co');
  }
};
