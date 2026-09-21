import { createClient } from '@supabase/supabase-js';
import { config } from './env';

// Cliente Supabase seguro para el backend (usa Service Role Key si existe para auditorías y operaciones protegidas)
const key = config.supabase.serviceRoleKey !== 'your-service-role-key'
  ? config.supabase.serviceRoleKey
  : config.supabase.anonKey;

export const supabase = createClient(config.supabase.url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
