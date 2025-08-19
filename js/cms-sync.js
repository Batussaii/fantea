/**
 * CMS Sync - Sistema de sincronización entre el CMS y las páginas principales
 * Lee los datos guardados por el CMS desde localStorage y los aplica dinámicamente
 */

class CMSSync {
    constructor(page = null) {
        this.cmsData = {};
        this.currentPage = page || this.getCurrentPage();
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
        } else if (path.includes('test-cms-footer.html')) {
            return 'footer';
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
            case 'footer':
                this.applyFooterChanges();
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
            this.updateImageSrc('.hero-img', this.cmsData['asociaciones-header'].image);
            if (this.cmsData['asociaciones-header'].buttons) {
                const b = this.cmsData['asociaciones-header'].buttons;
                const btnVer = document.querySelector('.hero-actions .btn:nth-child(1)');
                const btnUnirse = document.querySelector('.hero-actions .btn:nth-child(2)');
                const btnEst = document.querySelector('.hero-actions .btn:nth-child(3)');
                if (btnVer) { btnVer.textContent = b.ver || btnVer.textContent; btnVer.href = b.verUrl || btnVer.href; }
                if (btnUnirse) { btnUnirse.textContent = b.unirse || btnUnirse.textContent; btnUnirse.href = b.unirseUrl || btnUnirse.href; }
                if (btnEst) { btnEst.textContent = b.estatutos || btnEst.textContent; btnEst.href = b.estatutosUrl || btnEst.href; }
            }
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

        // Stats in hero
        if (this.cmsData['asociaciones-stats'] && this.cmsData['asociaciones-stats'].stats) {
            this.cmsData['asociaciones-stats'].stats.forEach((stat, index) => {
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-number`, stat.number);
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-text`, stat.description);
            });
        }

        // Join section
        if (this.cmsData['asociaciones-join']) {
            this.updateTextContent('#join .join-text h2', this.cmsData['asociaciones-join'].title);
            this.updateTextContent('#join .join-text p', this.cmsData['asociaciones-join'].description);
            if (this.cmsData['asociaciones-join'].buttons) {
                const jb1 = document.querySelector('#join .join-actions .btn:nth-child(1)');
                const jb2 = document.querySelector('#join .join-actions .btn:nth-child(2)');
                if (jb1) { jb1.textContent = this.cmsData['asociaciones-join'].buttons.primary || jb1.textContent; jb1.href = this.cmsData['asociaciones-join'].buttons.primaryUrl || jb1.href; }
                if (jb2) { jb2.textContent = this.cmsData['asociaciones-join'].buttons.secondary || jb2.textContent; jb2.href = this.cmsData['asociaciones-join'].buttons.secondaryUrl || jb2.href; }
            }
        }

        // Benefits section
        if (this.cmsData['asociaciones-benefits'] && this.cmsData['asociaciones-benefits'].benefits) {
            const cards = document.querySelectorAll('.benefits-grid .benefit-card');
            this.cmsData['asociaciones-benefits'].benefits.forEach((b, index) => {
                if (cards[index]) {
                    const icon = cards[index].querySelector('.benefit-icon i');
                    const title = cards[index].querySelector('h4');
                    const desc = cards[index].querySelector('p');
                    if (icon && b.icon) icon.className = b.icon;
                    if (title && b.title) title.textContent = b.title;
                    if (desc && b.description) desc.textContent = b.description;
                }
            });
        }

        // CTA section
        if (this.cmsData['asociaciones-cta']) {
            this.updateTextContent('.cta-section .cta-content h2', this.cmsData['asociaciones-cta'].title);
            this.updateTextContent('.cta-section .cta-content p', this.cmsData['asociaciones-cta'].description);
            if (this.cmsData['asociaciones-cta'].buttons) {
                const b1 = document.querySelector('.cta-actions .btn:nth-child(1)');
                const b2 = document.querySelector('.cta-actions .btn:nth-child(2)');
                if (b1) { b1.textContent = this.cmsData['asociaciones-cta'].buttons.primary || b1.textContent; b1.href = this.cmsData['asociaciones-cta'].buttons.primaryUrl || b1.href; }
                if (b2) { b2.textContent = this.cmsData['asociaciones-cta'].buttons.secondary || b2.textContent; b2.href = this.cmsData['asociaciones-cta'].buttons.secondaryUrl || b2.href; }
            }
        }

        // Statutes section
        if (this.cmsData['asociaciones-statutes']) {
            this.updateTextContent('#download-statutes .statutes-text h2', this.cmsData['asociaciones-statutes'].title);
            this.updateTextContent('#download-statutes .statutes-text p', this.cmsData['asociaciones-statutes'].description);
            if (this.cmsData['asociaciones-statutes'].features) {
                const featureItems = document.querySelectorAll('.statutes-features .feature-item span');
                this.cmsData['asociaciones-statutes'].features.forEach((feature, index) => {
                    if (featureItems[index] && feature) {
                        featureItems[index].textContent = feature;
                    }
                });
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
            this.updateImageSrc('.hero-img', this.cmsData['areas-header'].image);
            
            // Actualizar botones del hero
            if (this.cmsData['areas-header'].buttons) {
                const buttons = this.cmsData['areas-header'].buttons;
                const btnVer = document.querySelector('.hero-actions .btn:nth-child(1)');
                const btnManifiesto = document.querySelector('.hero-actions .btn:nth-child(2)');
                if (btnVer && buttons.ver) { 
                    btnVer.textContent = buttons.ver; 
                    btnVer.href = buttons.verUrl || btnVer.href; 
                }
                if (btnManifiesto && buttons.manifiesto) { 
                    btnManifiesto.textContent = buttons.manifiesto; 
                    btnManifiesto.href = buttons.manifiestoUrl || btnManifiesto.href; 
                }
            }
        }

        // Stats Section
        if (this.cmsData['areas-stats'] && this.cmsData['areas-stats'].items) {
            this.cmsData['areas-stats'].items.forEach((stat, index) => {
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-number`, stat.number);
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-text`, stat.description);
            });
        }

