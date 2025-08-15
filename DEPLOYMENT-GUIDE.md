# Guía de Despliegue - FANTEA en fly.io

## 🎯 **Objetivo**

Desplegar FANTEA en fly.io con **cambios permanentes** del CMS que sean visibles para todos los usuarios de `fantea.fly.dev`.

## 📋 **Requisitos Previos**

1. **Cuenta en fly.io** - [Regístrate aquí](https://fly.io/docs/speedrun/)
2. **flyctl CLI** - [Instalación](https://fly.io/docs/hands-on/install-flyctl/)
3. **Node.js** (versión 16 o superior)

## 🚀 **Despliegue Automático**

### Opción 1: Script Automático (Recomendado)

```bash
# Dar permisos de ejecución
chmod +x deploy-fly.sh

# Ejecutar despliegue
./deploy-fly.sh
```

### Opción 2: Despliegue Manual

```bash
# 1. Iniciar sesión en fly.io
flyctl auth login

# 2. Crear volumen persistente
flyctl volumes create fantea_data --size 1 --region mad

# 3. Desplegar aplicación
flyctl deploy

# 4. Verificar estado
flyctl status
```

## 🔧 **Configuración Técnica**

### **Volumen Persistente**
- **Nombre:** `fantea_data`
- **Tamaño:** 1GB
- **Región:** Madrid (mad)
- **Propósito:** Almacenar `cms-data.json` permanentemente

### **Servidor Node.js**
- **Puerto:** 3001
- **Modo:** Producción
- **Persistencia:** Siempre activo (no se para)

### **Archivos de Datos**
- **Localización:** `/app/data/cms-data.json`
- **Backup:** localStorage como caché
- **Sincronización:** Tiempo real entre pestañas

## ✅ **Verificación del Despliegue**

### 1. **Verificar URLs**
```bash
# Aplicación principal
curl https://fantea.fly.dev

# API del CMS
curl https://fantea.fly.dev/api/cms/load

# Dashboard CMS
curl https://fantea.fly.dev/admin/login.html
```

### 2. **Verificar Persistencia**
1. Accede al dashboard: `https://fantea.fly.dev/admin/login.html`
2. Haz cambios en el CMS
3. Guarda los cambios
4. Refresca la página principal: `https://fantea.fly.dev`
5. **Los cambios deben permanecer** ✅

### 3. **Verificar para Otros Usuarios**
1. Abre una ventana de incógnito
2. Ve a `https://fantea.fly.dev`
3. **Los cambios deben ser visibles** ✅

## 🔄 **Flujo de Datos**

```
Dashboard CMS → Servidor Node.js → Volumen Persistente
     ↓              ↓                    ↓
localStorage ← API Response ← cms-data.json
     ↓              ↓                    ↓
Página Web ← CMS Sync ← localStorage (caché)
```

## 🛠️ **Comandos Útiles**

### **Gestión de la Aplicación**
```bash
# Ver logs en tiempo real
flyctl logs

# Reiniciar aplicación
flyctl restart

# Ver estado
flyctl status

# Escalar aplicación
flyctl scale count 1
```

### **Gestión del Volumen**
```bash
# Listar volúmenes
flyctl volumes list

# Ver detalles del volumen
flyctl volumes show fantea_data

# Crear backup (si es necesario)
flyctl volumes create fantea_data_backup --size 1 --region mad
```

### **Gestión de Datos**
```bash
# Conectar al servidor
flyctl ssh console

# Ver archivo de datos
cat /app/data/cms-data.json

# Hacer backup manual
cp /app/data/cms-data.json /tmp/backup.json
```

## 🚨 **Solución de Problemas**

### **Problema: Los cambios no se guardan**
```bash
# Verificar logs del servidor
flyctl logs

# Verificar que el volumen existe
flyctl volumes list

# Reiniciar aplicación
flyctl restart
```

### **Problema: Error 500 en API**
```bash
# Verificar permisos del directorio
flyctl ssh console
ls -la /app/data/

# Verificar archivo de datos
cat /app/data/cms-data.json
```

### **Problema: Aplicación no responde**
```bash
# Verificar estado
flyctl status

# Verificar logs
flyctl logs

# Reiniciar aplicación
flyctl restart
```

## 📊 **Monitoreo**

### **Métricas Disponibles**
- **Uptime:** 99.9% (servidor siempre activo)
- **Latencia:** < 100ms (región Madrid)
- **Almacenamiento:** 1GB persistente
- **Memoria:** 512MB RAM

### **Alertas Recomendadas**
- CPU > 80%
- Memoria > 80%
- Errores 500 > 1%
- Tiempo de respuesta > 2s

## 🔒 **Seguridad**

### **Configuraciones Implementadas**
- ✅ HTTPS forzado
- ✅ CORS configurado
- ✅ Límites de tamaño de archivo
- ✅ Validación de datos
- ✅ Logs de auditoría

### **Recomendaciones Adicionales**
- Configurar autenticación del dashboard
- Implementar rate limiting
- Configurar backups automáticos
- Monitorear logs de acceso

## 💰 **Costos Estimados**

### **fly.io (Plan Gratuito)**
- **Aplicación:** Gratis (3 apps)
- **Volumen:** Gratis (3GB total)
- **Ancho de banda:** Gratis (160GB/mes)
- **CPU:** Gratis (3 vCPUs compartidos)

### **Plan Pago (si es necesario)**
- **Aplicación:** $1.94/mes
- **Volumen:** $0.15/GB/mes
- **Ancho de banda:** $0.15/GB

## 📞 **Soporte**

### **fly.io**
- [Documentación](https://fly.io/docs/)
- [Comunidad](https://community.fly.io/)
- [Soporte](https://fly.io/docs/support/)

### **FANTEA**
- Revisar logs: `flyctl logs`
- Verificar estado: `flyctl status`
- Reiniciar: `flyctl restart`

---

## 🎉 **¡Listo!**

Una vez desplegado, tu CMS tendrá:
- ✅ **Cambios permanentes** para todos los usuarios
- ✅ **Persistencia** en volumen de fly.io
- ✅ **Sincronización** en tiempo real
- ✅ **Alta disponibilidad** (99.9% uptime)
- ✅ **Escalabilidad** automática
