# ACTUALIZACIÓN DE PALETA DE COLORES - FANTEA

## Resumen de Cambios

Se ha actualizado toda la paleta de colores de la web para usar únicamente tonos de verde, azul y blanco basados en el logo de FANTEA, eliminando colores como amarillo, violeta, naranja, etc.

## Nueva Paleta de Colores

### Colores Principales del Logo
- **Verde Azulado (Teal)**: `#1E5F74` - Color principal (FAN)
- **Azul**: `#3B82F6` - Color secundario (TEA)  
- **Verde**: `#10B981` - Color de acento
- **Blanco**: `#FFFFFF` - Color neutro

### Variaciones
- **Teal Claro**: `#2DD4BF`
- **Teal Oscuro**: `#134E4A`
- **Azul Claro**: `#60A5FA`
- **Azul Oscuro**: `#2563EB`
- **Verde Claro**: `#34D399`
- **Verde Oscuro**: `#047857`

### Grises Neutrales (Basados en Verde Azulado)
- **Gris Medio**: `#64748B`
- **Gris Claro**: `#94A3B8`
- **Gris Muy Claro**: `#CBD5E1`
- **Gris Oscuro**: `#475569`

## Archivos Actualizados

### 1. `css/fantea-colors.css`
- ✅ Nueva paleta completa de colores
- ✅ Variables CSS organizadas
- ✅ Clases de utilidad
- ✅ Gradientes y sombras

### 2. `css/main-colors.css` (NUEVO)
- ✅ Archivo principal que importa la paleta
- ✅ Variables globales de compatibilidad
- ✅ Clases de utilidad globales
- ✅ Botones específicos de FANTEA
- ✅ Soporte para accesibilidad y modo oscuro

### 3. `css/styles.css`
- ✅ Variables principales actualizadas
- ✅ Gradientes de hero y page-header
- ✅ Colores del footer
- ✅ Colores del mapa interactivo
- ✅ Estados de hover y focus

### 4. Archivos de Corrección
- ✅ `css/associations-fix.css` - Colores amarillos → Verde
- ✅ `css/manifesto-fix.css` - Colores amarillos → Verde
- ✅ `css/press-fix.css` - Colores amarillos → Verde
- ✅ `css/areas-fix.css` - Colores amarillos → Verde
- ✅ `css/values-fix.css` - Grises actualizados

### 5. `admin/css/admin-styles.css`
- ✅ Colores del panel administrativo
- ✅ Gradiente de login actualizado

### 6. `index.html`
- ✅ Importación del nuevo archivo de colores

## Colores Eliminados

### ❌ Amarillo (`#FCD34D`)
- Reemplazado por verde (`var(--fantea-green)`)
- Usado en highlights y números de estadísticas

### ❌ Violeta (`#A78BFA`, `#7C3AED`)
- Reemplazado por variaciones de teal
- Usado en el mapa interactivo y gradientes

### ❌ Naranja (`#F97316`)
- Reemplazado por gradiente verde-azul
- Usado en contactos de emergencia

### ❌ Púrpura (`#4C1D95`)
- Reemplazado por teal oscuro
- Usado en el footer

## Gradientes Actualizados

### Antes
```css
background: linear-gradient(135deg, var(--primary-color) 0%, #A855F7 100%);
background: linear-gradient(135deg, var(--accent-color), #F97316);
```

### Después
```css
background: var(--fantea-gradient-primary);
background: var(--fantea-gradient-tertiary);
```

## Clases de Utilidad Disponibles

### Texto
- `.text-teal`, `.text-blue`, `.text-green`
- `.text-primary`, `.text-secondary`, `.text-accent`

### Fondos
- `.bg-teal`, `.bg-blue`, `.bg-green`
- `.bg-primary`, `.bg-secondary`, `.bg-accent`

### Gradientes
- `.gradient-primary` - Teal a Azul
- `.gradient-secondary` - Azul a Verde
- `.gradient-tertiary` - Teal a Verde

### Botones
- `.btn-fantea-primary` - Botón teal
- `.btn-fantea-secondary` - Botón azul
- `.btn-fantea-accent` - Botón verde

## Beneficios de la Actualización

1. **Coherencia Visual**: Toda la web usa la misma paleta del logo
2. **Identidad de Marca**: Colores consistentes con FANTEA
3. **Accesibilidad**: Mejor contraste y legibilidad
4. **Mantenimiento**: Sistema centralizado de colores
5. **Flexibilidad**: Fácil personalización con variables CSS

## Próximos Pasos

1. Verificar que todos los archivos HTML incluyan `main-colors.css`
2. Probar la accesibilidad con lectores de pantalla
3. Verificar el contraste en diferentes dispositivos
4. Documentar cualquier color adicional que necesite actualización

## Notas Técnicas

- Todas las variables usan el prefijo `--fantea-` para evitar conflictos
- Los colores están organizados por categorías (principales, variaciones, grises)
- Se mantiene compatibilidad con el sistema existente
- Soporte para modo oscuro y alto contraste incluido