        // Areas List Section
        if (this.cmsData['areas-list']) {
            if (this.cmsData['areas-list'].title) {
                this.updateTextContent('.areas-section .section-header h2', this.cmsData['areas-list'].title);
            }
            if (this.cmsData['areas-list'].subtitle) {
                this.updateTextContent('.areas-section .section-header p', this.cmsData['areas-list'].subtitle);
            }
            
            // Areas List - Actualizar cada área individualmente
            if (this.cmsData['areas-list'].areas) {
                this.cmsData['areas-list'].areas.forEach((area, index) => {
                    const areaCard = document.querySelector(`.areas-grid .area-card:nth-child(${index + 1})`);
                    if (areaCard) {
                        // Actualizar título
                        const title = areaCard.querySelector('.area-info h3');
                        if (title && area.title) title.textContent = area.title;
                        
                        // Actualizar emoji
                        const emoji = areaCard.querySelector('.area-emoji');
                        if (emoji && area.emoji) emoji.textContent = area.emoji;
                        
                        // Actualizar descripción
                        const description = areaCard.querySelector('.area-description p');
                        if (description && area.description) description.textContent = area.description;
                        
                        // Actualizar lista de características
                        if (area.features) {
                            const featuresList = areaCard.querySelector('.area-list');
                            if (featuresList) {
                                featuresList.innerHTML = '';
                                area.features.forEach(feature => {
                                    const li = document.createElement('li');
                                    li.innerHTML = `<i class="fas fa-check"></i>${feature}`;
                                    featuresList.appendChild(li);
                                });
                            }
                        }
                    }
                });
            }
        }

        // Impact Section
        if (this.cmsData['areas-impact']) {
            if (this.cmsData['areas-impact'].title) {
                this.updateTextContent('.impact-section .impact-text h2', this.cmsData['areas-impact'].title);
            }
            if (this.cmsData['areas-impact'].description) {
                this.updateTextContent('.impact-section .impact-text p', this.cmsData['areas-impact'].description);
            }
            this.updateImageSrc('.impact-img', this.cmsData['areas-impact'].image);
            
            // Impact Stats
            if (this.cmsData['areas-impact'].stats) {
                this.cmsData['areas-impact'].stats.forEach((stat, index) => {
                    this.updateTextContent(`.impact-stats .impact-stat:nth-child(${index + 1}) .impact-number`, stat.percentage);
                    this.updateTextContent(`.impact-stats .impact-stat:nth-child(${index + 1}) .impact-label`, stat.description);
                });
            }
        }

