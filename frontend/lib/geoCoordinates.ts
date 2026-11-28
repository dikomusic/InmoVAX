/**
 * Mapeo y Resolución de Coordenadas Geográficas Reales para La Paz, Bolivia
 * InmoVAX Core Engine - Geocodificación precisa y dispersión determinista para mapas interactivos
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// Coordenadas céntricas reales de las principales zonas y barrios de La Paz (incluye alias y variaciones)
export const LA_PAZ_ZONE_COORDINATES: Record<string, LatLng> = {
  // Zona Sur - Irpavi
  'irvapi': { lat: -16.5280, lng: -68.0790 },
  'irpavi': { lat: -16.5280, lng: -68.0790 },
  'irpavi ii': { lat: -16.5230, lng: -68.0710 },
  'irpavi 2': { lat: -16.5230, lng: -68.0710 },

  // Zona Sur - Calacoto & San Miguel
  'calacoto': { lat: -16.5398, lng: -68.0864 },
  'san miguel': { lat: -16.5422, lng: -68.0815 },
  'los pinos': { lat: -16.5410, lng: -68.0750 },
  'la florida': { lat: -16.5370, lng: -68.0920 },
  'aranjuez': { lat: -16.5560, lng: -68.0920 },

  // Zona Sur - Achumani, Cota Cota & Chasquipampa
  'achumani': { lat: -16.5365, lng: -68.0674 },
  'cota cota': { lat: -16.5385, lng: -68.0560 },
  'cotacota': { lat: -16.5385, lng: -68.0560 },
  'chasquipampa': { lat: -16.5450, lng: -68.0450 },
  'koani': { lat: -16.5320, lng: -68.0610 },
  'auquisamaña': { lat: -16.5350, lng: -68.0720 },
  'auquisamana': { lat: -16.5350, lng: -68.0720 },
  'bolognia': { lat: -16.5290, lng: -68.0930 },
  'bella vista': { lat: -16.5310, lng: -68.0980 },

  // Zona Sur - Obrajes & Següencoma
  'obrajes': { lat: -16.5245, lng: -68.1128 },
  'alto obrajes': { lat: -16.5180, lng: -68.1170 },
  'seguencoma': { lat: -16.5300, lng: -68.1060 },
  'següencoma': { lat: -16.5300, lng: -68.1060 },
  'bajo seguencoma': { lat: -16.5330, lng: -68.1020 },

  // Zona Central & Sopocachi
  'sopocachi': { lat: -16.5135, lng: -68.1298 },
  'plaza abaroa': { lat: -16.5130, lng: -68.1280 },
  'plaza españa': { lat: -16.5150, lng: -68.1320 },
  'san pedro': { lat: -16.5020, lng: -68.1360 },
  'centro': { lat: -16.4990, lng: -68.1340 },
  'el prado': { lat: -16.5025, lng: -68.1320 },
  'miraflores': { lat: -16.5015, lng: -68.1215 },
  'villa fatima': { lat: -16.4850, lng: -68.1150 },
  'villa fátima': { lat: -16.4850, lng: -68.1150 },

  // Zona Mallasa & Mallasilla
  'mallasa': { lat: -16.5650, lng: -68.0770 },
  'mallasilla': { lat: -16.5690, lng: -68.0820 },
  'rio abajo': { lat: -16.5800, lng: -68.0700 },

  // El Alto
  'el alto': { lat: -16.5050, lng: -68.1630 },
  'ciudad satelite': { lat: -16.5180, lng: -68.1520 },
  'parada 8': { lat: -16.5050, lng: -68.1630 },

  // Fallback metropolitano La Paz
  'la paz': { lat: -16.5250, lng: -68.0950 }
};

// Coordenadas conocidas que corresponden a valores por defecto/placeholder no configurados por el usuario
const isDummyPlaceholderCoordinate = (lat: number, lng: number): boolean => {
  return (
    (Math.abs(lat - (-16.5)) < 0.005 && Math.abs(lng - (-68.15)) < 0.005) ||
    (Math.abs(lat - (-16.5)) < 0.005 && Math.abs(lng - (-68.1193)) < 0.005) ||
    (Math.abs(lat) < 0.001 && Math.abs(lng) < 0.001)
  );
};

// Generador determinista de offset a partir del string de ID
function getDeterministicOffset(id: string): { dLat: number; dLng: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const factorA = ((hash % 100) / 100 - 0.5) * 0.005; // ~200 metros
  const factorB = ((((hash >> 3) % 100) / 100) - 0.5) * 0.005;
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
  const text = `${property.zone || ''} ${property.ubicacion || ''} ${property.direccion || ''} ${property.title || ''}`.toLowerCase();

  // 1. Detectar si el texto menciona una zona conocida de La Paz
  let matchedZoneCoords: LatLng | null = null;
  for (const [zoneKey, coords] of Object.entries(LA_PAZ_ZONE_COORDINATES)) {
    if (text.includes(zoneKey)) {
      matchedZoneCoords = coords;
      break;
    }
  }

  // 2. Si tiene coordenadas numéricas válidas
  if (
    typeof property.latitude === 'number' &&
    typeof property.longitude === 'number' &&
    property.latitude >= -17.0 &&
    property.latitude <= -16.2 &&
    property.longitude >= -68.3 &&
    property.longitude <= -67.8
  ) {
    // Si NO es un placeholder genérico (-16.5, -68.15)
    if (!isDummyPlaceholderCoordinate(property.latitude, property.longitude)) {
      // Si se detectó una zona específica (ej: Irpavi / Calacoto), verificar si las coordenadas guardadas coinciden o están ridículamente lejos (ej. > 5 km)
      if (matchedZoneCoords) {
        const dLat = Math.abs(property.latitude - matchedZoneCoords.lat);
        const dLng = Math.abs(property.longitude - matchedZoneCoords.lng);
        // Si está a menos de ~4 km de la zona indicada, respetar las coordenadas precisas del usuario
        if (dLat < 0.04 && dLng < 0.04) {
          return {
            lat: property.latitude,
            lng: property.longitude
          };
        }
      } else {
        return {
          lat: property.latitude,
          lng: property.longitude
        };
      }
    }
  }

  // 3. Si las coordenadas eran el placeholder (-16.5, -68.15) o no las tenía, usar la zona detectada
  const baseCoords = matchedZoneCoords || LA_PAZ_ZONE_COORDINATES['la paz'];

  // 4. Aplicar leve dispersión determinista para que propiedades en la misma zona no se solapen
  const offset = getDeterministicOffset(property.id || property.title || 'prop-default');
  return {
    lat: Number((baseCoords.lat + offset.dLat).toFixed(6)),
    lng: Number((baseCoords.lng + offset.dLng).toFixed(6))
  };
}
