/**
 * Configuración del servidor CMS
 */

const path = require('path');

const config = {
    // Puerto del servidor
    port: process.env.PORT || 3001,
    
    // Configuración de directorios
    directories: {
        // Directorio de datos persistente
        data: process.env.NODE_ENV === 'production' ? '/app/data' : path.join(__dirname, 'data'),
        
        // Directorio de subidas
        uploads: process.env.NODE_ENV === 'production' ? '/app/data/uploads' : path.join(__dirname, 'data', 'uploads'),
        
        // Subdirectorios de uploads
        uploadsSubdirs: {
            images: 'images',
            estatutos: 'estatutos',
            documentos: 'documentos',
            general: 'general'
        }
    },
    
    // Configuración de archivos
    files: {
        // Archivo de datos del CMS
        cmsData: 'cms-data.json',
        
        // Límites de archivos
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB
            maxFiles: 10 // Máximo 10 archivos por subida
        },
        
        // Tipos de archivo permitidos
        allowedTypes: {
            statutes: ['application/pdf'],
            documents: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png'
            ],
            general: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png'
            ]
        }
    },
    
    // Configuración de CORS
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? ['https://fantea.org', 'https://www.fantea.org'] 
            : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
        credentials: true
    },
    
    // Configuración de seguridad
    security: {
        // Headers de seguridad
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
        }
    }
};

// Funciones de utilidad
config.getPath = function(type) {
    return path.join(this.directories.data, this.files.cmsData);
};

config.getUploadPath = function(subdir) {
    if (this.directories.uploadsSubdirs && this.directories.uploadsSubdirs[subdir]) {
        return path.join(this.directories.uploads, this.directories.uploadsSubdirs[subdir]);
    }
    return path.join(this.directories.uploads, subdir);
};

config.getAllowedTypes = function(fieldName) {
    return this.files.allowedTypes[fieldName] || this.files.allowedTypes.general;
};

module.exports = config;
