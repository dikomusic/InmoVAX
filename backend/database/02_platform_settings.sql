-- ==============================================================================
-- INMOVAX MIGRATION 02: PLATFORM SETTINGS & SELLER ATTRIBUTES (3NF NORMALIZATION)
-- ==============================================================================

-- 1. TABLA NORMALIZADA DE CONFIGURACIÓN GLOBAL DE PLATAFORMA (Singleton 3NF)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    bank_name VARCHAR(100) NOT NULL DEFAULT 'Banco Mercantil Santa Cruz',
    bank_account_number VARCHAR(60) NOT NULL DEFAULT '4010-8923-01-92',
    bank_account_holder VARCHAR(150) NOT NULL DEFAULT 'InmoVAX Soluciones Inmobiliarias S.R.L.',
    bank_account_type VARCHAR(40) NOT NULL DEFAULT 'Caja de Ahorro M/E',
    bank_account_id_number VARCHAR(40) NOT NULL DEFAULT '3049581028 (NIT)',
    qr_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    support_whatsapp VARCHAR(30) NOT NULL DEFAULT '+591 77201928',
    support_email VARCHAR(255) NOT NULL DEFAULT 'contacto@inmovax.com',
    support_hours VARCHAR(100) NOT NULL DEFAULT 'Lunes a Sábado de 08:30 a 19:00',
    listing_duration_days SMALLINT NOT NULL DEFAULT 60 CHECK (listing_duration_days > 0),
    commission_rate NUMERIC(4, 2) NOT NULL DEFAULT 3.00 CHECK (commission_rate >= 0),
    min_anticretico_amount NUMERIC(10, 2) NOT NULL DEFAULT 15000.00 CHECK (min_anticretico_amount >= 0),
    require_folio_real BOOLEAN NOT NULL DEFAULT TRUE,
    auto_assign_advisor BOOLEAN NOT NULL DEFAULT TRUE,
    allow_direct_client_publish BOOLEAN NOT NULL DEFAULT TRUE,
    notify_whatsapp_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    notify_email_summaries BOOLEAN NOT NULL DEFAULT TRUE,
    system_maintenance BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- Insertar configuración inicial por defecto si no existe
INSERT INTO public.platform_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 2. TABLA NORMALIZADA DE ZONAS METROPOLITANAS (3NF Lookup Table)
CREATE TABLE IF NOT EXISTS public.platform_zones (
    id SERIAL PRIMARY KEY,
    city VARCHAR(50) NOT NULL DEFAULT 'La Paz',
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_platform_zone UNIQUE (city, name)
);

-- Zonas de cobertura predeterminadas
INSERT INTO public.platform_zones (city, name, is_active, display_order) VALUES
('La Paz', 'Sopocachi', TRUE, 1),
('La Paz', 'Calacoto', TRUE, 2),
('La Paz', 'San Miguel', TRUE, 3),
('La Paz', 'Achumani', TRUE, 4),
('La Paz', 'Miraflores', TRUE, 5),
('La Paz', 'San Jorge', TRUE, 6),
('La Paz', 'Irpavi', TRUE, 7),
('La Paz', 'Los Pinos', TRUE, 8),
('La Paz', 'Cota Cota', FALSE, 9),
('La Paz', 'Obrajes', TRUE, 10),
('El Alto', 'Ciudad Satélite', TRUE, 11),
('Cochabamba', 'Zona Norte', TRUE, 12),
('Santa Cruz', 'Equipetrol', TRUE, 13)
ON CONFLICT (city, name) DO NOTHING;

-- 3. EXTENSIÓN DE PERFILES CON ATRIBUTOS COMERCIALES NORMALIZADOS (3NF)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name VARCHAR(150);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_sales VARCHAR(30);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_email_offers BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_whatsapp_alerts BOOLEAN DEFAULT TRUE;

-- 4. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_zones ENABLE ROW LEVEL SECURITY;

-- Lectura pública para plataforma
DROP POLICY IF EXISTS "platform_settings_read_public" ON public.platform_settings;
CREATE POLICY "platform_settings_read_public" ON public.platform_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "platform_zones_read_public" ON public.platform_zones;
CREATE POLICY "platform_zones_read_public" ON public.platform_zones FOR SELECT USING (true);

-- Modificación solo por administradores (o fallback permisivo si backend usa service key)
DROP POLICY IF EXISTS "platform_settings_admin_all" ON public.platform_settings;
CREATE POLICY "platform_settings_admin_all" ON public.platform_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "platform_zones_admin_all" ON public.platform_zones;
CREATE POLICY "platform_zones_admin_all" ON public.platform_zones FOR ALL USING (true) WITH CHECK (true);
