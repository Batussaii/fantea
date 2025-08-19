# 📊 Guía del Sistema de Estadísticas del Dashboard

## 🎯 ¿Cómo se Miden y Cuentan las Estadísticas?

### 1. **Visitas al Sitio Web** ✅ (Automático)
- **¿Cuándo se cuenta?** Cada vez que alguien visita cualquier página del sitio
- **¿Dónde se registra?** En `data/visits.json`
- **¿Qué se guarda?**
  - Contador diario de visitas
  - Contador por hora
  - IPs únicas por día
  - Historial de los últimos 30 días
- **Código:** `recordVisit()` en `server.js` (middleware automático)

### 2. **Descargas de Estatutos** ✅ (Automático)
- **¿Cuándo se cuenta?** Cada vez que alguien descarga un archivo de estatutos
- **¿Dónde se registra?** En `data/stats.json`
- **¿Qué se guarda?**
  - Contador total de descargas
  - Contador del mes actual
  - Historial con timestamp y nombre del archivo
- **Código:** `recordDownload()` en `server.js`

### 3. **Noticias Publicadas** ✅ (Manual)
- **¿Cuándo se cuenta?** Cuando se hace clic en "Nueva Noticia"
- **¿Dónde se registra?** En `data/stats.json`
- **¿Qué se guarda?**
  - Contador total de noticias
  - Contador del mes actual
- **Código:** `recordNewsCreated()` en `server.js`

### 4. **Eventos Programados** ✅ (Manual)
- **¿Cuándo se cuenta?** Cuando se hace clic en "Nuevo Evento"
- **¿Dónde se registra?** En `data/stats.json`
- **¿Qué se guarda?**
  - Contador total de eventos
  - Contador del mes actual
- **Código:** `recordEventCreated()` en `server.js`

### 5. **Asociaciones Afiliadas** ✅ (Manual)
- **¿Cuándo se cuenta?** Cuando se registra una nueva asociación
- **¿Dónde se registra?** En `data/stats.json`
- **¿Qué se guarda?**
  - Contador total de asociaciones
  - Contador del mes actual
- **Código:** `recordAssociationCreated()` en `server.js`

## 📁 Estructura del Archivo de Estadísticas

```json
{
  "downloads": {
    "total": 1,           // Total histórico
    "thisMonth": 1,       // Este mes
    "lastMonth": 0,       // Mes anterior
    "history": [          // Últimas 100 descargas
      {
        "filename": "estatutos.pdf",
        "type": "statutes",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "month": 0,
        "year": 2024
      }
    ]
  },
  "news": {
    "total": 0,
    "thisMonth": 0,
    "lastMonth": 0
  },
  "events": {
    "total": 0,
    "thisMonth": 0,
    "lastMonth": 0
  },
  "associations": {
    "total": 0,
    "thisMonth": 0,
    "lastMonth": 0
  },
  "lastUpdated": "2024-01-15T10:00:00.000Z"
}
```

## 🔄 APIs Disponibles

### Obtener Estadísticas
```
GET /api/dashboard/stats
```

### Obtener Historial de Descargas
```
GET /api/dashboard/downloads/history
```

### Obtener Datos del Gráfico
```
GET /api/dashboard/chart-data?period=7 días
```
**Parámetros:**
- `period`: "7 días", "30 días", "3 meses"

### Registrar Nueva Noticia
```
POST /api/dashboard/record/news
```

### Registrar Nuevo Evento
```
POST /api/dashboard/record/event
```

### Registrar Nueva Asociación
```
POST /api/dashboard/record/association
```

### Actualizar Contadores Mensuales
```
POST /api/dashboard/update-monthly
```

## 🚀 Cómo Usar el Sistema

### Para Desarrolladores:
1. **Registrar descarga automática:**
   ```javascript
   // Se ejecuta automáticamente en el endpoint de descarga
   await recordDownload(filename, type);
   ```

2. **Registrar nueva noticia:**
   ```javascript
   const response = await fetch('/api/dashboard/record/news', {
       method: 'POST'
   });
   ```

3. **Registrar nuevo evento:**
   ```javascript
   const response = await fetch('/api/dashboard/record/event', {
       method: 'POST'
   });
   ```

4. **Registrar nueva asociación:**
   ```javascript
   const response = await fetch('/api/dashboard/record/association', {
       method: 'POST'
   });
   ```

### Para Administradores:
- Los contadores se actualizan automáticamente
- El dashboard muestra datos en tiempo real
- Los contadores mensuales se reinician automáticamente

## 📈 Características del Sistema

### ✅ Automático:
- Tracking de visitas web (middleware automático)
- Tracking de descargas de estatutos
- Actualización de contadores mensuales
- Persistencia de datos en JSON
- Gráfico de actividad con datos reales

### ✅ Manual (Requiere Integración):
- Registro de noticias creadas
- Registro de eventos creados
- Registro de asociaciones creadas

### ✅ Características:
- Historial de las últimas 100 descargas
- Cálculo automático de cambios mensuales
- Fallback a datos demo si hay errores
- Actualización en tiempo real del dashboard

## 🔧 Configuración

### Archivo de Configuración:
- `data/stats.json` - Almacena todas las estadísticas
- Se crea automáticamente si no existe
- Se actualiza en tiempo real

### Logs:
- Todas las operaciones se registran en la consola del servidor
- Errores se manejan gracefulmente sin afectar la funcionalidad

## 🎯 Próximos Pasos

1. **Integrar con CMS:** Conectar el registro de noticias/eventos con el CMS real
2. **Tracking de Asociaciones:** Implementar registro automático de nuevas afiliaciones
3. **Métricas Avanzadas:** Añadir gráficos de tendencias y análisis
4. **Exportación:** Permitir exportar estadísticas a CSV/Excel
