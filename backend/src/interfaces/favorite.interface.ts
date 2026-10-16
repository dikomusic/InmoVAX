/**
 * Interfaces y Contratos de Datos para Favoritos
 * InmoVAX Backend - Arquitectura en Capas
 */

export interface IFavoriteItem {
  id: string;
  code: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  contractType: string;
  href: string;
  addedAt: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
}

export interface IAddFavoriteDTO {
  userId: string;
  propertyId: string;
}

export interface IFavoriteResponse {
  total: number;
  favorites: IFavoriteItem[];
  propertyIds: string[];
}
