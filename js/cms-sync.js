/**
 * CMS Sync - Sistema de sincronización entre el CMS y las páginas principales
 * Lee los datos guardados por el CMS desde localStorage y los aplica dinámicamente
 */

class CMSSync {
    constructor() {
        this.cmsData = this.loadCMSData();
        this.currentPage = this.getCurrentPage();
        console.log('CMS Sync iniciado para página:', this.currentPage);
        console.log('Datos CMS cargados:', this.cmsData);
    }

    // Cargar datos del CMS desde localStorage
    loadCMSData() {
        try {
            const data = localStorage.getItem('fantea_cms_data');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.warn('Error cargando datos CMS:', error);
            return {};
        }
    }

    // Determinar la página actual
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            return 'inicio';
        } else if (path.includes('nosotros.html')) {
            return 'nosotros';
        } else if (path.includes('autismo.html')) {
            return 'autismo';
        } else if (path.includes('servicios.html')) {
            return 'servicios';
        } else if (path.includes('actualidad.html')) {
            return 'actualidad';
        } else if (path.includes('afiliate.html')) {
            return 'afiliate';
        } else if (path.includes('contacto.html')) {
            return 'contacto';
        }
        return 'unknown';
    }

    // Aplicar cambios según la página
    applyCMSChanges() {
        if (!this.cmsData || Object.keys(this.cmsData).length === 0) {
            console.log('No hay datos CMS para aplicar');
            return;
        }

        switch (this.currentPage) {
            case 'inicio':
                this.applyInicioChanges();
                break;
            case 'nosotros':
                this.applyNosotrosChanges();
                break;
            case 'autismo':
                this.applyAutismoChanges();
                break;
            case 'servicios':
                this.applyServiciosChanges();
                break;
            case 'actualidad':
                this.applyActualidadChanges();
                break;
            case 'afiliate':
                this.applyAfiliateChanges();
                break;
            case 'contacto':
                this.applyContactoChanges();
                break;
            default:
                console.log('Página no reconocida para aplicar cambios CMS');
        }
    }

    // Aplicar cambios a página de Inicio
    applyInicioChanges() {
        console.log('Aplicando cambios CMS a página de Inicio...');

        // Hero Section
        if (this.cmsData.hero) {
            this.updateTextContent('.hero-title', this.cmsData.hero.title);
            this.updateTextContent('.hero-description', this.cmsData.hero.description);
            this.updateImageSrc('.hero-img', this.cmsData.hero.image);
        }

        // Stats Section (estadísticas en hero-stats)
        if (this.cmsData.stats && this.cmsData.stats.items) {
            this.cmsData.stats.items.forEach((stat, index) => {
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-number`, stat.number);
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-text`, stat.label);
            });
        }

        // Features Section (características principales)
        if (this.cmsData.features && this.cmsData.features.items) {
            this.cmsData.features.items.forEach((feature, index) => {
                this.updateTextContent(`.features-grid .feature-card:nth-child(${index + 1}) h3`, feature.title);
                this.updateTextContent(`.features-grid .feature-card:nth-child(${index + 1}) p`, feature.description);
            });
        }

        // News Section (últimas noticias)
        if (this.cmsData.news && this.cmsData.news.items) {
            this.cmsData.news.items.forEach((item, index) => {
                this.updateTextContent(`.news-grid .news-card:nth-child(${index + 1}) h3`, item.title);
                this.updateTextContent(`.news-grid .news-card:nth-child(${index + 1}) p`, item.summary);
                this.updateImageSrc(`.news-grid .news-card:nth-child(${index + 1}) .news-image`, item.image);
                this.updateTextContent(`.news-grid .news-card:nth-child(${index + 1}) .news-category`, item.category);
            });
        }

        console.log('Cambios de Inicio aplicados');
    }

    // Aplicar cambios a página de Nosotros
    applyNosotrosChanges() {
        console.log('Aplicando cambios CMS a página de Nosotros...');

        // Header Section
        if (this.cmsData['nosotros-header']) {
            this.updateTextContent('.page-header h1', this.cmsData['nosotros-header'].title);
            this.updateTextContent('.page-header p', this.cmsData['nosotros-header'].description);
            this.updateImageSrc('.history-img', this.cmsData['nosotros-header'].image);
        }

        // Mission/Vision Section
        if (this.cmsData['nosotros-mission']) {
            this.updateTextContent('.mvv-card.mission h3', this.cmsData['nosotros-mission'].missionTitle);
            this.updateTextContent('.mvv-card.mission p', this.cmsData['nosotros-mission'].missionText);
            this.updateTextContent('.mvv-card.vision h3', this.cmsData['nosotros-mission'].visionTitle);
            this.updateTextContent('.mvv-card.vision p', this.cmsData['nosotros-mission'].visionText);
        }

        // Timeline Section
        if (this.cmsData['nosotros-timeline'] && this.cmsData['nosotros-timeline'].items) {
            const timelineContainer = document.querySelector('.history-timeline');
            if (timelineContainer) {
                timelineContainer.innerHTML = '';
                this.cmsData['nosotros-timeline'].items.forEach(item => {
                    const timelineItem = document.createElement('div');
                    timelineItem.className = 'timeline-item';
                    timelineItem.innerHTML = `
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-content">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `;
                    timelineContainer.appendChild(timelineItem);
                });
            }
        }

        console.log('Cambios de Nosotros aplicados');
    }

    // Aplicar cambios a página de Autismo
    applyAutismoChanges() {
        console.log('Aplicando cambios CMS a página de Autismo...');

        if (this.cmsData['autismo-header']) {
            this.updateTextContent('#autismo-header h1', this.cmsData['autismo-header'].title);
            this.updateTextContent('#autismo-header p', this.cmsData['autismo-header'].description);
        }

        if (this.cmsData['autismo-intro'] && this.cmsData['autismo-intro'].keyPoints) {
            const keyPointsContainer = document.querySelector('#key-points');
            if (keyPointsContainer) {
                keyPointsContainer.innerHTML = '';
                this.cmsData['autismo-intro'].keyPoints.forEach(point => {
                    const pointElement = document.createElement('div');
                    pointElement.className = 'key-point';
                    pointElement.innerHTML = `<h3>${point.title}</h3><p>${point.description}</p>`;
                    keyPointsContainer.appendChild(pointElement);
                });
            }
        }

        console.log('Cambios de Autismo aplicados');
    }

    // Aplicar cambios a página de Servicios
    applyServiciosChanges() {
        console.log('Aplicando cambios CMS a página de Servicios...');

        if (this.cmsData['servicios-header']) {
            this.updateTextContent('#servicios-header h1', this.cmsData['servicios-header'].title);
            this.updateTextContent('#servicios-header p', this.cmsData['servicios-header'].description);
        }

        if (this.cmsData['servicios-pilares'] && this.cmsData['servicios-pilares'].services) {
            this.cmsData['servicios-pilares'].services.forEach((service, index) => {
                this.updateTextContent(`.service-item:nth-child(${index + 1}) h3`, service.title);
                this.updateTextContent(`.service-item:nth-child(${index + 1}) p`, service.description);
            });
        }

        console.log('Cambios de Servicios aplicados');
    }

    // Aplicar cambios a página de Actualidad
    applyActualidadChanges() {
        console.log('Aplicando cambios CMS a página de Actualidad...');

        if (this.cmsData['actualidad-header']) {
            this.updateTextContent('#actualidad-header h1', this.cmsData['actualidad-header'].title);
            this.updateTextContent('#actualidad-header p', this.cmsData['actualidad-header'].description);
        }

        console.log('Cambios de Actualidad aplicados');
    }

    // Aplicar cambios a página de Afíliate
    applyAfiliateChanges() {
        console.log('Aplicando cambios CMS a página de Afíliate...');

        if (this.cmsData['afiliate-header']) {
            this.updateTextContent('#afiliate-header h1', this.cmsData['afiliate-header'].title);
            this.updateTextContent('#afiliate-header p', this.cmsData['afiliate-header'].description);
        }

        if (this.cmsData['afiliate-membership'] && this.cmsData['afiliate-membership'].types) {
            this.cmsData['afiliate-membership'].types.forEach((type, index) => {
                this.updateTextContent(`.membership-type:nth-child(${index + 1}) h3`, type.title);
                this.updateTextContent(`.membership-type:nth-child(${index + 1}) p`, type.description);
            });
        }

        console.log('Cambios de Afíliate aplicados');
    }

    // Aplicar cambios a página de Contacto
    applyContactoChanges() {
        console.log('Aplicando cambios CMS a página de Contacto...');

        if (this.cmsData['contacto-header']) {
            this.updateTextContent('#contacto-header h1', this.cmsData['contacto-header'].title);
            this.updateTextContent('#contacto-header p', this.cmsData['contacto-header'].description);
        }

        if (this.cmsData['contacto-info']) {
            this.updateTextContent('#contact-phone', this.cmsData['contacto-info'].phone);
            this.updateTextContent('#contact-email', this.cmsData['contacto-info'].email);
            this.updateTextContent('#contact-address', this.cmsData['contacto-info'].address);
            this.updateTextContent('#contact-hours', this.cmsData['contacto-info'].hours);
        }

        console.log('Cambios de Contacto aplicados');
    }

    // Métodos helper para actualizar contenido
    updateTextContent(selector, content) {
        if (!content) return;
        
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = content;
            console.log(`Actualizado ${selector}:`, content);
        } else {
            console.warn(`Elemento no encontrado: ${selector}`);
        }
    }

    updateImageSrc(selector, src) {
        if (!src) return;
        
        const element = document.querySelector(selector);
        if (element) {
            element.src = src;
            element.alt = 'Imagen actualizada desde CMS';
            console.log(`Actualizada imagen ${selector}:`, src);
        } else {
            console.warn(`Imagen no encontrada: ${selector}`);
        }
    }

    // Método para actualizar HTML interno
    updateHTML(selector, html) {
        if (!html) return;
        
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
            console.log(`Actualizado HTML ${selector}`);
        } else {
            console.warn(`Elemento no encontrado: ${selector}`);
        }
    }

    // Método público para inicializar
    init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.applyCMSChanges();
            });
        } else {
            this.applyCMSChanges();
        }
    }

    // Método para escuchar mensajes del CMS (para actualizaciones en tiempo real)
    listenForCMSUpdates() {
        // Escuchar mensajes postMessage del CMS
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CMS_UPDATE') {
                console.log('Recibida actualización del CMS via postMessage:', event.data);
                this.handleCMSUpdate(event.data);
            }
        });

        // Escuchar cambios en localStorage (funciona entre pestañas)
        window.addEventListener('storage', (event) => {
            if (event.key === 'fantea_cms_data') {
                console.log('Detectado cambio en localStorage del CMS');
                this.cmsData = this.loadCMSData();
                this.applyCMSChanges();
            }
        });

        // Escuchar eventos personalizados (mismo contexto)
        window.addEventListener('cms-data-updated', (event) => {
            console.log('Detectado evento personalizado del CMS:', event.detail);
            this.handleCMSUpdate(event.detail);
        });

        // Escuchar BroadcastChannel (comunicación entre pestañas)
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                this.cmsChannel = new BroadcastChannel('fantea-cms');
                this.cmsChannel.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'CMS_UPDATE') {
                        console.log('Recibida actualización del CMS via BroadcastChannel:', event.data);
                        this.handleCMSUpdate(event.data);
                    }
                });
                console.log('BroadcastChannel listener inicializado');
            } catch (e) {
                console.log('BroadcastChannel no disponible:', e);
            }
        }

        // Polling como respaldo (cada 5 segundos)
        this.pollInterval = setInterval(() => {
            const freshData = this.loadCMSData();
            if (JSON.stringify(freshData) !== JSON.stringify(this.cmsData)) {
                console.log('Detectados cambios via polling');
                this.cmsData = freshData;
                this.applyCMSChanges();
            }
        }, 5000);
    }

    // Manejar actualizaciones del CMS
    handleCMSUpdate(updateData) {
        // Recargar todos los datos para asegurar consistencia
        this.cmsData = this.loadCMSData();
        
        // Aplicar cambios específicos si es posible
        if (updateData.section && updateData.data) {
            this.cmsData[updateData.section] = updateData.data;
        }
        
        this.applyCMSChanges();
    }

    // Limpiar recursos cuando sea necesario
    cleanup() {
        if (this.cmsChannel) {
            this.cmsChannel.close();
        }
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }
}

// Inicializar automáticamente cuando se carga el script
if (typeof window !== 'undefined') {
    const cmsSync = new CMSSync();
    cmsSync.init();
    cmsSync.listenForCMSUpdates();
    
    // Limpiar recursos al cerrar la ventana
    window.addEventListener('beforeunload', () => {
        cmsSync.cleanup();
    });
    
    // Limpiar recursos al cambiar de página
    window.addEventListener('pagehide', () => {
        cmsSync.cleanup();
    });
    
    // Hacer disponible globalmente para debugging
    window.CMSSync = cmsSync;
    
    console.log('CMS Sync inicializado correctamente con múltiples canales de comunicación');
} 