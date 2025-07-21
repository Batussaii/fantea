/**
 * FANTEA - Sistema de Traducción Multilingüe
 * Soporte para Español (por defecto) e Inglés
 */

// Idiomas disponibles
const AVAILABLE_LANGUAGES = {
    'es': {
        name: 'Español',
        flag: '🇪🇸'
    },
    'en': {
        name: 'English',
        flag: '🇺🇸'
    }
};

// Idioma por defecto
const DEFAULT_LANGUAGE = 'es';

// Traducciones del sitio web
const TRANSLATIONS = {
    es: {
        // Navegación
        nav: {
            home: 'Inicio',
            about: 'Nosotros',
            autism: 'Sobre el Autismo',
            services: 'Servicios',
            news: 'Actualidad',
            affiliate: 'Afíliate',
            contact: 'Contacto',
            join: 'Únete a Nosotros'
        },
        
        // Hero section
        hero: {
            title: 'Unidos por la diversidad, <span class="highlight">comprometidos con el autismo</span> en Andalucía',
            description: 'FANTEA es la federación que une a las asociaciones de autismo de toda Andalucía para defender derechos, promover inclusión y ofrecer recursos especializados a personas autistas y sus familias.',
            buttons: {
                about: 'Conócenos',
                affiliate: 'Afíliate',
                donate: 'Haz una Donación'
            },
            stats: {
                families: 'familias andaluzas<br>apoyadas',
                associations: 'asociaciones<br>afiliadas',
                professionals: 'profesionales<br>formados',
                resources: 'recursos y guías<br>disponibles'
            }
        },
        
        // Secciones principales
        sections: {
            whatWeDo: 'Lo que Hacemos',
            latestNews: 'Últimas Noticias',
            ourServices: 'Nuestros Servicios',
            getInvolved: 'Participa'
        },
        
        // Servicios
        services: {
            inclusion: {
                title: 'Inclusión Educativa',
                description: 'Programas y recursos para facilitar la inclusión en centros educativos'
            },
            employment: {
                title: 'Empleo con Apoyo',
                description: 'Orientación y acompañamiento para la inserción laboral'
            },
            families: {
                title: 'Apoyo a Familias',
                description: 'Asesoramiento psicológico y orientación especializada'
            },
            training: {
                title: 'Formación Profesional',
                description: 'Cursos y talleres para profesionales del sector'
            }
        },
        
        // Footer
        footer: {
            navigation: 'Navegación',
            resources: 'Recursos',
            contact: 'Contacto',
            about: 'Sobre Nosotros',
            autism: '¿Qué es el Autismo?',
            services: 'Servicios',
            news: 'Noticias',
            affiliate: 'Afíliate',
            familyGuides: 'Guías para Familias',
            professionalTraining: 'Formación Profesional',
            downloadCenter: 'Centro de Descargas',
            faq: 'Preguntas Frecuentes',
            privacy: 'Política de Privacidad',
            contactBtn: 'Contactar',
            address: 'Calle Principal 123, Sevilla',
            phone: '+34 954 123 456',
            email: 'info@fantea.org',
            copyright: '© 2024 FANTEA - Federación Andaluza de Autismo. Todos los derechos reservados.',
            terms: 'Términos de Uso',
            cookies: 'Cookies'
        },
        
        // Página Nosotros
        about: {
            pageTitle: 'Nosotros',
            pageDescription: 'Conoce la historia, misión y equipo de FANTEA',
            breadcrumb: 'Nosotros',
            ourHistory: 'Nuestra Historia',
            ourMission: 'Nuestra Misión',
            ourVision: 'Nuestra Visión',
            ourValues: 'Nuestros Valores',
            timeline: {
                foundation: {
                    title: 'Fundación de FANTEA',
                    description: 'Constitución de la Federación Andaluza de Autismo con el objetivo de unir fuerzas por la inclusión.'
                },
                recognition: {
                    title: 'Reconocimiento Autonómico',
                    description: 'La Junta de Andalucía reconoce oficialmente a FANTEA como entidad de utilidad pública regional.'
                },
                expansion: {
                    title: 'Expansión Regional',
                    description: 'FANTEA se extiende a las 8 provincias andaluzas con 35 asociaciones afiliadas activamente.'
                }
            }
        },
        
        // Página Servicios
        servicesPage: {
            pageTitle: 'Programas y Servicios',
            pageDescription: 'Descubre nuestros programas de inclusión educativa y laboral, apoyo a familias, formación profesional y campañas de sensibilización en Andalucía',
            pillars: 'Nuestros Pilares de Acción',
            pillarsDescription: 'Trabajamos en cuatro áreas fundamentales para construir una Andalucía más inclusiva',
            educationalInclusion: {
                title: 'Inclusión Educativa y Laboral',
                description: 'Programas para facilitar el acceso y permanencia de personas autistas en centros educativos y entornos laborales.',
                learnMore: 'Descubre más'
            },
            familySupport: {
                title: 'Apoyo a Familias',
                description: 'Orientación, apoyo psicológico y recursos para familias de personas autistas en toda Andalucía.',
                learnMore: 'Descubre más'
            },
            training: {
                title: 'Formación y Sensibilización',
                description: 'Programas formativos para profesionales, educadores y sociedad en general sobre autismo y neurodiversidad.',
                learnMore: 'Descubre más'
            },
            campaigns: {
                title: 'Campañas Institucionales',
                description: 'Iniciativas de sensibilización y cambio social para mejorar la percepción y derechos de las personas autistas.',
                learnMore: 'Descubre más'
            }
        },
        
        // Página Afiliación
        affiliate: {
            pageTitle: 'Únete a Nosotros',
            pageDescription: 'Forma parte de la mayor red andaluza de apoyo a las personas autistas y sus familias',
            waysToParticipate: 'Formas de Participar',
            participateDescription: 'Elige la modalidad que mejor se adapte a tu situación y únete a nuestra causa',
            associations: 'Asociaciones',
            families: 'Familias',
            volunteers: 'Voluntarios',
            collaborators: 'Colaboradores',
            donations: {
                title: 'Donaciones y Patrocinios',
                description: 'Tu aportación económica nos ayuda a mantener y ampliar nuestros programas en Andalucía',
                oneTime: 'Donación Puntual',
                monthly: 'Donación Mensual',
                corporate: 'Patrocinio Empresarial',
                donate: 'Donar Ahora',
                becomePartner: 'Hacerse Socio Colaborador'
            },
            documents: {
                title: 'Documentos y Estatutos',
                description: 'Descarga la documentación oficial y requisitos legales para la afiliación a FANTEA',
                corporate: 'Documentos Corporativos',
                forms: 'Formularios de Afiliación',
                legal: 'Documentos Legales',
                resources: 'Recursos y Guías',
                download: 'Descargar'
            }
        },
        
        // Página Contacto
        contact: {
            pageTitle: 'Contacto',
            pageDescription: 'Ponte en contacto con FANTEA - Estamos aquí para ayudarte',
            getInTouch: 'Ponte en Contacto',
            contactForm: 'Formulario de Contacto',
            name: 'Nombre',
            email: 'Correo Electrónico',
            phone: 'Teléfono',
            subject: 'Asunto',
            message: 'Mensaje',
            send: 'Enviar Mensaje',
            contactInfo: 'Información de Contacto',
            office: 'Oficina Principal',
            schedule: 'Horario de Atención',
            scheduleTime: 'Lunes a Viernes: 9:00 - 17:00h',
            socialMedia: 'Síguenos en Redes Sociales'
        },
        
        // Elementos comunes
        common: {
            readMore: 'Leer más',
            learnMore: 'Conocer más',
            viewAll: 'Ver todos',
            close: 'Cerrar',
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito',
            required: 'Campo requerido',
            backToTop: 'Volver arriba',
            search: 'Buscar',
            filter: 'Filtrar',
            reset: 'Restablecer',
            save: 'Guardar',
            cancel: 'Cancelar',
            accept: 'Aceptar',
            reject: 'Rechazar',
            edit: 'Editar',
            delete: 'Eliminar',
            share: 'Compartir',
            print: 'Imprimir',
            download: 'Descargar'
        },
        
        // Accessibility
        accessibility: {
            title: 'Opciones de Accesibilidad',
            increaseFontSize: 'Aumentar texto',
            decreaseFontSize: 'Reducir texto',
            highContrast: 'Alto contraste',
            dyslexiaFont: 'Fuente dislexia',
            skipToContent: 'Saltar al contenido principal'
        }
    },
    
    en: {
        // Navigation
        nav: {
            home: 'Home',
            about: 'About Us',
            autism: 'About Autism',
            services: 'Services',
            news: 'News',
            affiliate: 'Join Us',
            contact: 'Contact',
            join: 'Join Us'
        },
        
        // Hero section
        hero: {
            title: 'United in diversity, <span class="highlight">committed to autism</span> in Andalusia',
            description: 'FANTEA is the federation that unites autism associations across Andalusia to defend rights, promote inclusion and offer specialized resources to autistic people and their families.',
            buttons: {
                about: 'About Us',
                affiliate: 'Join Us',
                donate: 'Make a Donation'
            },
            stats: {
                families: 'Andalusian families<br>supported',
                associations: 'affiliated<br>associations',
                professionals: 'professionals<br>trained',
                resources: 'resources and guides<br>available'
            }
        },
        
        // Main sections
        sections: {
            whatWeDo: 'What We Do',
            latestNews: 'Latest News',
            ourServices: 'Our Services',
            getInvolved: 'Get Involved'
        },
        
        // Services
        services: {
            inclusion: {
                title: 'Educational Inclusion',
                description: 'Programs and resources to facilitate inclusion in educational centers'
            },
            employment: {
                title: 'Supported Employment',
                description: 'Guidance and support for job placement'
            },
            families: {
                title: 'Family Support',
                description: 'Psychological counseling and specialized guidance'
            },
            training: {
                title: 'Professional Training',
                description: 'Courses and workshops for sector professionals'
            }
        },
        
        // Footer
        footer: {
            navigation: 'Navigation',
            resources: 'Resources',
            contact: 'Contact',
            about: 'About Us',
            autism: 'What is Autism?',
            services: 'Services',
            news: 'News',
            affiliate: 'Join Us',
            familyGuides: 'Family Guides',
            professionalTraining: 'Professional Training',
            downloadCenter: 'Download Center',
            faq: 'Frequently Asked Questions',
            privacy: 'Privacy Policy',
            contactBtn: 'Contact',
            address: '123 Main Street, Seville',
            phone: '+34 954 123 456',
            email: 'info@fantea.org',
            copyright: '© 2024 FANTEA - Andalusian Autism Federation. All rights reserved.',
            terms: 'Terms of Use',
            cookies: 'Cookies'
        },
        
        // About page
        about: {
            pageTitle: 'About Us',
            pageDescription: 'Learn about FANTEA\'s history, mission and team',
            breadcrumb: 'About Us',
            ourHistory: 'Our History',
            ourMission: 'Our Mission',
            ourVision: 'Our Vision',
            ourValues: 'Our Values',
            timeline: {
                foundation: {
                    title: 'Foundation of FANTEA',
                    description: 'Establishment of the Andalusian Autism Federation with the goal of joining forces for inclusion.'
                },
                recognition: {
                    title: 'Regional Recognition',
                    description: 'The Andalusian Government officially recognizes FANTEA as a regional public utility entity.'
                },
                expansion: {
                    title: 'Regional Expansion',
                    description: 'FANTEA expands to all 8 Andalusian provinces with 35 actively affiliated associations.'
                }
            }
        },
        
        // Services page
        servicesPage: {
            pageTitle: 'Programs and Services',
            pageDescription: 'Discover our educational and employment inclusion programs, family support, professional training and awareness campaigns in Andalusia',
            pillars: 'Our Action Pillars',
            pillarsDescription: 'We work in four fundamental areas to build a more inclusive Andalusia',
            educationalInclusion: {
                title: 'Educational and Employment Inclusion',
                description: 'Programs to facilitate access and permanence of autistic people in educational centers and work environments.',
                learnMore: 'Learn more'
            },
            familySupport: {
                title: 'Family Support',
                description: 'Guidance, psychological support and resources for families of autistic people throughout Andalusia.',
                learnMore: 'Learn more'
            },
            training: {
                title: 'Training and Awareness',
                description: 'Training programs for professionals, educators and society in general about autism and neurodiversity.',
                learnMore: 'Learn more'
            },
            campaigns: {
                title: 'Institutional Campaigns',
                description: 'Awareness and social change initiatives to improve the perception and rights of autistic people.',
                learnMore: 'Learn more'
            }
        },
        
        // Affiliate page
        affiliate: {
            pageTitle: 'Join Us',
            pageDescription: 'Be part of the largest Andalusian network supporting autistic people and their families',
            waysToParticipate: 'Ways to Participate',
            participateDescription: 'Choose the option that best fits your situation and join our cause',
            associations: 'Associations',
            families: 'Families',
            volunteers: 'Volunteers',
            collaborators: 'Collaborators',
            donations: {
                title: 'Donations and Sponsorships',
                description: 'Your financial contribution helps us maintain and expand our programs in Andalusia',
                oneTime: 'One-time Donation',
                monthly: 'Monthly Donation',
                corporate: 'Corporate Sponsorship',
                donate: 'Donate Now',
                becomePartner: 'Become a Partner'
            },
            documents: {
                title: 'Documents and Statutes',
                description: 'Download official documentation and legal requirements for FANTEA affiliation',
                corporate: 'Corporate Documents',
                forms: 'Affiliation Forms',
                legal: 'Legal Documents',
                resources: 'Resources and Guides',
                download: 'Download'
            }
        },
        
        // Contact page
        contact: {
            pageTitle: 'Contact',
            pageDescription: 'Get in touch with FANTEA - We are here to help you',
            getInTouch: 'Get in Touch',
            contactForm: 'Contact Form',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            subject: 'Subject',
            message: 'Message',
            send: 'Send Message',
            contactInfo: 'Contact Information',
            office: 'Main Office',
            schedule: 'Business Hours',
            scheduleTime: 'Monday to Friday: 9:00 - 17:00',
            socialMedia: 'Follow us on Social Media'
        },
        
        // Common elements
        common: {
            readMore: 'Read more',
            learnMore: 'Learn more',
            viewAll: 'View all',
            close: 'Close',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            required: 'Required field',
            backToTop: 'Back to top',
            search: 'Search',
            filter: 'Filter',
            reset: 'Reset',
            save: 'Save',
            cancel: 'Cancel',
            accept: 'Accept',
            reject: 'Reject',
            edit: 'Edit',
            delete: 'Delete',
            share: 'Share',
            print: 'Print',
            download: 'Download'
        },
        
        // Accessibility
        accessibility: {
            title: 'Accessibility Options',
            increaseFontSize: 'Increase text',
            decreaseFontSize: 'Decrease text',
            highContrast: 'High contrast',
            dyslexiaFont: 'Dyslexia font',
            skipToContent: 'Skip to main content'
        }
    }
};

