/**
 * Mapeo y Resolución de Coordenadas Geográficas Reales para La Paz, Bolivia
 * InmoVAX Core Engine - Geocodificación precisa y dispersión determinista para mapas interactivos
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// Coordenadas céntricas reales de las principales zonas y barrios de La Paz
export const LA_PAZ_ZONE_COORDINATES: Record<string, LatLng> = {
  'sopocachi': { lat: -16.5135, lng: -68.1298 },
  'calacoto': { lat: -16.5398, lng: -68.0864 },
  'san miguel': { lat: -16.5422, lng: -68.0815 },
  'achumani': { lat: -16.5365, lng: -68.0674 },
  'obrajes': { lat: -16.5245, lng: -68.1128 },
  'alto obrajes': { lat: -16.5180, lng: -68.1170 },
  'miraflores': { lat: -16.5015, lng: -68.1215 },
  'cota cota': { lat: -16.5385, lng: -68.0560 },
  'irpavi': { lat: -16.5280, lng: -68.0790 },
  'irpavi ii': { lat: -16.5230, lng: -68.0710 },
  'los pinos': { lat: -16.5410, lng: -68.0750 },
  'chasquipampa': { lat: -16.5450, lng: -68.0450 },
  'san pedro': { lat: -16.5020, lng: -68.1360 },
  'centro': { lat: -16.4990, lng: -68.1340 },
  'mallasa': { lat: -16.5650, lng: -68.0770 },
  'mallasilla': { lat: -16.5690, lng: -68.0820 },
  'bolognia': { lat: -16.5290, lng: -68.0930 },
  'auquisamaña': { lat: -16.5350, lng: -68.0720 },
  'bella vista': { lat: -16.5310, lng: -68.0980 },
  'la florida': { lat: -16.5370, lng: -68.0920 },
  'aranjuez': { lat: -16.5560, lng: -68.0920 },
  'koani': { lat: -16.5320, lng: -68.0610 },
  'seguencoma': { lat: -16.5300, lng: -68.1060 },
  'bajo seguencoma': { lat: -16.5330, lng: -68.1020 },
  'villa fatima': { lat: -16.4850, lng: -68.1150 },
  'el alto': { lat: -16.5050, lng: -68.1630 },
  'ciudad satelite': { lat: -16.5180, lng: -68.1520 },
  'la paz': { lat: -16.5250, lng: -68.0950 }
};

// Generador determinista de offset a partir del string de ID
function getDeterministicOffset(id: string): { dLat: number; dLng: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const factorA = ((hash % 100) / 100 - 0.5) * 0.007; // ~300 metros
  const factorB = ((((hash >> 3) % 100) / 100) - 0.5) * 0.007;
  return { dLat: factorA, dLng: factorB };
}

/**
 * Resuelve coordenadas precisas para cualquier propiedad en La Paz
 */
export function resolvePropertyCoordinates(property: {
  id?: string;
  title?: string;
  ubicacion?: string;
  direccion?: string;
  zone?: string;
  latitude?: number | null;
  longitude?: number | null;
}): LatLng {
  // 1. Si ya tiene coordenadas válidas dentro del cuadrante metropolitano de La Paz
  if (
    typeof property.latitude === 'number' &&
    typeof property.longitude === 'number' &&
    property.latitude >= -17.0 &&
    property.latitude <= -16.2 &&
    property.longitude >= -68.3 &&
    property.longitude <= -67.8
  ) {
    return {
      lat: property.latitude,
      lng: property.longitude
    };
  }

  // 2. Búsqueda por texto en los campos de ubicación y dirección
  const text = `${property.zone || ''} ${property.ubicacion || ''} ${property.direccion || ''} ${property.title || ''}`.toLowerCase();
  
  let baseCoords: LatLng | null = null;
  for (const [zoneKey, coords] of Object.entries(LA_PAZ_ZONE_COORDINATES)) {
    if (text.includes(zoneKey)) {
      baseCoords = coords;
      break;
    }
  }

  // 3. Fallback general a La Paz si no coincide ninguna zona específica
  if (!baseCoords) {
    baseCoords = LA_PAZ_ZONE_COORDINATES['la paz'];
  }

  // 4. Aplicar leve dispersión determinista para que propiedades en la misma zona no se solapen
  const offset = getDeterministicOffset(property.id || property.title || 'prop-default');
  return {
    lat: Number((baseCoords.lat + offset.dLat).toFixed(6)),
    lng: Number((baseCoords.lng + offset.dLng).toFixed(6))
  };
}
