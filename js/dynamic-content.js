/**
 * Dynamic Content Loader - FANTEA
 * Carga contenido dinámicamente desde el servidor Python
 */

class DynamicContentLoader {
    constructor() {
        this.serverUrl = 'http://localhost:5000';
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === '' || filename === 'index.html') {
            return 'inicio';
        }
        
        // Mapear nombres de archivo a páginas
        const pageMap = {
            'quienes-somos.html': 'quienes-somos',
            'asociaciones.html': 'asociaciones',
            'areas.html': 'areas',
            'manifiesto.html': 'manifiesto',
            'prensa.html': 'prensa',
            'afiliate.html': 'afiliate',
            'contacto.html': 'contacto'
        };
        
        return pageMap[filename] || 'inicio';
    }

    async init() {
        try {
            console.log(`Cargando contenido dinámico para página: ${this.currentPage}`);
            const data = await this.loadContent();
            this.updatePageContent(data);
        } catch (error) {
            console.error('Error cargando contenido dinámico:', error);
            // Si falla, mantener el contenido estático
        }
    }

    async loadContent() {
        const response = await fetch(`${this.serverUrl}/api/content/${this.currentPage}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    updatePageContent(data) {
        if (this.currentPage === 'inicio') {
            this.updateInicioContent(data);
        } else if (this.currentPage === 'quienes-somos') {
            this.updateQuienesSomosContent(data);
        }
        // Agregar más páginas según sea necesario
    }

    updateInicioContent(data) {
        // Actualizar Hero Section
        if (data.hero) {
            this.updateElement('.hero-title', data.hero.title);
            this.updateElement('.hero-description', data.hero.description);
            
            // Actualizar imagen del hero si existe
            if (data.hero.image) {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    heroSection.style.backgroundImage = `url(${data.hero.image})`;
                }
            }
            
            // Actualizar botones del hero
            this.updateHeroButtons(data.hero.buttons);
        }

        // Actualizar Estadísticas
        if (data.stats && data.stats.items) {
            this.updateStats(data.stats.items);
        }

        // Actualizar Pilares Fundamentales
        if (data.featuredSections) {
            this.updateElement('.featured-sections h2', data.featuredSections.title);
            this.updateElement('.featured-sections .subtitle', data.featuredSections.subtitle);
            this.updateFeaturedSections(data.featuredSections.sections);
        }

        // Actualizar CTA
        if (data.cta) {
            this.updateElement('.cta h2', data.cta.title);
            this.updateElement('.cta p', data.cta.description);
            this.updateCTAButtons(data.cta.buttons);
        }

        // Actualizar metadatos de la página
        if (data.page) {
            this.updatePageMeta(data.page);
        }
    }

    updateQuienesSomosContent(data) {
        // Actualizar Banner Section
        if (data.hero) {
            this.updateElement('.hero-title', data.hero.title);
            if (data.hero.subtitle) {
                this.updateElement('.hero-subtitle', data.hero.subtitle);
            }
            this.updateElement('.hero-description', data.hero.description);
        }

        // Actualizar Estadísticas
        if (data.stats && data.stats.items) {
            this.updateStats(data.stats.items);
        }

        // Actualizar Misión y Visión
        if (data.misionVision) {
            this.updateElement('.mision-vision h2', data.misionVision.title);
            this.updateElement('.mision-vision .subtitle', data.misionVision.subtitle);
            this.updateElement('.mision h2', data.misionVision.mision.title);
            this.updateElement('.mision p', data.misionVision.mision.description);
            this.updateElement('.vision h2', data.misionVision.vision.title);
            this.updateElement('.vision p', data.misionVision.vision.description);
            this.updateElement('.sede h2', data.misionVision.sede.title);
            this.updateElement('.sede p', data.misionVision.sede.description);
            this.updateElement('.familias h2', data.misionVision.familias.title);
            this.updateElement('.familias p', data.misionVision.familias.description);
        } else {
            // Fallback para estructura antigua
            if (data.mision) {
                this.updateElement('.mision h2', data.mision.title);
                this.updateElement('.mision p', data.mision.description);
            }

            if (data.vision) {
                this.updateElement('.vision h2', data.vision.title);
                this.updateElement('.vision p', data.vision.description);
            }
        }

        // Actualizar Valores/Principios
        if (data.valores) {
            this.updateValores(data.valores);
        }

        // Actualizar Historia
        if (data.historia) {
            this.updateHistoria(data.historia);
        }
    }

    updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element && content) {
            element.textContent = content;
        }
    }

    updateHeroButtons(buttons) {
        const heroActions = document.querySelector('.hero-actions');
        if (!heroActions || !buttons) return;

        // Limpiar botones existentes
        heroActions.innerHTML = '';

        // Agregar nuevos botones
        buttons.forEach(button => {
            const btn = document.createElement('a');
            btn.href = button.url;
            btn.textContent = button.text;
            
            // Aplicar estilos según el tipo de botón
            if (button.style === 'primary') {
                btn.className = 'btn btn-primary btn-large';
            } else if (button.style === 'outline') {
                btn.className = 'btn btn-outline btn-large';
            } else if (button.style === 'white') {
                btn.className = 'btn btn-white btn-large';
            } else {
                btn.className = 'btn btn-outline btn-large';
            }
            
            heroActions.appendChild(btn);
        });
    }

    updateStats(stats) {
        const statsContainer = document.querySelector('.stats-grid');
        if (!statsContainer || !stats) return;

        // Limpiar estadísticas existentes
        statsContainer.innerHTML = '';

        // Agregar nuevas estadísticas
        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'stat-item';
            statElement.innerHTML = `
                <div class="stat-number">${stat.number}</div>
                <div class="stat-text">${stat.text}</div>
            `;
            statsContainer.appendChild(statElement);
        });
    }

    updateFeaturedSections(sections) {
        const sectionsContainer = document.querySelector('.featured-sections-grid');
        if (!sectionsContainer || !sections) return;

        // Limpiar secciones existentes
        sectionsContainer.innerHTML = '';

        // Agregar nuevas secciones
        sections.forEach(section => {
            const sectionElement = document.createElement('div');
            sectionElement.className = 'featured-section';
            sectionElement.innerHTML = `
                <div class="section-icon">
                    <i class="${section.icon}"></i>
                </div>
                <h3>${section.title}</h3>
                <p>${section.description}</p>
                <a href="${section.link.url}" class="btn btn-outline">${section.link.text}</a>
            `;
            sectionsContainer.appendChild(sectionElement);
        });
    }

    updateCTAButtons(buttons) {
        const ctaActions = document.querySelector('.cta .cta-actions');
        if (!ctaActions || !buttons) return;

        // Limpiar botones existentes
        ctaActions.innerHTML = '';

        // Agregar nuevos botones
        buttons.forEach(button => {
            const btn = document.createElement('a');
            btn.href = button.url;
            btn.textContent = button.text;
            
            // Aplicar estilos según el tipo de botón
            if (button.style === 'white') {
                btn.className = 'btn btn-white btn-large';
            } else if (button.style === 'outline-white') {
                btn.className = 'btn btn-outline-white btn-large';
            } else {
                btn.className = 'btn btn-white btn-large';
            }
            
            ctaActions.appendChild(btn);
        });
    }

    updateValores(valores) {
        const valoresContainer = document.querySelector('.valores-grid');
        if (!valoresContainer || !valores) return;

        // Limpiar valores existentes
        valoresContainer.innerHTML = '';

        // Agregar nuevos valores
        valores.forEach(valor => {
            const valorElement = document.createElement('div');
            valorElement.className = 'valor-item';
            valorElement.innerHTML = `
                <h3>${valor.title}</h3>
                <p>${valor.description}</p>
            `;
            valoresContainer.appendChild(valorElement);
        });
    }

    updateHistoria(historia) {
        const historiaContainer = document.querySelector('.historia-grid');
        if (!historiaContainer || !historia) return;

        // Limpiar historia existente
        historiaContainer.innerHTML = '';

        // Agregar nueva historia
        historia.forEach(evento => {
            const eventoElement = document.createElement('div');
            eventoElement.className = 'historia-item';
            eventoElement.innerHTML = `
                <div class="historia-year">${evento.year}</div>
                <h3>${evento.title}</h3>
                <p>${evento.description}</p>
            `;
            historiaContainer.appendChild(eventoElement);
        });
    }

    updatePageMeta(pageData) {
        if (pageData.title) {
            document.title = pageData.title;
        }
        
        if (pageData.description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.content = pageData.description;
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.dynamicContent = new DynamicContentLoader();
});