        // CTA Section
        if (this.cmsData['areas-cta']) {
            if (this.cmsData['areas-cta'].title) {
                this.updateTextContent('.cta-section .cta-content h2', this.cmsData['areas-cta'].title);
            }
            if (this.cmsData['areas-cta'].description) {
                this.updateTextContent('.cta-section .cta-content p', this.cmsData['areas-cta'].description);
            }
            
            // CTA Buttons
            if (this.cmsData['areas-cta'].buttons) {
                const buttons = this.cmsData['areas-cta'].buttons;
                const btnManifiesto = document.querySelector('.cta-actions .btn:nth-child(1)');
                const btnContactar = document.querySelector('.cta-actions .btn:nth-child(2)');
                if (btnManifiesto && buttons.manifiesto) { 
                    btnManifiesto.textContent = buttons.manifiesto; 
                    btnManifiesto.href = buttons.manifiestoUrl || btnManifiesto.href; 
                }
                if (btnContactar && buttons.contactar) { 
                    btnContactar.textContent = buttons.contactar; 
                    btnContactar.href = buttons.contactarUrl || btnContactar.href; 
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
            this.updateImageSrc('.hero-img', this.cmsData['manifiesto-header'].image);
            
            // Actualizar botones del hero
            if (this.cmsData['manifiesto-header'].buttons) {
                const buttons = this.cmsData['manifiesto-header'].buttons;
                const btnCompromisos = document.querySelector('.hero-actions .btn:nth-child(1)');
                if (btnCompromisos && buttons[0]) { 
                    btnCompromisos.textContent = buttons[0].text; 
                    btnCompromisos.href = buttons[0].url || btnCompromisos.href; 
                }
            }
        }

        // Stats Section
        if (this.cmsData['manifiesto-stats'] && this.cmsData['manifiesto-stats'].items) {
            this.cmsData['manifiesto-stats'].items.forEach((stat, index) => {
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-number`, stat.number);
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-text`, stat.description);
            });
        }

        // Commitments Section
        if (this.cmsData['manifiesto-commitments']) {
            if (this.cmsData['manifiesto-commitments'].title) {
                this.updateTextContent('.commitments-section .section-header h2', this.cmsData['manifiesto-commitments'].title);
            }
            if (this.cmsData['manifiesto-commitments'].subtitle) {
                this.updateTextContent('.commitments-section .section-header p', this.cmsData['manifiesto-commitments'].subtitle);
            }
            
            // Commitments List - Actualizar cada compromiso individualmente
            if (this.cmsData['manifiesto-commitments'].commitments) {
                this.cmsData['manifiesto-commitments'].commitments.forEach((commitment, index) => {
                    const commitmentCard = document.querySelector(`.commitments-grid .commitment-card:nth-child(${index + 1})`);
                    if (commitmentCard) {
                        // Actualizar título
                        const title = commitmentCard.querySelector('h3');
                        if (title && commitment.title) title.textContent = commitment.title;
                        
                        // Actualizar descripción
                        const description = commitmentCard.querySelector('p');
                        if (description && commitment.description) description.textContent = commitment.description;
                        
                        // Actualizar icono
                        const icon = commitmentCard.querySelector('.commitment-icon i');
                        if (icon && commitment.icon) icon.className = commitment.icon;
                    }
                });
            }
        }

        // Values Section
        if (this.cmsData['manifiesto-values']) {
            if (this.cmsData['manifiesto-values'].title) {
                this.updateTextContent('.values-section .section-header h2', this.cmsData['manifiesto-values'].title);
            }
            if (this.cmsData['manifiesto-values'].subtitle) {
                this.updateTextContent('.values-section .section-header p', this.cmsData['manifiesto-values'].subtitle);
            }
            
            // Values List - Actualizar cada valor individualmente
            if (this.cmsData['manifiesto-values'].values) {
                this.cmsData['manifiesto-values'].values.forEach((value, index) => {
                    const valueCard = document.querySelector(`.values-grid .value-card:nth-child(${index + 1})`);
                    if (valueCard) {
                        // Actualizar título
                        const title = valueCard.querySelector('h3');
                        if (title && value.title) title.textContent = value.title;
                        
                        // Actualizar descripción
                        const description = valueCard.querySelector('p');
                        if (description && value.description) description.textContent = value.description;
                        
                        // Actualizar icono
                        const icon = valueCard.querySelector('.value-icon i');
                        if (icon && value.icon) icon.className = value.icon;
                    }
                });
            }
        }

        // CTA Section
        if (this.cmsData['manifiesto-cta']) {
            if (this.cmsData['manifiesto-cta'].title) {
                this.updateTextContent('.cta-section .cta-content h2', this.cmsData['manifiesto-cta'].title);
            }
            if (this.cmsData['manifiesto-cta'].description) {
                this.updateTextContent('.cta-section .cta-content p', this.cmsData['manifiesto-cta'].description);
            }
            
            // CTA Buttons
            if (this.cmsData['manifiesto-cta'].buttons) {
                const buttons = this.cmsData['manifiesto-cta'].buttons;
                const btnUnirse = document.querySelector('.cta-actions .btn:nth-child(1)');
                const btnContactar = document.querySelector('.cta-actions .btn:nth-child(2)');
                if (btnUnirse && buttons.unirse) { 
                    btnUnirse.textContent = buttons.unirse; 
                    btnUnirse.href = buttons.unirseUrl || btnUnirse.href; 
                }
                if (btnContactar && buttons.contactar) { 
                    btnContactar.textContent = buttons.contactar; 
                    btnContactar.href = buttons.contactarUrl || btnContactar.href; 
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
            this.updateImageSrc('.hero-img', this.cmsData['prensa-header'].image);
            
            // Actualizar botones del hero
            if (this.cmsData['prensa-header'].buttons) {
                const buttons = this.cmsData['prensa-header'].buttons;
                const btnNoticias = document.querySelector('.hero-actions .btn:nth-child(1)');
                const btnRecursos = document.querySelector('.hero-actions .btn:nth-child(2)');
                if (btnNoticias && buttons[0]) { 
                    btnNoticias.textContent = buttons[0].text; 
                    btnNoticias.href = buttons[0].url || btnNoticias.href; 
                }
                if (btnRecursos && buttons[1]) { 
                    btnRecursos.textContent = buttons[1].text; 
                    btnRecursos.href = buttons[1].url || btnRecursos.href; 
                }
            }
        }

        // Stats Section
        if (this.cmsData['prensa-stats'] && this.cmsData['prensa-stats'].items) {
            this.cmsData['prensa-stats'].items.forEach((stat, index) => {
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-number`, stat.number);
                this.updateTextContent(`.hero-stats .stat-item:nth-child(${index + 1}) .stat-text`, stat.description);
            });
        }

        // Press Items Section
        if (this.cmsData['prensa-items']) {
            // Actualizar cada artículo de prensa individualmente
            if (this.cmsData['prensa-items'].articles) {
                this.cmsData['prensa-items'].articles.forEach((article, index) => {
                    const pressCard = document.querySelector(`.press-grid .press-card:nth-child(${index + 1})`);
                    if (pressCard) {
                        // Actualizar imagen
                        const image = pressCard.querySelector('.press-image img');
                        if (image && article.image) image.src = article.image;
                        
                        // Actualizar categoría
                        const category = pressCard.querySelector('.press-category');
                        if (category && article.category) category.textContent = article.category;
                        
                        // Actualizar fecha
                        const date = pressCard.querySelector('.press-date');
                        if (date && article.date) date.innerHTML = `<i class="fas fa-calendar"></i> ${article.date}`;
                        
                        // Actualizar tipo
                        const type = pressCard.querySelector('.press-type');
                        if (type && article.type) type.innerHTML = `<i class="fas fa-${article.typeIcon}"></i> ${article.type}`;
                        
                        // Actualizar título
                        const title = pressCard.querySelector('h3');
                        if (title && article.title) title.textContent = article.title;
                        
                        // Actualizar descripción
                        const description = pressCard.querySelector('p');
                        if (description && article.description) description.textContent = article.description;
                        
                        // Actualizar enlace
                        const link = pressCard.querySelector('.press-link span');
                        if (link && article.linkText) link.textContent = article.linkText;
                        
                        // Actualizar URL del enlace
                        const linkElement = pressCard.querySelector('.press-link');
                        if (linkElement && article.linkUrl) linkElement.href = article.linkUrl;
                    }
                });
            }
        }

        // Resources Section
        if (this.cmsData['prensa-resources']) {
            if (this.cmsData['prensa-resources'].title) {
                this.updateTextContent('.resources-section .section-header h2', this.cmsData['prensa-resources'].title);
            }
            if (this.cmsData['prensa-resources'].subtitle) {
                this.updateTextContent('.resources-section .section-header p', this.cmsData['prensa-resources'].subtitle);
            }
            
            // Resources List - Actualizar cada recurso individualmente
            if (this.cmsData['prensa-resources'].resources) {
                this.cmsData['prensa-resources'].resources.forEach((resource, index) => {
                    const resourceCard = document.querySelector(`.resources-grid .resource-card:nth-child(${index + 1})`);
                    if (resourceCard) {
                        // Actualizar icono
                        const icon = resourceCard.querySelector('.resource-icon i');
                        if (icon && resource.icon) icon.className = resource.icon;
                        
                        // Actualizar título
                        const title = resourceCard.querySelector('h3');
                        if (title && resource.title) title.textContent = resource.title;
                        
                        // Actualizar descripción
                        const description = resourceCard.querySelector('p');
                        if (description && resource.description) description.textContent = resource.description;
                        
                        // Actualizar enlace
                        const link = resourceCard.querySelector('.resource-link span');
                        if (link && resource.linkText) link.textContent = resource.linkText;
                        
                        // Actualizar URL del enlace
                        const linkElement = resourceCard.querySelector('.resource-link');
                        if (linkElement && resource.linkUrl) linkElement.href = resource.linkUrl;
                    }
                });
            }
        }

        // Contact Section
        if (this.cmsData['prensa-contact']) {
            if (this.cmsData['prensa-contact'].title) {
                this.updateTextContent('.contact-section .contact-text h2', this.cmsData['prensa-contact'].title);
            }
            if (this.cmsData['prensa-contact'].description) {
                this.updateTextContent('.contact-section .contact-text p', this.cmsData['prensa-contact'].description);
            }
            
            // Contact Info
            if (this.cmsData['prensa-contact'].contactInfo) {
                const contactInfo = this.cmsData['prensa-contact'].contactInfo;
                if (contactInfo.email) {
                    this.updateTextContent('.contact-item:nth-child(1) span', contactInfo.email);
                }
                if (contactInfo.phone) {
                    this.updateTextContent('.contact-item:nth-child(2) span', contactInfo.phone);
                }
                if (contactInfo.hours) {
                    this.updateTextContent('.contact-item:nth-child(3) span', contactInfo.hours);
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

        // Solicitud de Afiliación Section
        if (this.cmsData['afiliate-solicitud']) {
            this.updateTextContent('.membership-options .section-header h2', this.cmsData['afiliate-solicitud'].title);
            this.updateTextContent('.membership-options .section-header p', this.cmsData['afiliate-solicitud'].description);
        }

        // Beneficios Section
        if (this.cmsData['afiliate-beneficios']) {
            this.updateTextContent('.benefits-list h4', this.cmsData['afiliate-beneficios'].title);
            if (this.cmsData['afiliate-beneficios'].items) {
                this.cmsData['afiliate-beneficios'].items.forEach((item, index) => {
                    this.updateTextContent(`.benefits-list ul li:nth-child(${index + 1})`, item);
                });
            }
        }

        // Requisitos Section
        if (this.cmsData['afiliate-requisitos']) {
            this.updateTextContent('.requirements h4', this.cmsData['afiliate-requisitos'].title);
            if (this.cmsData['afiliate-requisitos'].items) {
                this.cmsData['afiliate-requisitos'].items.forEach((item, index) => {
                    this.updateTextContent(`.requirements ul li:nth-child(${index + 1})`, item);
                });
            }
        }

        // Formulario Section
        if (this.cmsData['afiliate-formulario']) {
            this.updateTextContent('.zoho-form-container h4', this.cmsData['afiliate-formulario'].title);
            this.updateTextContent('.zoho-form-container p', this.cmsData['afiliate-formulario'].description);
            this.updateTextContent('.form-info p', this.cmsData['afiliate-formulario'].note);
        }

        // Impacto Section
        if (this.cmsData['afiliate-impacto']) {
            this.updateTextContent('.impact-section .section-header h2', this.cmsData['afiliate-impacto'].title);
            this.updateTextContent('.impact-section .section-header p', this.cmsData['afiliate-impacto'].description);
            
            if (this.cmsData['afiliate-impacto'].stats) {
                const stats = this.cmsData['afiliate-impacto'].stats;
                this.updateTextContent('.impact-item:nth-child(1) .impact-number', stats.personasBeneficiadas);
                this.updateTextContent('.impact-item:nth-child(1) .impact-text', stats.personasBeneficiadasText);
                this.updateTextContent('.impact-item:nth-child(2) .impact-number', stats.asociacionesAfiliadas);
                this.updateTextContent('.impact-item:nth-child(2) .impact-text', stats.asociacionesAfiliadasText);
                this.updateTextContent('.impact-item:nth-child(3) .impact-number', stats.voluntariosActivos);
                this.updateTextContent('.impact-item:nth-child(3) .impact-text', stats.voluntariosActivosText);
                this.updateTextContent('.impact-item:nth-child(4) .impact-number', stats.familiasColaboradoras);
                this.updateTextContent('.impact-item:nth-child(4) .impact-text', stats.familiasColaboradorasText);
            }
        }

        // Testimonios Section
        if (this.cmsData['afiliate-testimonios']) {
            if (this.cmsData['afiliate-testimonios'].testimonios) {
                this.cmsData['afiliate-testimonios'].testimonios.forEach((testimonio, index) => {
                    this.updateTextContent(`.testimonial-card:nth-child(${index + 1}) .testimonial-content p`, testimonio.texto);
                    this.updateTextContent(`.testimonial-card:nth-child(${index + 1}) .testimonial-author h4`, testimonio.nombre);
                    this.updateTextContent(`.testimonial-card:nth-child(${index + 1}) .testimonial-author span`, testimonio.cargo);
                    if (testimonio.imagen) {
                        this.updateAttribute(`.testimonial-card:nth-child(${index + 1}) .testimonial-author img`, 'src', testimonio.imagen);
                    }
                });
            }
        }

        // Donaciones Section
        if (this.cmsData['afiliate-donaciones']) {
            this.updateTextContent('.donations-section .section-header h2', this.cmsData['afiliate-donaciones'].title);
            this.updateTextContent('.donations-section .section-header p', this.cmsData['afiliate-donaciones'].description);
        }

        // Donación Puntual Section
        if (this.cmsData['afiliate-donacion-puntual']) {
            const data = this.cmsData['afiliate-donacion-puntual'];
            this.updateTextContent('.donation-card:first-child .donation-header h3', data.title);
            this.updateTextContent('.donation-card:first-child p', data.description);
            this.updateTextContent('.donation-card:first-child .donation-impact h4', data.impactTitle);
            this.updateTextContent('.donation-card:first-child .payment-methods h5', data.paymentMethodsTitle);
            this.updateTextContent('.donation-card:first-child .btn-primary', data.buttonText);
            
            if (data.impactItems) {
                data.impactItems.forEach((item, index) => {
                    this.updateTextContent(`.donation-card:first-child .impact-list li:nth-child(${index + 1})`, item);
                });
            }
        }

        // Donación Mensual Section
        if (this.cmsData['afiliate-donacion-mensual']) {
            const data = this.cmsData['afiliate-donacion-mensual'];
            this.updateTextContent('.donation-card.featured .donation-header h3', data.title);
            this.updateTextContent('.donation-card.featured p', data.description);
            this.updateTextContent('.donation-card.featured .popular-badge', data.popularBadge);
            this.updateTextContent('.donation-card.featured .partner-benefits h5', data.benefitsTitle);
            this.updateTextContent('.donation-card.featured .btn-secondary', data.buttonText);
            
            if (data.monthlyOptions) {
                data.monthlyOptions.forEach((option, index) => {
                    this.updateTextContent(`.donation-card.featured .monthly-option:nth-child(${index + 1}) .amount`, option.amount);
                    this.updateTextContent(`.donation-card.featured .monthly-option:nth-child(${index + 1}) .impact`, option.impact);
                });
            }
            
            if (data.benefitsItems) {
                data.benefitsItems.forEach((item, index) => {
                    this.updateTextContent(`.donation-card.featured .benefits-list li:nth-child(${index + 1})`, item);
                });
            }
        }

        // Patrocinio Section
        if (this.cmsData['afiliate-patrocinio']) {
            const data = this.cmsData['afiliate-patrocinio'];
            this.updateTextContent('.donation-card:last-child .donation-header h3', data.title);
            this.updateTextContent('.donation-card:last-child p', data.description);
            this.updateTextContent('.donation-card:last-child .csr-benefits h5', data.benefitsTitle);
            this.updateTextContent('.donation-card:last-child .btn-outline', data.buttonText);
            
            if (data.tiers) {
                data.tiers.forEach((tier, index) => {
                    this.updateTextContent(`.donation-card:last-child .tier-item:nth-child(${index + 1}) h5`, tier.name);
                    this.updateTextContent(`.donation-card:last-child .tier-item:nth-child(${index + 1}) .tier-amount`, tier.amount);
                    this.updateTextContent(`.donation-card:last-child .tier-item:nth-child(${index + 1}) p`, tier.description);
                });
            }
            
            if (data.benefitsItems) {
                data.benefitsItems.forEach((item, index) => {
                    this.updateTextContent(`.donation-card:last-child .benefits-list li:nth-child(${index + 1})`, item);
                });
            }
        }

        // Transparencia Section
        if (this.cmsData['afiliate-transparencia']) {
            const data = this.cmsData['afiliate-transparencia'];
            this.updateTextContent('.transparency-card h3', data.title);
            this.updateTextContent('.transparency-note', data.note);
            
            if (data.fundDistribution) {
                data.fundDistribution.forEach((fund, index) => {
                    this.updateTextContent(`.fund-item:nth-child(${index + 1}) .fund-label`, fund.label);
                    this.updateTextContent(`.fund-item:nth-child(${index + 1}) .fund-percentage`, fund.percentage);
                });
            }
        }

        // Documentos Section
        if (this.cmsData['afiliate-documentos']) {
            this.updateTextContent('.legal-documents .section-header h2', this.cmsData['afiliate-documentos'].title);
            this.updateTextContent('.legal-documents .section-header p', this.cmsData['afiliate-documentos'].description);
        }

        // Documentos Corporativos Section
        if (this.cmsData['afiliate-documentos-corporativos']) {
            const data = this.cmsData['afiliate-documentos-corporativos'];
            this.updateTextContent('.document-category:first-child .category-header h3', data.title);
            
            if (data.documents) {
                data.documents.forEach((doc, index) => {
                    this.updateTextContent(`.document-category:first-child .document-item:nth-child(${index + 1}) h4`, doc.name);
                    this.updateTextContent(`.document-category:first-child .document-item:nth-child(${index + 1}) p`, doc.description);
                    this.updateTextContent(`.document-category:first-child .document-item:nth-child(${index + 1}) .document-meta`, doc.meta);
                });
            }
        }

        // Formularios de Afiliación Section
        if (this.cmsData['afiliate-formularios-afiliacion']) {
            const data = this.cmsData['afiliate-formularios-afiliacion'];
            this.updateTextContent('.document-category:nth-child(2) .category-header h3', data.title);
            
            if (data.documents) {
                data.documents.forEach((doc, index) => {
                    this.updateTextContent(`.document-category:nth-child(2) .document-item:nth-child(${index + 1}) h4`, doc.name);
                    this.updateTextContent(`.document-category:nth-child(2) .document-item:nth-child(${index + 1}) p`, doc.description);
                    this.updateTextContent(`.document-category:nth-child(2) .document-item:nth-child(${index + 1}) .document-meta`, doc.meta);
                });
            }
        }

        // Documentos Legales Section
        if (this.cmsData['afiliate-documentos-legales']) {
            const data = this.cmsData['afiliate-documentos-legales'];
            this.updateTextContent('.document-category:nth-child(3) .category-header h3', data.title);
            
            if (data.documents) {
                data.documents.forEach((doc, index) => {
                    this.updateTextContent(`.document-category:nth-child(3) .document-item:nth-child(${index + 1}) h4`, doc.name);
                    this.updateTextContent(`.document-category:nth-child(3) .document-item:nth-child(${index + 1}) p`, doc.description);
                    this.updateTextContent(`.document-category:nth-child(3) .document-item:nth-child(${index + 1}) .document-meta`, doc.meta);
                });
            }
        }

        // Recursos y Guías Section
        if (this.cmsData['afiliate-recursos-guias']) {
            const data = this.cmsData['afiliate-recursos-guias'];
            this.updateTextContent('.document-category:last-child .category-header h3', data.title);
            
            if (data.documents) {
                data.documents.forEach((doc, index) => {
                    this.updateTextContent(`.document-category:last-child .document-item:nth-child(${index + 1}) h4`, doc.name);
                    this.updateTextContent(`.document-category:last-child .document-item:nth-child(${index + 1}) p`, doc.description);
                    this.updateTextContent(`.document-category:last-child .document-item:nth-child(${index + 1}) .document-meta`, doc.meta);
                });
            }
        }

        // Ayuda Section
        if (this.cmsData['afiliate-ayuda']) {
            const data = this.cmsData['afiliate-ayuda'];
            this.updateTextContent('.help-card .help-header h3', data.title);
            this.updateTextContent('.help-card p', data.description);
            this.updateTextContent('.help-actions .btn-primary', data.buttonText);
            this.updateTextContent('.help-actions .btn-outline', data.faqButtonText);
            
            if (data.contactOptions) {
                data.contactOptions.forEach((option, index) => {
                    this.updateTextContent(`.help-option:nth-child(${index + 1}) h4`, option.title);
                    this.updateTextContent(`.help-option:nth-child(${index + 1}) p`, option.value);
                });
            }
        }

        console.log('Cambios de Afíliate aplicados');
    }

    // Aplicar cambios a página de Contacto
    applyContactoChanges() {
        console.log('Aplicando cambios CMS a página de Contacto...');

        // Banner Section
        if (this.cmsData['contacto-header']) {
            this.updateTextContent('.page-header h1', this.cmsData['contacto-header'].title);
            this.updateTextContent('.page-header p', this.cmsData['contacto-header'].description);
        }

        // Formulario Section
        if (this.cmsData['contacto-info']) {
            this.updateTextContent('.form-header h2', this.cmsData['contacto-info'].formTitle);
            this.updateTextContent('.form-header p', this.cmsData['contacto-info'].formSubtitle);
        }

        // Información de Contacto Section
        if (this.cmsData['contacto-info'] && this.cmsData['contacto-info'].contactInfo) {
            this.updateTextContent('.contact-info-card h3', 'Información de Contacto');
            
            // Dirección
            if (this.cmsData['contacto-info'].contactInfo.dirección) {
                this.updateTextContent('.contact-details .contact-item:nth-child(1) .contact-text h4', 'Dirección');
                this.updateTextContent('.contact-details .contact-item:nth-child(1) .contact-text p', this.cmsData['contacto-info'].contactInfo.dirección);
            }
            
            // Teléfono
            if (this.cmsData['contacto-info'].contactInfo.teléfonoprincipal) {
                this.updateTextContent('.contact-details .contact-item:nth-child(2) .contact-text h4', 'Teléfono');
                this.updateTextContent('.contact-details .contact-item:nth-child(2) .contact-text p', this.cmsData['contacto-info'].contactInfo.teléfonoprincipal);
                if (this.cmsData['contacto-info'].contactInfo.horariodeatención) {
                    this.updateTextContent('.contact-details .contact-item:nth-child(2) .contact-text small', this.cmsData['contacto-info'].contactInfo.horariodeatención);
                }
            }
            
            // Email
            if (this.cmsData['contacto-info'].contactInfo.emailprincipal) {
                this.updateTextContent('.contact-details .contact-item:nth-child(3) .contact-text h4', 'Email');
                this.updateTextContent('.contact-details .contact-item:nth-child(3) .contact-text p', this.cmsData['contacto-info'].contactInfo.emailprincipal);
            }
            
            // Atención Especializada
            if (this.cmsData['contacto-info'].contactInfo.emaildeprensa) {
                this.updateTextContent('.contact-details .contact-item:nth-child(4) .contact-text h4', 'Atención Especializada');
                this.updateTextContent('.contact-details .contact-item:nth-child(4) .contact-text p', this.cmsData['contacto-info'].contactInfo.emaildeprensa);
                this.updateTextContent('.contact-details .contact-item:nth-child(4) .contact-text small', 'Para consultas específicas sobre TEA');
            }
        }

        // Línea de Apoyo Section
        if (this.cmsData['contacto-apoyo']) {
            this.updateTextContent('.emergency-header h4', this.cmsData['contacto-apoyo'].title);
            this.updateTextContent('.emergency-number', this.cmsData['contacto-apoyo'].number);
            this.updateTextContent('.emergency-description', this.cmsData['contacto-apoyo'].description);
        }

        // Horarios Section
        if (this.cmsData['contacto-horarios']) {
            this.updateTextContent('.schedule-card h3', this.cmsData['contacto-horarios'].title);
            this.updateTextContent('.schedule-note p', this.cmsData['contacto-horarios'].note);
            
            if (this.cmsData['contacto-horarios'].schedules) {
                this.cmsData['contacto-horarios'].schedules.forEach((schedule, index) => {
                    this.updateTextContent(`.schedule-list .schedule-item:nth-child(${index + 1}) .day`, schedule.day);
                    this.updateTextContent(`.schedule-list .schedule-item:nth-child(${index + 1}) .time`, schedule.time);
                });
            }
        }

        // Ubicación Section
        if (this.cmsData['contacto-ubicacion']) {
            this.updateTextContent('.map-header h2', this.cmsData['contacto-ubicacion'].title);
            this.updateTextContent('.map-header p', this.cmsData['contacto-ubicacion'].description);
        }

        // Transporte Section
        if (this.cmsData['contacto-transporte']) {
            this.updateTextContent('.location-info h3', this.cmsData['contacto-transporte'].title);
            
            if (this.cmsData['contacto-transporte'].metro) {
                this.updateTextContent('.transport-options .transport-item:nth-child(1) h4', this.cmsData['contacto-transporte'].metro.title);
                this.updateTextContent('.transport-options .transport-item:nth-child(1) p', this.cmsData['contacto-transporte'].metro.description);
            }
            
            if (this.cmsData['contacto-transporte'].bus) {
                this.updateTextContent('.transport-options .transport-item:nth-child(2) h4', this.cmsData['contacto-transporte'].bus.title);
                this.updateTextContent('.transport-options .transport-item:nth-child(2) p', this.cmsData['contacto-transporte'].bus.description);
            }
            
            if (this.cmsData['contacto-transporte'].parking) {
                this.updateTextContent('.transport-options .transport-item:nth-child(3) h4', this.cmsData['contacto-transporte'].parking.title);
                this.updateTextContent('.transport-options .transport-item:nth-child(3) p', this.cmsData['contacto-transporte'].parking.description);
            }
        }

        // Accesibilidad Section
        if (this.cmsData['contacto-accesibilidad']) {
            this.updateTextContent('.accessibility-info h3', this.cmsData['contacto-accesibilidad'].title);
            
            if (this.cmsData['contacto-accesibilidad'].features) {
                this.cmsData['contacto-accesibilidad'].features.forEach((feature, index) => {
                    this.updateTextContent(`.accessibility-features li:nth-child(${index + 1})`, feature);
                });
            }
        }

        // FAQ Section
        if (this.cmsData['contacto-faq']) {
            this.updateTextContent('.faq-section .section-header h2', this.cmsData['contacto-faq'].title);
            this.updateTextContent('.faq-section .section-header p', this.cmsData['contacto-faq'].description);
            
            if (this.cmsData['contacto-faq'].questions) {
                this.cmsData['contacto-faq'].questions.forEach((faq, index) => {
                    this.updateTextContent(`.faq-grid .faq-item:nth-child(${index + 1}) .faq-question h3`, faq.question);
                    this.updateTextContent(`.faq-grid .faq-item:nth-child(${index + 1}) .faq-answer p`, faq.answer);
                });
            }
        }

        console.log('Cambios de Contacto aplicados');
    }

    // Aplicar cambios a página de Footer
    applyFooterChanges() {
        console.log('Aplicando cambios CMS a Footer...');

        // Logo y descripción principal
        if (this.cmsData['footer-logo']) {
            this.updateTextContent('.footer-logo h3', this.cmsData['footer-logo'].title);
            this.updateTextContent('.footer-section:first-child p', this.cmsData['footer-logo'].description);
        }

        // Redes sociales
        if (this.cmsData['footer-social']) {
            const socialLinks = document.querySelectorAll('.social-links a');
            if (socialLinks.length >= 5) {
                if (this.cmsData['footer-social'].facebook) {
                    socialLinks[0].href = this.cmsData['footer-social'].facebook;
                    socialLinks[0].target = '_blank';
                    socialLinks[0].rel = 'noopener noreferrer';
                }
                if (this.cmsData['footer-social'].twitter) {
                    socialLinks[1].href = this.cmsData['footer-social'].twitter;
                    socialLinks[1].target = '_blank';
                    socialLinks[1].rel = 'noopener noreferrer';
                }
                if (this.cmsData['footer-social'].instagram) {
                    socialLinks[2].href = this.cmsData['footer-social'].instagram;
                    socialLinks[2].target = '_blank';
                    socialLinks[2].rel = 'noopener noreferrer';
                }
                if (this.cmsData['footer-social'].linkedin) {
                    socialLinks[3].href = this.cmsData['footer-social'].linkedin;
                    socialLinks[3].target = '_blank';
                    socialLinks[3].rel = 'noopener noreferrer';
                }
                if (this.cmsData['footer-social'].youtube) {
                    socialLinks[4].href = this.cmsData['footer-social'].youtube;
                    socialLinks[4].target = '_blank';
                    socialLinks[4].rel = 'noopener noreferrer';
                }
            }
        }

        // Navegación
        if (this.cmsData['footer-navigation']) {
            this.updateTextContent('.footer-section:nth-child(2) h4', this.cmsData['footer-navigation'].title);
            
            if (this.cmsData['footer-navigation'].links) {
                const navLinks = document.querySelectorAll('.footer-section:nth-child(2) .footer-links li a');
                this.cmsData['footer-navigation'].links.forEach((link, index) => {
                    if (navLinks[index]) {
                        navLinks[index].textContent = link.text;
                        navLinks[index].href = link.url;
                    }
                });
            }
        }

        // Recursos
        if (this.cmsData['footer-resources']) {
            this.updateTextContent('.footer-section:nth-child(3) h4', this.cmsData['footer-resources'].title);
            
            if (this.cmsData['footer-resources'].links) {
                const resourceLinks = document.querySelectorAll('.footer-section:nth-child(3) .footer-links li a');
                this.cmsData['footer-resources'].links.forEach((link, index) => {
                    if (resourceLinks[index]) {
                        resourceLinks[index].textContent = link.text;
                        resourceLinks[index].href = link.url;
                    }
                });
            }
        }

        // Contacto
        if (this.cmsData['footer-contact']) {
            this.updateTextContent('.footer-section:nth-child(4) h4', this.cmsData['footer-contact'].title);
            
            const contactInfo = document.querySelectorAll('.footer-section:nth-child(4) .contact-info p');
            if (contactInfo.length >= 3) {
                if (this.cmsData['footer-contact'].address) {
                    contactInfo[0].innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>${this.cmsData['footer-contact'].address}</span>`;
                }
                if (this.cmsData['footer-contact'].phone) {
                    contactInfo[1].innerHTML = `<i class="fas fa-phone"></i> <span>${this.cmsData['footer-contact'].phone}</span>`;
                }
                if (this.cmsData['footer-contact'].email) {
                    contactInfo[2].innerHTML = `<i class="fas fa-envelope"></i> <span>${this.cmsData['footer-contact'].email}</span>`;
                }
            }
            
            if (this.cmsData['footer-contact'].buttonText) {
                this.updateTextContent('.footer-actions .btn-primary', this.cmsData['footer-contact'].buttonText);
            }
        }

        // Footer bottom
        if (this.cmsData['footer-bottom']) {
            this.updateTextContent('.footer-bottom-content p', this.cmsData['footer-bottom'].copyright);
            
            if (this.cmsData['footer-bottom'].links) {
                const bottomLinks = document.querySelectorAll('.footer-bottom-links a');
                this.cmsData['footer-bottom'].links.forEach((link, index) => {
                    if (bottomLinks[index]) {
                        bottomLinks[index].textContent = link.text;
                        bottomLinks[index].href = link.url;
                    }
                });
            }
        }

        console.log('Cambios de Footer aplicados');
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

    // Método público para cargar y aplicar cambios
    async loadAndApplyChanges() {
        try {
            this.cmsData = await this.loadCMSData();
            console.log('Datos CMS cargados:', this.cmsData);
            this.applyCMSChanges();
            return this.cmsData;
        } catch (error) {
            console.error('Error al cargar y aplicar cambios CMS:', error);
            throw error;
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