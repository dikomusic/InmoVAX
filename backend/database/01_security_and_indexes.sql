-- ==============================================================================
-- INMOVAX: IMPLEMENTACIÓN DE SEGURIDAD RLS, ÍNDICES Y POLÍTICAS DE ALMACENAMIENTO
-- Ejecutar en el SQL Editor de Supabase (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- ==============================================================================
-- 1. ACTIVACIÓN DE ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ==============================================================================
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.legal_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. POLÍTICAS DE SEGURIDAD RLS (IDEMPOTENTES)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- A. TABLA: profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Perfiles lectura publica" ON public.profiles;
CREATE POLICY "Perfiles lectura publica" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Usuarios editan su propio perfil o Admin" ON public.profiles;
CREATE POLICY "Usuarios editan su propio perfil o Admin" 
ON public.profiles FOR UPDATE 
USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 4)
);

DROP POLICY IF EXISTS "Insercion de perfiles autenticados o service" ON public.profiles;
CREATE POLICY "Insercion de perfiles autenticados o service" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- B. TABLA: properties
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Lectura publica de inmuebles activos" ON public.properties;
CREATE POLICY "Lectura publica de inmuebles activos" 
ON public.properties FOR SELECT 
USING (
    status_id IN (1, 2) OR -- Activo o En Validación
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 4)
);

DROP POLICY IF EXISTS "Vendedores y administradores insertan propiedades" ON public.properties;
CREATE POLICY "Vendedores y administradores insertan propiedades" 
ON public.properties FOR INSERT 
WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 4) OR
    auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Vendedores modifican solo sus propiedades" ON public.properties;
CREATE POLICY "Vendedores modifican solo sus propiedades" 
ON public.properties FOR UPDATE 
USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 4) OR
    auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Vendedores eliminan solo sus propiedades" ON public.properties;
CREATE POLICY "Vendedores eliminan solo sus propiedades" 
ON public.properties FOR DELETE 
USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 4) OR
    auth.role() = 'service_role'
);

-- ------------------------------------------------------------------------------
-- C. TABLA: property_images
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Lectura publica de imagenes de inmuebles" ON public.property_images;
CREATE POLICY "Lectura publica de imagenes de inmuebles" 
ON public.property_images FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Gestion de imagenes por propietario o admin" ON public.property_images;
CREATE POLICY "Gestion de imagenes por propietario o admin" 
ON public.property_images FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = property_images.property_id 
        AND (p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles prof WHERE prof.id = auth.uid() AND prof.role_id = 4))
    ) OR
    auth.role() = 'service_role'
);

-- ------------------------------------------------------------------------------
-- D. TABLA: offers
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Visibilidad privada de ofertas" ON public.offers;
CREATE POLICY "Visibilidad privada de ofertas" 
ON public.offers FOR SELECT 
USING (
    auth.uid() = buyer_id OR
    EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = offers.property_id AND p.user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles prof WHERE prof.id = auth.uid() AND prof.role_id = 4) OR
    auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Compradores o usuarios envian ofertas" ON public.offers;
CREATE POLICY "Compradores o usuarios envian ofertas" 
ON public.offers FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizacion de ofertas por partes autorizadas" ON public.offers;
CREATE POLICY "Actualizacion de ofertas por partes autorizadas" 
ON public.offers FOR UPDATE 
USING (
    auth.uid() = buyer_id OR
    EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = offers.property_id AND p.user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles prof WHERE prof.id = auth.uid() AND prof.role_id = 4) OR
    auth.role() = 'service_role'
);

-- ------------------------------------------------------------------------------
-- E. TABLA: appointments
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Visibilidad de citas por participantes o admin" ON public.appointments;
CREATE POLICY "Visibilidad de citas por participantes o admin" 
ON public.appointments FOR SELECT 
USING (
    auth.uid() = client_id OR
    EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = appointments.property_id AND p.user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles prof WHERE prof.id = auth.uid() AND prof.role_id = 4) OR
    auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Creacion de citas para interesados" ON public.appointments;
CREATE POLICY "Creacion de citas para interesados" 
ON public.appointments FOR INSERT 
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- F. TABLA: advisors y legal_audits
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Asesores lectura publica" ON public.advisors;
CREATE POLICY "Asesores lectura publica" 
ON public.advisors FOR SELECT 
USING (is_active = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role_id = 4));

DROP POLICY IF EXISTS "Auditorias legales visibles por admin y propietario" ON public.legal_audits;
CREATE POLICY "Auditorias legales visibles por admin y propietario" 
ON public.legal_audits FOR SELECT 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role_id = 4) OR
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = legal_audits.property_id AND p.user_id = auth.uid()) OR
    auth.role() = 'service_role'
);

-- ==============================================================================
-- 3. ÍNDICES DE ALTO RENDIMIENTO (OPTIMIZACIÓN DE CONSULTAS)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_status_id ON public.properties(status_id);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at_desc ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_zone ON public.properties(zone);
CREATE INDEX IF NOT EXISTS idx_properties_type_id ON public.properties(type_id);
CREATE INDEX IF NOT EXISTS idx_properties_price_amount ON public.properties(price_amount);
CREATE INDEX IF NOT EXISTS idx_properties_folio_real ON public.properties(folio_real);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_offers_property_id ON public.offers(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON public.appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles(role_id);

-- ==============================================================================
-- 4. POLÍTICAS DE SUPABASE STORAGE PARA EL BUCKET: property-images
-- ==============================================================================
-- Lectura pública desde CDN
DROP POLICY IF EXISTS "Imagenes de propiedades publicas en CDN" ON storage.objects;
CREATE POLICY "Imagenes de propiedades publicas en CDN" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-images');

-- Subida controlada de imágenes
DROP POLICY IF EXISTS "Permitir subida de imagenes a usuarios" ON storage.objects;
CREATE POLICY "Permitir subida de imagenes a usuarios" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'property-images' AND
    (auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon')
);

-- Eliminación de imágenes solo por propietarios o administradores
DROP POLICY IF EXISTS "Eliminar imagenes de storage autorizados" ON storage.objects;
CREATE POLICY "Eliminar imagenes de storage autorizados" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'property-images' AND
    (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);
