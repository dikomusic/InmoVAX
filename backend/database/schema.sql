-- ==============================================================================
-- INMOVAX DATABASE SCHEMA (PostgreSQL / Supabase)
-- Normalización: 3NF (Tercera Forma Normal)
-- Seguridad: Row Level Security (RLS) + Triggers de Auditoría Inmutable
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE ROLES DEL SISTEMA (Catálogo)
CREATE TABLE IF NOT EXISTS public.roles (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.roles (id, name, description) VALUES
(1, 'visitante', 'Usuario anónimo o sin publicaciones activas que solo explora'),
(2, 'comprador', 'Usuario con cuenta activa para consultar y guardar favoritos (0 inmuebles)'),
(3, 'vendedor', 'Usuario propietario con 1 o más inmuebles publicados y acceso al portal'),
(4, 'admin', 'Administrador de plataforma y auditor legal de Folios Reales')
ON CONFLICT (id) DO NOTHING;

-- 3. PERFILES DE USUARIO (Sincronizado con Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Mapea a auth.users.id
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    role_id SMALLINT NOT NULL DEFAULT 2 REFERENCES public.roles(id),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role_id);

-- 4. CATÁLOGOS INMUTABLES DE INMUEBLES
CREATE TABLE IF NOT EXISTS public.property_types (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO public.property_types (id, name) VALUES
(1, 'Anticrético'),
(2, 'Venta'),
(3, 'Alquiler')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.property_statuses (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(40) UNIQUE NOT NULL
);

INSERT INTO public.property_statuses (id, name) VALUES
(1, 'Activo'),
(2, 'En Validación Legal'),
(3, 'Pausado'),
(4, 'Cerrado')
ON CONFLICT (id) DO NOTHING;

-- 5. ASESORES OFICIALES CERTIFICADOS
CREATE TABLE IF NOT EXISTS public.advisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) UNIQUE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA PRINCIPAL DE INMUEBLES (Normalizada)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    advisor_id UUID REFERENCES public.advisors(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    zone VARCHAR(100) NOT NULL,
    city VARCHAR(50) DEFAULT 'La Paz',
    address TEXT,
    type_id SMALLINT NOT NULL REFERENCES public.property_types(id),
    status_id SMALLINT NOT NULL DEFAULT 2 REFERENCES public.property_statuses(id),
    price_amount NUMERIC(12, 2) NOT NULL CHECK (price_amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'BOB')),
    folio_real VARCHAR(40) NOT NULL UNIQUE,
    bedrooms SMALLINT DEFAULT 0 CHECK (bedrooms >= 0),
    bathrooms SMALLINT DEFAULT 0 CHECK (bathrooms >= 0),
    area_sqm NUMERIC(8, 2) NOT NULL CHECK (area_sqm > 0),
    category VARCHAR(40) DEFAULT 'Departamento',
    is_negotiable BOOLEAN DEFAULT FALSE,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    land_area_sqm NUMERIC(8, 2),
    parking_spots SMALLINT DEFAULT 0 CHECK (parking_spots >= 0),
    amenities TEXT[] DEFAULT '{}',
    views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
    inquiries_count INTEGER DEFAULT 0 CHECK (inquiries_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type_id);
CREATE INDEX IF NOT EXISTS idx_properties_folio ON public.properties(folio_real);
CREATE INDEX IF NOT EXISTS idx_properties_zone ON public.properties(zone);

-- 7. GALERÍA DE IMÁGENES DE INMUEBLES
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_cover BOOLEAN DEFAULT FALSE,
    display_order SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_images_prop ON public.property_images(property_id);

-- 8. OFERTAS Y NEGOCIACIONES COMERCIALES
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(30) NOT NULL,
    offer_amount NUMERIC(12, 2) NOT NULL CHECK (offer_amount > 0),
    initial_price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'BOB')),
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Aceptada', 'Contraofertada', 'Rechazada')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offers_property ON public.offers(property_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer ON public.offers(buyer_id);

-- 9. AGENDA DE VISITAS PRESENCIALES
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    advisor_id UUID NOT NULL REFERENCES public.advisors(id),
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(30) NOT NULL,
    visit_date DATE NOT NULL,
    time_slot VARCHAR(15) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Confirmada' CHECK (status IN ('Confirmada', 'Realizada', 'Reprogramada')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_prop ON public.appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_advisor ON public.appointments(advisor_id);

