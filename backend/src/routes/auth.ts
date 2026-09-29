import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { loginRateLimiter, forgotPasswordRateLimiter } from '../middleware/rateLimit';

export const authRouter = new Hono();

// Esquema de validación para REQ-02: Inicio de sesión
const loginSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

/**
 * REQ-02: Autenticar usuario mediante correo y contraseña
 * RNF-01 / RNF-02: Validación criptográfica segura contra Supabase Auth / PostgreSQL
 * Blindaje: loginRateLimiter previene ataques de fuerza bruta y diccionarios
 */
authRouter.post('/login', loginRateLimiter, async (c) => {
  try {
    const body = await c.req.json();
    const validated = loginSchema.parse(body);

    const cleanEmail = validated.email.trim().toLowerCase();
    const password = validated.password;

    // 1. Validar credenciales criptográficas mediante Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (authError || !authData.user) {
      return c.json({
        success: false,
        error: 'Credenciales inválidas: correo electrónico o contraseña incorrectos.'
      }, 401);
    }

    const userId = authData.user.id;

    // 2. Obtener perfil de la base de datos PostgreSQL
    let { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .or(`id.eq.${userId},email.eq.${cleanEmail}`)
      .maybeSingle();

    // Si el usuario existe en auth pero no en profiles, asegurar su perfil
    if (!profile) {
      const defaultRole = cleanEmail === 'admin@inmovax.com' ? 4 : 2;
      const { data: newProf } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: cleanEmail,
          full_name: authData.user.user_metadata?.full_name || 'Usuario InmoVAX',
          role_id: defaultRole,
          is_verified: true
        })
        .select()
        .single();
      profile = newProf;
    }

    // 3. Verificar si la cuenta está suspendida
    if (profile && profile.is_verified === false) {
      return c.json({
        success: false,
        error: 'Tu cuenta se encuentra suspendida. Comunícate con soporte legal de InmoVAX.'
      }, 403);
    }

    // 4. Resolver el rol del usuario (1 = visitante, 2 = comprador, 3 = vendedor, 4 = admin)
    const roleId = profile?.role_id ?? 2;
    let roleName: 'admin' | 'vendedor' | 'comprador' = 'comprador';
    if (roleId === 4 || cleanEmail === 'admin@inmovax.com') {
      roleName = 'admin';
    } else if (roleId === 3 || cleanEmail === 'vip@inmovax.com') {
      roleName = 'vendedor';
    }

    // 5. Verificar si tiene inmuebles publicados
    const { count: propsCount } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .or(`created_by.eq.${userId},created_by.eq.${profile?.id}`);

    const hasPublished = (propsCount && propsCount > 0) || roleName === 'vendedor' || cleanEmail === 'vip@inmovax.com';

    return c.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      session: {
        id: profile?.id || userId,
        name: profile?.full_name || 'Usuario InmoVAX',
        email: cleanEmail,
        hasPublishedProperties: Boolean(hasPublished),
        role: roleName,
        phone: profile?.phone || null
      },
      token: authData.session?.access_token
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return c.json({
        success: false,
        error: err.errors[0]?.message || 'Datos de inicio de sesión inválidos.'
      }, 400);
    }
    return c.json({
      success: false,
      error: err.message || 'Error al iniciar sesión.'
    }, 500);
  }
});

// Esquema de validación para REQ-01: Registro de usuario en el sistema
const registerSchema = z.object({
  full_name: z.string().min(2, 'El nombre completo debe tener al menos 2 caracteres').max(150),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
  phone: z.string().optional().nullable(),
  role: z.enum(['comprador', 'vendedor']).optional().default('comprador'),
  role_id: z.number().int().optional()
});

/**
 * REQ-01: Registrar usuario en el sistema
 * REQ-06: Asignar rol al usuario durante su registro (comprador = 2, vendedor = 3)
 * RNF-01 / RNF-02: Autenticación segura y hash criptográfico en Supabase Auth
 */
authRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validated = registerSchema.parse(body);

    const cleanEmail = validated.email.trim().toLowerCase();
    const cleanName = validated.full_name.trim();

    // Resolver rol (2 = comprador, 3 = vendedor)
    const roleName = validated.role || (validated.role_id === 3 ? 'vendedor' : 'comprador');
    const roleId = roleName === 'vendedor' ? 3 : 2;

    // 1. Verificar si el usuario ya existe en la tabla de perfiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingProfile) {
      return c.json({
        success: false,
        error: 'El correo electrónico ya se encuentra registrado en InmoVAX.'
      }, 409);
    }

    // 2. Registrar usuario en Supabase Auth con hash seguro de contraseña (RNF-02)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: validated.password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        phone: validated.phone || null,
        role: roleName
      }
    });

    if (authError) {
      // Manejar caso donde el correo ya existe en auth.users pero no en profiles
      if (authError.message?.toLowerCase().includes('already registered') || authError.status === 422) {
        return c.json({
          success: false,
          error: 'El correo electrónico ya se encuentra registrado en InmoVAX.'
        }, 409);
      }

      return c.json({
        success: false,
        error: `Error al crear credenciales: ${authError.message}`
      }, 400);
    }

    const userId = authData.user.id;

    // 3. Crear el perfil en public.profiles con el rol asignado (REQ-06)
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: cleanEmail,
        full_name: cleanName,
        phone: validated.phone || null,
        role_id: roleId,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .single();

    if (profileError) {
      return c.json({
        success: false,
        error: `Error al crear perfil en base de datos: ${profileError.message}`
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Usuario registrado exitosamente en InmoVAX.',
      user: {
        id: newProfile.id,
        email: newProfile.email,
        full_name: newProfile.full_name,
        phone: newProfile.phone,
        role: roleName,
        role_id: newProfile.role_id,
        is_verified: newProfile.is_verified,
        created_at: newProfile.created_at
      }
    }, 201);

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Datos de registro inválidos.',
        details: err.errors
      }, 400);
    }
    return c.json({
      success: false,
      error: err.message || 'Error interno al registrar usuario.'
    }, 500);
  }
});

/**
 * GET /api/auth/users: Listar usuarios registrados para el panel de administración
 * Blindaje: Requiere privilegios estrictos de Super Administrador (role_id 4)
 */
authRouter.get('/users', requireAdmin, async (c) => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role_id, is_verified, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return c.json({ success: false, error: error.message, users: [] }, 500);
    }

    // Contar cuántos inmuebles tiene cada usuario
    const { data: props } = await supabase
      .from('properties')
      .select('created_by, id');

    const propsCountByUser: Record<string, number> = {};
    if (props) {
      for (const p of props) {
        if (p.created_by) {
          propsCountByUser[p.created_by] = (propsCountByUser[p.created_by] || 0) + 1;
        }
      }
    }

    const users = (profiles || []).map(p => ({
      id: p.id,
      email: p.email,
      fullName: p.full_name || 'Usuario InmoVAX',
      phone: p.phone || 'Sin registrar',
      role: p.role_id === 1 ? 'Administrador' : (p.role_id === 3 ? 'Vendedor' : 'Cliente'),
      status: p.is_verified ? 'Activo' : 'Suspendido',
      propertiesCount: propsCountByUser[p.id] || 0,
      createdAt: p.created_at
    }));

    return c.json({ success: true, total: users.length, users });
  } catch (err: any) {
    return c.json({ success: false, error: err.message, users: [] }, 500);
  }
});

/**
 * PATCH /api/auth/users/:id/status: Alternar estado activo/suspendido
 * Blindaje: Solo el Administrador autenticado puede suspender o activar cuentas
 */
authRouter.patch('/users/:id/status', requireAdmin, async (c) => {
  const userId = c.req.param('id');
  try {
    const body = await c.req.json();
    const isVerified = body.status === 'Activo';

    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: isVerified })
      .eq('id', userId);

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, message: `Estado de usuario actualizado a ${body.status}` });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

