// ==========================================================================
// CMS INITIALIZATION FOR CONTACTO PAGE
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando CMS para página de contacto...');
    
    // Initialize CMS data for contacto page
    initializeContactoCMS();
});

async function initializeContactoCMS() {
    try {
        // Check if CMS data exists for each section
        const sections = Object.keys(defaultData);
        
        for (const section of sections) {
            try {
                const response = await fetch(`${API_BASE_URL}/cms/load/${section}`);
                
                if (!response.ok) {
                    console.log(`Inicializando sección: ${section}`);
                    // Save default data for this section
                    await saveSectionData(section, defaultData[section]);
                } else {
                    console.log(`Sección ${section} ya tiene datos`);
                }
            } catch (error) {
                console.error(`Error al inicializar sección ${section}:`, error);
                // Try to save default data anyway
                try {
                    await saveSectionData(section, defaultData[section]);
                } catch (saveError) {
                    console.error(`Error al guardar datos por defecto para ${section}:`, saveError);
                }
            }
        }
        
        console.log('Inicialización del CMS de contacto completada');
        
    } catch (error) {
        console.error('Error durante la inicialización del CMS de contacto:', error);
    }
}

async function saveSectionData(section, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/cms/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                section: section,
                data: data
            })
        });
        
        if (response.ok) {
            console.log(`Datos guardados para sección: ${section}`);
        } else {
            throw new Error(`Error al guardar sección ${section}`);
        }
    } catch (error) {
        console.error(`Error al guardar sección ${section}:`, error);
        throw error;
    }
}