-- 10. FAVORITOS GUARDADOS
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, property_id)
);

-- 11. AUDITORÍA JURÍDICA Y EXPEDIENTES DE DERECHOS REALES
CREATE TABLE IF NOT EXISTS public.legal_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    doc_type VARCHAR(60) NOT NULL,
    folio_real VARCHAR(40) NOT NULL,
    alodial_status VARCHAR(60) NOT NULL DEFAULT 'Libre de Gravamen',
    verified_by VARCHAR(150) DEFAULT 'InmoVAX Legal DDRR',
    verification_date DATE NOT NULL DEFAULT CURRENT_DATE,
    legal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_audits_prop ON public.legal_audits(property_id);

-- 12. TABLA INMUTABLE DE AUDITORÍA GENERAL (Append-Only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action VARCHAR(60) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(60) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON public.audit_logs(created_at);

-- INMUTABILIDAD DE AUDITORÍA: Nadie puede actualizar ni borrar auditorías
REVOKE UPDATE, DELETE, TRUNCATE ON public.audit_logs FROM public, anon, authenticated;

-- ==============================================================================
-- TRIGGERS DE SEGURIDAD Y TIMESTAMP
-- ==============================================================================

-- Trigger 1: Actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_profiles_updated_at ON public.profiles;
CREATE TRIGGER tg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tg_properties_updated_at ON public.properties;
CREATE TRIGGER tg_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tg_offers_updated_at ON public.offers;
CREATE TRIGGER tg_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger 2: Auditoría automática en properties
CREATE OR REPLACE FUNCTION public.audit_properties_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_changed_fields TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Intentar obtener el user_id autenticado de Supabase Auth
    BEGIN
        v_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
    END;

    IF (TG_OP = 'UPDATE') THEN
        IF OLD.price_amount <> NEW.price_amount THEN
            v_changed_fields := array_append(v_changed_fields, 'price_amount');
        END IF;
        IF OLD.status_id <> NEW.status_id THEN
            v_changed_fields := array_append(v_changed_fields, 'status_id');
        END IF;
        IF OLD.title <> NEW.title THEN
            v_changed_fields := array_append(v_changed_fields, 'title');
        END IF;
        IF OLD.zone <> NEW.zone THEN
            v_changed_fields := array_append(v_changed_fields, 'zone');
        END IF;

        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data, changed_fields)
        VALUES (COALESCE(v_user_id, NEW.user_id), 'UPDATE_PROPERTY', 'properties', NEW.id::text, to_jsonb(OLD), to_jsonb(NEW), v_changed_fields);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data, changed_fields)
        VALUES (COALESCE(v_user_id, OLD.user_id), 'DELETE_PROPERTY', 'properties', OLD.id::text, to_jsonb(OLD), NULL, ARRAY['ALL']);
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data, changed_fields)
        VALUES (COALESCE(v_user_id, NEW.user_id), 'CREATE_PROPERTY', 'properties', NEW.id::text, NULL, to_jsonb(NEW), ARRAY['ALL']);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_audit_properties ON public.properties;
CREATE TRIGGER tg_audit_properties
AFTER INSERT OR UPDATE OR DELETE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.audit_properties_changes();

-- ==============================================================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Lectura pública, modificación solo del dueño
CREATE POLICY "Profiles son legibles por todos" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Properties:
-- Catálogo público lee inmuebles Activos
CREATE POLICY "Propiedades activas son públicas" ON public.properties FOR SELECT USING (
    status_id = 1 OR auth.uid() = user_id
);
-- Vendedores solo insertan sus propiedades
CREATE POLICY "Vendedores crean sus propiedades" ON public.properties FOR INSERT WITH CHECK (
    auth.uid() = user_id
);
-- Vendedores solo modifican sus propiedades
CREATE POLICY "Vendedores modifican sus propiedades" ON public.properties FOR UPDATE USING (
    auth.uid() = user_id
);
-- Vendedores solo eliminan sus propiedades
CREATE POLICY "Vendedores eliminan sus propiedades" ON public.properties FOR DELETE USING (
    auth.uid() = user_id
);

