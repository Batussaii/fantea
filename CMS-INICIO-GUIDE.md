# Guía del CMS - Página de Inicio (index.html)

## Descripción General

El sistema CMS de FANTEA permite editar dinámicamente el contenido de la página de inicio sin necesidad de modificar código HTML. Todos los cambios se reflejan automáticamente en la web.

## Estructura de Datos

### 1. Sección Hero (Banner Principal)

**Ubicación en el CMS:** Dashboard → Contenido Estático → Inicio → Banner Principal

**Campos editables:**
- **Título Principal:** "Unidos por la diversidad, comprometidos con el autismo en Andalucía"
- **Descripción:** "FANTEA es la federación que une a las asociaciones de autismo de toda Andalucía para defender derechos, promover inclusión y ofrecer recursos especializados a personas autistas y sus familias."
- **Imagen Principal:** Imagen del banner hero
- **Botón "Conócenos":** Texto del primer botón
- **Botón "Afíliate":** Texto del segundo botón  
- **Botón "Haz una Donación":** Texto del tercer botón

### 2. Sección Estadísticas

**Ubicación en el CMS:** Dashboard → Contenido Estático → Inicio → Estadísticas

**Campos editables:**
- **Estadística 1:** "1 de 100" / "niños tienen autismo"
- **Estadística 2:** "500+" / "familias andaluzas apoyadas"
- **Estadística 3:** "15" / "años de experiencia"
- **Estadística 4:** "35+" / "asociaciones afiliadas"

### 3. Secciones Destacadas (Pilares Fundamentales)

**Ubicación en el CMS:** Dashboard → Contenido Estático → Inicio → Secciones Destacadas

**Campos editables:**
- **Título de la Sección:** "Nuestros Pilares Fundamentales"
- **Subtítulo:** "Trabajamos en múltiples frentes para construir una sociedad más inclusiva"

**Características (4 tarjetas):**

#### Característica 1 - Quiénes Somos
- **Título:** "Quiénes Somos"
- **Descripción:** "Conoce FANTEA, la Federación Andaluza TEA que defiende los derechos de las personas autistas y sus familias en Andalucía."
- **Icono:** "fas fa-users"
- **Texto del Enlace:** "Conoce más"

#### Característica 2 - Asociaciones Federadas
- **Título:** "Asociaciones Federadas"
- **Descripción:** "Descubre las asociaciones que forman parte de FANTEA y cómo trabajamos de forma coordinada."
- **Icono:** "fas fa-handshake"
- **Texto del Enlace:** "Ver asociaciones"

#### Característica 3 - Áreas de Trabajo
- **Título:** "Áreas de Trabajo"
- **Descripción:** "Educación, salud, vida adulta, inclusión social y vivienda. Trabajamos en todos los ámbitos de la vida."
- **Icono:** "fas fa-graduation-cap"
- **Texto del Enlace:** "Ver áreas"

#### Característica 4 - Nuestro Manifiesto
- **Título:** "Nuestro Manifiesto"
- **Descripción:** "Conoce nuestros compromisos y valores para defender los derechos del colectivo TEA en Andalucía."
- **Icono:** "fas fa-bullhorn"
- **Texto del Enlace:** "Leer manifiesto"

### 4. Llamada a la Acción (CTA)

**Ubicación en el CMS:** Dashboard → Contenido Estático → Inicio → Llamada a la Acción

**Campos editables:**
- **Título CTA:** "Únete a Nuestra Comunidad"
- **Descripción:** "Forma parte del cambio hacia una sociedad más inclusiva y accesible para las personas autistas y sus familias."
- **Botón Principal:** "Afíliate Ahora"
- **Botón Secundario:** "Contactar"

## Cómo Usar el CMS

### 1. Acceder al Dashboard
1. Ve a `admin/login.html`
2. Inicia sesión con tus credenciales
3. Accede al dashboard principal

### 2. Editar Contenido de Inicio
1. En el menú lateral, haz clic en "Contenido Estático"
2. Haz clic en la pestaña "Inicio"
3. Expande las secciones que quieras editar
4. Modifica los campos deseados
5. Haz clic en "Guardar Sección" para cada sección modificada

