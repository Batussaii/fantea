# Guía de Colores de FANTEA

## Paleta de Colores del Logo

### Colores Principales

| Color | Código HEX | RGB | Descripción | Uso |
|-------|------------|-----|-------------|-----|
| **FANTEA Teal** | `#1E5F74` | `30, 95, 116` | Verde azulado oscuro (FAN) | Color principal, títulos, elementos destacados |
| **FANTEA Blue** | `#3B82F6` | `59, 130, 246` | Azul medio (TEA) | Color secundario, enlaces, botones |
| **FANTEA Green** | `#10B981` | `16, 185, 129` | Verde complementario | Acentos, elementos de éxito |
| **FANTEA Gray** | `#6B7280` | `107, 114, 128` | Gris claro (FEDERACIÓN ANDALUZA TEA) | Texto secundario, elementos neutros |

### Variaciones de Colores

#### Teal (Verde Azulado)
- **Light**: `#2DD4BF` - Para hover y elementos claros
- **Dark**: `#134E4A` - Para hover y elementos oscuros

#### Blue (Azul)
- **Light**: `#60A5FA` - Para hover y elementos claros
- **Dark**: `#2563EB` - Para hover y elementos oscuros

#### Green (Verde)
- **Light**: `#34D399` - Para hover y elementos claros
- **Dark**: `#047857` - Para hover y elementos oscuros

#### Gray (Gris)
- **Light**: `#9CA3AF` - Para texto secundario claro
- **Dark**: `#374151` - Para texto secundario oscuro

## Variables CSS

```css
:root {
    /* Colores principales del logo */
    --fantea-teal: #1E5F74;
    --fantea-blue: #3B82F6;
    --fantea-green: #10B981;
    --fantea-gray: #6B7280;

    /* Variaciones */
    --fantea-teal-light: #2DD4BF;
    --fantea-teal-dark: #134E4A;
    --fantea-blue-light: #60A5FA;
    --fantea-blue-dark: #2563EB;
    --fantea-green-light: #34D399;
    --fantea-green-dark: #047857;
    --fantea-gray-light: #9CA3AF;
    --fantea-gray-dark: #374151;
}
```

## Clases Utilitarias

### Texto
- `.text-fantea-teal` - Texto en color teal
- `.text-fantea-blue` - Texto en color azul
- `.text-fantea-green` - Texto en color verde
- `.text-fantea-gray` - Texto en color gris

### Fondos
- `.bg-fantea-teal` - Fondo teal
- `.bg-fantea-blue` - Fondo azul
- `.bg-fantea-green` - Fondo verde
- `.bg-fantea-gray` - Fondo gris

### Bordes
- `.border-fantea-teal` - Borde teal
- `.border-fantea-blue` - Borde azul
- `.border-fantea-green` - Borde verde
- `.border-fantea-gray` - Borde gris

### Gradientes
- `.gradient-fantea-teal-blue` - Gradiente de teal a azul
- `.gradient-fantea-blue-green` - Gradiente de azul a verde

### Botones
- `.btn-fantea-teal` - Botón teal
- `.btn-fantea-blue` - Botón azul
- `.btn-fantea-green` - Botón verde
- `.btn-outline-fantea-teal` - Botón outline teal
- `.btn-outline-fantea-blue` - Botón outline azul
- `.btn-outline-fantea-green` - Botón outline verde

### Hover
- `.hover-fantea-teal:hover` - Hover teal
- `.hover-fantea-blue:hover` - Hover azul
- `.hover-fantea-green:hover` - Hover verde

## Aplicación en la Web

### Elementos Principales
- **Header/Navbar**: Fondo teal, texto blanco
- **Botones principales**: Fondo teal, hover teal oscuro
- **Enlaces**: Color azul, hover azul oscuro
- **Títulos**: Color teal
- **Texto secundario**: Color gris

### Secciones
- **Hero sections**: Gradiente teal-azul
- **Cards**: Bordes teal, hover azul
- **CTA sections**: Fondo teal
- **Footer**: Fondo teal oscuro

### Estados
- **Éxito**: Verde
- **Información**: Azul
- **Advertencia**: Naranja (complementario)
- **Error**: Rojo (complementario)

## Accesibilidad

### Contraste
- Teal sobre blanco: ✅ Excelente contraste
- Azul sobre blanco: ✅ Buen contraste
- Verde sobre blanco: ✅ Buen contraste
- Gris sobre blanco: ⚠️ Contraste moderado

### Modo Oscuro
- Teal claro: `#2DD4BF`
- Azul claro: `#60A5FA`
- Fondo: `#121212`
- Texto: `#ffffff`

## Implementación

1. Incluir `css/fantea-colors.css` en todas las páginas
2. Usar las clases utilitarias para aplicar colores
3. Mantener consistencia en toda la web
4. Respetar la jerarquía visual del logo

## Inspiración del Logo

Los colores están basados en el logo de FANTEA:
- **FAN** (verde azulado): Representa la naturaleza y estabilidad
- **TEA** (azul): Representa la confianza y profesionalidad
- **FEDERACIÓN ANDALUZA TEA** (gris): Representa la neutralidad y seriedad

Esta paleta crea una identidad visual coherente y profesional que refleja los valores de la organización. 