export interface ParsedAISearch {
  operation: 'anticretico' | 'alquilar' | 'comprar';
  operationLabel: string;
  propertyType: 'departamentos' | 'casas' | 'oficinas' | 'terrenos' | 'locales' | 'todos';
  propertyTypeLabel: string;
  location: string;
  locationLabel: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  detectedChips: string[];
  targetUrl: string;
}

const BOLIVIAN_LOCATIONS = [
  // La Paz Zonas
  { key: 'sopocachi', label: 'Sopocachi', city: 'lapaz' },
  { key: 'calacoto', label: 'Calacoto', city: 'lapaz' },
  { key: 'san miguel', label: 'San Miguel', city: 'lapaz' },
  { key: 'achumani', label: 'Achumani', city: 'lapaz' },
  { key: 'obrajes', label: 'Obrajes', city: 'lapaz' },
  { key: 'miraflores', label: 'Miraflores', city: 'lapaz' },
  { key: 'irpavi', label: 'Irpavi', city: 'lapaz' },
  { key: 'cota cota', label: 'Cota Cota', city: 'lapaz' },
  { key: 'la florida', label: 'La Florida', city: 'lapaz' },
  { key: 'seguencoma', label: 'Següencoma', city: 'lapaz' },
  { key: 'següencoma', label: 'Següencoma', city: 'lapaz' },
  { key: 'san pedro', label: 'San Pedro', city: 'lapaz' },
  { key: 'centro', label: 'Centro', city: 'lapaz' },
  { key: 'chasquipampa', label: 'Chasquipampa', city: 'lapaz' },
  { key: 'alto obrajes', label: 'Alto Obrajes', city: 'lapaz' },
  // El Alto Zonas
  { key: 'satelite', label: 'Ciudad Satélite', city: 'elalto' },
  { key: 'rio seco', label: 'Río Seco', city: 'elalto' },
  { key: 'senkata', label: 'Senkata', city: 'elalto' },
  { key: 'villa adela', label: 'Villa Adela', city: 'elalto' },
  { key: '16 de julio', label: '16 de Julio', city: 'elalto' },
  // Cochabamba Zonas
  { key: 'cala cala', label: 'Cala Cala', city: 'cochabamba' },
  { key: 'recoleta', label: 'La Recoleta', city: 'cochabamba' },
  { key: 'tiquipaya', label: 'Tiquipaya', city: 'cochabamba' },
  { key: 'sacaba', label: 'Sacaba', city: 'cochabamba' },
  { key: 'quillacollo', label: 'Quillacollo', city: 'cochabamba' },
  // Santa Cruz Zonas
  { key: 'equipetrol', label: 'Equipetrol', city: 'santacruz' },
  { key: 'urubo', label: 'Urubó', city: 'santacruz' },
  { key: 'urubó', label: 'Urubó', city: 'santacruz' },
  { key: 'las palmas', label: 'Las Palmas', city: 'santacruz' },
  { key: 'zona norte', label: 'Zona Norte', city: 'santacruz' },
  { key: 'zona sur', label: 'Zona Sur', city: 'santacruz' },
  // Ciudades generales
  { key: 'la paz', label: 'La Paz', city: 'lapaz' },
  { key: 'el alto', label: 'El Alto', city: 'elalto' },
  { key: 'cochabamba', label: 'Cochabamba', city: 'cochabamba' },
  { key: 'santa cruz', label: 'Santa Cruz', city: 'santacruz' },
];

