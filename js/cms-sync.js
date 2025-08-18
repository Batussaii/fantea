/**
 * CMS Sync - Sistema de sincronización entre el CMS y las páginas principales
 * Lee los datos guardados por el CMS desde localStorage y los aplica dinámicamente
 */

class CMSSync {
    constructor() {
        this.cmsData = {};
        this.currentPage = this.getCurrentPage();
        console.log('CMS Sync iniciado para página:', this.currentPage);
        this.initialize();
    }

    async initialize() {
        this.cmsData = await this.loadCMSData();
        console.log('Datos CMS cargados:', this.cmsData);
        this.applyCMSChanges();
    }

    // Cargar datos del CMS desde la API del servidor
    async loadCMSData() {
        try {
            const response = await fetch(CMS_CONFIG.apiUrls.load);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Guardar en localStorage como caché
                    localStorage.setItem('fantea_cms_data', JSON.stringify(result.data));
                    return result.data;
                } else {
                    console.warn('Error en respuesta del servidor:', result.error);
                    return this.loadFromLocalStorage();
                }
            } else {
                console.warn('Error en respuesta del servidor:', response.status);
                return this.loadFromLocalStorage();
            }
        } catch (error) {
            console.warn('Error cargando datos CMS desde servidor:', error);
            return this.loadFromLocalStorage();
        }
    }

    // Fallback a localStorage
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('fantea_cms_data');
            return data ? JSON.parse(data) : {};
        } catch (localError) {
            console.warn('Error cargando datos CMS desde localStorage:', localError);
            return {};
        }
    }

    // Determinar la página actual
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            return 'inicio';
        } else if (path.includes('quienes-somos.html')) {
            return 'quienes-somos';
        } else if (path.includes('asociaciones.html')) {
            return 'asociaciones';
        } else if (path.includes('areas.html')) {
            return 'areas';
        } else if (path.includes('manifiesto.html')) {
            return 'manifiesto';
        } else if (path.includes('prensa.html')) {
            return 'prensa';
        } else if (path.includes('afiliate.html')) {
            return 'afiliate';
        } else if (path.includes('contacto.html')) {
            return 'contacto';
        } else if (path.includes('nosotros.html')) {
            return 'nosotros';
        } else if (path.includes('autismo.html')) {
            return 'autismo';
        } else if (path.includes('servicios.html')) {
            return 'servicios';
        } else if (path.includes('actualidad.html')) {
            return 'actualidad';
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
            case 'quienes-somos':
                this.applyQuienesSomosChanges();
                break;
            case 'asociaciones':
                this.applyAsociacionesChanges();
                break;
            case 'areas':
                this.applyAreasChanges();
                break;
            case 'manifiesto':
                this.applyManifiestoChanges();
                break;
            case 'prensa':
                this.applyPrensaChanges();
                break;
            case 'afiliate':
                this.applyAfiliateChanges();
                break;
            case 'contacto':
                this.applyContactoChanges();
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
            default:
                console.log('Página no reconocida para aplicar cambios CMS:', this.currentPage);
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
            
            // Actualizar botones del hero si están definidos
            if (this.cmsData.hero.buttons) {
                const buttons = this.cmsData.hero.buttons;
                if (buttons.about) {
                    this.updateTextContent('.hero-actions .btn:nth-child(1)', buttons.about);
                }
                if (buttons.affiliate) {
                    this.updateTextContent('.hero-actions .btn:nth-child(2)', buttons.affiliate);
                }
                if (buttons.donate) {
                    this.updateTextContent('.hero-actions .btn:nth-child(3)', buttons.donate);
                }
            }
        }

        // Stats Section (estadísticas en hero-stats)
        if (this.cmsData.stats && this.cmsData.stats.stats) {
            this.cmsData.stats.stats.forEach((stat, index) => {
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-number`, stat.number);
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-text`, stat.description);
            });
        }

        // Features Section (características principales)
        if (this.cmsData.features) {
            if (this.cmsData.features.title) {
                this.updateTextContent('.featured-sections .section-header h2', this.cmsData.features.title);
            }
            if (this.cmsData.features.subtitle) {
                this.updateTextContent('.featured-sections .section-header p', this.cmsData.features.subtitle);
            }
            if (this.cmsData.features.features) {
                this.cmsData.features.features.forEach((feature, index) => {
                    this.updateTextContent(`.features-grid .feature-card:nth-child(${index + 1}) h3`, feature.title);
                    this.updateTextContent(`.features-grid .feature-card:nth-child(${index + 1}) p`, feature.description);
                    
                    // Actualizar icono
                    const iconElement = document.querySelector(`.features-grid .feature-card:nth-child(${index + 1}) .feature-icon i`);
                    if (iconElement && feature.icon) {
                        iconElement.className = feature.icon;
                    }
                    
                    // Actualizar enlace y texto del enlace
                    const linkElement = document.querySelector(`.features-grid .feature-card:nth-child(${index + 1}) .feature-link`);
                    if (linkElement && feature.linkText) {
                        linkElement.textContent = feature.linkText;
                        if (feature.link) {
                            linkElement.href = feature.link;
                        }
                    }
                });
            }
        }

        // CTA Section - llamada a la acción
        if (this.cmsData.cta) {
            this.updateTextContent('.cta-section h2', this.cmsData.cta.title);
            this.updateTextContent('.cta-section p', this.cmsData.cta.description);
            
            // Actualizar botones del CTA si están definidos
            if (this.cmsData.cta.buttons) {
                const buttons = this.cmsData.cta.buttons;
                if (buttons.primary) {
                    this.updateTextContent('.cta-actions .btn-primary', buttons.primary);
                }
                if (buttons.secondary) {
                    this.updateTextContent('.cta-actions .btn-outline-white', buttons.secondary);
                }
            }
        }

        console.log('Cambios de Inicio aplicados');
    }

    // Aplicar cambios a página de Quiénes Somos
    applyQuienesSomosChanges() {
        console.log('Aplicando cambios CMS a página de Quiénes Somos...');

        // Header Section
        if (this.cmsData['quienes-somos-header']) {
            this.updateTextContent('.hero-title', this.cmsData['quienes-somos-header'].title);
            this.updateTextContent('.hero-description', this.cmsData['quienes-somos-header'].subtitle);
            this.updateImageSrc('.hero-img', this.cmsData['quienes-somos-header'].image);
            
            // Actualizar botones del hero
            if (this.cmsData['quienes-somos-header'].buttons) {
                const buttons = this.cmsData['quienes-somos-header'].buttons;
                if (buttons.mision) {
                    this.updateTextContent('.hero-actions .btn:nth-child(1)', buttons.mision);
                }
                if (buttons.valores) {
                    this.updateTextContent('.hero-actions .btn:nth-child(2)', buttons.valores);
                }
            }
        }

        // Stats Section
        if (this.cmsData['quienes-somos-stats'] && this.cmsData['quienes-somos-stats'].stats) {
            this.cmsData['quienes-somos-stats'].stats.forEach((stat, index) => {
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-number`, stat.number);
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-text`, stat.description);
            });
        }

        // Misión y Visión Section
        if (this.cmsData['quienes-somos-mision']) {
            if (this.cmsData['quienes-somos-mision'].title) {
                this.updateTextContent('.featured-sections .section-header h2', this.cmsData['quienes-somos-mision'].title);
            }
            if (this.cmsData['quienes-somos-mision'].subtitle) {
                this.updateTextContent('.featured-sections .section-header p', this.cmsData['quienes-somos-mision'].subtitle);
            }
            
            // Cards de Misión y Visión
            if (this.cmsData['quienes-somos-mision'].cards) {
                this.cmsData['quienes-somos-mision'].cards.forEach((card, index) => {
                    this.updateTextContent(`.features-grid .feature-card:nth-child(${index + 1}) h3`, card.title);
                    this.updateTextContent(`.features-grid .feature-card:nth-child(${index + 1}) p:first-of-type`, card.description);
                    this.updateTextContent(`.features-grid .feature-card:nth-child(${index + 1}) p:last-of-type`, card.highlight);
                    
                    // Actualizar icono
                    const iconElement = document.querySelector(`.features-grid .feature-card:nth-child(${index + 1}) .feature-icon i`);
                    if (iconElement && card.icon) {
                        iconElement.className = card.icon;
                    }
                });
            }
        }

        // Valores Section
        if (this.cmsData['quienes-somos-valores']) {
            if (this.cmsData['quienes-somos-valores'].title) {
                this.updateTextContent('.values-section .section-header h2', this.cmsData['quienes-somos-valores'].title);
            }
            if (this.cmsData['quienes-somos-valores'].subtitle) {
                this.updateTextContent('.values-section .section-header p', this.cmsData['quienes-somos-valores'].subtitle);
            }
            
            // Valores
            if (this.cmsData['quienes-somos-valores'].values) {
                this.cmsData['quienes-somos-valores'].values.forEach((value, index) => {
                    this.updateTextContent(`.values-grid .value-card:nth-child(${index + 1}) h3`, value.title);
                    this.updateTextContent(`.values-grid .value-card:nth-child(${index + 1}) p`, value.description);
                    
                    // Actualizar icono
                    const iconElement = document.querySelector(`.values-grid .value-card:nth-child(${index + 1}) .value-icon i`);
                    if (iconElement && value.icon) {
                        iconElement.className = value.icon;
                    }
                });
            }
        }

        // Historia Section
        if (this.cmsData['quienes-somos-historia']) {
            if (this.cmsData['quienes-somos-historia'].title) {
                this.updateTextContent('.our-history .section-header h2', this.cmsData['quienes-somos-historia'].title);
            }
            if (this.cmsData['quienes-somos-historia'].subtitle) {
                this.updateTextContent('.our-history .section-header p', this.cmsData['quienes-somos-historia'].subtitle);
            }
            
            // Timeline
            if (this.cmsData['quienes-somos-historia'].timeline) {
                const timelineContainer = document.querySelector('.history-timeline');
                if (timelineContainer) {
                    timelineContainer.innerHTML = '';
                    this.cmsData['quienes-somos-historia'].timeline.forEach(item => {
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
        }

        // CTA Section
        if (this.cmsData['quienes-somos-cta']) {
            this.updateTextContent('.cta-section .cta-content h2', this.cmsData['quienes-somos-cta'].title);
            this.updateTextContent('.cta-section .cta-content p', this.cmsData['quienes-somos-cta'].description);
            
            // Botones del CTA
            if (this.cmsData['quienes-somos-cta'].buttons) {
                this.cmsData['quienes-somos-cta'].buttons.forEach((button, index) => {
                    const buttonElement = document.querySelector(`.cta-actions .btn:nth-child(${index + 1})`);
                    if (buttonElement) {
                        buttonElement.textContent = button.text;
                        buttonElement.href = button.url;
                        buttonElement.className = `btn ${button.type === 'primary' ? 'btn-primary' : 'btn-outline'}`;
                    }
                });
            }
        }

        console.log('Cambios de Quiénes Somos aplicados');
    }

    // Aplicar cambios a página de Asociaciones
    applyAsociacionesChanges() {
        console.log('Aplicando cambios CMS a página de Asociaciones...');

        // Header Section
        if (this.cmsData['asociaciones-header']) {
            this.updateTextContent('.hero-title', this.cmsData['asociaciones-header'].title);
            this.updateTextContent('.hero-description', this.cmsData['asociaciones-header'].description);
        }

        // Associations List Section
        if (this.cmsData['asociaciones-list']) {
            if (this.cmsData['asociaciones-list'].sectionTitle) {
                this.updateTextContent('.associations-section .section-header h2', this.cmsData['asociaciones-list'].sectionTitle);
            }
            if (this.cmsData['asociaciones-list'].subtitle) {
                this.updateTextContent('.associations-section .section-header p', this.cmsData['asociaciones-list'].subtitle);
            }
            if (this.cmsData['asociaciones-list'].introText) {
                this.updateTextContent('.associations-intro p', this.cmsData['asociaciones-list'].introText);
            }
            
            // Associations List
            if (this.cmsData['asociaciones-list'].associations) {
                const associationsContainer = document.querySelector('.associations-grid');
                if (associationsContainer) {
                    associationsContainer.innerHTML = '';
                    this.cmsData['asociaciones-list'].associations.forEach(association => {
                        const associationCard = document.createElement('div');
                        associationCard.className = 'association-card';
                        associationCard.innerHTML = `
                            <div class="association-content">
                                <h3>${association.name}</h3>
                                <p class="association-province">${association.province}</p>
                                <p class="association-description">${association.description}</p>
                                ${association.website ? `<a href="${association.website}" class="association-link" target="_blank">Visitar web</a>` : ''}
                            </div>
                        `;
                        associationsContainer.appendChild(associationCard);
                    });
                }
            }
        }

        console.log('Cambios de Asociaciones aplicados');
    }

    // Aplicar cambios a página de Áreas
    applyAreasChanges() {
        console.log('Aplicando cambios CMS a página de Áreas...');

        // Header Section
        if (this.cmsData['areas-header']) {
            this.updateTextContent('.hero-title', this.cmsData['areas-header'].title);
            this.updateTextContent('.hero-description', this.cmsData['areas-header'].description);
        }

        // Areas List Section
        if (this.cmsData['areas-list']) {
            if (this.cmsData['areas-list'].sectionTitle) {
                this.updateTextContent('.areas-section .section-header h2', this.cmsData['areas-list'].sectionTitle);
            }
            if (this.cmsData['areas-list'].subtitle) {
                this.updateTextContent('.areas-section .section-header p', this.cmsData['areas-list'].subtitle);
            }
            
            // Areas List
            if (this.cmsData['areas-list'].areas) {
                const areasContainer = document.querySelector('.areas-grid');
                if (areasContainer) {
                    areasContainer.innerHTML = '';
                    this.cmsData['areas-list'].areas.forEach(area => {
                        const areaCard = document.createElement('div');
                        areaCard.className = 'area-card';
                        areaCard.innerHTML = `
                            <div class="area-icon">
                                <i class="${area.icon}"></i>
                            </div>
                            <div class="area-content">
                                <h3>${area.title}</h3>
                                <p>${area.description}</p>
                            </div>
                        `;
                        areasContainer.appendChild(areaCard);
                    });
                }
            }
        }

        console.log('Cambios de Áreas aplicados');
    }

    // Aplicar cambios a página de Manifiesto
    applyManifiestoChanges() {
        console.log('Aplicando cambios CMS a página de Manifiesto...');

        // Header Section
        if (this.cmsData['manifiesto-header']) {
            this.updateTextContent('.hero-title', this.cmsData['manifiesto-header'].title);
            this.updateTextContent('.hero-description', this.cmsData['manifiesto-header'].description);
        }

        // Manifesto Content Section
        if (this.cmsData['manifiesto-content']) {
            if (this.cmsData['manifiesto-content'].sectionTitle) {
                this.updateTextContent('.manifesto-section .section-header h2', this.cmsData['manifiesto-content'].sectionTitle);
            }
            if (this.cmsData['manifiesto-content'].introText) {
                this.updateTextContent('.manifesto-intro p', this.cmsData['manifiesto-content'].introText);
            }
            
            // Principles List
            if (this.cmsData['manifiesto-content'].principles) {
                const principlesContainer = document.querySelector('.principles-grid');
                if (principlesContainer) {
                    principlesContainer.innerHTML = '';
                    this.cmsData['manifiesto-content'].principles.forEach(principle => {
                        const principleCard = document.createElement('div');
                        principleCard.className = 'principle-card';
                        principleCard.innerHTML = `
                            <div class="principle-content">
                                <h3>${principle.title}</h3>
                                <p>${principle.description}</p>
                            </div>
                        `;
                        principlesContainer.appendChild(principleCard);
                    });
                }
            }
        }

        console.log('Cambios de Manifiesto aplicados');
    }

    // Aplicar cambios a página de Prensa
    applyPrensaChanges() {
        console.log('Aplicando cambios CMS a página de Prensa...');

        // Header Section
        if (this.cmsData['prensa-header']) {
            this.updateTextContent('.hero-title', this.cmsData['prensa-header'].title);
            this.updateTextContent('.hero-description', this.cmsData['prensa-header'].description);
        }

        // Press Content Section
        if (this.cmsData['prensa-content']) {
            if (this.cmsData['prensa-content'].sectionTitle) {
                this.updateTextContent('.press-section .section-header h2', this.cmsData['prensa-content'].sectionTitle);
            }
            if (this.cmsData['prensa-content'].introText) {
                this.updateTextContent('.press-intro p', this.cmsData['prensa-content'].introText);
            }
            
            // Contact Info
            if (this.cmsData['prensa-content'].contactInfo) {
                const contactInfo = this.cmsData['prensa-content'].contactInfo;
                
                if (contactInfo.email) {
                    this.updateTextContent('.press-contact .contact-email', contactInfo.email);
                }
                if (contactInfo.phone) {
                    this.updateTextContent('.press-contact .contact-phone', contactInfo.phone);
                }
                if (contactInfo.hours) {
                    this.updateTextContent('.press-contact .contact-hours', contactInfo.hours);
                }
            }
            
            // Press Releases
            if (this.cmsData['prensa-content'].pressReleases) {
                const pressReleasesContainer = document.querySelector('.press-releases-grid');
                if (pressReleasesContainer) {
                    pressReleasesContainer.innerHTML = '';
                    this.cmsData['prensa-content'].pressReleases.forEach(release => {
                        const releaseCard = document.createElement('div');
                        releaseCard.className = 'press-release-card';
                        releaseCard.innerHTML = `
                            <div class="release-content">
                                <span class="release-date">${release.date}</span>
                                <h3>${release.title}</h3>
                                <p>${release.summary}</p>
                                ${release.pdfUrl ? `<a href="${release.pdfUrl}" class="release-link" target="_blank">Descargar PDF</a>` : ''}
                            </div>
                        `;
                        pressReleasesContainer.appendChild(releaseCard);
                    });
                }
            }
        }

        console.log('Cambios de Prensa aplicados');
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

        // History Section
        if (this.cmsData.history) {
            if (this.cmsData.history.title) {
                this.updateTextContent('.our-history .section-header h2', this.cmsData.history.title);
            }
            if (this.cmsData.history.subtitle) {
                this.updateTextContent('.our-history .section-header p', this.cmsData.history.subtitle);
            }
            
            // Timeline Section
            if (this.cmsData.history.timeline) {
                const timelineContainer = document.querySelector('.history-timeline');
                if (timelineContainer) {
                    timelineContainer.innerHTML = '';
                    this.cmsData.history.timeline.forEach(item => {
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
        }

        // Legacy Timeline Section (mantener compatibilidad)
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

        // Header Section
        if (this.cmsData['autismo-header']) {
            this.updateTextContent('.page-header h1', this.cmsData['autismo-header'].title);
            this.updateTextContent('.page-header p', this.cmsData['autismo-header'].description);
        }

        // Intro Section
        if (this.cmsData['autismo-intro']) {
            if (this.cmsData['autismo-intro'].sectionTitle) {
                this.updateTextContent('.autism-explanation .section-header h2', this.cmsData['autismo-intro'].sectionTitle);
            }
            if (this.cmsData['autismo-intro'].subtitle) {
                this.updateTextContent('.autism-explanation .section-header p', this.cmsData['autismo-intro'].subtitle);
            }
            if (this.cmsData['autismo-intro'].definitionTitle) {
                this.updateTextContent('.autism-definition h3', this.cmsData['autismo-intro'].definitionTitle);
            }
            if (this.cmsData['autismo-intro'].definitionText) {
                this.updateTextContent('.autism-definition p', this.cmsData['autismo-intro'].definitionText);
            }
            
            // Key Points - crear elementos dinámicos
            if (this.cmsData['autismo-intro'].keyPoints) {
                const keyPointsContainer = document.querySelector('.key-points-grid') || document.querySelector('.autism-characteristics');
                if (keyPointsContainer) {
                    keyPointsContainer.innerHTML = '';
                    this.cmsData['autismo-intro'].keyPoints.forEach(point => {
                        const pointElement = document.createElement('div');
                        pointElement.className = 'key-point-item';
                        pointElement.innerHTML = `
                            <div class="point-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="point-content">
                                <h4>${point}</h4>
                            </div>
                        `;
                        keyPointsContainer.appendChild(pointElement);
                    });
                }
            }
        }

        console.log('Cambios de Autismo aplicados');
    }

    // Aplicar cambios a página de Servicios
    applyServiciosChanges() {
        console.log('Aplicando cambios CMS a página de Servicios...');

        // Header Section
        if (this.cmsData['servicios-header']) {
            this.updateTextContent('.page-header h1', this.cmsData['servicios-header'].title);
            this.updateTextContent('.page-header p', this.cmsData['servicios-header'].description);
        }

        // Pilares Section
        if (this.cmsData['servicios-pilares']) {
            if (this.cmsData['servicios-pilares'].title) {
                this.updateTextContent('.service-pillars .section-header h2', this.cmsData['servicios-pilares'].title);
            }
            if (this.cmsData['servicios-pilares'].subtitle) {
                this.updateTextContent('.service-pillars .section-header p', this.cmsData['servicios-pilares'].subtitle);
            }
            
            if (this.cmsData['servicios-pilares'].services) {
                this.cmsData['servicios-pilares'].services.forEach((service, index) => {
                    this.updateTextContent(`.services-grid .service-card:nth-child(${index + 1}) h3`, service.title);
                    this.updateTextContent(`.services-grid .service-card:nth-child(${index + 1}) p`, service.description);
                    
                    // Actualizar icono si está presente
                    const iconElement = document.querySelector(`.services-grid .service-card:nth-child(${index + 1}) .service-icon i`);
                    if (iconElement && service.icon) {
                        iconElement.className = service.icon;
                    }
                });
            }
        }

        console.log('Cambios de Servicios aplicados');
    }

    // Aplicar cambios a página de Actualidad
    applyActualidadChanges() {
        console.log('Aplicando cambios CMS a página de Actualidad...');

        // Header Section
        if (this.cmsData['actualidad-header']) {
            this.updateTextContent('.page-header h1', this.cmsData['actualidad-header'].title);
            this.updateTextContent('.page-header p', this.cmsData['actualidad-header'].description);
        }

        // Config Section
        if (this.cmsData['actualidad-config']) {
            if (this.cmsData['actualidad-config'].introText) {
                this.updateTextContent('.blog-intro p', this.cmsData['actualidad-config'].introText);
            }
            
            // Categorías dinámicas
            if (this.cmsData['actualidad-config'].categories) {
                const categoriesContainer = document.querySelector('.blog-categories') || document.querySelector('.news-filters');
                if (categoriesContainer) {
                    categoriesContainer.innerHTML = '';
                    this.cmsData['actualidad-config'].categories.forEach(category => {
                        const categoryElement = document.createElement('button');
                        categoryElement.className = 'category-filter';
                        categoryElement.style.borderColor = category.color;
                        categoryElement.style.color = category.color;
                        categoryElement.textContent = category.name;
                        categoriesContainer.appendChild(categoryElement);
                    });
                }
            }
        }

        console.log('Cambios de Actualidad aplicados');
    }

    // Aplicar cambios a página de Afíliate
    applyAfiliateChanges() {
        console.log('Aplicando cambios CMS a página de Afíliate...');

        // Header Section
        if (this.cmsData['afiliate-header']) {
            this.updateTextContent('.page-header h1', this.cmsData['afiliate-header'].title);
            this.updateTextContent('.page-header p', this.cmsData['afiliate-header'].description);
        }

        // Membership Section
        if (this.cmsData['afiliate-membership']) {
            if (this.cmsData['afiliate-membership'].title) {
                this.updateTextContent('.ways-to-participate .section-header h2', this.cmsData['afiliate-membership'].title);
            }
            if (this.cmsData['afiliate-membership'].subtitle) {
                this.updateTextContent('.ways-to-participate .section-header p', this.cmsData['afiliate-membership'].subtitle);
            }
            
            if (this.cmsData['afiliate-membership'].membershipTypes) {
                this.cmsData['afiliate-membership'].membershipTypes.forEach((type, index) => {
                    // Actualizar pestañas
                    this.updateTextContent(`.tab-nav .tab-btn:nth-child(${index + 1})`, type.tabName);
                    
                    // Actualizar contenido de pestañas
                    this.updateTextContent(`.tab-content:nth-child(${index + 1}) h3`, type.title);
                    this.updateTextContent(`.tab-content:nth-child(${index + 1}) p`, type.description);
                });
            }
        }

        console.log('Cambios de Afíliate aplicados');
    }

    // Aplicar cambios a página de Contacto
    applyContactoChanges() {
        console.log('Aplicando cambios CMS a página de Contacto...');

        // Header Section
        if (this.cmsData['contacto-header']) {
            this.updateTextContent('.page-header h1', this.cmsData['contacto-header'].title);
            this.updateTextContent('.page-header p', this.cmsData['contacto-header'].description);
        }

        // Contact Info Section
        if (this.cmsData['contacto-info']) {
            // Título del formulario
            if (this.cmsData['contacto-info'].formTitle) {
                this.updateTextContent('.contact-form h2', this.cmsData['contacto-info'].formTitle);
            }
            if (this.cmsData['contacto-info'].formSubtitle) {
                this.updateTextContent('.contact-form .form-subtitle', this.cmsData['contacto-info'].formSubtitle);
            }
            
            // Información de contacto
            if (this.cmsData['contacto-info'].contactInfo) {
                const contactInfo = this.cmsData['contacto-info'].contactInfo;
                
                if (contactInfo.teléfono) {
                    this.updateTextContent('.contact-item.phone .contact-text', contactInfo.teléfono);
                }
                if (contactInfo.email) {
                    this.updateTextContent('.contact-item.email .contact-text', contactInfo.email);
                }
                if (contactInfo.dirección) {
                    this.updateTextContent('.contact-item.address .contact-text', contactInfo.dirección);
                }
                if (contactInfo.horario) {
                    this.updateTextContent('.contact-item.hours .contact-text', contactInfo.horario);
                }
            }
            
            // Redes sociales
            if (this.cmsData['contacto-info'].socialLinks) {
                const socialLinks = this.cmsData['contacto-info'].socialLinks;
                
                if (socialLinks.facebook) {
                    this.updateAttribute('.social-links a[data-social="facebook"]', 'href', socialLinks.facebook);
                }
                if (socialLinks.twitter) {
                    this.updateAttribute('.social-links a[data-social="twitter"]', 'href', socialLinks.twitter);
                }
                if (socialLinks.instagram) {
                    this.updateAttribute('.social-links a[data-social="instagram"]', 'href', socialLinks.instagram);
                }
                if (socialLinks.linkedin) {
                    this.updateAttribute('.social-links a[data-social="linkedin"]', 'href', socialLinks.linkedin);
                }
            }
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

    // Método para actualizar atributos
    updateAttribute(selector, attribute, value) {
        if (!value) return;
        
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute(attribute, value);
            console.log(`Actualizado atributo ${attribute} de ${selector}:`, value);
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