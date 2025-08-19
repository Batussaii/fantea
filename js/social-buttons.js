/**
 * SOCIAL MEDIA BUTTONS ENHANCEMENT
 * Mejora la funcionalidad de los botones de redes sociales
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeSocialButtons();
});

/**
 * Inicializar los botones de redes sociales
 */
function initializeSocialButtons() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        // Agregar tooltip con información de la red social
        addSocialTooltip(link);
        
        // Agregar efecto de carga al hacer clic
        link.addEventListener('click', function(e) {
            if (this.href && this.href !== '#' && this.href !== window.location.href) {
                addLoadingEffect(this);
            }
        });
        
        // Agregar efecto de hover mejorado
        link.addEventListener('mouseenter', function() {
            addHoverEffect(this);
        });
        
        link.addEventListener('mouseleave', function() {
            removeHoverEffect(this);
        });
        
        // Agregar soporte para teclado
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Agregar tooltip a los botones de redes sociales
 */
function addSocialTooltip(link) {
    const socialName = link.getAttribute('aria-label');
    const platform = getSocialPlatform(socialName);
    
    if (platform) {
        link.setAttribute('title', `Síguenos en ${platform}`);
        
        // Crear tooltip personalizado
        const tooltip = document.createElement('div');
        tooltip.className = 'social-tooltip';
        tooltip.textContent = `Síguenos en ${platform}`;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
        `;
        
        link.style.position = 'relative';
        link.appendChild(tooltip);
        
        // Mostrar/ocultar tooltip
        link.addEventListener('mouseenter', function() {
            tooltip.style.opacity = '1';
        });
        
        link.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
    }
}

/**
 * Obtener el nombre de la plataforma social
 */
function getSocialPlatform(ariaLabel) {
    const platforms = {
        'Facebook': 'Facebook',
        'Twitter': 'Twitter/X',
        'Instagram': 'Instagram',
        'LinkedIn': 'LinkedIn',
        'YouTube': 'YouTube'
    };
    
    return platforms[ariaLabel] || ariaLabel;
}

/**
 * Agregar efecto de carga al botón
 */
function addLoadingEffect(link) {
    const icon = link.querySelector('i');
    const originalClass = icon.className;
    
    // Agregar clase de carga
    link.classList.add('loading');
    
    // Simular tiempo de carga (opcional)
    setTimeout(() => {
        link.classList.remove('loading');
    }, 1000);
}

/**
 * Agregar efecto de hover mejorado
 */
function addHoverEffect(link) {
    const icon = link.querySelector('i');
    
    // Agregar clase de hover
    link.classList.add('hover-effect');
    
    // Efecto de pulso sutil
    icon.style.animation = 'pulse 0.6s ease-in-out';
}

/**
 * Remover efecto de hover
 */
function removeHoverEffect(link) {
    const icon = link.querySelector('i');
    
    // Remover clase de hover
    link.classList.remove('hover-effect');
    
    // Detener animación
    icon.style.animation = '';
}

/**
 * Verificar si los enlaces de redes sociales están configurados
 */
function checkSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    let configuredLinks = 0;
    
    socialLinks.forEach(link => {
        if (link.href && link.href !== '#' && link.href !== window.location.href) {
            configuredLinks++;
        }
    });
    
    // Si no hay enlaces configurados, mostrar mensaje
    if (configuredLinks === 0) {
        showSocialLinksWarning();
    }
    
    return configuredLinks;
}

/**
 * Mostrar advertencia si no hay enlaces de redes sociales configurados
 */
function showSocialLinksWarning() {
    const socialContainer = document.querySelector('.social-links');
    if (socialContainer) {
        const warning = document.createElement('div');
        warning.className = 'social-warning';
        warning.innerHTML = `
            <small style="color: rgba(255,255,255,0.7); font-style: italic;">
                <i class="fas fa-info-circle"></i>
                Los enlaces de redes sociales se configuran desde el panel administrativo
            </small>
        `;
        warning.style.cssText = `
            margin-top: 10px;
            text-align: center;
            font-size: 12px;
        `;
        
        socialContainer.appendChild(warning);
    }
}

/**
 * Análisis de clics en redes sociales (para estadísticas)
 */
function trackSocialClick(platform) {
    // Aquí se puede implementar tracking de analytics
    console.log(`Clic en ${platform}`);
    
    // Ejemplo con Google Analytics (si está disponible)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'social_click', {
            'social_network': platform,
            'event_category': 'social_media'
        });
    }
}

// Agregar estilos CSS adicionales dinámicamente
const additionalStyles = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .social-links a.hover-effect {
        transform: translateY(-3px) scale(1.05);
    }
    
    .social-links a.hover-effect i {
        transform: scale(1.15);
    }
`;

// Insertar estilos en el head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Exportar funciones para uso global
window.SocialButtons = {
    initialize: initializeSocialButtons,
    checkLinks: checkSocialLinks,
    trackClick: trackSocialClick
};