export function parseAISearchQuery(input: string): ParsedAISearch {
  const cleanInput = (input || '').trim();
  const lower = cleanInput.toLowerCase();

  // 1. Detección de Operación
  let operation: 'anticretico' | 'alquilar' | 'comprar' = 'comprar';
  let operationLabel = 'Venta';

  if (
    lower.includes('anticretic') ||
    lower.includes('anticrétic') ||
    lower.includes('anticret')
  ) {
    operation = 'anticretico';
    operationLabel = 'Anticrético';
  } else if (
    lower.includes('alquiler') ||
    lower.includes('alquilar') ||
    lower.includes('alquilo') ||
    lower.includes('renta') ||
    lower.includes('arriendo')
  ) {
    operation = 'alquilar';
    operationLabel = 'Alquiler';
  } else if (
    lower.includes('compra') ||
    lower.includes('comprar') ||
    lower.includes('venta') ||
    lower.includes('adquirir')
  ) {
    operation = 'comprar';
    operationLabel = 'Compra / Venta';
  }

  // 2. Detección de Tipo de Inmueble
  let propertyType: 'departamentos' | 'casas' | 'oficinas' | 'terrenos' | 'locales' | 'todos' = 'todos';
  let propertyTypeLabel = 'Todos los tipos';

  if (
    lower.includes('departamento') ||
    lower.includes('depa') ||
    lower.includes('dpto') ||
    lower.includes('monoambiente') ||
    lower.includes('penthouse') ||
    lower.includes('duplex')
  ) {
    propertyType = 'departamentos';
    propertyTypeLabel = 'Departamento';
  } else if (
    lower.includes('casa') ||
    lower.includes('chalet') ||
    lower.includes('villa')
  ) {
    propertyType = 'casas';
    propertyTypeLabel = 'Casa';
  } else if (
    lower.includes('oficina') ||
    lower.includes('consultorio')
  ) {
    propertyType = 'oficinas';
    propertyTypeLabel = 'Oficina';
  } else if (
    lower.includes('terreno') ||
    lower.includes('lote')
  ) {
    propertyType = 'terrenos';
    propertyTypeLabel = 'Terreno';
  } else if (
    lower.includes('local') ||
    lower.includes('galpon') ||
    lower.includes('galpón') ||
    lower.includes('tienda')
  ) {
    propertyType = 'locales';
    propertyTypeLabel = 'Local Comercial';
  }

  // 3. Detección de Ubicación
  let location = '';
  let locationLabel = '';
  let matchedCity = '';

  for (const loc of BOLIVIAN_LOCATIONS) {
    if (lower.includes(loc.key)) {
      location = loc.key;
      locationLabel = loc.label;
      matchedCity = loc.city;
      break;
    }
  }

  // 4. Detección de Dormitorios
  let bedrooms: number | undefined = undefined;
  if (lower.includes('monoambiente')) {
    bedrooms = 1;
  } else {
    const bedMatch = lower.match(/(\d+)\s*(dormitorio|dorm|habitación|habitacion|cuarto|recámara|recamara)/i);
    if (bedMatch) {
      bedrooms = parseInt(bedMatch[1], 10);
    }
  }

  // 5. Detección de Precios
  let maxPrice: number | undefined = undefined;
  let minPrice: number | undefined = undefined;

  // Rango "entre X y Y"
  const rangeMatch = lower.match(/entre\s*(\d+[k\d\.,]*)\s*y\s*(\d+[k\d\.,]*)/i);
  if (rangeMatch) {
    minPrice = parseNumberValue(rangeMatch[1]);
    maxPrice = parseNumberValue(rangeMatch[2]);
  } else {
    // "menos de X", "hasta X", "maximo X", "< X"
    const maxMatch = lower.match(/(?:menos\s+de|hasta|máximo|maximo|menor\s+a|<)\s*(\$us|usd|\$|bs)?\s*(\d+[k\d\.,]*)/i);
    if (maxMatch) {
      maxPrice = parseNumberValue(maxMatch[2]);
    } else {
      // "mas de X", "desde X", "mayor a X", "> X"
      const minMatch = lower.match(/(?:más\s+de|mas\s+de|desde|mayor\s+a|>)\s*(\$us|usd|\$|bs)?\s*(\d+[k\d\.,]*)/i);
      if (minMatch) {
        minPrice = parseNumberValue(minMatch[2]);
      } else {
        // Detección directa de número de 4 o más cifras (ej: 45000, 50k)
        const soloPriceMatch = lower.match(/(?:^|\s)(?:(?:us|usd|\$us|\$)\s*)?(\d{4,6}|\d{1,3}k)(?:\s|$)/i);
        if (soloPriceMatch) {
          maxPrice = parseNumberValue(soloPriceMatch[1]);
        }
      }
    }
  }

  // 6. Resumen de Chips detectados por IA
  const detectedChips: string[] = [];
  detectedChips.push(operationLabel);
  if (propertyTypeLabel !== 'Todos los tipos') {
    detectedChips.push(propertyTypeLabel);
  }
  if (locationLabel) {
    detectedChips.push(locationLabel);
  }
  if (bedrooms) {
    detectedChips.push(`${bedrooms} ${bedrooms === 1 ? 'dormitorio' : 'dormitorios'}`);
  }
  if (maxPrice) {
    detectedChips.push(`Hasta $us ${maxPrice.toLocaleString('en-US')}`);
  }
  if (minPrice && !maxPrice) {
    detectedChips.push(`Desde $us ${minPrice.toLocaleString('en-US')}`);
  }

  // 7. Construcción de URL destino
  const basePath = `/${operation}/${propertyType}`;
  const params = new URLSearchParams();
  if (matchedCity) params.set('ciudad', matchedCity);
  if (location && location !== matchedCity) params.set('zona', location);
  if (minPrice) params.set('min', minPrice.toString());
  if (maxPrice) params.set('max', maxPrice.toString());
  if (bedrooms) params.set('dormitorios', bedrooms.toString());
  if (cleanInput) params.set('q', cleanInput);

  const queryString = params.toString();
  const targetUrl = queryString ? `${basePath}?${queryString}` : basePath;

  return {
    operation,
    operationLabel,
    propertyType,
    propertyTypeLabel,
    location: locationLabel || location,
    locationLabel,
    minPrice,
    maxPrice,
    bedrooms,
    detectedChips,
    targetUrl
  };
}

function parseNumberValue(val: string): number | undefined {
  if (!val) return undefined;
  const clean = val.toLowerCase().replace(/[,.]/g, '').trim();
  if (clean.endsWith('k')) {
    const num = parseFloat(clean.replace('k', ''));
    return isNaN(num) ? undefined : Math.round(num * 1000);
  }
  const num = parseInt(clean, 10);
  return isNaN(num) ? undefined : num;
}
