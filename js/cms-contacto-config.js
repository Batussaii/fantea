// ==========================================================================
// CMS CONFIGURATION FOR CONTACTO PAGE
// ==========================================================================

const CMS_CONFIG = {
    // Banner de página
    'contacto-banner': {
        title: 'Contacto',
        description: 'Estamos aquí para ayudarte. Contacta con nosotros para cualquier consulta, información o apoyo que necesites'
    },

    // Formulario de contacto
    'contacto-formulario': {
        title: 'Envíanos un Mensaje',
        description: 'Completa el formulario y nos pondremos en contacto contigo lo antes posible',
        buttonText: 'Enviar Mensaje'
    },

    // Información de contacto
    'contacto-info': {
        title: 'Información de Contacto',
        address: {
            title: 'Dirección',
            text: 'Calle de la Inclusión, 123\n28015 Madrid, España'
        },
        phone: {
            title: 'Teléfono',
            number: '+34 900 123 456',
            schedule: 'Lunes a Viernes: 9:00 - 18:00'
        },
        email: {
            title: 'Email',
            address: 'info@fantea.org'
        },
        specialized: {
            title: 'Atención Especializada',
            email: 'atencion@fantea.org',
            description: 'Para consultas específicas sobre TEA'
        }
    },

    // Línea de apoyo
    'contacto-apoyo': {
        title: 'Línea de Apoyo 24/7',
        number: '900 800 700',
        description: 'Apoyo emocional y orientación para familias en situaciones de crisis'
    },

    // Horarios de atención
    'contacto-horarios': {
        title: 'Horarios de Atención',
        schedules: [
            { day: 'Lunes - Viernes', time: '9:00 - 18:00' },
            { day: 'Sábado', time: '10:00 - 14:00' },
            { day: 'Domingo', time: 'Cerrado' }
        ],
        note: 'Para urgencias fuera del horario de oficina, utiliza nuestra línea de apoyo 24/7'
    },

    // Ubicación
    'contacto-ubicacion': {
        title: 'Nuestra Ubicación',
        description: 'Visítanos en nuestras oficinas centrales en el corazón de Madrid'
    },

    // Cómo llegar
    'contacto-transporte': {
        title: 'Cómo Llegar',
        metro: {
            title: 'Metro',
            description: 'Líneas 2, 5 y 10 - Estación Chueca (5 min andando)'
        },
        bus: {
            title: 'Autobús',
            description: 'Líneas 3, 40, 149 - Parada Gran Vía (3 min andando)'
        },
        parking: {
            title: 'Parking',
            description: 'Parking público disponible en Calle Hortaleza'
        }
    },

    // Accesibilidad
    'contacto-accesibilidad': {
        title: 'Accesibilidad',
        features: [
            'Acceso para sillas de ruedas',
            'Ascensor disponible',
            'Intérprete de lengua de signos (cita previa)',
            'Material en braille disponible',
            'Plaza de parking reservada'
        ]
    },

    // Preguntas frecuentes
    'contacto-faq': {
        title: 'Preguntas Frecuentes',
        description: 'Resolvemos las dudas más comunes antes de que nos contactes',
        questions: [
            {
                question: '¿Cómo puedo obtener información sobre servicios de apoyo?',
                answer: 'Puedes contactarnos directamente por teléfono, email o a través del formulario de esta página. También ofrecemos consultas presenciales con cita previa para brindar orientación personalizada.'
            },
            {
                question: '¿Ofrecen servicios de diagnóstico?',
                answer: 'No realizamos diagnósticos directamente, pero podemos orientarte hacia profesionales especializados en nuestra red. También ofrecemos información sobre el proceso diagnóstico y acompañamiento familiar.'
            },
            {
                question: '¿Cómo puede mi asociación afiliarse a la federación?',
                answer: 'Las asociaciones interesadas pueden contactarnos para recibir información sobre los requisitos y proceso de afiliación. Ofrecemos apoyo durante todo el proceso y beneficios continuos para las asociaciones afiliadas.'
            },
            {
                question: '¿Tienen programas de formación para profesionales?',
                answer: 'Sí, ofrecemos cursos especializados para profesionales de la educación, salud y servicios sociales. Consulta nuestro calendario de formación o contacta con nuestro equipo técnico para más información.'
            },
            {
                question: '¿Cuánto tiempo tardan en responder a las consultas?',
                answer: 'Nos comprometemos a responder todas las consultas en un máximo de 48 horas laborables. Para consultas urgentes, utiliza nuestra línea telefónica directa o el servicio de apoyo 24/7.'
            },
            {
                question: '¿Realizan actividades en otras ciudades?',
                answer: 'Sí, organizamos eventos, formaciones y actividades en diferentes ciudades a través de nuestras asociaciones afiliadas. Consulta nuestro calendario de eventos o pregunta por actividades en tu zona.'
            }
        ]
    }
};

// Default data structure for CMS initialization
const defaultData = {
    'contacto-banner': CMS_CONFIG['contacto-banner'],
    'contacto-formulario': CMS_CONFIG['contacto-formulario'],
    'contacto-info': CMS_CONFIG['contacto-info'],
    'contacto-apoyo': CMS_CONFIG['contacto-apoyo'],
    'contacto-horarios': CMS_CONFIG['contacto-horarios'],
    'contacto-ubicacion': CMS_CONFIG['contacto-ubicacion'],
    'contacto-transporte': CMS_CONFIG['contacto-transporte'],
    'contacto-accesibilidad': CMS_CONFIG['contacto-accesibilidad'],
    'contacto-faq': CMS_CONFIG['contacto-faq']
};
