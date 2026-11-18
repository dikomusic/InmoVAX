/**
 * Configuración centralizada de URL de la API del Backend InmoVAX
 */
export const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:4000/api';

export const BACKEND_URL = API_BASE.replace(/\/api\/?$/, '');