-- 3. Property Images:
CREATE POLICY "Imágenes de propiedades son públicas" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Vendedores gestionan imágenes de sus propiedades" ON public.property_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.user_id = auth.uid())
);

-- 4. Offers:
CREATE POLICY "Ofertas son visibles por el comprador o por el vendedor del inmueble" ON public.offers FOR SELECT USING (
    auth.uid() = buyer_id OR
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.user_id = auth.uid())
);
CREATE POLICY "Compradores pueden enviar ofertas" ON public.offers FOR INSERT WITH CHECK (
    auth.uid() = buyer_id OR auth.uid() IS NOT NULL
);
CREATE POLICY "Vendedor o comprador pueden actualizar estado de oferta" ON public.offers FOR UPDATE USING (
    auth.uid() = buyer_id OR
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.user_id = auth.uid())
);

-- 5. Appointments:
CREATE POLICY "Citas visibles por participantes" ON public.appointments FOR SELECT USING (
    auth.uid() = client_id OR
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.user_id = auth.uid())
);

-- 6. Favorites:
CREATE POLICY "Usuarios ven sus propios favoritos" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios gestionan sus favoritos" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- 7. Audit logs:
CREATE POLICY "Solo administradores ven registros de auditoría" ON public.audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 4)
);

-- ==============================================================================
-- SEED DATA (Datos Iniciales de Prueba)
-- ==============================================================================

-- Asesores de prueba
INSERT INTO public.advisors (id, full_name, phone, email, license_number) VALUES
('a0000000-0000-0000-0000-000000000001', 'Lic. Carlos Vega', '+591 77201928', 'carlos.vega@inmovax.com', 'DDRR-ADV-2024-001'),
('a0000000-0000-0000-0000-000000000002', 'Lic. Mariana Ríos', '+591 76543219', 'mariana.rios@inmovax.com', 'DDRR-ADV-2024-002')
ON CONFLICT (id) DO NOTHING;

