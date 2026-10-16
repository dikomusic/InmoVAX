/**
 * Rutas de Inmuebles y Propiedades
 * InmoVAX Backend - Enrutador Delgado (Delegación a Controladores)
 */

import { Hono } from 'hono';
import { PropertyController } from '../controllers/property.controller';

export const propertiesRouter = new Hono();

// Catálogo y Búsqueda
propertiesRouter.get('/', PropertyController.getProperties);
propertiesRouter.get('/seller/:email', PropertyController.getSellerProperties);
propertiesRouter.get('/:id', PropertyController.getPropertyById);

// Publicación y Carga de Archivos
propertiesRouter.post('/', PropertyController.createProperty);
propertiesRouter.post('/upload', PropertyController.uploadImage);
propertiesRouter.post('/register-profile', PropertyController.registerProfile);

// Gestión y Auditoría
propertiesRouter.patch('/:id/toggle-pause', PropertyController.togglePause);
propertiesRouter.patch('/:id/status', PropertyController.updateStatus);
propertiesRouter.patch('/:id', PropertyController.updateProperty);
propertiesRouter.delete('/:id', PropertyController.deleteProperty);
