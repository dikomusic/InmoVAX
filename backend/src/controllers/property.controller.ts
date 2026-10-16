/**
 * Controlador de Inmuebles y Propiedades
 * InmoVAX Backend - Patrón Controlador (Capa de Presentación / HTTP)
 */

import { Context } from 'hono';
import { z } from 'zod';
import { PropertyService } from '../services/property.service';
import { propertyInputSchema, propertyUpdateSchema } from '../models/property.model';
import { UserRepository } from '../repositories/user.repository';
import { supabase } from '../config/supabase';

export class PropertyController {
  /**
   * GET /api/properties: Listar inmuebles disponibles con filtros
   */
  static async getProperties(c: Context) {
    const type = c.req.query('type');
    const zone = c.req.query('zone');
    const q = c.req.query('q');
    const status = c.req.query('status');

    try {
      const properties = await PropertyService.listProperties({ type, zone, q, status });
      return c.json({
        source: 'supabase-postgresql',
        total: properties.length,
        properties
      });
    } catch (err: any) {
      return c.json({ source: 'supabase-error', total: 0, properties: [] });
    }
  }

  /**
   * GET /api/properties/:id: Detalle individual de un inmueble
   */
  static async getPropertyById(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const property = await PropertyService.getPropertyById(id);
      if (!property) {
        return c.json({ success: false, error: 'Inmueble no encontrado en la base de datos' }, 404);
      }
      return c.json({
        success: true,
        source: 'supabase-postgresql',
        property
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message }, 500);
    }
  }

  /**
   * GET /api/properties/seller/:email: Inmuebles de un vendedor
   */
  static async getSellerProperties(c: Context) {
    const email = decodeURIComponent(c.req.param('email') || '').toLowerCase().trim();
    try {
      const properties = await PropertyService.getSellerProperties(email);
      return c.json({
        source: 'supabase-postgresql',
        sellerEmail: email,
        total: properties.length,
        properties
      });
    } catch (err: any) {
      return c.json({ source: 'supabase-postgresql', sellerEmail: email, total: 0, properties: [] });
    }
  }

  /**
   * POST /api/properties: Registrar nuevo inmueble
   */
  static async createProperty(c: Context) {
    try {
      const body = await c.req.json();
      const validated = propertyInputSchema.parse(body);
      const property = await PropertyService.createProperty(validated);

      return c.json({
        success: true,
        message: 'Inmueble registrado exitosamente en Supabase para auditoría legal con Folio Real',
        property
      }, 201);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Validación fallida', details: err.errors }, 400);
      }
      return c.json({ success: false, error: err.message || 'Error al procesar el inmueble' }, 400);
    }
  }

  /**
   * POST /api/properties/upload: Subir imagen a Supabase Storage
   */
  static async uploadImage(c: Context) {
    try {
      const body = await c.req.parseBody();
      const file = body['file'];
      if (!file || !(file instanceof File)) {
        return c.json({ success: false, error: 'No file provided' }, 400);
      }

      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1000)}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
        });

      if (error) {
        return c.json({ success: false, error: error.message }, 500);
      }

      const { data: publicUrlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return c.json({ success: true, url: publicUrlData.publicUrl });
    } catch (err: any) {
      return c.json({ success: false, error: String(err) }, 500);
    }
  }

  /**
   * PATCH /api/properties/:id/toggle-pause: Pausar o Reactivar inmueble
   */
  static async togglePause(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const nextStatusText = await PropertyService.togglePause(id);
      return c.json({
        success: true,
        message: `Inmueble cambiado a estado: ${nextStatusText}`,
        status: nextStatusText
      });
    } catch (err: any) {
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message }, status);
    }
  }

  /**
   * PATCH /api/properties/:id/status: Actualizar estado de aprobación
   */
  static async updateStatus(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const body = await c.req.json();
      const targetStatus = body.status || 'Activo';
      const result = await PropertyService.updateStatus(id, targetStatus);

      return c.json({
        success: true,
        message: `Inmueble actualizado exitosamente a: ${result.status}`,
        status: result.status,
        statusId: result.statusId
      });
    } catch (err: any) {
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message || 'Error al actualizar estado' }, status);
    }
  }

  /**
   * PATCH /api/properties/:id: REQ-13 - Editar información de un inmueble publicado
   */
  static async updateProperty(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const body = await c.req.json();
      const validated = propertyUpdateSchema.parse(body);
      const property = await PropertyService.updateProperty(id, validated);

      return c.json({
        success: true,
        message: 'Inmueble actualizado exitosamente en Supabase PostgreSQL',
        property
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Validación fallida', details: err.errors }, 400);
      }
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message || 'Error al actualizar inmueble' }, status);
    }
  }

  /**
   * DELETE /api/properties/:id: Eliminar publicación
   */
  static async deleteProperty(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const result = await PropertyService.deleteProperty(id);
      return c.json({
        success: true,
        message: `Publicación "${result.title}" eliminada con éxito de Supabase`,
        deletedId: result.id
      });
    } catch (err: any) {
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message }, status);
    }
  }

  /**
   * POST /api/properties/register-profile: Sincronizar perfil de usuario
   */
  static async registerProfile(c: Context) {
    try {
      const body = await c.req.json();
      const email = body.email;
      if (!email) {
        return c.json({ success: false, error: 'Email requerido' }, 400);
      }

      const emailLower = email.toLowerCase().trim();
      const existing = await UserRepository.findByEmail(emailLower);
      if (existing) {
        return c.json({ success: true, profile: existing, message: 'Usuario ya existente' });
      }

      const newUserId = crypto.randomUUID();
      const { data: inserted, error } = await UserRepository.upsertProfile({
        id: newUserId,
        email: emailLower,
        full_name: body.full_name || emailLower.split('@')[0],
        phone: body.phone || null,
        role_id: body.role_id || 2,
        is_verified: true
      });

      if (error) {
        return c.json({ success: false, error: error.message }, 500);
      }

      return c.json({ success: true, profile: inserted, message: 'Perfil registrado en Supabase' });
    } catch (err: any) {
      return c.json({ success: false, error: String(err) }, 500);
    }
  }
}
