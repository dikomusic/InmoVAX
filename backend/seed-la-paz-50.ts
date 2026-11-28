import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ftebnxosnjyofiakhfap.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZWJueG9zbmp5b2ZpYWtoZmFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkxMzMyMywiZXhwIjoyMTA1NDg5MzIzfQ.MGIsXPuxSBqA_ZP0KlWqTlEu3jNU_Fiwiu20WvzEY5A';

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// Fotos arquitectónicas e interiores de alta definición de Unsplash
const PHOTOS = {
  casasModernas: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=1200&auto=format&fit=crop'
  ],
  departamentos: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-ee1b2b8004f3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'
  ],
  interiores: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop'
  ]
};

// 12 Usuarios reales paceños con sus roles
const USUARIOS_PACEÑOS = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'vendedor@inmovax.com',
    full_name: 'Arq. Gonzalo Benítez Soliz',
    phone: '+591 76543210',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    email: 'valeria.quiroga@inmovax.com',
    full_name: 'Lic. Valeria Quiroga Flores',
    phone: '+591 77218945',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    email: 'carlos.siles@inmovax.com',
    full_name: 'Ing. Carlos Eduardo Siles',
    phone: '+591 70654321',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    email: 'marcela.fernandez@inmovax.com',
    full_name: 'Dra. Marcela Fernández Peña',
    phone: '+591 71598762',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    email: 'rodrigo.paz@inmovax.com',
    full_name: 'Arq. Rodrigo Paz Campero',
    phone: '+591 72034567',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000006',
    email: 'gabriela.morales@inmovax.com',
    full_name: 'Lic. Gabriela Morales Terán',
    phone: '+591 78912340',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000007',
    email: 'mauricio.alarcon@inmovax.com',
    full_name: 'Ing. Mauricio Alarcón Zalles',
    phone: '+591 73045678',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000008',
    email: 'patricia.torrico@inmovax.com',
    full_name: 'Patricia Torrico Mercado',
    phone: '+591 76239014',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000009',
    email: 'fernando.villarroel@inmovax.com',
    full_name: 'Fernando Villarroel Justiniano',
    phone: '+591 71987654',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000010',
    email: 'sofia.ballivian@inmovax.com',
    full_name: 'Sofía Ballivián Méndez',
    phone: '+591 77712398',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000011',
    email: 'javier.montes@inmovax.com',
    full_name: 'Javier Montes Claros',
    phone: '+591 70198234',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  },
  {
    id: 'a0000000-0000-0000-0000-000000000012',
    email: 'andrea.lizarazu@inmovax.com',
    full_name: 'Andrea Lizarazu Guzmán',
    phone: '+591 75890123',
    role_id: 3,
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    is_verified: true
  }
];

// 50 Inmuebles reales situados en las distintas zonas de La Paz
interface PropDef {
  code: string;
  title: string;
  description: string;
  zone: string;
  address: string;
  type_id: number; // 1: Anticrético, 2: Venta, 3: Alquiler
  category: 'Casa' | 'Departamento' | 'Penthouse' | 'Townhouse' | 'Terreno';
  price_amount: number;
  currency: 'USD' | 'BOB';
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  land_area_sqm?: number;
  parking_spots: number;
  latitude: number;
  longitude: number;
  folio_real: string;
  amenities: string[];
  userIndex: number;
  coverImg: string;
  gallery: string[];
}

