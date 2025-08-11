# Sistema de Cache Busting - FANTEA

## Problema
Los usuarios reportan que no ven los cambios realizados en la web porque el navegador está cacheando los archivos CSS y JavaScript.

## Solución Implementada

### 1. Cache Buster JavaScript (`js/cache-buster.js`)

El sistema incluye un script que:

- **Genera versiones únicas**: Crea timestamps únicos para cada carga de página
- **Actualiza enlaces automáticamente**: Modifica las URLs de CSS y JS con parámetros de versión
- **Verificación automática**: Revisa actualizaciones cada 5 minutos y al hacer focus en la ventana
- **Limpieza de caché**: Limpia la caché del navegador automáticamente

### 2. Botón Manual de Actualización

Se agregó un botón en el panel de accesibilidad que permite:
- Forzar la actualización manual de la página
- Limpiar la caché sin recargar
- Ver información de caché en la consola

### 3. Configuración del Servidor (`.htaccess`)

Headers HTTP que previenen el cacheo:
```apache
Header set Cache-Control "no-cache, no-store, must-revalidate"
Header set Pragma "no-cache"
Header set Expires "0"
```

## Cómo Usar

### Para Usuarios Finales

1. **Actualización automática**: El sistema funciona automáticamente
2. **Botón manual**: Hacer clic en el botón de accesibilidad (ícono de rueda) → "Actualizar"
3. **Consola del navegador**: Escribir `showCacheInfo()` para ver información de caché

### Para Desarrolladores

#### Funciones Disponibles en Consola:
```javascript
// Forzar actualización completa
forceUpdate()

// Limpiar caché sin recargar
clearCache()

// Ver información de caché
showCacheInfo()
```

#### Verificar que Funciona:
1. Abrir las herramientas de desarrollador (F12)
2. Ir a la pestaña "Network"
3. Recargar la página
4. Verificar que los archivos CSS y JS tienen parámetros `?v=timestamp`

## Archivos Modificados

- `js/cache-buster.js` - Nuevo script de cache busting
- `index.html` - Incluye el script y botón de actualización
- `css/styles.css` - Estilos para el botón de actualización
- `.htaccess` - Configuración del servidor para prevenir caché

## Configuración para Diferentes Entornos

### Desarrollo
- Cache busting automático activado
- Headers HTTP previenen caché
- Verificación cada 5 minutos

### Producción
- Mantener el sistema activo para actualizaciones rápidas
- Considerar deshabilitar la verificación automática si no es necesaria
- Los headers HTTP siguen siendo útiles

## Troubleshooting

### Si los cambios siguen sin aparecer:

1. **Verificar que el script se carga**:
   ```javascript
   console.log('Cache Buster cargado:', typeof window.cacheBuster !== 'undefined')
   ```

2. **Forzar actualización manual**:
   ```javascript
   forceUpdate()
   ```

3. **Limpiar caché del navegador**:
   - Chrome: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
   - Firefox: Ctrl+F5 (Windows) o Cmd+F5 (Mac)

4. **Verificar headers HTTP**:
   - Abrir herramientas de desarrollador
   - Pestaña Network
   - Verificar que los archivos CSS/JS tienen headers `Cache-Control: no-cache`

### Logs de Debug

El sistema muestra logs en la consola:
- `🚀 Cache Buster FANTEA inicializado`
- `🔄 Nueva versión detectada, actualizando caché...`
- `🗑️ Caché limpiado`

## Beneficios

1. **Actualizaciones inmediatas**: Los usuarios ven los cambios al instante
2. **Experiencia mejorada**: No necesitan limpiar caché manualmente
3. **Desarrollo más eficiente**: Los cambios se reflejan inmediatamente
4. **Compatibilidad**: Funciona en todos los navegadores modernos

## Notas Técnicas

- El sistema usa `localStorage` para rastrear versiones
- Compatible con Service Workers si están implementados
- No afecta el rendimiento significativamente
- Funciona con CDNs y recursos externos (excepto los que ya tienen parámetros de versión) 