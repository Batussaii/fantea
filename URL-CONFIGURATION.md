# Configuración de URLs - CMS FANTEA

## Problema Resuelto

El sistema anterior tenía URLs hardcodeadas que no funcionaban correctamente en producción. Ahora tenemos un sistema inteligente que detecta automáticamente el entorno.

## Cómo Funciona

### 🔧 Desarrollo (localhost)
```
URL: http://localhost:3001/api/cms/load
```

### 🚀 Producción (Fly.io)
```
URL: https://fantea.fly.dev/api/cms/load
```

## Archivo de Configuración

El archivo `js/config.js` maneja automáticamente las URLs:

```javascript
const CMS_CONFIG = {
    // Detecta automáticamente si estamos en desarrollo
    isDevelopment: window.location.hostname === 'localhost',
    
    // URL base de la API
    get apiBaseUrl() {
        if (this.isDevelopment) {
            return 'http://localhost:3001';
        } else {
            // En producción, usa la misma URL del sitio web
            return window.location.origin;
        }
    }
};
```

## URLs Generadas

### Desarrollo
- **API Base**: `http://localhost:3001`
- **Cargar datos**: `http://localhost:3001/api/cms/load`
- **Guardar datos**: `http://localhost:3001/api/cms/save`

### Producción
- **API Base**: `https://fantea.fly.dev`
- **Cargar datos**: `https://fantea.fly.dev/api/cms/load`
- **Guardar datos**: `https://fantea.fly.dev/api/cms/save`

## Archivos Actualizados

1. **`js/config.js`** - Configuración centralizada
2. **`js/cms-sync.js`** - Usa `CMS_CONFIG.apiUrls.load`
3. **`admin/js/admin-dashboard.js`** - Usa `CMS_CONFIG.apiUrls.save`
4. **`test-server.html`** - Usa configuración automática

## Inclusión en Páginas

### Dashboard
```html
<script src="../js/config.js"></script>
```

### Páginas principales
```html
<script src="js/config.js"></script>
```

## Ventajas

1. **✅ Automático**: No necesitas cambiar URLs manualmente
2. **✅ Flexible**: Funciona en cualquier dominio
3. **✅ Mantenible**: Una sola configuración para todo
4. **✅ Debug**: Muestra información útil en consola

## Debug

En desarrollo verás:
```
🔧 CMS Config (Development): {
  hostname: "localhost",
  origin: "http://localhost:3001",
  isDevelopment: true,
  apiBaseUrl: "http://localhost:3001"
}
```

En producción verás:
```
🚀 CMS Config (Production): {
  hostname: "fantea.fly.dev",
  origin: "https://fantea.fly.dev",
  isDevelopment: false,
  apiBaseUrl: "https://fantea.fly.dev"
}
```

## Pruebas

1. **Local**: `http://localhost:3001/test-server.html`
2. **Producción**: `https://fantea.fly.dev/test-server.html`

Ambos funcionarán correctamente con las URLs apropiadas.
