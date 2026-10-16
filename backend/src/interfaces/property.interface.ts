/**
 * Interfaces y Contratos de Datos para Inmuebles en InmoVAX
 * Arquitectura en Capas - Capa de Interfaces
 */

export type PropertyType = 'Anticrético' | 'Venta' | 'Alquiler';
export type PropertyStatus = 'Activo' | 'En Validación Legal' | 'Pausado' | 'Cerrado';

export interface IProperty {
  id: string;
  title: string;
  zone: string;
  address?: string;
  description?: string;
  type: PropertyType;
  price: string;
  views: number;
  inquiries: number;
  status: PropertyStatus;
  folioReal: string;
  assignedAdvisor: string;
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  image: string;
  gallery?: string[];
  category?: string;
  isNegotiable?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  habitaciones?: number;
  banos?: number;
  metros?: number;
  landAreaSqm?: number | null;
  parkingSpots?: number;
  estacionamientos?: number;
  amenities?: string[];
  amenidades?: string[];
  href?: string;
  datePublished?: string;
  authorEmail?: string;
  authorName?: string;
}

export interface ICreatePropertyDTO {
  id?: string;
  title: string;
  zone: string;
  type: PropertyType;
  price: string;
  folioReal: string;
  authorEmail: string;
  authorName: string;
  description?: string;
  category?: string;
  isNegotiable?: boolean;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string;
  gallery?: string[];
  assignedAdvisor?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  landAreaSqm?: number | null;
  parkingSpots?: number;
  amenities?: string[];
  status?: PropertyStatus;
}

export interface IUpdatePropertyDTO {
  title?: string;
  description?: string;
  category?: string;
  isNegotiable?: boolean;
  zone?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  type?: PropertyType;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  landAreaSqm?: number | null;
  parkingSpots?: number;
  amenities?: string[];
  status?: PropertyStatus;
  image?: string;
  gallery?: string[];
}

export interface IPropertyFilter {
  type?: string;
  zone?: string;
  status?: string;
  q?: string;
}
