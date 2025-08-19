# 📁 Guía de Gestión de Archivos - FANTEA

## 🎯 Problema Resuelto

**Problema anterior:** Los archivos PDF subidos en el dashboard no se guardaban realmente en el servidor. Después de refrescar la página, los archivos desaparecían y los usuarios no podían descargarlos.

**Solución implementada:** Sistema completo de gestión de archivos con persistencia real en el servidor.

## 🚀 Funcionalidades Implementadas

### 1. **Subida de Estatutos PDF**
- ✅ Subida real de archivos PDF al servidor
- ✅ Validación de tipo de archivo (solo PDF)
- ✅ Límite de tamaño (10MB)
- ✅ Nombres únicos para evitar conflictos
- ✅ Persistencia en directorio del servidor

### 2. **Subida de Documentos Generales**
- ✅ Subida múltiple de archivos
- ✅ Tipos permitidos: PDF, DOC, DOCX, JPG, PNG
- ✅ Validación de tipos y tamaños
- ✅ Organización por categorías

### 3. **Gestión de Archivos**
- ✅ Descarga directa de archivos
- ✅ Eliminación segura de archivos
- ✅ Información detallada de archivos
- ✅ Historial de subidas

### 4. **Interfaz de Usuario**
- ✅ Drag & drop para subida
- ✅ Barra de progreso en tiempo real
- ✅ Notificaciones de estado
- ✅ Validación en tiempo real

## 🛠️ Arquitectura Técnica

### Servidor (Node.js + Express)
```
server.js
├── Configuración con multer para subida de archivos
├── Endpoints REST para gestión de archivos
├── Validación de tipos y tamaños
├── Persistencia en sistema de archivos
└── Configuración de CORS y seguridad
```

### Cliente (JavaScript)
```
admin/dashboard.html
├── Interfaz de gestión de archivos
├── Funciones de subida asíncrona
├── Manejo de errores y notificaciones
└── Integración con APIs del servidor
```

### Configuración
```
server-config.js
├── Configuración centralizada
├── Tipos de archivo permitidos
├── Límites de tamaño
└── Rutas de directorios
```

## 📂 Estructura de Directorios

```
data/
├── uploads/
│   ├── estatutos/          # Archivos PDF de estatutos
│   ├── documentos/         # Documentos generales
│   ├── images/            # Imágenes del CMS
│   └── general/           # Otros archivos
├── cms-data.json          # Metadatos de archivos
└── backups/               # Copias de seguridad
```

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install multer
```

### 2. Iniciar Servidor
```bash
node server.js
```

### 3. Acceder al Dashboard
```
http://localhost:3001/admin/dashboard.html
```

## 📋 Endpoints de la API

### Subida de Archivos
```
POST /api/files/upload/statutes
POST /api/files/upload/documents
```

### Gestión de Archivos
```
GET  /api/files/info
GET  /api/files/download/:type/:filename
DELETE /api/files/delete/:type/:filename
```

### Parámetros
- `type`: `statutes` | `documents`
- `filename`: Nombre del archivo en el servidor

## 🧪 Testing

### Archivo de Prueba
```
test-file-upload.html
```
Incluye tests para:
- ✅ Configuración del servidor
- ✅ Subida de estatutos
- ✅ Subida de documentos
- ✅ Descarga de archivos
- ✅ Eliminación de archivos

### Cómo Usar el Test
1. Abrir `test-file-upload.html` en el navegador
2. Asegurar que el servidor esté corriendo en puerto 3001
3. Ejecutar cada test en orden
4. Verificar resultados en la interfaz

## 🔒 Seguridad

### Validaciones Implementadas
- ✅ Tipos de archivo permitidos
- ✅ Límites de tamaño (10MB)
- ✅ Nombres únicos para archivos
- ✅ Sanitización de nombres
- ✅ Headers de seguridad

### Configuración CORS
```javascript
cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}
```

## 📊 Flujo de Datos

### Subida de Archivo
```
1. Usuario selecciona archivo
2. Validación en cliente (tipo, tamaño)
3. FormData enviado al servidor
4. Validación en servidor
5. Guardado en sistema de archivos
6. Metadatos guardados en cms-data.json
7. Respuesta de éxito al cliente
8. Actualización de interfaz
```

### Descarga de Archivo
```
1. Usuario solicita descarga
2. Consulta de metadatos del archivo
3. Verificación de existencia
4. Stream del archivo al cliente
5. Descarga automática en navegador
```

## 🐛 Solución de Problemas

### Error: "Tipo de archivo no permitido"
- Verificar que el archivo sea del tipo correcto
- Revisar configuración en `server-config.js`

### Error: "Archivo demasiado grande"
- El archivo excede el límite de 10MB
- Comprimir o dividir el archivo

### Error: "Servidor no responde"
- Verificar que el servidor esté corriendo
- Revisar logs del servidor
- Comprobar puerto 3001

### Error: "CORS"
- Verificar configuración CORS en `server-config.js`
- Asegurar que el origen esté permitido

## 📈 Mejoras Futuras

### Funcionalidades Planificadas
- [ ] Compresión automática de imágenes
- [ ] Preview de archivos PDF
- [ ] Búsqueda y filtrado de archivos
- [ ] Versiones de archivos
- [ ] Backup automático
- [ ] Integración con almacenamiento en la nube

### Optimizaciones
- [ ] Streaming de archivos grandes
- [ ] Cache de archivos frecuentes
- [ ] Compresión de archivos
- [ ] CDN para archivos estáticos

## 📞 Soporte

### Logs del Servidor
```bash
# Ver logs en tiempo real
node server.js

# Logs importantes:
# - Subida exitosa de archivos
# - Errores de validación
# - Errores de sistema de archivos
```

### Archivos de Configuración
- `server-config.js`: Configuración del servidor
- `js/config.js`: Configuración del cliente
- `package.json`: Dependencias del proyecto

---

## ✅ Verificación de Funcionamiento

Para verificar que todo funciona correctamente:

1. **Iniciar servidor:**
   ```bash
   node server.js
   ```

2. **Abrir dashboard:**
   ```
   http://localhost:3001/admin/dashboard.html
   ```

3. **Navegar a "Archivos"**

4. **Subir un archivo PDF de estatutos**

5. **Verificar que aparece en la lista**

6. **Refrescar la página y verificar que persiste**

7. **Probar descarga del archivo**

8. **Probar eliminación del archivo**

Si todos estos pasos funcionan correctamente, la implementación está completa y funcional. 🎉