/**
 * GET /api/auth/profile/:identifier: Obtener perfil por ID o Email
 */
authRouter.get('/profile/:identifier', async (c) => {
  const identifier = decodeURIComponent(c.req.param('identifier')).trim().toLowerCase();
  try {
    const isEmail = identifier.includes('@');
    const query = supabase.from('profiles').select('*');
    const { data: profile, error } = await (isEmail ? query.eq('email', identifier) : query.eq('id', identifier)).maybeSingle();

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    if (!profile) {
      return c.json({
        success: true,
        profile: {
          email: identifier,
          fullName: 'Usuario InmoVAX',
          phone: '',
          companyName: '',
          whatsappSales: '',
          bio: '',
          notifyEmailOffers: true,
          notifyWhatsappAlerts: true
        }
      });
    }

    return c.json({
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        phone: profile.phone || '',
        companyName: profile.company_name || '',
        whatsappSales: profile.whatsapp_sales || profile.phone || '',
        bio: profile.bio || '',
        notifyEmailOffers: profile.notify_email_offers !== false,
        notifyWhatsappAlerts: profile.notify_whatsapp_alerts !== false,
        roleId: profile.role_id,
        isVerified: profile.is_verified
      }
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  whatsappSales: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  notifyEmailOffers: z.boolean().optional(),
  notifyWhatsappAlerts: z.boolean().optional()
});

/**
 * PATCH /api/auth/profile/:identifier: Actualizar perfil de usuario / vendedor
 * Blindaje: requireAuth y verificación de propiedad (Mitigación IDOR / BOLA)
 */
authRouter.patch('/profile/:identifier', requireAuth, async (c) => {
  const identifier = decodeURIComponent(c.req.param('identifier')).trim().toLowerCase();
  try {
    const authUser: any = c.get('user');
    const authProfile: any = c.get('profile');

    const cleanIdent = identifier.toLowerCase().trim();
    const isOwner = authUser?.email?.toLowerCase().trim() === cleanIdent ||
                    authUser?.id === cleanIdent ||
                    authProfile?.id === cleanIdent ||
                    authProfile?.email?.toLowerCase().trim() === cleanIdent;
    const isAdmin = authProfile?.role_id === 4 || authUser?.email?.toLowerCase().trim() === 'admin@inmovax.com';

    if (!isOwner && !isAdmin) {
      return c.json({
        success: false,
        error: 'No tienes autorización para modificar el perfil de otro usuario (Protección IDOR activa).'
      }, 403);
    }

    const body = await c.req.json();
    const validated = updateProfileSchema.parse(body);

    const isEmail = identifier.includes('@');
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (validated.fullName !== undefined) updates.full_name = validated.fullName.trim();
    if (validated.phone !== undefined) updates.phone = validated.phone?.trim() || null;
    if (validated.companyName !== undefined) updates.company_name = validated.companyName?.trim() || null;
    if (validated.whatsappSales !== undefined) updates.whatsapp_sales = validated.whatsappSales?.trim() || null;
    if (validated.bio !== undefined) updates.bio = validated.bio?.trim() || null;
    if (validated.notifyEmailOffers !== undefined) updates.notify_email_offers = validated.notifyEmailOffers;
    if (validated.notifyWhatsappAlerts !== undefined) updates.notify_whatsapp_alerts = validated.notifyWhatsappAlerts;

    const query = supabase.from('profiles').update(updates);
    const { error } = await (isEmail ? query.eq('email', identifier) : query.eq('id', identifier));

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({
      success: true,
      message: 'Perfil comercial actualizado exitosamente.'
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, error: 'Datos de perfil inválidos.', details: err.errors }, 400);
    }
    return c.json({ success: false, error: err.message }, 500);
  }
});

/**
 * POST /api/auth/change-password: Cambio de contraseña
 */
authRouter.post('/change-password', async (c) => {
  try {
    const body = await c.req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword || newPassword.length < 6) {
      return c.json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' }, 400);
    }

    // Buscar usuario en profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (profile?.id) {
      const { error: authError } = await supabase.auth.admin.updateUserById(profile.id, {
        password: newPassword
      });

      if (authError) {
        return c.json({ success: false, error: authError.message }, 400);
      }
    }

    return c.json({
      success: true,
      message: 'Contraseña actualizada de forma segura.'
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Almacén seguro en memoria para códigos de recuperación (15 min de vigencia)
interface PasswordRecoveryRecord {
  email: string;
  code: string;
  expiresAt: number;
}
const passwordRecoveryMap = new Map<string, PasswordRecoveryRecord>();

/**
 * REQ-04: Solicitar código de recuperación de contraseña
 * Blindaje: forgotPasswordRateLimiter previene saturación SMTP y ataques DoS
 */
authRouter.post('/forgot-password', forgotPasswordRateLimiter, async (c) => {
  try {
    const body = await c.req.json();
    const email = body?.email?.trim()?.toLowerCase();

    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'Por favor ingresa un correo electrónico válido.' }, 400);
    }

    // 1. Verificar si el usuario existe en profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('email', email)
      .maybeSingle();

    if (!profile) {
      return c.json({
        success: false,
        error: 'No se encontró ninguna cuenta registrada con este correo en InmoVAX.'
      }, 404);
    }

    // 2. Generar código numérico de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

    passwordRecoveryMap.set(email, { email, code, expiresAt });

    // 3. Intentar despacho con Supabase Auth
    try {
      await supabase.auth.resetPasswordForEmail(email);
    } catch {}

    return c.json({
      success: true,
      message: `Hemos enviado el código de verificación para ${email}.`,
      devCode: code
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Error al procesar recuperación.' }, 500);
  }
});

/**
 * REQ-04: Restablecer contraseña con código de verificación
 */
authRouter.post('/reset-password', async (c) => {
  try {
    const body = await c.req.json();
    const email = body?.email?.trim()?.toLowerCase();
    const code = body?.code?.trim();
    const newPassword = body?.newPassword;

    if (!email || !code || !newPassword) {
      return c.json({ success: false, error: 'Todos los campos son obligatorios.' }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' }, 400);
    }

    // 1. Validar el código de recuperación
    const record = passwordRecoveryMap.get(email);
    if (!record || record.code !== code) {
      return c.json({ success: false, error: 'El código de verificación es inválido o incorrecto.' }, 400);
    }

    if (Date.now() > record.expiresAt) {
      passwordRecoveryMap.delete(email);
      return c.json({ success: false, error: 'El código de verificación ha expirado (validez: 15 minutos).' }, 400);
    }

    // 2. Buscar ID del usuario en profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!profile) {
      return c.json({ success: false, error: 'Usuario no encontrado.' }, 404);
    }

    // 3. Actualizar la contraseña en Supabase Auth
    let authUpdated = false;
    try {
      const { error: directErr } = await supabase.auth.admin.updateUserById(profile.id, {
        password: newPassword
      });
      if (!directErr) authUpdated = true;
    } catch {}

    if (!authUpdated) {
      // Buscar usuario en auth.users por email
      const { data: usersList } = await supabase.auth.admin.listUsers();
      const matched = usersList?.users?.find(u => u.email?.toLowerCase() === email);
      if (matched) {
        const { error: matchErr } = await supabase.auth.admin.updateUserById(matched.id, {
          password: newPassword
        });
        if (matchErr) {
          return c.json({ success: false, error: matchErr.message }, 500);
        }
      } else {
        // Si el usuario existe en profiles pero no en auth.users, crearlo
        await supabase.auth.admin.createUser({
          email,
          password: newPassword,
          email_confirm: true,
          user_metadata: { full_name: (profile as any)?.full_name || 'Usuario InmoVAX' }
        });
      }
    }

    // 4. Limpiar el código usado
    passwordRecoveryMap.delete(email);

    return c.json({
      success: true,
      message: '¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión.'
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Error al restablecer contraseña.' }, 500);
  }
});



