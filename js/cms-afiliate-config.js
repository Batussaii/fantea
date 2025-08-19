/**
 * Configuración del CMS para la página de Afiliate
 * Define la estructura de datos y campos editables
 */

const AFILIATE_CMS_CONFIG = {
    // Estructura de datos para la página de afiliate
    sections: {
        'afiliate-header': {
            title: 'Encabezado de la página',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título principal',
                    default: 'Únete a Nosotros',
                    selector: '.page-header h1'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción',
                    default: 'Forma parte de la mayor red nacional de apoyo a las personas autistas y sus familias',
                    selector: '.page-header p'
                }
            }
        },
        'afiliate-solicitud': {
            title: 'Sección de Solicitud de Afiliación',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de la sección',
                    default: 'Solicitud de Afiliación de Asociaciones',
                    selector: '.membership-options .section-header h2'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción',
                    default: 'Si tu asociación comparte nuestros valores y objetivos, FANTEA es tu casa. Unirte a la federación significa sumar fuerzas para defender de forma coordinada los derechos del colectivo TEA en Andalucía.',
                    selector: '.membership-options .section-header p'
                }
            }
        },
        'afiliate-beneficios': {
            title: 'Beneficios para Asociaciones',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de beneficios',
                    default: 'Beneficios para Asociaciones Afiliadas:',
                    selector: '.benefits-list h4'
                },
                items: {
                    type: 'list',
                    label: 'Lista de beneficios',
                    default: [
                        'Representación a nivel nacional',
                        'Acceso a formación especializada',
                        'Materiales educativos y recursos',
                        'Apoyo técnico y asesoramiento',
                        'Participación en proyectos nacionales',
                        'Red de contactos y colaboración',
                        'Certificación de calidad'
                    ],
                    selector: '.benefits-list ul li'
                }
            }
        },
        'afiliate-requisitos': {
            title: 'Requisitos para Afiliación',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de requisitos',
                    default: 'Requisitos:',
                    selector: '.requirements h4'
                },
                items: {
                    type: 'list',
                    label: 'Lista de requisitos',
                    default: [
                        'Ser una organización sin ánimo de lucro',
                        'Tener objetivos alineados con nuestra misión',
                        'Contar con al menos 2 años de actividad',
                        'Presentar documentación legal actualizada',
                        'Compromiso con los valores de la federación'
                    ],
                    selector: '.requirements ul li'
                }
            }
        },
        'afiliate-formulario': {
            title: 'Formulario de Solicitud',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título del formulario',
                    default: 'Formulario de Solicitud de Afiliación',
                    selector: '.zoho-form-container h4'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción del formulario',
                    default: 'Utiliza el formulario oficial de FANTEA para solicitar la afiliación de tu asociación:',
                    selector: '.zoho-form-container p'
                },
                note: {
                    type: 'textarea',
                    label: 'Nota informativa',
                    default: 'Nota: Este formulario es el canal oficial para solicitar la afiliación de asociaciones a FANTEA. Una vez enviado, nuestro equipo se pondrá en contacto contigo para continuar con el proceso.',
                    selector: '.form-info p'
                }
            }
        },
        'afiliate-impacto': {
            title: 'Sección de Impacto',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de impacto',
                    default: 'Tu Participación Marca la Diferencia',
                    selector: '.impact-section .section-header h2'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción de impacto',
                    default: 'Conoce el impacto real de formar parte de nuestra comunidad',
                    selector: '.impact-section .section-header p'
                },
                stats: {
                    type: 'object',
                    label: 'Estadísticas de impacto',
                    fields: {
                        personasBeneficiadas: {
                            type: 'text',
                            label: 'Número de personas beneficiadas',
                            default: '15,000+',
                            selector: '.impact-item:nth-child(1) .impact-number'
                        },
                        personasBeneficiadasText: {
                            type: 'text',
                            label: 'Texto personas beneficiadas',
                            default: 'Personas beneficiadas',
                            selector: '.impact-item:nth-child(1) .impact-text'
                        },
                        asociacionesAfiliadas: {
                            type: 'text',
                            label: 'Número de asociaciones afiliadas',
                            default: '52',
                            selector: '.impact-item:nth-child(2) .impact-number'
                        },
                        asociacionesAfiliadasText: {
                            type: 'text',
                            label: 'Texto asociaciones afiliadas',
                            default: 'Asociaciones afiliadas',
                            selector: '.impact-item:nth-child(2) .impact-text'
                        },
                        voluntariosActivos: {
                            type: 'text',
                            label: 'Número de voluntarios activos',
                            default: '300+',
                            selector: '.impact-item:nth-child(3) .impact-number'
                        },
                        voluntariosActivosText: {
                            type: 'text',
                            label: 'Texto voluntarios activos',
                            default: 'Voluntarios activos',
                            selector: '.impact-item:nth-child(3) .impact-text'
                        },
                        familiasColaboradoras: {
                            type: 'text',
                            label: 'Número de familias colaboradoras',
                            default: '1,200+',
                            selector: '.impact-item:nth-child(4) .impact-number'
                        },
                        familiasColaboradorasText: {
                            type: 'text',
                            label: 'Texto familias colaboradoras',
                            default: 'Familias colaboradoras',
                            selector: '.impact-item:nth-child(4) .impact-text'
                        }
                    }
                }
            }
        },
        'afiliate-testimonios': {
            title: 'Testimonios',
            fields: {
                testimonios: {
                    type: 'array',
                    label: 'Testimonios',
                    itemType: 'object',
                    default: [
                        {
                            texto: 'Formar parte de esta federación ha sido fundamental para el desarrollo de nuestra asociación local. El apoyo y los recursos compartidos nos han permitido ayudar a muchas más familias.',
                            nombre: 'Ana García',
                            cargo: 'Presidenta, Asociación Autismo Sevilla',
                            imagen: 'images/testimonial-1.jpg'
                        },
                        {
                            texto: 'Como familia afiliada, hemos encontrado el apoyo y la orientación que necesitábamos. La red de contactos y los recursos disponibles han sido invaluables para el desarrollo de nuestro hijo.',
                            nombre: 'Carlos y María Mendoza',
                            cargo: 'Familia Afiliada, Madrid',
                            imagen: 'images/testimonial-2.jpg'
                        },
                        {
                            texto: 'Ser voluntario aquí me ha dado la oportunidad de contribuir de manera significativa a una causa que considero fundamental. Cada evento y cada familia a la que ayudo me llena de satisfacción.',
                            nombre: 'Luis Rodríguez',
                            cargo: 'Voluntario desde 2019',
                            imagen: 'images/testimonial-3.jpg'
                        }
                    ],
                    fields: {
                        texto: {
                            type: 'textarea',
                            label: 'Texto del testimonio'
                        },
                        nombre: {
                            type: 'text',
                            label: 'Nombre del autor'
                        },
                        cargo: {
                            type: 'text',
                            label: 'Cargo o descripción'
                        },
                        imagen: {
                            type: 'image',
                            label: 'Imagen del autor'
                        }
                    }
                }
            }
        },
        'afiliate-donaciones': {
            title: 'Sección de Donaciones',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de donaciones',
                    default: 'Donaciones y Patrocinios',
                    selector: '.donations-section .section-header h2'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción de donaciones',
                    default: 'Tu aportación económica nos ayuda a mantener y ampliar nuestros programas en Andalucía',
                    selector: '.donations-section .section-header p'
                }
            }
        },
        'afiliate-donacion-puntual': {
            title: 'Donación Puntual',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de donación puntual',
                    default: 'Donación Puntual',
                    selector: '.donation-card:first-child .donation-header h3'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción de donación puntual',
                    default: 'Realiza una donación única para apoyar nuestros proyectos actuales',
                    selector: '.donation-card:first-child p'
                },
                impactTitle: {
                    type: 'text',
                    label: 'Título de impacto',
                    default: '¿Qué consigues con tu donación?',
                    selector: '.donation-card:first-child .donation-impact h4'
                },
                impactItems: {
                    type: 'list',
                    label: 'Lista de impactos',
                    default: [
                        '25€ - Material educativo para 5 familias',
                        '50€ - Una sesión de apoyo psicológico',
                        '100€ - Formación para 10 profesionales',
                        '250€ - Un taller de sensibilización escolar'
                    ],
                    selector: '.donation-card:first-child .impact-list li'
                },
                paymentMethodsTitle: {
                    type: 'text',
                    label: 'Título métodos de pago',
                    default: 'Métodos de pago seguros:',
                    selector: '.donation-card:first-child .payment-methods h5'
                },
                buttonText: {
                    type: 'text',
                    label: 'Texto del botón',
                    default: 'Donar Ahora',
                    selector: '.donation-card:first-child .btn-primary'
                }
            }
        },
        'afiliate-donacion-mensual': {
            title: 'Donación Mensual',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de donación mensual',
                    default: 'Donación Mensual',
                    selector: '.donation-card.featured .donation-header h3'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción de donación mensual',
                    default: 'Conviértete en socio colaborador con una aportación mensual recurrente',
                    selector: '.donation-card.featured p'
                },
                popularBadge: {
                    type: 'text',
                    label: 'Texto de badge popular',
                    default: 'Más Popular',
                    selector: '.donation-card.featured .popular-badge'
                },
                monthlyOptions: {
                    type: 'array',
                    label: 'Opciones mensuales',
                    itemType: 'object',
                    default: [
                        {
                            amount: '10€/mes',
                            impact: 'Apoyas a 2 familias mensualmente'
                        },
                        {
                            amount: '25€/mes',
                            impact: 'Financias programas de inclusión educativa'
                        },
                        {
                            amount: '50€/mes',
                            impact: 'Contribuyes a campañas de sensibilización'
                        }
                    ],
                    fields: {
                        amount: {
                            type: 'text',
                            label: 'Cantidad'
                        },
                        impact: {
                            type: 'text',
                            label: 'Impacto'
                        }
                    }
                },
                benefitsTitle: {
                    type: 'text',
                    label: 'Título de beneficios',
                    default: 'Beneficios como socio colaborador:',
                    selector: '.donation-card.featured .partner-benefits h5'
                },
                benefitsItems: {
                    type: 'list',
                    label: 'Lista de beneficios',
                    default: [
                        'Memoria anual de actividades',
                        'Newsletter mensual exclusivo',
                        'Invitaciones a eventos especiales',
                        'Certificado de donación anual',
                        'Desgravación fiscal hasta 80%'
                    ],
                    selector: '.donation-card.featured .benefits-list li'
                },
                buttonText: {
                    type: 'text',
                    label: 'Texto del botón',
                    default: 'Hacerse Socio Colaborador',
                    selector: '.donation-card.featured .btn-secondary'
                }
            }
        },
        'afiliate-patrocinio': {
            title: 'Patrocinio Empresarial',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de patrocinio',
                    default: 'Patrocinio Empresarial',
                    selector: '.donation-card:last-child .donation-header h3'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción de patrocinio',
                    default: 'Tu empresa puede colaborar con FANTEA y obtener visibilidad en nuestras actividades',
                    selector: '.donation-card:last-child p'
                },
                tiers: {
                    type: 'array',
                    label: 'Niveles de patrocinio',
                    itemType: 'object',
                    default: [
                        {
                            name: 'Colaborador Bronce',
                            amount: '500€ - 1.999€',
                            description: 'Logo en web y publicaciones'
                        },
                        {
                            name: 'Colaborador Plata',
                            amount: '2.000€ - 4.999€',
                            description: 'Logo destacado + menciones en eventos'
                        },
                        {
                            name: 'Colaborador Oro',
                            amount: '5.000€+',
                            description: 'Patrocinio completo de programa específico'
                        }
                    ],
                    fields: {
                        name: {
                            type: 'text',
                            label: 'Nombre del nivel'
                        },
                        amount: {
                            type: 'text',
                            label: 'Rango de cantidad'
                        },
                        description: {
                            type: 'text',
                            label: 'Descripción'
                        }
                    }
                },
                benefitsTitle: {
                    type: 'text',
                    label: 'Título de beneficios empresariales',
                    default: 'Beneficios para tu empresa:',
                    selector: '.donation-card:last-child .csr-benefits h5'
                },
                benefitsItems: {
                    type: 'list',
                    label: 'Lista de beneficios empresariales',
                    default: [
                        'Mejora de imagen corporativa',
                        'Responsabilidad Social Empresarial',
                        'Desgravaciones fiscales',
                        'Networking con otras empresas',
                        'Certificado de colaboración'
                    ],
                    selector: '.donation-card:last-child .benefits-list li'
                },
                buttonText: {
                    type: 'text',
                    label: 'Texto del botón',
                    default: 'Contactar para Patrocinio',
                    selector: '.donation-card:last-child .btn-outline'
                }
            }
        },
        'afiliate-transparencia': {
            title: 'Transparencia en el Uso de Fondos',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de transparencia',
                    default: 'Transparencia en el Uso de Fondos',
                    selector: '.transparency-card h3'
                },
                fundDistribution: {
                    type: 'array',
                    label: 'Distribución de fondos',
                    itemType: 'object',
                    default: [
                        {
                            label: 'Programas y Servicios',
                            percentage: '65%'
                        },
                        {
                            label: 'Formación y Sensibilización',
                            percentage: '20%'
                        },
                        {
                            label: 'Gastos Administrativos',
                            percentage: '10%'
                        },
                        {
                            label: 'Comunicación y Eventos',
                            percentage: '5%'
                        }
                    ],
                    fields: {
                        label: {
                            type: 'text',
                            label: 'Etiqueta'
                        },
                        percentage: {
                            type: 'text',
                            label: 'Porcentaje'
                        }
                    }
                },
                note: {
                    type: 'textarea',
                    label: 'Nota de transparencia',
                    default: 'Consulta nuestra memoria económica anual para información detallada sobre el uso de los fondos.',
                    selector: '.transparency-note'
                }
            }
        },
        'afiliate-documentos': {
            title: 'Sección de Documentos',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de documentos',
                    default: 'Documentos y Estatutos',
                    selector: '.legal-documents .section-header h2'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción de documentos',
                    default: 'Descarga la documentación oficial y requisitos legales para la afiliación a FANTEA',
                    selector: '.legal-documents .section-header p'
                }
            }
        },
        'afiliate-documentos-corporativos': {
            title: 'Documentos Corporativos',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de la categoría',
                    default: 'Documentos Corporativos',
                    selector: '.document-category:first-child .category-header h3'
                },
                documents: {
                    type: 'array',
                    label: 'Documentos corporativos',
                    itemType: 'object',
                    default: [
                        {
                            name: 'Estatutos de FANTEA',
                            description: 'Documento fundacional con la estructura organizativa y objetivos de la federación.',
                            meta: 'PDF • 2.3 MB • Actualizado: Marzo 2024'
                        },
                        {
                            name: 'Reglamento de Régimen Interno',
                            description: 'Normas internas de funcionamiento y procedimientos organizativos.',
                            meta: 'PDF • 1.8 MB • Actualizado: Enero 2024'
                        },
                        {
                            name: 'Código Ético',
                            description: 'Principios éticos y valores que rigen la actuación de FANTEA y sus miembros.',
                            meta: 'PDF • 0.9 MB • Actualizado: Febrero 2024'
                        }
                    ],
                    fields: {
                        name: {
                            type: 'text',
                            label: 'Nombre del documento'
                        },
                        description: {
                            type: 'textarea',
                            label: 'Descripción'
                        },
                        meta: {
                            type: 'text',
                            label: 'Metadatos'
                        }
                    }
                }
            }
        },
        'afiliate-formularios-afiliacion': {
            title: 'Formularios de Afiliación',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de la categoría',
                    default: 'Formularios de Afiliación',
                    selector: '.document-category:nth-child(2) .category-header h3'
                },
                documents: {
                    type: 'array',
                    label: 'Formularios de afiliación',
                    itemType: 'object',
                    default: [
                        {
                            name: 'Solicitud de Afiliación - Asociaciones',
                            description: 'Formulario oficial para que las asociaciones se afilien a FANTEA.',
                            meta: 'PDF • 0.5 MB • Formulario rellenable'
                        },
                        {
                            name: 'Solicitud de Membresía - Familias',
                            description: 'Formulario para que las familias se registren como miembros individuales.',
                            meta: 'PDF • 0.3 MB • Formulario rellenable'
                        },
                        {
                            name: 'Formulario de Voluntariado',
                            description: 'Documento para registrarse como voluntario y declarar disponibilidad e intereses.',
                            meta: 'PDF • 0.4 MB • Formulario rellenable'
                        }
                    ],
                    fields: {
                        name: {
                            type: 'text',
                            label: 'Nombre del documento'
                        },
                        description: {
                            type: 'textarea',
                            label: 'Descripción'
                        },
                        meta: {
                            type: 'text',
                            label: 'Metadatos'
                        }
                    }
                }
            }
        },
        'afiliate-documentos-legales': {
            title: 'Documentos Legales',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de la categoría',
                    default: 'Documentos Legales',
                    selector: '.document-category:nth-child(3) .category-header h3'
                },
                documents: {
                    type: 'array',
                    label: 'Documentos legales',
                    itemType: 'object',
                    default: [
                        {
                            name: 'Política de Privacidad y Protección de Datos',
                            description: 'Información sobre el tratamiento de datos personales conforme al RGPD.',
                            meta: 'PDF • 1.1 MB • Actualizado: Diciembre 2023'
                        },
                        {
                            name: 'Términos y Condiciones de Uso',
                            description: 'Condiciones generales de uso de los servicios y recursos de FANTEA.',
                            meta: 'PDF • 0.7 MB • Actualizado: Noviembre 2023'
                        },
                        {
                            name: 'Certificado de Utilidad Pública',
                            description: 'Documento oficial que acredita la declaración de utilidad pública de FANTEA.',
                            meta: 'PDF • 1.5 MB • Validez permanente'
                        }
                    ],
                    fields: {
                        name: {
                            type: 'text',
                            label: 'Nombre del documento'
                        },
                        description: {
                            type: 'textarea',
                            label: 'Descripción'
                        },
                        meta: {
                            type: 'text',
                            label: 'Metadatos'
                        }
                    }
                }
            }
        },
        'afiliate-recursos-guias': {
            title: 'Recursos y Guías',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de la categoría',
                    default: 'Recursos y Guías',
                    selector: '.document-category:last-child .category-header h3'
                },
                documents: {
                    type: 'array',
                    label: 'Recursos y guías',
                    itemType: 'object',
                    default: [
                        {
                            name: 'Guía para Nuevas Asociaciones Afiliadas',
                            description: 'Manual completo con todos los pasos para completar el proceso de afiliación.',
                            meta: 'PDF • 3.2 MB • Guía ilustrada'
                        },
                        {
                            name: 'Manual de Buenas Prácticas',
                            description: 'Recomendaciones y mejores prácticas para el trabajo con personas autistas.',
                            meta: 'PDF • 4.1 MB • Manual técnico'
                        },
                        {
                            name: 'Memoria de Actividades 2023',
                            description: 'Informe completo de las actividades, programas y logros conseguidos durante 2023.',
                            meta: 'PDF • 5.7 MB • Informe anual'
                        }
                    ],
                    fields: {
                        name: {
                            type: 'text',
                            label: 'Nombre del documento'
                        },
                        description: {
                            type: 'textarea',
                            label: 'Descripción'
                        },
                        meta: {
                            type: 'text',
                            label: 'Metadatos'
                        }
                    }
                }
            }
        },
        'afiliate-ayuda': {
            title: 'Sección de Ayuda',
            fields: {
                title: {
                    type: 'text',
                    label: 'Título de ayuda',
                    default: '¿Necesitas Ayuda?',
                    selector: '.help-card .help-header h3'
                },
                description: {
                    type: 'textarea',
                    label: 'Descripción de ayuda',
                    default: 'Si tienes dudas sobre el proceso de afiliación o necesitas ayuda con algún documento, nuestro equipo está aquí para asistirte.',
                    selector: '.help-card p'
                },
                contactOptions: {
                    type: 'array',
                    label: 'Opciones de contacto',
                    itemType: 'object',
                    default: [
                        {
                            title: 'Teléfono de Consultas',
                            value: '+34 954 123 456 (L-V: 9:00-17:00)',
                            icon: 'fas fa-phone'
                        },
                        {
                            title: 'Email de Afiliaciones',
                            value: 'afiliaciones@fantea.org',
                            icon: 'fas fa-envelope'
                        },
                        {
                            title: 'Cita Personalizada',
                            value: 'Solicita una reunión individual',
                            icon: 'fas fa-calendar'
                        }
                    ],
                    fields: {
                        title: {
                            type: 'text',
                            label: 'Título'
                        },
                        value: {
                            type: 'text',
                            label: 'Valor'
                        },
                        icon: {
                            type: 'text',
                            label: 'Icono (Font Awesome)'
                        }
                    }
                },
                buttonText: {
                    type: 'text',
                    label: 'Texto del botón de contacto',
                    default: 'Contactar',
                    selector: '.help-actions .btn-primary'
                },
                faqButtonText: {
                    type: 'text',
                    label: 'Texto del botón de FAQ',
                    default: 'Preguntas Frecuentes',
                    selector: '.help-actions .btn-outline'
                }
            }
        }
    },

    // Datos por defecto para inicializar el CMS
    defaultData: {
        'afiliate-header': {
            title: 'Únete a Nosotros',
            description: 'Forma parte de la mayor red nacional de apoyo a las personas autistas y sus familias'
        },
        'afiliate-solicitud': {
            title: 'Solicitud de Afiliación de Asociaciones',
            description: 'Si tu asociación comparte nuestros valores y objetivos, FANTEA es tu casa. Unirte a la federación significa sumar fuerzas para defender de forma coordinada los derechos del colectivo TEA en Andalucía.'
        },
        'afiliate-beneficios': {
            title: 'Beneficios para Asociaciones Afiliadas:',
            items: [
                'Representación a nivel nacional',
                'Acceso a formación especializada',
                'Materiales educativos y recursos',
                'Apoyo técnico y asesoramiento',
                'Participación en proyectos nacionales',
                'Red de contactos y colaboración',
                'Certificación de calidad'
            ]
        },
        'afiliate-requisitos': {
            title: 'Requisitos:',
            items: [
                'Ser una organización sin ánimo de lucro',
                'Tener objetivos alineados con nuestra misión',
                'Contar con al menos 2 años de actividad',
                'Presentar documentación legal actualizada',
                'Compromiso con los valores de la federación'
            ]
        },
        'afiliate-formulario': {
            title: 'Formulario de Solicitud de Afiliación',
            description: 'Utiliza el formulario oficial de FANTEA para solicitar la afiliación de tu asociación:',
            note: 'Nota: Este formulario es el canal oficial para solicitar la afiliación de asociaciones a FANTEA. Una vez enviado, nuestro equipo se pondrá en contacto contigo para continuar con el proceso.'
        },
        'afiliate-impacto': {
            title: 'Tu Participación Marca la Diferencia',
            description: 'Conoce el impacto real de formar parte de nuestra comunidad',
            stats: {
                personasBeneficiadas: '15,000+',
                personasBeneficiadasText: 'Personas beneficiadas',
                asociacionesAfiliadas: '52',
                asociacionesAfiliadasText: 'Asociaciones afiliadas',
                voluntariosActivos: '300+',
                voluntariosActivosText: 'Voluntarios activos',
                familiasColaboradoras: '1,200+',
                familiasColaboradorasText: 'Familias colaboradoras'
            }
        },
        'afiliate-testimonios': {
            testimonios: [
                {
                    texto: 'Formar parte de esta federación ha sido fundamental para el desarrollo de nuestra asociación local. El apoyo y los recursos compartidos nos han permitido ayudar a muchas más familias.',
                    nombre: 'Ana García',
                    cargo: 'Presidenta, Asociación Autismo Sevilla',
                    imagen: 'images/testimonial-1.jpg'
                },
                {
                    texto: 'Como familia afiliada, hemos encontrado el apoyo y la orientación que necesitábamos. La red de contactos y los recursos disponibles han sido invaluables para el desarrollo de nuestro hijo.',
                    nombre: 'Carlos y María Mendoza',
                    cargo: 'Familia Afiliada, Madrid',
                    imagen: 'images/testimonial-2.jpg'
                },
                {
                    texto: 'Ser voluntario aquí me ha dado la oportunidad de contribuir de manera significativa a una causa que considero fundamental. Cada evento y cada familia a la que ayudo me llena de satisfacción.',
                    nombre: 'Luis Rodríguez',
                    cargo: 'Voluntario desde 2019',
                    imagen: 'images/testimonial-3.jpg'
                }
            ]
        },
        'afiliate-donaciones': {
            title: 'Donaciones y Patrocinios',
            description: 'Tu aportación económica nos ayuda a mantener y ampliar nuestros programas en Andalucía'
        },
        'afiliate-donacion-puntual': {
            title: 'Donación Puntual',
            description: 'Realiza una donación única para apoyar nuestros proyectos actuales',
            impactTitle: '¿Qué consigues con tu donación?',
            impactItems: [
                '25€ - Material educativo para 5 familias',
                '50€ - Una sesión de apoyo psicológico',
                '100€ - Formación para 10 profesionales',
                '250€ - Un taller de sensibilización escolar'
            ],
            paymentMethodsTitle: 'Métodos de pago seguros:',
            buttonText: 'Donar Ahora'
        },
        'afiliate-donacion-mensual': {
            title: 'Donación Mensual',
            description: 'Conviértete en socio colaborador con una aportación mensual recurrente',
            popularBadge: 'Más Popular',
            monthlyOptions: [
                {
                    amount: '10€/mes',
                    impact: 'Apoyas a 2 familias mensualmente'
                },
                {
                    amount: '25€/mes',
                    impact: 'Financias programas de inclusión educativa'
                },
                {
                    amount: '50€/mes',
                    impact: 'Contribuyes a campañas de sensibilización'
                }
            ],
            benefitsTitle: 'Beneficios como socio colaborador:',
            benefitsItems: [
                'Memoria anual de actividades',
                'Newsletter mensual exclusivo',
                'Invitaciones a eventos especiales',
                'Certificado de donación anual',
                'Desgravación fiscal hasta 80%'
            ],
            buttonText: 'Hacerse Socio Colaborador'
        },
        'afiliate-patrocinio': {
            title: 'Patrocinio Empresarial',
            description: 'Tu empresa puede colaborar con FANTEA y obtener visibilidad en nuestras actividades',
            tiers: [
                {
                    name: 'Colaborador Bronce',
                    amount: '500€ - 1.999€',
                    description: 'Logo en web y publicaciones'
                },
                {
                    name: 'Colaborador Plata',
                    amount: '2.000€ - 4.999€',
                    description: 'Logo destacado + menciones en eventos'
                },
                {
                    name: 'Colaborador Oro',
                    amount: '5.000€+',
                    description: 'Patrocinio completo de programa específico'
                }
            ],
            benefitsTitle: 'Beneficios para tu empresa:',
            benefitsItems: [
                'Mejora de imagen corporativa',
                'Responsabilidad Social Empresarial',
                'Desgravaciones fiscales',
                'Networking con otras empresas',
                'Certificado de colaboración'
            ],
            buttonText: 'Contactar para Patrocinio'
        },
        'afiliate-transparencia': {
            title: 'Transparencia en el Uso de Fondos',
            fundDistribution: [
                {
                    label: 'Programas y Servicios',
                    percentage: '65%'
                },
                {
                    label: 'Formación y Sensibilización',
                    percentage: '20%'
                },
                {
                    label: 'Gastos Administrativos',
                    percentage: '10%'
                },
                {
                    label: 'Comunicación y Eventos',
                    percentage: '5%'
                }
            ],
            note: 'Consulta nuestra memoria económica anual para información detallada sobre el uso de los fondos.'
        },
        'afiliate-documentos': {
            title: 'Documentos y Estatutos',
            description: 'Descarga la documentación oficial y requisitos legales para la afiliación a FANTEA'
        },
        'afiliate-documentos-corporativos': {
            title: 'Documentos Corporativos',
            documents: [
                {
                    name: 'Estatutos de FANTEA',
                    description: 'Documento fundacional con la estructura organizativa y objetivos de la federación.',
                    meta: 'PDF • 2.3 MB • Actualizado: Marzo 2024'
                },
                {
                    name: 'Reglamento de Régimen Interno',
                    description: 'Normas internas de funcionamiento y procedimientos organizativos.',
                    meta: 'PDF • 1.8 MB • Actualizado: Enero 2024'
                },
                {
                    name: 'Código Ético',
                    description: 'Principios éticos y valores que rigen la actuación de FANTEA y sus miembros.',
                    meta: 'PDF • 0.9 MB • Actualizado: Febrero 2024'
                }
            ]
        },
        'afiliate-formularios-afiliacion': {
            title: 'Formularios de Afiliación',
            documents: [
                {
                    name: 'Solicitud de Afiliación - Asociaciones',
                    description: 'Formulario oficial para que las asociaciones se afilien a FANTEA.',
                    meta: 'PDF • 0.5 MB • Formulario rellenable'
                },
                {
                    name: 'Solicitud de Membresía - Familias',
                    description: 'Formulario para que las familias se registren como miembros individuales.',
                    meta: 'PDF • 0.3 MB • Formulario rellenable'
                },
                {
                    name: 'Formulario de Voluntariado',
                    description: 'Documento para registrarse como voluntario y declarar disponibilidad e intereses.',
                    meta: 'PDF • 0.4 MB • Formulario rellenable'
                }
            ]
        },
        'afiliate-documentos-legales': {
            title: 'Documentos Legales',
            documents: [
                {
                    name: 'Política de Privacidad y Protección de Datos',
                    description: 'Información sobre el tratamiento de datos personales conforme al RGPD.',
                    meta: 'PDF • 1.1 MB • Actualizado: Diciembre 2023'
                },
                {
                    name: 'Términos y Condiciones de Uso',
                    description: 'Condiciones generales de uso de los servicios y recursos de FANTEA.',
                    meta: 'PDF • 0.7 MB • Actualizado: Noviembre 2023'
                },
                {
                    name: 'Certificado de Utilidad Pública',
                    description: 'Documento oficial que acredita la declaración de utilidad pública de FANTEA.',
                    meta: 'PDF • 1.5 MB • Validez permanente'
                }
            ]
        },
        'afiliate-recursos-guias': {
            title: 'Recursos y Guías',
            documents: [
                {
                    name: 'Guía para Nuevas Asociaciones Afiliadas',
                    description: 'Manual completo con todos los pasos para completar el proceso de afiliación.',
                    meta: 'PDF • 3.2 MB • Guía ilustrada'
                },
                {
                    name: 'Manual de Buenas Prácticas',
                    description: 'Recomendaciones y mejores prácticas para el trabajo con personas autistas.',
                    meta: 'PDF • 4.1 MB • Manual técnico'
                },
                {
                    name: 'Memoria de Actividades 2023',
                    description: 'Informe completo de las actividades, programas y logros conseguidos durante 2023.',
                    meta: 'PDF • 5.7 MB • Informe anual'
                }
            ]
        },
        'afiliate-ayuda': {
            title: '¿Necesitas Ayuda?',
            description: 'Si tienes dudas sobre el proceso de afiliación o necesitas ayuda con algún documento, nuestro equipo está aquí para asistirte.',
            contactOptions: [
                {
                    title: 'Teléfono de Consultas',
                    value: '+34 954 123 456 (L-V: 9:00-17:00)',
                    icon: 'fas fa-phone'
                },
                {
                    title: 'Email de Afiliaciones',
                    value: 'afiliaciones@fantea.org',
                    icon: 'fas fa-envelope'
                },
                {
                    title: 'Cita Personalizada',
                    value: 'Solicita una reunión individual',
                    icon: 'fas fa-calendar'
                }
            ],
            buttonText: 'Contactar',
            faqButtonText: 'Preguntas Frecuentes'
        }
    }
};

// Hacer disponible globalmente
window.AFILIATE_CMS_CONFIG = AFILIATE_CMS_CONFIG;
