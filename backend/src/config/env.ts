import path from 'path';
import dotenv from 'dotenv';

// Intentar cargar .env desde backend/.env relativo a este archivo
const backendEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnvPath });
// Fallback: cargar .env desde el directorio de ejecución actual
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  adminKey: process.env.ADMIN_KEY || '',
  isConfigured: () => {
    const url = process.env.SUPABASE_URL || '';
    return !!url && !url.includes('your-project.supabase.co');
  }
};