### 3. Vista Previa
- Usa el botón "Vista Previa" para ver los cambios antes de publicarlos
- Los cambios se aplican automáticamente en la página de inicio

### 4. Guardar Todos los Cambios
- Usa el botón "Guardar Todos los Cambios" para guardar todas las modificaciones de una vez

## Archivos del Sistema

### Archivos de Datos
- `cms-data.json` - Contiene todos los datos del CMS
- `js/cms-sync.js` - Sistema de sincronización entre CMS y páginas

### Archivos del Dashboard
- `admin/dashboard.html` - Interfaz del CMS
- `admin/js/admin-dashboard.js` - Lógica del dashboard
- `admin/js/cms-integration.js` - Integración con el servidor

### Archivos de Prueba
- `test-cms-inicio.html` - Página de prueba para verificar la carga de datos

## Estructura JSON de Datos

```json
{
  "hero": {
    "title": "Unidos por la diversidad, comprometidos con el autismo en Andalucía",
    "description": "FANTEA es la federación que une a las asociaciones de autismo de toda Andalucía...",
    "image": "images/hero-inclusive.jpg",
    "buttons": {
      "about": "Conócenos",
      "affiliate": "Afíliate",
      "donate": "Haz una Donación"
    }
  },
  "stats": {
    "stats": [
      {
        "number": "1 de 100",
        "description": "niños tienen autismo"
      },
      {
        "number": "500+",
        "description": "familias andaluzas apoyadas"
      },
      {
        "number": "15",
        "description": "años de experiencia"
      },
      {
        "number": "35+",
        "description": "asociaciones afiliadas"
      }
    ]
  },
  "features": {
    "title": "Nuestros Pilares Fundamentales",
    "subtitle": "Trabajamos en múltiples frentes para construir una sociedad más inclusiva",
    "features": [
      {
        "title": "Quiénes Somos",
        "description": "Conoce FANTEA, la Federación Andaluza TEA...",
        "icon": "fas fa-users",
        "linkText": "Conoce más"
      }
    ]
  },
  "cta": {
    "title": "Únete a Nuestra Comunidad",
    "description": "Forma parte del cambio hacia una sociedad más inclusiva...",
    "buttons": {
      "primary": "Afíliate Ahora",
      "secondary": "Contactar"
    }
  }
}
```

## Funcionalidades Avanzadas

### 1. Actualización en Tiempo Real
- Los cambios se reflejan automáticamente en la página web
- Múltiples canales de comunicación (localStorage, BroadcastChannel, polling)

### 2. Gestión de Imágenes
- Subida de imágenes desde el dashboard
- Vista previa de imágenes antes de guardar
- Optimización automática de imágenes

### 3. Validación de Datos
- Validación automática de campos requeridos
- Prevención de datos malformados
- Backup automático de datos

### 4. Historial de Cambios
- Registro de modificaciones con timestamp
- Identificación del usuario que realizó los cambios
- Posibilidad de revertir cambios

## Solución de Problemas

### 1. Los cambios no se reflejan
- Verifica que el servidor esté funcionando
- Revisa la consola del navegador para errores
- Usa la página de prueba `test-cms-inicio.html`

### 2. Error al guardar
- Verifica la conexión a internet
- Comprueba que tienes permisos de administrador
- Revisa que los campos requeridos estén completos

### 3. Problemas de carga de datos
- Limpia la caché del navegador
- Verifica que el archivo `cms-data.json` sea válido
- Reinicia el servidor si es necesario

## Notas Importantes

1. **Siempre haz una copia de seguridad** antes de hacer cambios importantes
2. **Prueba los cambios** en la página de prueba antes de publicar
3. **Mantén un registro** de los cambios realizados
4. **Verifica la accesibilidad** después de hacer cambios
5. **Comprueba la responsividad** en diferentes dispositivos

## Contacto y Soporte

Para problemas técnicos o consultas sobre el CMS:
- Revisa la documentación técnica
- Consulta los logs del servidor
- Contacta al equipo de desarrollo
