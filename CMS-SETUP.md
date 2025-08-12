# Configuración del Sistema CMS - FANTEA

## Problema Resuelto

El sistema anterior usaba `localStorage` que causaba problemas de persistencia:
- Los datos no se compartían entre ventanas privadas
- Los datos se perdían al cambiar de contexto
- No había persistencia real de los datos

## Nueva Solución

Se ha implementado un servidor Node.js que:
- Guarda los datos en archivos JSON
- Proporciona una API REST para el CMS
- Mantiene persistencia real de los datos
- Incluye fallback a localStorage si el servidor no está disponible

## Instalación

### 1. Instalar Node.js
Asegúrate de tener Node.js instalado (versión 14 o superior):
```bash
node --version
npm --version
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3001`

### 4. Acceder al CMS
- **Dashboard**: `http://localhost:3001/admin/dashboard.html`
- **Sitio web**: `http://localhost:3001/index.html`

## Estructura de Archivos

```
Fantea/
├── server.js              # Servidor Node.js
├── package.json           # Dependencias
├── cms-data.json         # Datos del CMS (se crea automáticamente)
├── admin/
│   ├── dashboard.html    # Panel de administración
│   └── js/
│       └── admin-dashboard.js  # Lógica del dashboard
├── js/
│   └── cms-sync.js       # Sincronización con el servidor
└── images/
    └── cms/              # Imágenes subidas desde el CMS
```

## API del Servidor

### Guardar datos
```
POST /api/cms/save
Content-Type: application/json

{
  "section": "hero",
  "data": { ... },
  "user": "admin"
}
```

### Cargar datos
```
GET /api/cms/load
```

### Cargar sección específica
```
GET /api/cms/load/:section
```

### Subir imagen
```
POST /api/upload/image
Content-Type: application/json

{
  "imageData": "data:image/jpeg;base64,...",
  "filename": "hero-image.jpg"
}
```

## Ventajas de la Nueva Solución

1. **Persistencia real**: Los datos se guardan en archivos JSON
2. **Compartido entre sesiones**: Funciona en ventanas privadas
3. **API REST**: Fácil de extender y mantener
4. **Fallback**: Si el servidor no está disponible, usa localStorage
5. **Subida de imágenes**: Las imágenes se guardan en el servidor
6. **Escalable**: Fácil migración a MongoDB en el futuro

## Migración a MongoDB (Opcional)

Si quieres usar MongoDB en el futuro, solo necesitas:

1. Instalar MongoDB
2. Cambiar las funciones de guardado/carga en `server.js`
3. El frontend no necesita cambios

## Comandos Útiles

```bash
# Iniciar servidor en modo desarrollo (con auto-reload)
npm run dev

# Ver logs del servidor
npm start

# Instalar nuevas dependencias
npm install nombre-paquete
```

## Solución de Problemas

### El servidor no inicia
- Verifica que Node.js esté instalado
- Ejecuta `npm install` para instalar dependencias
- Verifica que el puerto 3001 esté libre

### Los datos no se guardan
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador para errores
- Verifica que el archivo `cms-data.json` tenga permisos de escritura

### Las imágenes no se suben
- Verifica que la carpeta `images/cms/` exista
- Revisa los permisos de escritura en la carpeta

## Despliegue en Producción (Fly.io)

### 1. Preparar el despliegue
```bash
# Asegúrate de que todos los archivos estén guardados
git add .
git commit -m "Preparar despliegue CMS con servidor Node.js"
```

### 2. Desplegar a Fly.io
```bash
# Opción A: Usar script automático
chmod +x deploy.sh
./deploy.sh

# Opción B: Desplegar manualmente
flyctl deploy
```

### 3. Verificar el despliegue
- **Sitio web**: https://fantea.fly.dev
- **Dashboard CMS**: https://fantea.fly.dev/admin/dashboard.html
- **API CMS**: https://fantea.fly.dev/api/cms/load

### 4. Configurar variables de entorno (opcional)
```bash
flyctl secrets set NODE_ENV=production
```

## Ventajas del Despliegue en Fly.io

1. **✅ Persistencia global**: Los datos se guardan en el servidor de Fly.io
2. **✅ Acceso compartido**: Todos los usuarios ven los mismos cambios
3. **✅ Escalabilidad**: Se adapta automáticamente al tráfico
4. **✅ SSL automático**: HTTPS incluido
5. **✅ CDN global**: Distribución de contenido rápida
6. **✅ Backup automático**: Los datos se respaldan automáticamente

## Próximos Pasos

1. **Autenticación**: Implementar login real
2. **Backup**: Sistema de respaldo automático
3. **MongoDB**: Migración a base de datos real
4. **Cache**: Sistema de caché para mejor rendimiento
5. **Logs**: Sistema de logs para auditoría
