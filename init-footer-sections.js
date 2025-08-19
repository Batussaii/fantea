// Script to manually initialize missing footer sections
console.log('Initializing missing footer sections...');

const missingSections = {
    'footer-social': {
        facebook: 'https://facebook.com/fantea',
        twitter: 'https://twitter.com/fantea',
        instagram: 'https://instagram.com/fantea',
        linkedin: 'https://linkedin.com/company/fantea',
        youtube: 'https://youtube.com/fantea'
    },
    'footer-navigation': {
        title: 'Navegación',
        links: [
            { text: 'Sobre Nosotros', url: 'quienes-somos.html' },
            { text: 'Asociaciones Federadas', url: 'asociaciones.html' },
            { text: 'Áreas', url: 'areas.html' },
            { text: 'Nuestro Manifiesto', url: 'manifiesto.html' },
            { text: 'Prensa', url: 'prensa.html' },
            { text: 'Afíliate', url: 'afiliate.html' }
        ]
    },
    'footer-contact': {
        title: 'Contacto',
        address: 'Calle Principal 123, Sevilla',
        phone: '+34 954 123 456',
        email: 'info@fantea.org',
        buttonText: 'Contactar'
    },
    'footer-bottom': {
        copyright: '© 2024 FANTEA - Federación Andaluza de Autismo. Todos los derechos reservados.',
        links: [
            { text: 'Política de Privacidad', url: '#' },
            { text: 'Términos de Uso', url: '#' },
            { text: 'Cookies', url: '#' }
        ]
    }
};

async function initializeMissingSections() {
    for (const [section, data] of Object.entries(missingSections)) {
        try {
            const response = await fetch(CMS_CONFIG.apiUrls.save, {
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
                console.log(`✓ Section ${section} initialized successfully`);
            } else {
                console.error(`✗ Failed to initialize section ${section}`);
            }
        } catch (error) {
            console.error(`✗ Error initializing section ${section}:`, error);
        }
    }
}

// Run the initialization
initializeMissingSections();
