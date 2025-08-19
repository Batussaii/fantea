// ==========================================================================
// CMS CONFIGURATION FOR FOOTER
// ==========================================================================

const CMS_CONFIG = {
    // Logo y descripción principal
    'footer-logo': {
        title: 'FANTEA',
        description: 'Federación Andaluza de Autismo. Trabajando por la inclusión y los derechos de las personas autistas en Andalucía desde 2009.'
    },

    // Redes sociales
    'footer-social': {
        facebook: 'https://facebook.com/fantea',
        twitter: 'https://twitter.com/fantea',
        instagram: 'https://instagram.com/fantea',
        linkedin: 'https://linkedin.com/company/fantea',
        youtube: 'https://youtube.com/fantea'
    },

    // Navegación
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

    // Recursos
    'footer-resources': {
        title: 'Recursos',
        links: [
            { text: 'Estatutos', url: 'estatutos.html' },
            { text: 'Guías para Familias', url: '#' },
            { text: 'Formación Profesional', url: '#' },
            { text: 'Centro de Descargas', url: '#' },
            { text: 'Preguntas Frecuentes', url: '#' },
            { text: 'Política de Privacidad', url: '#' }
        ]
    },

    // Contacto
    'footer-contact': {
        title: 'Contacto',
        address: 'Calle Principal 123, Sevilla',
        phone: '+34 954 123 456',
        email: 'info@fantea.org',
        buttonText: 'Contactar'
    },

    // Footer bottom
    'footer-bottom': {
        copyright: '© 2024 FANTEA - Federación Andaluza de Autismo. Todos los derechos reservados.',
        links: [
            { text: 'Política de Privacidad', url: '#' },
            { text: 'Términos de Uso', url: '#' },
            { text: 'Cookies', url: '#' }
        ]
    }
};

// Default data structure for CMS initialization
const defaultData = {
    'footer-logo': CMS_CONFIG['footer-logo'],
    'footer-social': CMS_CONFIG['footer-social'],
    'footer-navigation': CMS_CONFIG['footer-navigation'],
    'footer-resources': CMS_CONFIG['footer-resources'],
    'footer-contact': CMS_CONFIG['footer-contact'],
    'footer-bottom': CMS_CONFIG['footer-bottom']
};
