# Solución al Problema de Persistencia de Datos en Fly.io

## Problema Identificado

El problema era que los cambios realizados en el dashboard se perdían después de aproximadamente una hora, como si el contenido se reiniciara a su estado original. Esto se debía a que Fly.io estaba reiniciando la máquina virtual frecuentemente, y aunque el volumen persistente estaba configurado, había problemas con la sincronización y manejo de archivos.

## Solución Implementada

### 1. Mejoras en el Manejo de Archivos

- **Logging mejorado**: Se agregaron logs detallados para rastrear el estado de los archivos
- **Sincronización forzada**: Se implementó `sync` para forzar la escritura al disco
- **Manejo de errores robusto**: Mejor manejo de errores con creación de backups automáticos

### 2. Sistema de Backup Automático

- **Backups cada hora**: Se configuró un sistema de backup automático que se ejecuta cada hora
- **Restauración automática**: Si el archivo principal se corrompe, se restaura automáticamente desde el backup más reciente
- **Rotación de backups**: Se mantienen solo los últimos 10 backups para ahorrar espacio

### 3. Verificación de Integridad

- **Inicialización del sistema**: Al arrancar, el servidor verifica la integridad del volumen
- **Restauración automática**: Si detecta problemas, intenta restaurar desde backup
- **Logs detallados**: Información completa sobre el estado del sistema de archivos

### 4. Configuración Mejorada de Fly.io

- **Health checks más tolerantes**: Aumentado el grace period y timeout
- **Más memoria**: Aumentado de 512MB a 1024MB para mejor estabilidad
- **Volumen persistente**: Configurado correctamente en `/app/data`

## Archivos Modificados

### `server.js`
- Mejorado el manejo de errores en guardado/carga de datos
- Agregado sistema de backup automático
- Implementada verificación de integridad al inicio
- Agregados endpoints para backup/restauración manual

### `fly.toml`
- Aumentado grace period de health checks
- Aumentada memoria de la VM
- Configuración optimizada para estabilidad

### `verify-volume.js` (nuevo)
- Script para verificar la integridad del volumen
- Herramienta de diagnóstico para problemas de persistencia

## Cómo Monitorear

### 1. Verificar Logs
```bash
fly logs --app fantea
```

Buscar estos mensajes que indican que todo funciona correctamente:
- "Sistema de archivos inicializado correctamente"
- "Datos CMS cargados correctamente desde /app/data/cms-data.json"
- "Backup automático configurado para ejecutarse cada hora"

### 2. Verificar Estado del Volumen
```bash
fly ssh console --app fantea
ls -la /app/data/
cat /app/data/cms-data.json | head -20
```

### 3. Crear Backup Manual
```bash
curl -X POST https://fantea.fly.dev/api/cms/backup
```

### 4. Restaurar desde Backup
```bash
curl -X POST https://fantea.fly.dev/api/cms/restore
```

## Endpoints Nuevos

### Backup Manual
- **POST** `/api/cms/backup`
- Crea un backup manual del archivo CMS

### Restauración
- **POST** `/api/cms/restore`
- Restaura desde el backup más reciente

## Prevención de Problemas

### 1. Monitoreo Regular
- Revisar logs diariamente
- Verificar que los backups se están creando
- Monitorear el tamaño del volumen

### 2. Mantenimiento
- Los backups se rotan automáticamente (últimos 10)
- El sistema intenta restaurar automáticamente si detecta problemas
- Los health checks son más tolerantes para evitar reinicios innecesarios

### 3. Alertas
- Si ves "Creando nuevo archivo de datos CMS" frecuentemente, hay un problema
- Si no ves "Datos CMS cargados correctamente", verificar el volumen
- Si el sistema no puede restaurar desde backup, revisar permisos

## Verificación de que la Solución Funciona

1. **Hacer cambios en el dashboard**
2. **Esperar 1-2 horas**
3. **Verificar que los cambios persisten**
4. **Revisar logs para confirmar que no hay "Creando nuevo archivo de datos CMS"**

## Comandos Útiles

```bash
# Ver logs en tiempo real
fly logs --app fantea --follow

# Conectar al servidor
fly ssh console --app fantea

# Verificar estado de la app
fly status --app fantea

# Verificar volúmenes
fly volumes list --app fantea

# Verificar espacio en volumen
fly ssh console --app fantea -C "df -h /app/data"
```

## Notas Importantes

- El volumen persistente está configurado en `/app/data`
- Los backups se guardan en `/app/data/backups/`
- El archivo principal es `/app/data/cms-data.json`
- El sistema intenta restaurar automáticamente si detecta problemas
- Los health checks son más tolerantes para evitar reinicios innecesarios

Esta solución debería resolver completamente el problema de persistencia de datos en Fly.io.
