/**
 * Inicialización del CMS para la página de Afiliate
 * Se encarga de inicializar los datos por defecto si no existen
 */

class AfiliateCMSInit {
    constructor() {
        this.config = window.AFILIATE_CMS_CONFIG;
        this.apiUrl = window.CMS_CONFIG ? window.CMS_CONFIG.apiUrl : '/api/cms';
    }

    async initialize() {
        console.log('Inicializando CMS de Afiliate...');
        
        try {
            // Cargar datos existentes
            const response = await fetch(`${this.apiUrl}/load`);
            let existingData = {};
            
            if (response.ok) {
                existingData = await response.json();
                console.log('Datos existentes cargados:', existingData);
            }

            // Determinar qué secciones necesitan inicialización
            const sectionsToInitialize = this.getSectionsToInitialize(existingData);
            
            if (sectionsToInitialize.length > 0) {
                console.log('Secciones a inicializar:', sectionsToInitialize);
                await this.initializeSections(sectionsToInitialize);
            } else {
                console.log('Todas las secciones ya están inicializadas');
            }
            
        } catch (error) {
            console.error('Error durante la inicialización:', error);
        }
    }

    getSectionsToInitialize(existingData) {
        const sections = [];
        
        // Verificar cada sección del config
        Object.keys(this.config.sections).forEach(sectionKey => {
            if (!existingData[sectionKey]) {
                sections.push(sectionKey);
            }
        });
        
        return sections;
    }

    async initializeSections(sections) {
        for (const sectionKey of sections) {
            try {
                const sectionData = this.config.defaultData[sectionKey];
                if (sectionData) {
                    console.log(`Inicializando sección: ${sectionKey}`);
                    
                    const response = await fetch(`${this.apiUrl}/save`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            [sectionKey]: sectionData
                        })
                    });
                    
                    if (response.ok) {
                        console.log(`Sección ${sectionKey} inicializada correctamente`);
                    } else {
                        console.error(`Error al inicializar sección ${sectionKey}`);
                    }
                }
            } catch (error) {
                console.error(`Error al inicializar sección ${sectionKey}:`, error);
            }
        }
    }

    async reinitializeAll() {
        console.log('Reinicializando todas las secciones...');
        
        try {
            // Guardar todos los datos por defecto
            const response = await fetch(`${this.apiUrl}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.config.defaultData)
            });
            
            if (response.ok) {
                console.log('Todas las secciones reinicializadas correctamente');
            } else {
                console.error('Error al reinicializar secciones');
            }
        } catch (error) {
            console.error('Error durante la reinicialización:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('afiliate.html')) {
        window.afiliateCMSInit = new AfiliateCMSInit();
        window.afiliateCMSInit.initialize();
    }
});