-- Perfiles de prueba (UUIDs deterministas para pruebas iniciales)
-- Arq. Gonzalo Benítez (Vendedor con 4 publicaciones)
INSERT INTO public.profiles (id, email, full_name, phone, role_id, is_verified) VALUES
('b0000000-0000-0000-0000-000000000001', 'vendedor@inmovax.com', 'Arq. Gonzalo Benítez', '+591 71234567', 3, TRUE),
('b0000000-0000-0000-0000-000000000002', 'comprador@inmovax.com', 'Carlos Mendoza', '+591 78901234', 2, TRUE),
('b0000000-0000-0000-0000-000000000003', 'admin@inmovax.com', 'Super Administrador InmoVAX', '+591 70000000', 4, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Inmuebles de prueba para Gonzalo Benítez
INSERT INTO public.properties (
    id, code, user_id, advisor_id, title, description, zone, city, type_id, status_id, price_amount, currency, folio_real, bedrooms, bathrooms, area_sqm, views_count, inquiries_count
) VALUES
(
    'c0000000-0000-0000-0000-000000000001', 'PROP-101', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    'Departamento de Lujo con Terraza Panorámica', 'Espectacular departamento en zona exclusiva con finos acabados y vista inigualable.',
    'Sopocachi, La Paz', 'La Paz', 1, 1, 45000.00, 'USD', '2.01.0.99.0018472', 3, 2, 140.00, 312, 18
),
(
    'c0000000-0000-0000-0000-000000000002', 'PROP-102', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
    'Penthouse Exclusivo con Vista al Illimani', 'Penthouse de alta gama con terraza privada, parrilla y doble parqueo cubierto.',
    'Calacoto, La Paz', 'La Paz', 1, 2, 75000.00, 'USD', '2.01.1.05.0083719', 4, 4, 220.00, 184, 9
),
(
    'c0000000-0000-0000-0000-000000000003', 'PROP-103', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
    'Casa Minimalista con Jardín y Parrillero', 'Casa estilo contemporáneo con jardín amplio, seguridad 24 horas y paneles solares.',
    'Achumani, La Paz', 'La Paz', 2, 1, 185000.00, 'USD', '2.01.2.14.0041289', 4, 3, 310.00, 420, 24
),
(
    'c0000000-0000-0000-0000-000000000004', 'PROP-104', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
    'Oficina Comercial Corporativa Torre Titanium', 'Oficina en piso alto lista para ocupar, con salas de reuniones y divisiones en vidrio templado.',
    'Miraflores, La Paz', 'La Paz', 3, 1, 4500.00, 'BOB', '2.01.3.22.0019582', 1, 2, 95.00, 95, 6
)
ON CONFLICT (id) DO NOTHING;

-- Imágenes de los inmuebles
INSERT INTO public.property_images (property_id, image_url, is_cover, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop', TRUE, 1),
('c0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop', TRUE, 1),
('c0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop', TRUE, 1),
('c0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', TRUE, 1)
ON CONFLICT (id) DO NOTHING;

-- Auditorías Jurídicas DDRR
INSERT INTO public.legal_audits (property_id, doc_type, folio_real, alodial_status, verified_by, legal_notes) VALUES
('c0000000-0000-0000-0000-000000000001', 'Folio Real Matrícula DDRR', '2.01.0.99.0018472', 'Auditado & Vigente', 'Dra. Patricia Soliz (Notaría 45)', 'Folio computarizado sin gravámenes vigentes.'),
('c0000000-0000-0000-0000-000000000002', 'Certificado Alodial', '2.01.1.05.0083719', 'En Validación Notarial', 'Dr. Carlos Vega (Asesor InmoVAX)', 'Trámite de protocolización de minuta.')
ON CONFLICT (id) DO NOTHING;

-- Ofertas iniciales
INSERT INTO public.offers (property_id, buyer_name, buyer_phone, offer_amount, initial_price, currency, message, status) VALUES
(
    'c0000000-0000-0000-0000-000000000001', 'Dr. Marcelo Zeballos', '+591 77201928', 42000.00, 45000.00, 'USD',
    'Buen día Arq. Gonzalo, tengo el capital disponible en dólares efectivo para firma notarial inmediata este fin de semana.', 'Pendiente'
),
(
    'c0000000-0000-0000-0000-000000000002', 'Lic. Andrea Tapia', '+591 71203948', 70000.00, 75000.00, 'USD',
    'Estimado, solicito coordinar visita presencial con su asesor Carlos Vega y propongo $us 70,000 por 2 años.', 'Pendiente'
)
ON CONFLICT (id) DO NOTHING;

-- Citas iniciales
INSERT INTO public.appointments (property_id, advisor_id, client_name, client_phone, visit_date, time_slot, status) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Dr. Marcelo Zeballos', '+591 77201928', CURRENT_DATE, '16:00', 'Confirmada'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Lic. Andrea Tapia', '+591 71203948', CURRENT_DATE + INTERVAL '1 day', '11:30', 'Confirmada')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 13. CONSULTAS Y MENSAJERÍA P2P DIRECTA COMPRADOR <-> VENDEDOR (REQ-34)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consultations (
    id TEXT PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    property_title VARCHAR(200) NOT NULL,
    property_location VARCHAR(150),
    property_price VARCHAR(50),
    property_image TEXT,
    property_href TEXT,
    seller_email VARCHAR(255) NOT NULL,
    seller_name VARCHAR(150),
    buyer_email VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'respondido')),
    last_message TEXT NOT NULL,
    unread_by_seller INTEGER DEFAULT 1 CHECK (unread_by_seller >= 0),
    unread_by_buyer INTEGER DEFAULT 0 CHECK (unread_by_buyer >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.consultation_messages (
    id TEXT PRIMARY KEY,
    consultation_id TEXT NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('comprador', 'vendedor')),
    text TEXT NOT NULL,
    timestamp VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_seller ON public.consultations(seller_email);
CREATE INDEX IF NOT EXISTS idx_consultations_buyer ON public.consultations(buyer_email);
CREATE INDEX IF NOT EXISTS idx_consultations_property ON public.consultations(property_id);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_cons ON public.consultation_messages(consultation_id);

-- Políticas de Seguridad RLS en Supabase
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consultations_access" ON public.consultations;
CREATE POLICY "consultations_access" ON public.consultations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "consultation_messages_access" ON public.consultation_messages;
CREATE POLICY "consultation_messages_access" ON public.consultation_messages FOR ALL USING (true) WITH CHECK (true);


