/**
 * Configuración de URLs para el CMS
 * Maneja automáticamente las URLs de desarrollo y producción
 */

const CMS_CONFIG = {
    // Detectar si estamos en desarrollo o producción
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // URL base de la API
    get apiBaseUrl() {
        if (this.isDevelopment) {
            return 'http://localhost:3001';
        } else {
            // En producción, usar la misma URL del sitio web
            return window.location.origin;
        }
    },
    
    // URLs específicas de la API
    get apiUrls() {
        const base = this.apiBaseUrl;
        return {
            load: `${base}/api/cms/load`,
            save: `${base}/api/cms/save`,
            upload: `${base}/api/upload/image`,
            loadSection: (section) => `${base}/api/cms/load/${section}`,
            // URLs para gestión de archivos
            files: {
                info: `${base}/api/files/info`,
                uploadStatutes: `${base}/api/files/upload/statutes`,
                uploadDocuments: `${base}/api/files/upload/documents`,
                download: (type, filename) => `${base}/api/files/download/${type}/${filename}`,
                delete: (type, filename) => `${base}/api/files/delete/${type}/${filename}`
            }
        };
    },
    
    // Información de debug
    debug: {
        get info() {
            return {
                hostname: window.location.hostname,
                origin: window.location.origin,
                isDevelopment: this.isDevelopment,
                apiBaseUrl: this.apiBaseUrl
            };
        }
    }
};

// Hacer disponible globalmente
window.CMS_CONFIG = CMS_CONFIG;

// Log de configuración en desarrollo
if (CMS_CONFIG.isDevelopment) {
    console.log('🔧 CMS Config (Development):', CMS_CONFIG.debug.info);
} else {
    console.log('🚀 CMS Config (Production):', CMS_CONFIG.debug.info);
}
