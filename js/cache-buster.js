/**
 * Cache Buster - Sistema de actualización forzada de caché
 * FANTEA - Federación Andaluza de Autismo
 */

class CacheBuster {
    constructor() {
        this.version = this.generateVersion();
        this.init();
    }

    /**
     * Genera una versión única basada en timestamp
     */
    generateVersion() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${random}`;
    }

    /**
     * Inicializa el sistema de cache busting
     */
    init() {
        this.updateCSSLinks();
        this.updateJSLinks();
        this.addVersionToLocalStorage();
        this.setupAutoRefresh();
    }

    /**
     * Actualiza los enlaces CSS con parámetros de versión
     */
    updateCSSLinks() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (link.href && !link.href.includes('?v=')) {
                const separator = link.href.includes('?') ? '&' : '?';
                link.href = `${link.href}${separator}v=${this.version}`;
            }
        });
    }

    /**
     * Actualiza los enlaces JavaScript con parámetros de versión
     */
    updateJSLinks() {
        const scriptTags = document.querySelectorAll('script[src]');
        scriptTags.forEach(script => {
            if (script.src && !script.src.includes('?v=') && !script.src.includes('cdnjs.cloudflare.com')) {
                const separator = script.src.includes('?') ? '&' : '?';
                script.src = `${script.src}${separator}v=${this.version}`;
            }
        });
    }

    /**
     * Guarda la versión en localStorage para referencia
     */
    addVersionToLocalStorage() {
        localStorage.setItem('fantea_cache_version', this.version);
        localStorage.setItem('fantea_cache_timestamp', Date.now().toString());
    }

    /**
     * Configura la actualización automática cada cierto tiempo
     */
    setupAutoRefresh() {
        // Verificar si hay una nueva versión cada 5 minutos
        setInterval(() => {
            this.checkForUpdates();
        }, 5 * 60 * 1000);

        // Forzar actualización al hacer focus en la ventana
        window.addEventListener('focus', () => {
            this.checkForUpdates();
        });
    }

    /**
     * Verifica si hay actualizaciones disponibles
     */
    checkForUpdates() {
        const lastVersion = localStorage.getItem('fantea_cache_version');
        const lastTimestamp = localStorage.getItem('fantea_cache_timestamp');
        
        if (lastVersion !== this.version) {
            console.log('🔄 Nueva versión detectada, actualizando caché...');
            this.forceRefresh();
        }
    }

    /**
     * Fuerza la actualización de la página
     */
    forceRefresh() {
        // Limpiar caché del navegador
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }

        // Recargar la página
        window.location.reload(true);
    }

    /**
     * Método manual para forzar actualización
     */
    static forceUpdate() {
        const cacheBuster = new CacheBuster();
        cacheBuster.forceRefresh();
    }

    /**
     * Método para limpiar caché sin recargar
     */
    static clearCache() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
                console.log('🗑️ Caché limpiado');
            });
        }
    }
}

// Inicializar cache buster cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cacheBuster = new CacheBuster();
});

// Exponer métodos globales para uso manual
window.forceUpdate = CacheBuster.forceUpdate;
window.clearCache = CacheBuster.clearCache;

// Función para mostrar información de caché en consola
window.showCacheInfo = () => {
    const version = localStorage.getItem('fantea_cache_version');
    const timestamp = localStorage.getItem('fantea_cache_timestamp');
    const date = timestamp ? new Date(parseInt(timestamp)).toLocaleString() : 'N/A';
    
    console.log('📊 Información de caché FANTEA:');
    console.log('Versión:', version);
    console.log('Última actualización:', date);
    console.log('Para forzar actualización: forceUpdate()');
    console.log('Para limpiar caché: clearCache()');
};

// Mostrar información al cargar
console.log('🚀 Cache Buster FANTEA inicializado');
console.log('Para ver información de caché: showCacheInfo()'); 