/**
 * Esquemas de Validación y Modelos de Entrada para Inmuebles
 * InmoVAX Backend - Capa de Modelos (Zod)
 */

import { z } from 'zod';

export const propertyInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  description: z.string().optional(),
  category: z.string().optional().default('Departamento'),
  isNegotiable: z.boolean().optional().default(false),
  zone: z.string().min(2, 'La zona es requerida').max(100),
  address: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  type: z.preprocess((val) => {
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase();
      if (s === 'anticretico' || s === 'anticrético') return 'Anticrético';
      if (s === 'venta') return 'Venta';
      if (s === 'alquiler') return 'Alquiler';
    }
    return val;
  }, z.enum(['Anticrético', 'Venta', 'Alquiler'])),
  price: z.string().min(1, 'El precio es requerido'),
  folioReal: z.string().min(3, 'El Folio Real es requerido'),
  image: z.string().optional().or(z.literal('')),
  gallery: z.array(z.string()).optional(),
  authorEmail: z.string().email('Correo de autor inválido'),
  authorName: z.string().min(2),
  assignedAdvisor: z.string().optional().default('Propietario InmoVAX'),
  bedrooms: z.number().int().nonnegative().optional().default(3),
  bathrooms: z.number().int().nonnegative().optional().default(2),
  areaSqm: z.number().positive().optional().default(120),
  landAreaSqm: z.number().optional().nullable(),
  parkingSpots: z.number().int().nonnegative().optional().default(0),
  amenities: z.array(z.string()).optional().default([]),
  status: z.enum(['Activo', 'En Validación Legal', 'Pausado', 'Cerrado']).optional()
});

export const propertyUpdateSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  isNegotiable: z.boolean().optional(),
  zone: z.string().min(2, 'La zona es requerida').max(100).optional(),
  address: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  type: z.preprocess((val) => {
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase();
      if (s === 'anticretico' || s === 'anticrético') return 'Anticrético';
      if (s === 'venta') return 'Venta';
      if (s === 'alquiler') return 'Alquiler';
    }
    return val;
  }, z.enum(['Anticrético', 'Venta', 'Alquiler'])).optional(),
  price: z.string().min(1).optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  areaSqm: z.number().positive().optional(),
  landAreaSqm: z.number().optional().nullable(),
  parkingSpots: z.number().int().nonnegative().optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['Activo', 'En Validación Legal', 'Pausado', 'Cerrado']).optional(),
  image: z.string().optional().or(z.literal('')),
  gallery: z.array(z.string()).optional(),
});

export type PropertyInputModel = z.infer<typeof propertyInputSchema>;
export type PropertyUpdateModel = z.infer<typeof propertyUpdateSchema>;
