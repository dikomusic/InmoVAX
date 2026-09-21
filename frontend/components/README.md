# Atomic Design

La interfaz se organiza en cuatro niveles:

- `atoms`: controles visuales indivisibles y sin lógica de negocio (`Button`, `Input`, `Select`, `Textarea`, `Badge`).
- `molecules`: combinaciones pequeñas y reutilizables (`FormField`, `PropertyStats`, `PriceRangeField`, `SearchModeTabs`).
- `organisms`: bloques completos con comportamiento propio (`Navbar`, `LoginForm`, `PropertyCard`, paneles y formularios).
- `templates`: estructuras de página que definen composición y espaciado (`PublicSplitTemplate`).

## Reglas

1. Las páginas dentro de `app` componen templates y organisms; no deben duplicar estilos de controles.
2. Los atoms no conocen rutas, APIs ni datos de dominio.
3. Las molecules reciben datos y callbacks por props; no deben depender de una página concreta.
4. Los organisms pueden manejar estado de interacción, pero delegan controles visuales en atoms y molecules.
5. Antes de crear un control nuevo, buscar primero una primitive existente y extenderla sólo si el contrato sigue siendo genérico.

La migración inicial cubre el buscador de portada, las páginas de contacto y empleo, el login y las tarjetas de propiedades. Las secciones administrativas y de vendedor todavía contienen formularios inline y deben migrarse por bloques, manteniendo sus callbacks actuales.