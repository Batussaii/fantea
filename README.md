# Fantea - Sitio Web

Un sitio web moderno, accesible y responsive para Fantea, una federación nacional de autismo, inspirado en organizaciones como Autism Speaks, Autismo España y FEMAUT México.

## 🌟 Características Principales

### ✅ Diseño y Experiencia de Usuario
- **Responsive Design**: Totalmente adaptado para móviles, tablets y desktop
- **Accesibilidad Integrada**: Cumple con estándares WCAG 2.1 AA
- **Diseño Moderno**: Interfaz limpia con colores corporativos (azul #1565C0, naranja #FF9800)
- **Navegación Intuitiva**: Menú sticky con animaciones suaves
- **Animaciones CSS**: Efectos visuales profesionales sin comprometer la performance

### 🔧 Funcionalidades de Accesibilidad
- **Panel de Accesibilidad Flotante**: Accesible con Alt+A
  - Aumentar/reducir tamaño de fuente
  - Modo alto contraste
  - Fuente especial para dislexia
  - Preferencias guardadas en localStorage
- **Navegación por Teclado**: Todos los elementos son accesibles por teclado
- **Focus States**: Indicadores visuales claros para navegación
- **Skip Links**: Enlaces para saltar al contenido principal
- **ARIA Labels**: Etiquetas descriptivas para lectores de pantalla

### 📱 Páginas Incluidas

1. **Inicio (index.html)**
   - Banner principal con llamada a la acción
   - Estadísticas impactantes
   - Secciones destacadas (Autismo, Servicios, Eventos, Noticias)
   - Últimas noticias con sistema de cards
   - Llamada a la acción para afiliación

2. **Nosotros (nosotros.html)**
   - Historia de la federación con timeline interactivo
   - Misión, Visión y Valores en cards visuales
   - Equipo directivo y técnico con fotos y biografías
   - Alianzas y colaboraciones organizadas por categorías
   - Estadísticas de impacto

3. **Contacto (contacto.html)**
   - Formulario de contacto completo con validación
   - Información de contacto detallada
   - Mapa integrado de Google Maps
   - Horarios de atención
   - Línea de apoyo 24/7
   - Información de accesibilidad del edificio
   - FAQ expandible

4. **Afíliate (afiliate.html)**
   - Sistema de tabs para diferentes tipos de afiliación:
     - Asociaciones
     - Familias
     - Voluntarios
     - Colaboradores/Donaciones
   - Formularios específicos para cada tipo
   - Información de beneficios y requisitos
   - Testimonios de afiliados
   - Estadísticas de impacto

## 🛠 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript Vanilla**: Funcionalidades interactivas sin dependencias
- **Font Awesome 6**: Iconografía profesional
- **Google Fonts**: Tipografía Inter para mejor legibilidad
- **Google Maps**: Integración de mapas para ubicación

## 📁 Estructura de Archivos

```
Fantea/
├── index.html                 # Página principal
├── nosotros.html             # Sobre la federación
├── contacto.html             # Formulario de contacto
├── afiliate.html             # Páginas de afiliación
├── css/
│   └── styles.css            # Estilos principales
├── js/
│   └── main.js              # Funcionalidades JavaScript
├── images/                   # Carpeta para imágenes (placeholders)
│   ├── logo.png
│   ├── hero-inclusive.jpg
│   ├── news-1.jpg
│   ├── team/                 # Fotos del equipo
│   └── partners/             # Logos de socios
└── README.md                 # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno
- Servidor web local (opcional para desarrollo)

### Instalación Rápida
1. Descarga todos los archivos
2. Abre `index.html` en tu navegador
3. ¡Listo! El sitio está funcionando

### Para Desarrollo
```bash
# Opción 1: Con Python
python -m http.server 8000

# Opción 2: Con Node.js
npx serve .

# Opción 3: Con PHP
php -S localhost:8000
```

## 🎨 Personalización

### Colores Corporativos
En `css/styles.css`, modifica las variables CSS:

```css
:root {
    --primary-color: #1565C0;      /* Azul corporativo */
    --secondary-color: #FF9800;    /* Naranja accesibilidad */
    --accent-color: #4CAF50;       /* Verde esperanza */
}
```

### Contenido
- Reemplaza las imágenes en la carpeta `images/`
- Modifica los textos directamente en los archivos HTML
- Actualiza la información de contacto en todas las páginas

### Funcionalidades JavaScript
Todas las funcionalidades están en `js/main.js`:
- Menú responsive
- Panel de accesibilidad
- Validación de formularios
- Animaciones de scroll
- FAQ expandible
- Sistema de tabs

## 📧 Formularios Incluidos

### Formulario de Contacto
- Campos: nombre, email, teléfono, motivo, mensaje
- Validación en tiempo real
- Checkbox de privacidad obligatorio
- Newsletter opcional

### Formularios de Afiliación
1. **Asociaciones**: información legal, actividades, documentación
2. **Familias**: datos personales, intereses, provincia
3. **Voluntarios**: disponibilidad, experiencia, habilidades
4. **Donaciones**: tipo, importe, propósito

## ♿ Características de Accesibilidad

### Cumplimiento WCAG 2.1 AA
- ✅ Contraste mínimo de colores
- ✅ Texto escalable hasta 200%
- ✅ Navegación por teclado
- ✅ Etiquetas ARIA
- ✅ Estructura semántica
- ✅ Textos alternativos
- ✅ Focus visible

### Panel de Accesibilidad
- **Aumentar texto**: Escala desde 16px hasta 24px
- **Alto contraste**: Esquema de colores alternativo
- **Fuente dislexia**: Tipografía especializada
- **Persistencia**: Preferencias guardadas localmente

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px
- **Tablet**: 481px - 768px  
- **Mobile**: < 480px

### Adaptaciones Móviles
- Menú hamburguesa animado
- Cards en columna única
- Formularios simplificados
- Botones de tamaño táctil (min 48px)
- Espaciado optimizado

## 🔍 SEO Optimizado

- Meta tags descriptivos en cada página
- Estructura HTML semántica
- Headings jerarquizados (H1, H2, H3)
- URLs amigables
- Alt text en imágenes
- Schema markup preparado

## 🚀 Rendimiento

### Optimizaciones Incluidas
- CSS minificado con variables
- JavaScript vanilla (sin librerías pesadas)
- Lazy loading para imágenes
- Fuentes web optimizadas
- Animaciones CSS3 eficientes

## 🔧 Próximas Mejoras Sugeridas

1. **Backend Integration**
   - Envío real de formularios
   - Sistema de gestión de contenido
   - Base de datos de afiliados

2. **Funcionalidades Adicionales**
   - Blog/noticias dinámico
   - Calendario de eventos
   - Centro de descargas
   - Chat en vivo

3. **PWA Features**
   - Service Worker
   - Notificaciones push
   - Funcionalidad offline

## 📞 Soporte

Para preguntas sobre implementación o personalización:

- **Email**: desarrollo@fantea.org
- **Documentación**: Ver comentarios en código
- **Issues**: Reportar problemas técnicos

## 📄 Licencia

Este proyecto está desarrollado para uso de organizaciones sin ánimo de lucro dedicadas al autismo. Se permite la modificación y distribución para fines similares.

---

**Desarrollado con ❤️ para la comunidad autista**

*"Por un mundo más accesible para el autismo"* 