/**
 * Real-Time Sync - Sistema de sincronización en tiempo real para FANTEA
 * Maneja la sincronización automática de datos del CMS entre múltiples usuarios
 */

class RealTimeSync {
    constructor() {
        this.syncInterval = null;
        this.lastSyncTime = Date.now();
        this.syncFrequency = 3000; // 3 segundos
        this.isAdmin = window.location.pathname.includes('/admin/');
        this.channels = [];
        this.lastDataHash = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        console.log('🔄 Real-Time Sync inicializado');
        this.initialize();
    }

    async initialize() {
        // Configurar múltiples canales de comunicación
        this.setupBroadcastChannel();
        this.setupStorageListener();
        this.setupVisibilityListener();
        this.setupPolling();
        
        // Cargar datos iniciales
        await this.syncData();
        
        console.log('✅ Real-Time Sync configurado con múltiples canales');
    }

    // Configurar BroadcastChannel para comunicación entre pestañas
    setupBroadcastChannel() {
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                const channel = new BroadcastChannel('fantea-cms-sync');
                channel.addEventListener('message', (event) => {
                    if (event.data.type === 'DATA_UPDATED') {
                        console.log('🔄 Datos actualizados via BroadcastChannel');
                        this.handleDataUpdate(event.data);
                    }
                });
                this.channels.push(channel);
                console.log('📡 BroadcastChannel configurado');
            } catch (error) {
                console.warn('BroadcastChannel no disponible:', error);
            }
        }
    }

    // Escuchar cambios en localStorage
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'fantea_cms_data' && event.newValue !== event.oldValue) {
                console.log('🔄 Cambio detectado en localStorage');
                this.handleStorageChange(event.newValue);
            }
        });
    }

    // Configurar listener para cuando la página vuelve a ser visible
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('👁️ Página visible, sincronizando datos...');
                this.syncData();
            }
        });

        window.addEventListener('focus', () => {
            console.log('🎯 Ventana enfocada, sincronizando datos...');
            this.syncData();
        });
    }

    // Configurar polling regular
    setupPolling() {
        this.syncInterval = setInterval(() => {
            this.syncData();
        }, this.syncFrequency);
    }

    // Sincronizar datos con el servidor
    async syncData() {
        try {
            const response = await fetch(CMS_CONFIG.apiUrls.load, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const dataHash = this.generateHash(result.data);
                    
                    // Solo procesar si los datos han cambiado
                    if (dataHash !== this.lastDataHash) {
                        console.log('🔄 Nuevos datos detectados, actualizando...');
                        this.lastDataHash = dataHash;
                        
                        // Actualizar localStorage
                        localStorage.setItem('fantea_cms_data', JSON.stringify(result.data));
                        localStorage.setItem('fantea_cms_sync_time', Date.now().toString());
                        
                        // Notificar a otras pestañas
                        this.broadcastUpdate(result.data);
                        
                        // Aplicar cambios si hay un sistema CMS activo
                        if (window.CMSSync && typeof window.CMSSync.applyCMSChanges === 'function') {
                            window.CMSSync.cmsData = result.data;
                            window.CMSSync.applyCMSChanges();
                        }
                        
                        // Actualizar cache buster
                        if (window.cacheBuster) {
                            window.cacheBuster.version = window.cacheBuster.generateVersion();
                            window.cacheBuster.addVersionToLocalStorage();
                        }
                        
                        this.retryCount = 0;
                        this.lastSyncTime = Date.now();
                        
                        console.log('✅ Sincronización completada');
                    }
                }
            } else {
                console.warn('Error en respuesta del servidor:', response.status);
                this.handleSyncError();
            }
        } catch (error) {
            console.error('Error sincronizando datos:', error);
            this.handleSyncError();
        }
    }

    // Manejar errores de sincronización
    handleSyncError() {
        this.retryCount++;
        
        if (this.retryCount < this.maxRetries) {
            // Reintentar con delay exponencial
            const delay = Math.pow(2, this.retryCount) * 1000;
            console.log(`⏳ Reintentando sincronización en ${delay}ms (intento ${this.retryCount}/${this.maxRetries})`);
            
            setTimeout(() => {
                this.syncData();
            }, delay);
        } else {
            console.error('❌ Máximo número de reintentos alcanzado');
            // Aumentar frecuencia de polling como fallback
            if (this.syncFrequency < 30000) {
                this.syncFrequency = 30000; // 30 segundos
                this.restartPolling();
            }
        }
    }

    // Reiniciar polling con nueva frecuencia
    restartPolling() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        this.setupPolling();
        console.log(`🔄 Polling reiniciado con frecuencia de ${this.syncFrequency}ms`);
    }

    // Generar hash de los datos para detectar cambios
    generateHash(data) {
        const str = JSON.stringify(data, Object.keys(data).sort());
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit
        }
        return hash.toString();
    }

    // Difundir actualización a otras pestañas
    broadcastUpdate(data) {
        const updateData = {
            type: 'DATA_UPDATED',
            data: data,
            timestamp: Date.now(),
            source: this.isAdmin ? 'admin' : 'web'
        };

        // BroadcastChannel
        this.channels.forEach(channel => {
            try {
                channel.postMessage(updateData);
            } catch (error) {
                console.warn('Error enviando via BroadcastChannel:', error);
            }
        });

        // Evento personalizado para la misma ventana
        window.dispatchEvent(new CustomEvent('cms-data-updated', {
            detail: updateData
        }));
    }

    // Manejar actualización de datos
    handleDataUpdate(updateData) {
        if (updateData.timestamp > this.lastSyncTime) {
            console.log('🔄 Aplicando actualización recibida');
            
            // Actualizar localStorage
            localStorage.setItem('fantea_cms_data', JSON.stringify(updateData.data));
            localStorage.setItem('fantea_cms_sync_time', updateData.timestamp.toString());
            
            // Aplicar cambios
            if (window.CMSSync && typeof window.CMSSync.applyCMSChanges === 'function') {
                window.CMSSync.cmsData = updateData.data;
                window.CMSSync.applyCMSChanges();
            }
            
            // Actualizar dashboard si estamos en admin
            if (this.isAdmin && window.loadSavedContent) {
                window.loadSavedContent();
            }
            
            this.lastSyncTime = updateData.timestamp;
        }
    }

    // Manejar cambios en localStorage
    handleStorageChange(newValue) {
        if (newValue) {
            try {
                const data = JSON.parse(newValue);
                const dataHash = this.generateHash(data);
                
                if (dataHash !== this.lastDataHash) {
                    this.lastDataHash = dataHash;
                    
                    if (window.CMSSync && typeof window.CMSSync.applyCMSChanges === 'function') {
                        window.CMSSync.cmsData = data;
                        window.CMSSync.applyCMSChanges();
                    }
                }
            } catch (error) {
                console.error('Error procesando cambio de localStorage:', error);
            }
        }
    }

    // Forzar sincronización manual
    async forceSyncNow() {
        console.log('🚀 Sincronización forzada iniciada');
        clearInterval(this.syncInterval);
        await this.syncData();
        this.setupPolling();
        return true;
    }

    // Obtener estado de sincronización
    getSyncStatus() {
        return {
            lastSync: new Date(this.lastSyncTime).toLocaleString(),
            frequency: this.syncFrequency,
            retryCount: this.retryCount,
            isAdmin: this.isAdmin,
            channels: this.channels.length
        };
    }

    // Limpiar recursos
    cleanup() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        this.channels.forEach(channel => {
            try {
                channel.close();
            } catch (error) {
                console.warn('Error cerrando canal:', error);
            }
        });
        
        console.log('🧹 Real-Time Sync limpiado');
    }
}

// Inicializar automáticamente
if (typeof window !== 'undefined') {
    // Esperar a que CMS_CONFIG esté disponible
    const initRealTimeSync = () => {
        if (window.CMS_CONFIG) {
            window.realTimeSync = new RealTimeSync();
            
            // Limpiar al cerrar ventana
            window.addEventListener('beforeunload', () => {
                window.realTimeSync.cleanup();
            });
            
            // Funciones globales para debugging
            window.forceSyncNow = () => window.realTimeSync.forceSyncNow();
            window.getSyncStatus = () => window.realTimeSync.getSyncStatus();
            
            console.log('🔄 Real-Time Sync disponible globalmente');
        } else {
            // Reintentar en 100ms
            setTimeout(initRealTimeSync, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRealTimeSync);
    } else {
        initRealTimeSync();
    }
}