const RAW_PROPERTIES: PropDef[] = [
  // --- ZONA SUR: CALACOTO ---
  {
    code: 'LPZ-101',
    title: 'Residencia de Lujo con Jardín Privado en Calacoto',
    description: 'Hermosa casa estilo contemporáneo ubicada en Calle 18 de Calacoto. Cuenta con amplio living comedor con chimenea, cocina gourmet con isla de cuarzo, suite principal con jacuzzi y vestidor, parrillero techado y jardín soleado.',
    zone: 'Calacoto',
    address: 'Calle 18 de Calacoto #450',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 320000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 380,
    land_area_sqm: 450,
    parking_spots: 3,
    latitude: -16.5385,
    longitude: -68.0850,
    folio_real: '2.01.0.99.0018472',
    amenities: ['Jardín Privado', 'Parrillero Techado', 'Calefacción Central', 'Gas Domiciliario', 'Seguridad 24/7'],
    userIndex: 0,
    coverImg: PHOTOS.casasModernas[0],
    gallery: [PHOTOS.casasModernas[0], PHOTOS.interiores[0], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-102',
    title: 'Departamento Soleado en Calacoto sobre Av. Ballivián',
    description: 'Impecable departamento de 3 dormitorios con sol de mañana y tarde. Edificio con ascensor directo, sala espaciosa, acabados en madera tajibo y vistas panorámicas a las montañas.',
    zone: 'Calacoto',
    address: 'Av. Ballivián entre Calles 12 y 13 #1240',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 58000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 145,
    parking_spots: 1,
    latitude: -16.5360,
    longitude: -68.0865,
    folio_real: '2.01.0.99.0024911',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Calefón Eléctrico', 'Depósito', 'Portería 24 Horas'],
    userIndex: 2,
    coverImg: PHOTOS.departamentos[0],
    gallery: [PHOTOS.departamentos[0], PHOTOS.interiores[2], PHOTOS.interiores[3]]
  },
  {
    code: 'LPZ-103',
    title: 'Casa Familiar con Patio Soleado en Calacoto Calle 24',
    description: 'Casa de 2 plantas ideal para familia grande. Con iluminación natural todo el día, escritorio independiente, sala de juegos y garaje para 2 vehículos.',
    zone: 'Calacoto',
    address: 'Calle 24 de Calacoto #310',
    type_id: 3, // Alquiler
    category: 'Casa',
    price_amount: 8500,
    currency: 'BOB',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 290,
    land_area_sqm: 350,
    parking_spots: 2,
    latitude: -16.5412,
    longitude: -68.0820,
    folio_real: '2.01.0.99.0039120',
    amenities: ['Patio Privado', 'Gas Domiciliario', 'Parrillero', 'Cuarto de Servicio'],
    userIndex: 1,
    coverImg: PHOTOS.casasModernas[1],
    gallery: [PHOTOS.casasModernas[1], PHOTOS.interiores[4]]
  },
  {
    code: 'LPZ-104',
    title: 'Penthouse Exclusivo en Calacoto con Terraza y Jacuzzi',
    description: 'Penthouse de doble altura con terraza privada de 60 m². Vista 360 grados hacia la cordillera y el valle. Acabados importados y domótica integrada.',
    zone: 'Calacoto',
    address: 'Calle 15 de Calacoto, Edif. Torre Platinum',
    type_id: 2, // Venta
    category: 'Penthouse',
    price_amount: 295000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 4,
    area_sqm: 260,
    parking_spots: 2,
    latitude: -16.5372,
    longitude: -68.0848,
    folio_real: '2.01.0.99.0048123',
    amenities: ['Terraza Panorámica', 'Jacuzzi', 'Ascensor Privado', 'Seguridad 24/7', 'Gimnasio Común'],
    userIndex: 0,
    coverImg: PHOTOS.departamentos[6],
    gallery: [PHOTOS.departamentos[6], PHOTOS.interiores[0], PHOTOS.interiores[5]]
  },

  // --- ZONA CENTRAL / TRADICIONAL: SOPOCACHI ---
  {
    code: 'LPZ-105',
    title: 'Departamento Vintage Restaurado en Sopocachi Plaza Abaroa',
    description: 'Hermoso departamento con pisos de parquet pulidos, techos altos y gran iluminación. A 2 cuadras de la Plaza Abaroa y estación de Teleférico Amarillo.',
    zone: 'Sopocachi',
    address: 'Calle Sánchez Lima esq. Pedro Salazar #2190',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 42000,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 98,
    parking_spots: 1,
    latitude: -16.5125,
    longitude: -68.1278,
    folio_real: '2.01.0.99.0051299',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Cerca a Teleférico', 'Portero'],
    userIndex: 1,
    coverImg: PHOTOS.departamentos[1],
    gallery: [PHOTOS.departamentos[1], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-106',
    title: 'Casa Colonial Republicana en Sopocachi con Jardín Interior',
    description: 'Propiedad con valor arquitectónico patrimonial en el corazón de Sopocachi. Ideal para oficinas corporativas, embajada o residencia con encanto bohemio.',
    zone: 'Sopocachi',
    address: 'Calle Guachalla #410',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 285000,
    currency: 'USD',
    bedrooms: 5,
    bathrooms: 4,
    area_sqm: 410,
    land_area_sqm: 500,
    parking_spots: 3,
    latitude: -16.5108,
    longitude: -68.1292,
    folio_real: '2.01.0.99.0062341',
    amenities: ['Jardín Interior', 'Patio Andaluz', 'Gas Domiciliario', 'Depósito Amplio'],
    userIndex: 3,
    coverImg: PHOTOS.casasModernas[2],
    gallery: [PHOTOS.casasModernas[2], PHOTOS.interiores[2]]
  },
  {
    code: 'LPZ-107',
    title: 'Studio Loft Amoblado en Sopocachi Plaza España',
    description: 'Monoambiente tipo loft totalmente equipado y decorado con estilo nórdico. A pasos del Teleférico Amarillo y restaurantes gourmet.',
    zone: 'Sopocachi',
    address: 'Calle Presbítero Medina #890',
    type_id: 3, // Alquiler
    category: 'Departamento',
    price_amount: 3200,
    currency: 'BOB',
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 48,
    parking_spots: 0,
    latitude: -16.5140,
    longitude: -68.1255,
    folio_real: '2.01.0.99.0078120',
    amenities: ['Amoblado Completo', 'Internet Fibra Óptica', 'Gas Domiciliario', 'Seguridad Digital'],
    userIndex: 9,
    coverImg: PHOTOS.departamentos[2],
    gallery: [PHOTOS.departamentos[2], PHOTOS.interiores[3]]
  },
  {
    code: 'LPZ-108',
    title: 'Departamento Familiar de 3 Dormitorios en Sopocachi Alto',
    description: 'Ubicado en zona tranquila de Sopocachi con sol todo el día. Sala comedor en desnivel, cocina con cajonería alta y baja y suite con vestidor.',
    zone: 'Sopocachi',
    address: 'Calle Belisario Salinas #640',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 48000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 120,
    parking_spots: 1,
    latitude: -16.5115,
    longitude: -68.1285,
    folio_real: '2.01.0.99.0089145',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Calefón', 'Garaje Techado'],
    userIndex: 1,
    coverImg: PHOTOS.departamentos[3],
    gallery: [PHOTOS.departamentos[3], PHOTOS.interiores[4]]
  },

  // --- ZONA SUR: ACHUMANI ---
  {
    code: 'LPZ-109',
    title: 'Chalet Moderno en Condominio Cerrado en Achumani',
    description: 'Exclusivo chalet en Achumani Calle 22. Condominio con áreas verdes, canchas de fútbol y seguridad privada. Sala con doble altura y cocina americana.',
    zone: 'Achumani',
    address: 'Calle 22 de Achumani, Condominio Las Retamas',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 245000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 310,
    land_area_sqm: 380,
    parking_spots: 2,
    latitude: -16.5315,
    longitude: -68.0645,
    folio_real: '2.01.0.99.0091234',
    amenities: ['Condominio Cerrado', 'Seguridad 24/7', 'Parrillero', 'Jardín con Riego Automático', 'Gas Domiciliario'],
    userIndex: 4,
    coverImg: PHOTOS.casasModernas[3],
    gallery: [PHOTOS.casasModernas[3], PHOTOS.interiores[0]]
  },
  {
    code: 'LPZ-110',
    title: 'Casa Soleada de 3 Plantas en Achumani Calle 16',
    description: 'Casa en excelente estado con sol de mañana y tarde. Jardín delantero y posterior, parrillero techado y garaje para 3 vehículos.',
    zone: 'Achumani',
    address: 'Calle 16 de Achumani #280',
    type_id: 1, // Anticrético
    category: 'Casa',
    price_amount: 65000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 270,
    land_area_sqm: 320,
    parking_spots: 3,
    latitude: -16.5332,
    longitude: -68.0670,
    folio_real: '2.01.0.99.0104567',
    amenities: ['Parrillero', 'Garaje para 3 Autos', 'Gas Domiciliario', 'Portón Eléctrico'],
    userIndex: 4,
    coverImg: PHOTOS.casasModernas[4],
    gallery: [PHOTOS.casasModernas[4], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-111',
    title: 'Departamento Estrenar en Achumani Calle 9 con Balcón',
    description: 'Moderno departamento a estrenar con balcón privado. Muy cerca a supermercados Hipermaxi y Ketal de Achumani. Excelente clima templado.',
    zone: 'Achumani',
    address: 'Av. García Lanza esq. Calle 9 #150',
    type_id: 3, // Alquiler
    category: 'Departamento',
    price_amount: 4200,
    currency: 'BOB',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 85,
    parking_spots: 1,
    latitude: -16.5348,
    longitude: -68.0710,
    folio_real: '2.01.0.99.0118901',
    amenities: ['A Estrenar', 'Balcón', 'Gas Domiciliario', 'Ascensor', 'Cámaras de Seguridad'],
    userIndex: 0,
    coverImg: PHOTOS.departamentos[4],
    gallery: [PHOTOS.departamentos[4], PHOTOS.interiores[2]]
  },
  {
    code: 'LPZ-112',
    title: 'Townhouse en Complejo Privado en Achumani Alto',
    description: 'Diseño arquitectónico contemporáneo en 3 niveles. Jardín zen privado, terraza con vista a los cerros de Achumani y acabados de primera.',
    zone: 'Achumani',
    address: 'Calle 29 de Achumani, Pasaje Las Condes',
    type_id: 2, // Venta
    category: 'Townhouse',
    price_amount: 198000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 215,
    parking_spots: 2,
    latitude: -16.5290,
    longitude: -68.0610,
    folio_real: '2.01.0.99.0123456',
    amenities: ['Terraza Zen', 'Gas Domiciliario', 'Portón Automatizado', 'Acabados Importados'],
    userIndex: 4,
    coverImg: PHOTOS.casasModernas[5],
    gallery: [PHOTOS.casasModernas[5], PHOTOS.interiores[3]]
  },

  // --- ZONA SUR: SAN MIGUEL ---
  {
    code: 'LPZ-113',
    title: 'Departamento de Lujo en San Miguel Calle Montenegro',
    description: 'En el epicentro gastronómico y comercial de la Zona Sur. Edificio de categoría con salón lounge, gimnasio y seguridad integral.',
    zone: 'San Miguel',
    address: 'Calle Montenegro #1180',
    type_id: 2, // Venta
    category: 'Departamento',
    price_amount: 178000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 138,
    parking_spots: 1,
    latitude: -16.5410,
    longitude: -68.0825,
    folio_real: '2.01.0.99.0137890',
    amenities: ['Ubicación Premium', 'Gimnasio', 'Lounge Común', 'Gas Domiciliario', 'Ascensor'],
    userIndex: 2,
    coverImg: PHOTOS.departamentos[5],
    gallery: [PHOTOS.departamentos[5], PHOTOS.interiores[4]]
  },
  {
    code: 'LPZ-114',
    title: 'Casa Residencial en San Miguel Calle Gabriel René Moreno',
    description: 'Propiedad con amplio frente comercial o residencial. Construcción sólida con jardín lateral, parrillero y dependencias completas.',
    zone: 'San Miguel',
    address: 'Calle Gabriel René Moreno #420',
    type_id: 1, // Anticrético
    category: 'Casa',
    price_amount: 70000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 320,
    land_area_sqm: 390,
    parking_spots: 2,
    latitude: -16.5422,
    longitude: -68.0815,
    folio_real: '2.01.0.99.0141238',
    amenities: ['Gas Domiciliario', 'Parrillero', 'Jardín', 'Dependencia de Empleada'],
    userIndex: 2,
    coverImg: PHOTOS.casasModernas[6],
    gallery: [PHOTOS.casasModernas[6], PHOTOS.interiores[5]]
  },
  {
    code: 'LPZ-115',
    title: 'Departamento Amoblado Ejecutivo en San Miguel Calle Pankara',
    description: 'Ideal para ejecutivos o diplomáticos. Totalmente amoblado con electrodomésticos de última generación, calefacción y garaje.',
    zone: 'San Miguel',
    address: 'Calle Pankara #125',
    type_id: 3, // Alquiler
    category: 'Departamento',
    price_amount: 1100,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 95,
    parking_spots: 1,
    latitude: -16.5398,
    longitude: -68.0835,
    folio_real: '2.01.0.99.0156789',
    amenities: ['Amoblado Ejecutivo', 'Calefacción', 'Gas Domiciliario', 'Seguridad 24/7'],
    userIndex: 0,
    coverImg: PHOTOS.departamentos[7],
    gallery: [PHOTOS.departamentos[7], PHOTOS.interiores[0]]
  },

  // --- ZONA MIRAFLORES ---
  {
    code: 'LPZ-116',
    title: 'Departamento Soleado en Miraflores frente a Plaza Uyuni',
    description: 'A pasos del Complejo Hospitalario y estadio Hernando Siles. Conexión rápida con Teleféricos Blanco y Naranja. Muy iluminado.',
    zone: 'Miraflores',
    address: 'Av. Saavedra esq. Plaza Uyuni #1420',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 38000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 110,
    parking_spots: 1,
    latitude: -16.5020,
    longitude: -68.1220,
    folio_real: '2.01.0.99.0169012',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Cerca a Teleférico', 'Portero'],
    userIndex: 3,
    coverImg: PHOTOS.departamentos[8],
    gallery: [PHOTOS.departamentos[8], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-117',
    title: 'Casa Familiar en Miraflores Alto Av. Busch',
    description: 'Casa de 2 pisos con jardín delantero y patio trasero. A pocas cuadras de Plaza Villarroel. Gas domiciliario y garaje techado.',
    zone: 'Miraflores',
    address: 'Av. Busch entre Calles Brasil y Haití #1840',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 235000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 260,
    land_area_sqm: 300,
    parking_spots: 2,
    latitude: -16.4980,
    longitude: -68.1210,
    folio_real: '2.01.0.99.0173456',
    amenities: ['Jardín Delantero', 'Gas Domiciliario', 'Parrillero', 'Tanque de Agua'],
    userIndex: 3,
    coverImg: PHOTOS.casasModernas[7],
    gallery: [PHOTOS.casasModernas[7], PHOTOS.interiores[2]]
  },
  {
    code: 'LPZ-118',
    title: 'Departamento Moderno en Miraflores Sur Calle Díaz Romero',
    description: 'Edificio moderno con ascensor panorámico. Sala living con piso flotante alemán y cocina equipada.',
    zone: 'Miraflores',
    address: 'Calle Díaz Romero #1320',
    type_id: 3, // Alquiler
    category: 'Departamento',
    price_amount: 3800,
    currency: 'BOB',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 80,
    parking_spots: 1,
    latitude: -16.5045,
    longitude: -68.1235,
    folio_real: '2.01.0.99.0187890',
    amenities: ['Gas Domiciliario', 'Ascensor Panorámico', 'Depósito'],
    userIndex: 3,
    coverImg: PHOTOS.departamentos[9],
    gallery: [PHOTOS.departamentos[9], PHOTOS.interiores[3]]
  },

  // --- ZONA OBRAJES ---
  {
    code: 'LPZ-119',
    title: 'Hermosa Residencia en Obrajes Calle 2 con Jardín y Parrillero',
    description: 'Ubicación privilegiada en la entrada de Obrajes. Clima cálido, jardín con árboles frutales y parrillero cerrado para eventos.',
    zone: 'Obrajes',
    address: 'Calle 2 de Obrajes #190',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 275000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 340,
    land_area_sqm: 420,
    parking_spots: 3,
    latitude: -16.5220,
    longitude: -68.1090,
    folio_real: '2.01.0.99.0191234',
    amenities: ['Jardín con Frutales', 'Parrillero Techado', 'Gas Domiciliario', 'Clima Templado'],
    userIndex: 5,
    coverImg: PHOTOS.casasModernas[8],
    gallery: [PHOTOS.casasModernas[8], PHOTOS.interiores[4]]
  },
  {
    code: 'LPZ-120',
    title: 'Departamento Soleado en Obrajes Calle 10 sobre Hernando Siles',
    description: 'A media cuadra de farmacias, bancos y transporte público. Piso alto con sol radiante toda la tarde y vista abierta.',
    zone: 'Obrajes',
    address: 'Av. Hernando Siles esq. Calle 10 #540',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 45000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 115,
    parking_spots: 1,
    latitude: -16.5265,
    longitude: -68.1040,
    folio_real: '2.01.0.99.0205678',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Transporte a la Puerta', 'Garaje Techado'],
    userIndex: 5,
    coverImg: PHOTOS.departamentos[0],
    gallery: [PHOTOS.departamentos[0], PHOTOS.interiores[5]]
  },
  {
    code: 'LPZ-121',
    title: 'Casa Estilo Suizo en Alto Obrajes con Vista al Illimani',
    description: 'Construcción con detalles en piedra y vigas de madera a la vista. Vista frontal despejada hacia el nevado Illimani.',
    zone: 'Alto Obrajes',
    address: 'Sector Canchas, Calle Los Álamos #80',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 210000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 250,
    land_area_sqm: 310,
    parking_spots: 2,
    latitude: -16.5180,
    longitude: -68.1120,
    folio_real: '2.01.0.99.0219012',
    amenities: ['Vista al Illimani', 'Chimenea a Leña', 'Gas Domiciliario', 'Jardín'],
    userIndex: 10,
    coverImg: PHOTOS.casasModernas[9],
    gallery: [PHOTOS.casasModernas[9], PHOTOS.interiores[0]]
  },

  // --- ZONA COTA COTA ---
  {
    code: 'LPZ-122',
    title: 'Casa Campestre Moderna en Cota Cota Calle 34',
    description: 'Zona de clima cálido y tranquilidad absoluta. Casa con amplios ventanales, piscina atemperada pequeña y jardín floral.',
    zone: 'Cota Cota',
    address: 'Calle 34 de Cota Cota #120',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 260000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 320,
    land_area_sqm: 450,
    parking_spots: 3,
    latitude: -16.5460,
    longitude: -68.0710,
    folio_real: '2.01.0.99.0223456',
    amenities: ['Piscina Pequeña', 'Jardín Amplio', 'Parrillero', 'Gas Domiciliario'],
    userIndex: 4,
    coverImg: PHOTOS.casasModernas[10],
    gallery: [PHOTOS.casasModernas[10], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-123',
    title: 'Departamento Cómodo en Cota Cota Calle 28 cerca a la UMSA',
    description: 'Ideal para profesores universitarios o familias. Edificio tranquilo con expensas bajas y excelente asoleamiento.',
    zone: 'Cota Cota',
    address: 'Calle 28 de Cota Cota #450',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 35000,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 90,
    parking_spots: 1,
    latitude: -16.5440,
    longitude: -68.0740,
    folio_real: '2.01.0.99.0237890',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Cerca a Universidad', 'Garaje'],
    userIndex: 4,
    coverImg: PHOTOS.departamentos[1],
    gallery: [PHOTOS.departamentos[1], PHOTOS.interiores[2]]
  },

  // --- ZONA IRPAVI ---
  {
    code: 'LPZ-124',
    title: 'Casa Residencial en Irpavi Calle 1 cerca a MegaCenter',
    description: 'A 3 minutos caminando del MegaCenter y estación de Teleférico Verde. Casa de 3 plantas con escritorio y terraza.',
    zone: 'Irpavi',
    address: 'Calle 1 de Irpavi #210',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 290000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 330,
    land_area_sqm: 360,
    parking_spots: 2,
    latitude: -16.5295,
    longitude: -68.0790,
    folio_real: '2.01.0.99.0241234',
    amenities: ['Cerca a MegaCenter', 'Cerca a Teleférico', 'Gas Domiciliario', 'Parrillero'],
    userIndex: 7,
    coverImg: PHOTOS.casasModernas[11],
    gallery: [PHOTOS.casasModernas[11], PHOTOS.interiores[3]]
  },
  {
    code: 'LPZ-125',
    title: 'Chalet Soleado en Flor de Irpavi con Huerto Familiar',
    description: 'Chalet en zona de microclima especial en Flor de Irpavi. Con huerto ecológico, terraza con pérgola y sol todo el día.',
    zone: 'Irpavi',
    address: 'Flor de Irpavi, Pasaje Los Rosales #15',
    type_id: 1, // Anticrético
    category: 'Casa',
    price_amount: 52000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 230,
    land_area_sqm: 340,
    parking_spots: 2,
    latitude: -16.5240,
    longitude: -68.0750,
    folio_real: '2.01.0.99.0255678',
    amenities: ['Huerto Orgánico', 'Pérgola', 'Microclima Templado', 'Gas Domiciliario'],
    userIndex: 7,
    coverImg: PHOTOS.casasModernas[12],
    gallery: [PHOTOS.casasModernas[12], PHOTOS.interiores[4]]
  },

  // --- ZONA MALLASA Y MALLASILLA ---
  {
    code: 'LPZ-126',
    title: 'Casa Quinta de Campo en Mallasa con Piscina y Amplio Jardín',
    description: 'El mejor clima de La Paz a 15 minutos de Calacoto. Quinta con piscina atemperada, quincho para 30 personas y amplios jardines.',
    zone: 'Mallasa',
    address: 'Av. Hernán Siles Zuazo #140',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 340000,
    currency: 'USD',
    bedrooms: 5,
    bathrooms: 5,
    area_sqm: 420,
    land_area_sqm: 750,
    parking_spots: 4,
    latitude: -16.5680,
    longitude: -68.0920,
    folio_real: '2.01.0.99.0269012',
    amenities: ['Piscina Atemperada', 'Quincho Gigante', 'Jardín 500m2', 'Clima Cálido Valle'],
    userIndex: 8,
    coverImg: PHOTOS.casasModernas[13],
    gallery: [PHOTOS.casasModernas[13], PHOTOS.interiores[5]]
  },
  {
    code: 'LPZ-127',
    title: 'Casa Contemporánea en Condominio El Bosque en Mallasilla',
    description: 'Seguridad estricta las 24 horas en Mallasilla. Canchas de tenis, club house y senderos ecológicos.',
    zone: 'Mallasilla',
    address: 'Condominio El Bosque, Manzano D Lote 12',
    type_id: 1, // Anticrético
    category: 'Casa',
    price_amount: 60000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 290,
    land_area_sqm: 400,
    parking_spots: 2,
    latitude: -16.5750,
    longitude: -68.0880,
    folio_real: '2.01.0.99.0273456',
    amenities: ['Condominio El Bosque', 'Club House', 'Cancha de Tenis', 'Seguridad 24/7'],
    userIndex: 8,
    coverImg: PHOTOS.casasModernas[14],
    gallery: [PHOTOS.casasModernas[14], PHOTOS.interiores[0]]
  },

  // --- ZONA BOLOGNIA Y BELLA VISTA ---
  {
    code: 'LPZ-128',
    title: 'Casa Acoledora en Bolognia con Parrillero y Terraza',
    description: 'Ubicada en zona residencial tranquila. Con sol desde tempranas horas, ambientes amplios y terraza con vista a la serranía.',
    zone: 'Bolognia',
    address: 'Calle 6 de Bolognia #180',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 195000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 240,
    land_area_sqm: 280,
    parking_spots: 2,
    latitude: -16.5215,
    longitude: -68.0845,
    folio_real: '2.01.0.99.0287890',
    amenities: ['Parrillero', 'Terraza', 'Gas Domiciliario', 'Garaje Techado'],
    userIndex: 7,
    coverImg: PHOTOS.casasModernas[0],
    gallery: [PHOTOS.casasModernas[0], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-129',
    title: 'Departamento Soleado en Bella Vista Calle 17',
    description: 'Excelente departamento a pasos de Obrajes y Calacoto. Salón con chimenea eléctrica, 3 dormitorios y garaje subterráneo.',
    zone: 'Bella Vista',
    address: 'Calle 17 de Bella Vista #220',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 40000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 108,
    parking_spots: 1,
    latitude: -16.5270,
    longitude: -68.0950,
    folio_real: '2.01.0.99.0291234',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Garaje Subterráneo', 'Seguridad'],
    userIndex: 10,
    coverImg: PHOTOS.departamentos[2],
    gallery: [PHOTOS.departamentos[2], PHOTOS.interiores[2]]
  },

  // --- ZONA AUQUISAMAÑA Y LA FLORIDA ---
  {
    code: 'LPZ-130',
    title: 'Residencia en La Florida cerca al Club Alemán',
    description: 'Casa señorial con gran parqueo y jardín maduro. En calle tranquila y arbolada en el sector de La Florida.',
    zone: 'La Florida',
    address: 'Calle Las Retamas #90',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 380000,
    currency: 'USD',
    bedrooms: 5,
    bathrooms: 5,
    area_sqm: 450,
    land_area_sqm: 600,
    parking_spots: 4,
    latitude: -16.5340,
    longitude: -68.0890,
    folio_real: '2.01.0.99.0305678',
    amenities: ['Jardín Gigante', 'Cerca Club Alemán', 'Calefacción', 'Cuarto de Huéspedes'],
    userIndex: 11,
    coverImg: PHOTOS.casasModernas[1],
    gallery: [PHOTOS.casasModernas[1], PHOTOS.interiores[3]]
  },
  {
    code: 'LPZ-131',
    title: 'Chalet Moderno en Auquisamaña junto al Bosquecillo',
    description: 'Ambiente natural y aire puro frente a la reserva ecológica de Auquisamaña. Acabados en porcelanato y madera noble.',
    zone: 'Auquisamaña',
    address: 'Calle Los Pinos esq. El Bosque #14',
    type_id: 1, // Anticrético
    category: 'Casa',
    price_amount: 55000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 230,
    land_area_sqm: 300,
    parking_spots: 2,
    latitude: -16.5300,
    longitude: -68.0700,
    folio_real: '2.01.0.99.0319012',
    amenities: ['Junto al Bosquecillo', 'Gas Domiciliario', 'Parrillero', 'Alarma'],
    userIndex: 11,
    coverImg: PHOTOS.casasModernas[2],
    gallery: [PHOTOS.casasModernas[2], PHOTOS.interiores[4]]
  },

  // --- ZONA LOS PINOS Y CHASQUIPAMPA ---
  {
    code: 'LPZ-132',
    title: 'Departamento Remodelado en Los Pinos Calle 25',
    description: 'Departamento soleado en bloque remodelado con seguridad. Pisos de madera flotante, cocina empotrada y baño moderno.',
    zone: 'Los Pinos',
    address: 'Av. José Aguirre, Bloque 42 Depto 302',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 32000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 1,
    area_sqm: 85,
    parking_spots: 1,
    latitude: -16.5420,
    longitude: -68.0780,
    folio_real: '2.01.0.99.0323456',
    amenities: ['Gas Domiciliario', 'Estacionamiento Común', 'Cerca a Comercios'],
    userIndex: 6,
    coverImg: PHOTOS.departamentos[3],
    gallery: [PHOTOS.departamentos[3], PHOTOS.interiores[5]]
  },
  {
    code: 'LPZ-133',
    title: 'Casa Familiar de 3 Pisos en Chasquipampa Calle 46',
    description: 'Propiedad con departamento independiente en planta baja. Muy soleada y con terraza panorámica.',
    zone: 'Chasquipampa',
    address: 'Calle 46 de Chasquipampa #320',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 145000,
    currency: 'USD',
    bedrooms: 5,
    bathrooms: 4,
    area_sqm: 310,
    land_area_sqm: 250,
    parking_spots: 2,
    latitude: -16.5480,
    longitude: -68.0580,
    folio_real: '2.01.0.99.0337890',
    amenities: ['Departamento Independiente', 'Terraza', 'Gas Domiciliario', 'Sol Todo el Día'],
    userIndex: 6,
    coverImg: PHOTOS.casasModernas[3],
    gallery: [PHOTOS.casasModernas[3], PHOTOS.interiores[0]]
  },

  // --- ZONA SAN PEDRO Y CENTRO ---
  {
    code: 'LPZ-134',
    title: 'Departamento Amplio en San Pedro Plaza Sucre',
    description: 'Frente a la tradicional Plaza Sucre de San Pedro. A minutos a pie de El Prado y universidades.',
    zone: 'San Pedro',
    address: 'Calle Colombia esq. Plaza Sucre #390',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 36000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 112,
    parking_spots: 1,
    latitude: -16.5010,
    longitude: -68.1380,
    folio_real: '2.01.0.99.0341234',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Céntrico', 'Portería'],
    userIndex: 9,
    coverImg: PHOTOS.departamentos[4],
    gallery: [PHOTOS.departamentos[4], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-135',
    title: 'Piso Completo en Edificio sobre El Prado Paceño',
    description: 'Vistas inigualables al centro de la ciudad de La Paz y el desfile cívico. Edificio icónico con seguridad.',
    zone: 'Centro',
    address: 'Av. 16 de Julio (El Prado) #1490',
    type_id: 3, // Alquiler
    category: 'Departamento',
    price_amount: 5500,
    currency: 'BOB',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 160,
    parking_spots: 1,
    latitude: -16.4990,
    longitude: -68.1330,
    folio_real: '2.01.0.99.0355678',
    amenities: ['Vista a El Prado', 'Ascensor', 'Calefacción', 'Seguridad 24 Horas'],
    userIndex: 9,
    coverImg: PHOTOS.departamentos[5],
    gallery: [PHOTOS.departamentos[5], PHOTOS.interiores[2]]
  },

  // --- MÁS PROPIEDADES EN CALACOTO, SOPOCACHI, SAN MIGUEL, ACHUMANI, ETC. HASTA 50 ---
  {
    code: 'LPZ-136',
    title: 'Casa Minimalista a Estrenar en Calacoto Calle 21',
    description: 'Arquitectura bioclimática con muros térmicos, paneles solares y doble acristalamiento. La cúspide del diseño en Calacoto.',
    zone: 'Calacoto',
    address: 'Calle 21 de Calacoto #110',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 365000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 5,
    area_sqm: 390,
    land_area_sqm: 480,
    parking_spots: 3,
    latitude: -16.5400,
    longitude: -68.0830,
    folio_real: '2.01.0.99.0369012',
    amenities: ['Paneles Solares', 'Vidrio Doble Termopanel', 'Jardín con Deck', 'Seguridad Smart'],
    userIndex: 0,
    coverImg: PHOTOS.casasModernas[4],
    gallery: [PHOTOS.casasModernas[4], PHOTOS.interiores[3]]
  },
  {
    code: 'LPZ-137',
    title: 'Departamento Soleado en Calacoto Calle 10 con Jardín Común',
    description: 'Edificio boutique de solo 6 familias. Tranquilidad, sol y amplios jardines compartidos.',
    zone: 'Calacoto',
    address: 'Calle 10 de Calacoto #512',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 52000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 130,
    parking_spots: 1,
    latitude: -16.5350,
    longitude: -68.0875,
    folio_real: '2.01.0.99.0373456',
    amenities: ['Jardín Compartido', 'Gas Domiciliario', 'Edificio Boutique', 'Parqueo'],
    userIndex: 2,
    coverImg: PHOTOS.departamentos[6],
    gallery: [PHOTOS.departamentos[6], PHOTOS.interiores[4]]
  },
  {
    code: 'LPZ-138',
    title: 'Casa Colonial en Sopocachi Calle Fernando Guachalla',
    description: 'Espacios generosos, chimenea funcional de ladrillo refractario y jardín privado con sol.',
    zone: 'Sopocachi',
    address: 'Calle Fernando Guachalla #380',
    type_id: 3, // Alquiler
    category: 'Casa',
    price_amount: 7800,
    currency: 'BOB',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 280,
    land_area_sqm: 330,
    parking_spots: 2,
    latitude: -16.5110,
    longitude: -68.1290,
    folio_real: '2.01.0.99.0387890',
    amenities: ['Chimenea', 'Gas Domiciliario', 'Jardín Privado', 'Ubicación Bohemio-Cultural'],
    userIndex: 1,
    coverImg: PHOTOS.casasModernas[5],
    gallery: [PHOTOS.casasModernas[5], PHOTOS.interiores[5]]
  },
  {
    code: 'LPZ-139',
    title: 'Departamento con Balcón en Sopocachi Calle Rosendo Gutiérrez',
    description: 'A media cuadra de Av. 20 de Octubre. Zona comercial, supermercados y cafés de moda.',
    zone: 'Sopocachi',
    address: 'Calle Rosendo Gutiérrez #520',
    type_id: 2, // Venta
    category: 'Departamento',
    price_amount: 125000,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 88,
    parking_spots: 1,
    latitude: -16.5130,
    longitude: -68.1265,
    folio_real: '2.01.0.99.0391234',
    amenities: ['Balcón', 'Gas Domiciliario', 'Ascensor', 'Cerca Av. 20 de Octubre'],
    userIndex: 1,
    coverImg: PHOTOS.departamentos[7],
    gallery: [PHOTOS.departamentos[7], PHOTOS.interiores[0]]
  },
  {
    code: 'LPZ-140',
    title: 'Casa Quinta Familiar en Achumani Las Nieves',
    description: 'En el sector Las Nieves de Achumani. Clima agradable, árboles frutales y pozo de agua propio.',
    zone: 'Achumani',
    address: 'Achumani Las Nieves, Calle Los Pinos #45',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 228000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 285,
    land_area_sqm: 420,
    parking_spots: 3,
    latitude: -16.5270,
    longitude: -68.0620,
    folio_real: '2.01.0.99.0405678',
    amenities: ['Pozo de Agua Propio', 'Huerto', 'Gas Domiciliario', 'Parrillero'],
    userIndex: 4,
    coverImg: PHOTOS.casasModernas[6],
    gallery: [PHOTOS.casasModernas[6], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-141',
    title: 'Departamento en Achumani Calle 11 en Anticrético',
    description: 'Frente a parada del bus Pumakatari. Cómodo, soleado y con expensas mínimas.',
    zone: 'Achumani',
    address: 'Calle 11 de Achumani #230',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 39000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 105,
    parking_spots: 1,
    latitude: -16.5340,
    longitude: -68.0695,
    folio_real: '2.01.0.99.0419012',
    amenities: ['Pumakatari a la Puerta', 'Gas Domiciliario', 'Ascensor', 'Parqueo'],
    userIndex: 4,
    coverImg: PHOTOS.departamentos[8],
    gallery: [PHOTOS.departamentos[8], PHOTOS.interiores[2]]
  },
  {
    code: 'LPZ-142',
    title: 'Penthouse Dúplex en San Miguel Calle Claudio Aliaga',
    description: 'Dúplex con terraza privada, parrillero propio y vistas ininterrumpidas a la Muela del Diablo.',
    zone: 'San Miguel',
    address: 'Calle Claudio Aliaga #1420',
    type_id: 2, // Venta
    category: 'Penthouse',
    price_amount: 230000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 4,
    area_sqm: 210,
    parking_spots: 2,
    latitude: -16.5415,
    longitude: -68.0810,
    folio_real: '2.01.0.99.0423456',
    amenities: ['Vista Muela del Diablo', 'Parrillero Propio', 'Doble Altura', 'Ascensor Directo'],
    userIndex: 2,
    coverImg: PHOTOS.departamentos[9],
    gallery: [PHOTOS.departamentos[9], PHOTOS.interiores[3]]
  },
  {
    code: 'LPZ-143',
    title: 'Casa Estilo Rústico en Irpavi Calle 12',
    description: 'Vigas de eucalipto tratadas, chimenea en la sala y un jardín que recibe sol toda la tarde.',
    zone: 'Irpavi',
    address: 'Calle 12 de Irpavi #340',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 240000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 260,
    land_area_sqm: 350,
    parking_spots: 2,
    latitude: -16.5260,
    longitude: -68.0770,
    folio_real: '2.01.0.99.0437890',
    amenities: ['Estilo Rústico', 'Chimenea', 'Gas Domiciliario', 'Jardín con Sol'],
    userIndex: 7,
    coverImg: PHOTOS.casasModernas[7],
    gallery: [PHOTOS.casasModernas[7], PHOTOS.interiores[4]]
  },
  {
    code: 'LPZ-144',
    title: 'Departamento Ejecutivo en Obrajes Calle 6',
    description: 'Cerca a la Universidad Católica Boliviana (UCB). Muy seguro y con garaje cubierto.',
    zone: 'Obrajes',
    address: 'Calle 6 de Obrajes #310',
    type_id: 3, // Alquiler
    category: 'Departamento',
    price_amount: 4500,
    currency: 'BOB',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 90,
    parking_spots: 1,
    latitude: -16.5240,
    longitude: -68.1065,
    folio_real: '2.01.0.99.0441234',
    amenities: ['Cerca a la UCB', 'Gas Domiciliario', 'Ascensor', 'Garaje Techado'],
    userIndex: 5,
    coverImg: PHOTOS.departamentos[0],
    gallery: [PHOTOS.departamentos[0], PHOTOS.interiores[5]]
  },
  {
    code: 'LPZ-145',
    title: 'Casa Señorial en Miraflores Calle Díaz Romero',
    description: 'Construcción con muros anchos, finas maderas y patio posterior con parrillero.',
    zone: 'Miraflores',
    address: 'Calle Díaz Romero #1120',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 265000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 300,
    land_area_sqm: 360,
    parking_spots: 2,
    latitude: -16.5035,
    longitude: -68.1230,
    folio_real: '2.01.0.99.0455678',
    amenities: ['Muros Térmicos', 'Parrillero', 'Gas Domiciliario', 'Tanque de Agua'],
    userIndex: 3,
    coverImg: PHOTOS.casasModernas[8],
    gallery: [PHOTOS.casasModernas[8], PHOTOS.interiores[0]]
  },
  {
    code: 'LPZ-146',
    title: 'Chalet Moderno en Aranjuez con Clima de Valle',
    description: 'En el sector de Aranjuez, pasando La Florida. Microclima cálido, jardín con palmeras y terraza.',
    zone: 'La Florida',
    address: 'Av. Aranjuez, Condominio Las Palmas #8',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 298000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 4,
    area_sqm: 340,
    land_area_sqm: 460,
    parking_spots: 3,
    latitude: -16.5450,
    longitude: -68.0930,
    folio_real: '2.01.0.99.0469012',
    amenities: ['Clima Cálido', 'Jardín con Palmeras', 'Parrillero', 'Seguridad'],
    userIndex: 11,
    coverImg: PHOTOS.casasModernas[9],
    gallery: [PHOTOS.casasModernas[9], PHOTOS.interiores[1]]
  },
  {
    code: 'LPZ-147',
    title: 'Departamento Soleado en Cota Cota Calle 31',
    description: 'A media cuadra de Av. Muñoz Reyes. Muy iluminado con vistas a los cerros de Cota Cota.',
    zone: 'Cota Cota',
    address: 'Calle 31 de Cota Cota #180',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 37000,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 92,
    parking_spots: 1,
    latitude: -16.5455,
    longitude: -68.0725,
    folio_real: '2.01.0.99.0473456',
    amenities: ['Gas Domiciliario', 'Ascensor', 'Cerca a Av. Principal', 'Garaje'],
    userIndex: 4,
    coverImg: PHOTOS.departamentos[1],
    gallery: [PHOTOS.departamentos[1], PHOTOS.interiores[2]]
  },
  {
    code: 'LPZ-148',
    title: 'Casa Esquinera en Següencoma Bajo con Jardín',
    description: 'Casa en esquina con doble acceso vehicular. Próxima a Costanera y puente hacia Obrajes.',
    zone: 'Bella Vista',
    address: 'Bajo Següencoma, Calle Las Acacias #40',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 245000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 290,
    land_area_sqm: 350,
    parking_spots: 3,
    latitude: -16.5290,
    longitude: -68.0980,
    folio_real: '2.01.0.99.0487890',
    amenities: ['Esquinera', 'Doble Garaje', 'Gas Domiciliario', 'Jardín'],
    userIndex: 10,
    coverImg: PHOTOS.casasModernas[10],
    gallery: [PHOTOS.casasModernas[10], PHOTOS.interiores[3]]
  },
  {
    code: 'LPZ-149',
    title: 'Departamento Dúplex en Sopocachi Calle Macario Pinilla',
    description: 'Dúplex elegante con vista panorámica hacia la ciudad. Living con chimenea y suite con jacuzzi.',
    zone: 'Sopocachi',
    address: 'Calle Macario Pinilla #480',
    type_id: 1, // Anticrético
    category: 'Departamento',
    price_amount: 50000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    area_sqm: 155,
    parking_spots: 1,
    latitude: -16.5135,
    longitude: -68.1260,
    folio_real: '2.01.0.99.0491234',
    amenities: ['Dúplex', 'Jacuzzi', 'Chimenea', 'Ascensor', 'Gas Domiciliario'],
    userIndex: 1,
    coverImg: PHOTOS.departamentos[2],
    gallery: [PHOTOS.departamentos[2], PHOTOS.interiores[4]]
  },
  {
    code: 'LPZ-150',
    title: 'Mansión Exclusiva en Calacoto Las Cholas con Piscina y Cancha',
    description: 'Residencia de ensueño para diplomático o empresario. Cancha polideportiva, piscina climatizada, sauna seco y vapor, y sistema de seguridad militar.',
    zone: 'Calacoto',
    address: 'Sector Las Cholas, Calle Los Sauces #100',
    type_id: 2, // Venta
    category: 'Casa',
    price_amount: 490000,
    currency: 'USD',
    bedrooms: 5,
    bathrooms: 6,
    area_sqm: 580,
    land_area_sqm: 900,
    parking_spots: 5,
    latitude: -16.5350,
    longitude: -68.0890,
    folio_real: '2.01.0.99.0505678',
    amenities: ['Piscina Climatizada', 'Sauna Seco y Vapor', 'Cancha Deportiva', 'Seguridad Perimetral', 'Jardín 400m2'],
    userIndex: 0,
    coverImg: PHOTOS.casasModernas[11],
    gallery: [PHOTOS.casasModernas[11], PHOTOS.interiores[0], PHOTOS.interiores[1]]
  }
];

async function main() {
  console.log('--- INICIANDO SEED DE 50 CASAS E INMUEBLES EN LA PAZ ---');

  // 1. ELIMINAR CASAS EXISTENTES EN PROPERTIES
  console.log('1. Eliminando propiedades previas...');
  const { error: delPropsErr } = await sb
    .from('properties')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (delPropsErr) {
    console.error('Error eliminando propiedades:', delPropsErr);
  } else {
    console.log('Propiedades previas eliminadas exitosamente.');
  }

  // 2. INSERTAR/UPSERTAR USUARIOS PACEÑOS
  console.log('2. Insertando/Actualizando 12 usuarios reales de La Paz...');
  for (const user of USUARIOS_PACEÑOS) {
    const { error: userErr } = await sb.from('profiles').upsert(user, { onConflict: 'id' });
    if (userErr) {
      console.error(`Error insertando usuario ${user.email}:`, userErr.message);
    }
  }
  console.log('Usuarios paceños listos.');

  // 3. INSERTAR LAS 50 PROPIEDADES EN LA PAZ
  console.log(`3. Insertando ${RAW_PROPERTIES.length} propiedades en La Paz...`);
  let insertedCount = 0;

  for (const p of RAW_PROPERTIES) {
    const owner = USUARIOS_PACEÑOS[p.userIndex];

    const propPayload = {
      code: p.code,
      user_id: owner.id,
      title: p.title,
      description: p.description,
      zone: p.zone,
      city: 'La Paz',
      address: p.address,
      type_id: p.type_id,
      status_id: 1, // Activo
      price_amount: p.price_amount,
      currency: p.currency,
      folio_real: p.folio_real,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area_sqm: p.area_sqm,
      land_area_sqm: p.land_area_sqm || null,
      category: p.category,
      is_negotiable: true,
      latitude: p.latitude,
      longitude: p.longitude,
      parking_spots: p.parking_spots,
      amenities: p.amenities,
      views_count: Math.floor(Math.random() * 80) + 12,
      inquiries_count: Math.floor(Math.random() * 15) + 2
    };

    const { data: propData, error: propErr } = await sb
      .from('properties')
      .insert(propPayload)
      .select('id')
      .single();

    if (propErr) {
      console.error(`Error insertando propiedad ${p.code}:`, propErr.message);
      continue;
    }

    insertedCount++;
    const propId = propData.id;

    // 4. INSERTAR IMÁGENES DE LA PROPIEDAD
    const imagesToInsert = [
      {
        property_id: propId,
        image_url: p.coverImg,
        is_cover: true,
        display_order: 0
      },
      ...p.gallery.slice(1).map((url, idx) => ({
        property_id: propId,
        image_url: url,
        is_cover: false,
        display_order: idx + 1
      }))
    ];

    const { error: imgErr } = await sb.from('property_images').insert(imagesToInsert);
    if (imgErr) {
      console.error(`Error insertando imágenes para ${p.code}:`, imgErr.message);
    }
  }

  console.log(`--- SEED COMPLETADO: ${insertedCount} propiedades insertadas con éxito en La Paz ---`);
}

main().catch(err => {
  console.error('Fallo general:', err);
  process.exit(1);
});