/**
 * Clase principal del sistema de traducción
 */
class TranslationSystem {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || DEFAULT_LANGUAGE;
        this.translations = TRANSLATIONS;
        this.init();
    }
    
    /**
     * Inicializar sistema de traducción
     */
    init() {
        this.createLanguageSelector();
        this.loadSavedLanguage();
        this.bindEvents();
    }
    
    /**
     * Obtener idioma almacenado
     */
    getStoredLanguage() {
        return localStorage.getItem('fantea_language') || 
               (navigator.language.startsWith('en') ? 'en' : DEFAULT_LANGUAGE);
    }
    
    /**
     * Cargar idioma guardado
     */
    loadSavedLanguage() {
        const savedLang = this.getStoredLanguage();
        if (savedLang && AVAILABLE_LANGUAGES[savedLang]) {
            this.setLanguage(savedLang);
        }
    }
    
    /**
     * Crear selector de idioma
     */
    createLanguageSelector() {
        // Crear selector si no existe
        let langSelector = document.getElementById('language-selector');
        if (!langSelector) {
            langSelector = document.createElement('div');
            langSelector.id = 'language-selector';
            langSelector.className = 'language-selector';
            
            // Insertar en la navegación
            const navbar = document.querySelector('.navbar .container');
            if (navbar) {
                navbar.appendChild(langSelector);
            }
        }
        
        // HTML del selector
        langSelector.innerHTML = `
            <div class="lang-toggle">
                <button class="lang-btn" id="langToggle" title="${this.t('common.selectLanguage', 'Seleccionar idioma')}">
                    <span class="lang-flag">${AVAILABLE_LANGUAGES[this.currentLanguage].flag}</span>
                    <span class="lang-code">${this.currentLanguage.toUpperCase()}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="lang-dropdown" id="langDropdown">
                    ${Object.entries(AVAILABLE_LANGUAGES).map(([code, lang]) => `
                        <button class="lang-option ${code === this.currentLanguage ? 'active' : ''}" 
                                data-lang="${code}">
                            <span class="lang-flag">${lang.flag}</span>
                            <span class="lang-name">${lang.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Vincular eventos
     */
    bindEvents() {
        // Toggle del selector
        const langToggle = document.getElementById('langToggle');
        const langDropdown = document.getElementById('langDropdown');
        
        if (langToggle && langDropdown) {
            langToggle.addEventListener('click', (e) => {
                e.preventDefault();
                langDropdown.classList.toggle('show');
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#language-selector')) {
                    langDropdown.classList.remove('show');
                }
            });
            
            // Opciones de idioma
            langDropdown.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedLang = option.getAttribute('data-lang');
                    this.setLanguage(selectedLang);
                    langDropdown.classList.remove('show');
                });
            });
        }
    }
    
    /**
     * Cambiar idioma
     */
    setLanguage(lang) {
        if (!AVAILABLE_LANGUAGES[lang]) return;
        
        this.currentLanguage = lang;
        localStorage.setItem('fantea_language', lang);
        
        // Actualizar atributo del documento
        document.documentElement.setAttribute('lang', lang);
        
        // Traducir contenido
        this.translatePage();
        
        // Actualizar selector
        this.updateLanguageSelector();
        
        // Disparar evento de cambio de idioma
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }
    
    /**
     * Actualizar selector visual
     */
    updateLanguageSelector() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            const flag = langToggle.querySelector('.lang-flag');
            const code = langToggle.querySelector('.lang-code');
            
            if (flag) flag.textContent = AVAILABLE_LANGUAGES[this.currentLanguage].flag;
            if (code) code.textContent = this.currentLanguage.toUpperCase();
        }
        
        // Actualizar opciones activas
        document.querySelectorAll('.lang-option').forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            option.classList.toggle('active', optionLang === this.currentLanguage);
        });
    }
    
    /**
     * Obtener traducción
     */
    t(key, fallback = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && value[k]) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }
        
        return typeof value === 'string' ? value : fallback || key;
    }
    
    /**
     * Traducir toda la página
     */
    translatePage() {
        // Buscar elementos con atributo data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation !== key) {
                // Verificar si es HTML
                if (element.hasAttribute('data-i18n-html')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Traducir atributos
        const attrElements = document.querySelectorAll('[data-i18n-attr]');
        
        attrElements.forEach(element => {
            const attrData = element.getAttribute('data-i18n-attr');
            try {
                const attrs = JSON.parse(attrData);
                Object.entries(attrs).forEach(([attr, key]) => {
                    const translation = this.t(key);
                    if (translation !== key) {
                        element.setAttribute(attr, translation);
                    }
                });
            } catch (e) {
                console.error('Error parsing i18n attributes:', e);
            }
        });
        
        // Actualizar meta tags
        this.updateMetaTags();
    }
    
    /**
     * Actualizar meta tags según idioma
     */
    updateMetaTags() {
        const langMeta = document.querySelector('meta[name="language"]') || 
                        document.createElement('meta');
        langMeta.setAttribute('name', 'language');
        langMeta.setAttribute('content', this.currentLanguage);
        document.head.appendChild(langMeta);
    }
    
    /**
     * Obtener idioma actual
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    /**
     * Verificar si el idioma está soportado
     */
    isLanguageSupported(lang) {
        return AVAILABLE_LANGUAGES.hasOwnProperty(lang);
    }
}

// Crear instancia global
const i18n = new TranslationSystem();

// Exponer funciones globales
window.i18n = i18n;
window.t = (key, fallback) => i18n.t(key, fallback);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    i18n.init();
});

// Escuchar cambios de idioma para acciones adicionales
document.addEventListener('languageChanged', function(event) {
    console.log('Language changed to:', event.detail.language);
    
    // Aquí se pueden ejecutar acciones adicionales cuando cambie el idioma
    // Por ejemplo: recargar contenido dinámico, actualizar fechas, etc.
}); 