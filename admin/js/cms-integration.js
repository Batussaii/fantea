/**
 * CMS Integration - FANTEA Admin Dashboard
 * Integración con el servidor Python para manejo de contenido JSON
 */

class CMSIntegration {
    constructor() {
        this.currentPage = 'inicio';
        this.currentData = null;
        this.originalData = null;
        this.serverUrl = 'http://localhost:5000'; // URL del servidor Python
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPage('inicio');
    }

    bindEvents() {
        // Navigation para contenido estático
        document.querySelectorAll('[data-section]').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.closest('[data-section]').dataset.section;
                if (this.isStaticContentSection(section)) {
                    this.switchPage(section);
                }
            });
        });

        // Botones de guardar
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="saveSection"]')) {
                e.preventDefault();
                const sectionId = e.target.getAttribute('onclick').match(/saveSection\('([^']+)'\)/)[1];
                this.saveSection(sectionId);
            }
        });

        // Botones de restaurar
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="resetSection"]')) {
                e.preventDefault();
                const sectionId = e.target.getAttribute('onclick').match(/resetSection\('([^']+)'\)/)[1];
                this.resetSection(sectionId);
            }
        });

        // Guardar todos los cambios
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="saveAllChanges"]')) {
                e.preventDefault();
                this.saveAllChanges();
            }
        });
    }

    isStaticContentSection(section) {
        const staticSections = [
            'inicio', 'quienes-somos', 'asociaciones', 'areas', 
            'manifiesto', 'prensa', 'afiliate', 'contacto', 'redes-sociales'
        ];
        return staticSections.includes(section);
    }

    async switchPage(page) {
        // Actualizar navegación
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${page}"]`).classList.add('active');

        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Mostrar la sección correspondiente
        const targetSection = document.getElementById(`${page}-content`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        this.currentPage = page;
        await this.loadPage(page);
    }

    async loadPage(page) {
        try {
            console.log(`Cargando contenido para página: ${page}`);
            
            const response = await fetch(`${this.serverUrl}/api/content/${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentData = data;
            this.originalData = JSON.parse(JSON.stringify(data)); // Deep copy
            
            console.log(`Contenido cargado para ${page}:`, data);
            
            // Actualizar la interfaz con los datos cargados
            this.updateInterface(data);
            
        } catch (error) {
            console.error(`Error cargando contenido de ${page}:`, error);
            
            // Si es un 404, crear estructura vacía
            if (error.message.includes('404')) {
                this.currentData = this.getDefaultStructure(page);
                this.originalData = JSON.parse(JSON.stringify(this.currentData));
                this.updateInterface(this.currentData);
            } else {
                this.showNotification(`Error cargando contenido: ${error.message}`, 'error');
            }
        }
    }

    getDefaultStructure(page) {
        const structures = {
            'inicio': {
                hero: {
                    title: 'Unidos por la diversidad, comprometidos con el autismo en Andalucía',
                    description: 'Somos FANTEA - Federación Andaluza de Autismo, una organización sin ánimo de lucro que agrupa asociaciones de toda Andalucía para defender derechos, promover la inclusión y ofrecer recursos a personas autistas y familias.',
                    image: 'images/hero-inclusive.jpg',
                    buttons: [
                        { text: 'Conócenos', url: 'nosotros.html', style: 'primary' },
                        { text: 'Afíliate', url: 'afiliate.html', style: 'primary' },
                        { text: 'Haz una Donación', url: 'afiliate.html#donaciones', style: 'primary' }
                    ]
                },
                stats: [
                    { number: '1 de 100', text: 'niños tienen autismo' },
                    { number: '500+', text: 'familias andaluzas apoyadas' },
                    { number: '15', text: 'años de experiencia' },
                    { number: '35+', text: 'asociaciones afiliadas' }
                ],
                pilares: {
                    title: 'Nuestros Pilares Fundamentales',
                    description: 'Trabajamos en múltiples frentes para construir una sociedad más inclusiva',
                    items: [
                        {
                            icon: 'fas fa-users',
                            title: 'Quiénes Somos',
                            description: 'Conoce FANTEA, la Federación Andaluza TEA que defiende los derechos de las personas autistas y sus familias en Andalucía.',
                            linkText: 'Conoce más',
                            linkUrl: 'quienes-somos.html'
                        },
                        {
                            icon: 'fas fa-handshake',
                            title: 'Asociaciones Federadas',
                            description: 'Descubre las asociaciones que forman parte de FANTEA y cómo trabajamos de forma coordinada.',
                            linkText: 'Ver asociaciones',
                            linkUrl: 'asociaciones.html'
                        },
                        {
                            icon: 'fas fa-graduation-cap',
                            title: 'Áreas de Trabajo',
                            description: 'Educación, salud, vida adulta, inclusión social y vivienda. Trabajamos en todos los ámbitos de la vida.',
                            linkText: 'Ver áreas',
                            linkUrl: 'areas.html'
                        },
                        {
                            icon: 'fas fa-bullhorn',
                            title: 'Nuestro Manifiesto',
                            description: 'Conoce nuestros compromisos y valores para defender los derechos del colectivo TEA en Andalucía.',
                            linkText: 'Leer manifiesto',
                            linkUrl: 'manifiesto.html'
                        }
                    ]
                },
                cta: {
                    title: 'Únete a Nuestra Comunidad',
                    description: 'Forma parte del cambio hacia una sociedad más inclusiva y accesible para las personas autistas y sus familias.',
                    buttons: [
                        { text: 'Afíliate Ahora', url: 'afiliate.html', style: 'white' },
                        { text: 'Contactar', url: 'contacto.html', style: 'outline-white' }
                    ]
                }
            },
            'quienes-somos': {
                hero: {
                    title: 'Quiénes Somos',
                    subtitle: 'Federación Andaluza de Autismo',
                    description: 'Somos una organización sin ánimo de lucro que agrupa asociaciones de toda Andalucía para defender los derechos de las personas autistas y sus familias.'
                },
                mision: {
                    title: 'Nuestra Misión',
                    description: 'Defender los derechos, promover la inclusión y ofrecer recursos a personas autistas y familias en Andalucía.'
                },
                vision: {
                    title: 'Nuestra Visión',
                    description: 'Una sociedad inclusiva donde las personas autistas tengan las mismas oportunidades y derechos que el resto de la ciudadanía.'
                },
                valores: [
                    { title: 'Inclusión', description: 'Trabajamos por una sociedad que incluya a todas las personas.' },
                    { title: 'Derechos', description: 'Defendemos los derechos de las personas autistas y sus familias.' },
                    { title: 'Compromiso', description: 'Estamos comprometidos con el bienestar de nuestro colectivo.' }
                ]
            }
        };

        return structures[page] || {};
    }

    updateInterface(data) {
        // Actualizar campos de formulario con los datos cargados
        this.updateFormFields(data);
    }

    updateFormFields(data) {
        // Actualizar campos específicos según la página
        if (this.currentPage === 'inicio') {
            if (data.hero) {
                this.setFieldValue('inicio-hero-title', data.hero.title);
                this.setFieldValue('inicio-hero-description', data.hero.description);
                this.setFieldValue('inicio-hero-image-url', data.hero.image);
                this.updateImagePreview('inicio-hero-image-preview', data.hero.image);
                
                // Convertir botones de objeto a array
                const buttonsArray = this.convertButtonsToArray(data.hero.buttons);
                this.updateDynamicList('inicio-hero-buttons', buttonsArray, 'button');
            }
            
            if (data.stats && data.stats.items) {
                this.updateDynamicList('inicio-stats-list', data.stats.items, 'stat');
            }
            
            if (data.featuredSections) {
                this.setFieldValue('inicio-pilares-title', data.featuredSections.title);
                this.setFieldValue('inicio-pilares-description', data.featuredSections.subtitle);
                this.updateDynamicList('inicio-pilares-list', data.featuredSections.sections, 'pilar');
            }
            
            if (data.cta) {
                this.setFieldValue('inicio-cta-title', data.cta.title);
                this.setFieldValue('inicio-cta-description', data.cta.description);
                this.updateDynamicList('inicio-cta-buttons', data.cta.buttons, 'button');
            }
        } else if (this.currentPage === 'quienes-somos') {
            if (data.hero) {
                this.setFieldValue('quienes-somos-banner-title', data.hero.title);
                this.setFieldValue('quienes-somos-banner-subtitle', data.hero.subtitle);
                this.setFieldValue('quienes-somos-banner-description', data.hero.description);
            }
            
            if (data.stats && data.stats.items) {
                this.updateDynamicList('quienes-somos-stats-list', data.stats.items, 'stat');
            }
            
            if (data.misionVision) {
                this.setFieldValue('quienes-somos-mision-vision-title', data.misionVision.title);
                this.setFieldValue('quienes-somos-mision-vision-subtitle', data.misionVision.subtitle);
                this.setFieldValue('quienes-somos-mision-title', data.misionVision.mision.title);
                this.setFieldValue('quienes-somos-mision-description', data.misionVision.mision.description);
                this.setFieldValue('quienes-somos-vision-title', data.misionVision.vision.title);
                this.setFieldValue('quienes-somos-vision-description', data.misionVision.vision.description);
                this.setFieldValue('quienes-somos-sede-title', data.misionVision.sede.title);
                this.setFieldValue('quienes-somos-sede-description', data.misionVision.sede.description);
                this.setFieldValue('quienes-somos-familias-title', data.misionVision.familias.title);
                this.setFieldValue('quienes-somos-familias-description', data.misionVision.familias.description);
            } else {
                // Fallback para estructura antigua
                if (data.mision) {
                    this.setFieldValue('quienes-somos-mision-title', data.mision.title);
                    this.setFieldValue('quienes-somos-mision-description', data.mision.description);
                }
                
                if (data.vision) {
                    this.setFieldValue('quienes-somos-vision-title', data.vision.title);
                    this.setFieldValue('quienes-somos-vision-description', data.vision.description);
                }
            }
            
            if (data.valores) {
                this.updateDynamicList('quienes-somos-principios-list', data.valores, 'principio');
            }
            
            if (data.historia) {
                this.updateDynamicList('quienes-somos-historia-list', data.historia, 'historia');
            }
        } else if (this.currentPage === 'asociaciones') {
            if (data.hero) {
                this.setFieldValue('asociaciones-banner-title', data.hero.title);
                this.setFieldValue('asociaciones-banner-subtitle', data.hero.subtitle);
                this.setFieldValue('asociaciones-banner-description', data.hero.description);
            }
            
            if (data.asociaciones) {
                this.updateDynamicList('asociaciones-lista-items', data.asociaciones, 'asociacion');
            }
        } else if (this.currentPage === 'areas') {
            if (data.hero) {
                this.setFieldValue('areas-banner-title', data.hero.title);
                this.setFieldValue('areas-banner-subtitle', data.hero.subtitle);
                this.setFieldValue('areas-banner-description', data.hero.description);
            }
            
            if (data.areas) {
                this.updateDynamicList('areas-lista-items', data.areas, 'area');
            }
        } else if (this.currentPage === 'manifiesto') {
            if (data.hero) {
                this.setFieldValue('manifiesto-banner-title', data.hero.title);
                this.setFieldValue('manifiesto-banner-subtitle', data.hero.subtitle);
                this.setFieldValue('manifiesto-banner-description', data.hero.description);
            }
            
            if (data.contenido) {
                this.setFieldValue('manifiesto-contenido-texto', data.contenido.texto);
            }
        } else if (this.currentPage === 'prensa') {
            if (data.hero) {
                this.setFieldValue('prensa-banner-title', data.hero.title);
                this.setFieldValue('prensa-banner-subtitle', data.hero.subtitle);
                this.setFieldValue('prensa-banner-description', data.hero.description);
            }
            
            if (data.noticias) {
                this.updateDynamicList('prensa-noticias-items', data.noticias, 'noticia');
            }
        } else if (this.currentPage === 'afiliate') {
            if (data.hero) {
                this.setFieldValue('afiliate-banner-title', data.hero.title);
                this.setFieldValue('afiliate-banner-subtitle', data.hero.subtitle);
                this.setFieldValue('afiliate-banner-description', data.hero.description);
            }
            
            if (data.formulario) {
                this.setFieldValue('afiliate-formulario-titulo', data.formulario.titulo);
                this.setFieldValue('afiliate-formulario-descripcion', data.formulario.descripcion);
            }
        } else if (this.currentPage === 'contacto') {
            if (data.hero) {
                this.setFieldValue('contacto-banner-title', data.hero.title);
                this.setFieldValue('contacto-banner-subtitle', data.hero.subtitle);
                this.setFieldValue('contacto-banner-description', data.hero.description);
            }
            
            if (data.info) {
                this.setFieldValue('contacto-info-direccion', data.info.direccion);
                this.setFieldValue('contacto-info-telefono', data.info.telefono);
                this.setFieldValue('contacto-info-email', data.info.email);
                this.setFieldValue('contacto-info-horario', data.info.horario);
            }
        } else if (this.currentPage === 'redes-sociales') {
            if (data.redesSociales) {
                this.updateDynamicList('redes-sociales-items', data.redesSociales, 'red-social');
            }
        }
    }

    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value || '';
        }
    }

    updateImagePreview(previewId, imageUrl) {
        const preview = document.getElementById(previewId);
        if (preview && imageUrl) {
            preview.src = imageUrl;
            preview.style.display = 'block';
        }
    }

    updateDynamicList(containerId, items, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Limpiar contenedor
        container.innerHTML = '';

        // Verificar que items sea un array
        if (!items || !Array.isArray(items)) {
            console.warn(`Items no es un array válido para ${containerId}:`, items);
            return;
        }

        // Agregar items
        items.forEach(item => {
            const itemElement = this.createDynamicItem(item, type);
            container.appendChild(itemElement);
        });
    }

    convertButtonsToArray(buttonsObj) {
        if (!buttonsObj) return [];
        
        const buttonsArray = [];
        
        // Convertir objeto de botones a array
        Object.keys(buttonsObj).forEach(key => {
            const button = buttonsObj[key];
            if (button && button.text && button.url) {
                buttonsArray.push({
                    text: button.text,
                    url: button.url,
                    style: key === 'primary' ? 'primary' : key === 'secondary' ? 'outline' : 'white'
                });
            }
        });
        
        return buttonsArray;
    }

    createDynamicItem(item, type) {
        const div = document.createElement('div');
        div.className = 'dynamic-item';

        switch (type) {
            case 'button':
                div.innerHTML = `
                    <input type="text" placeholder="Texto del botón" value="${item.text || ''}" class="form-control">
                    <input type="text" placeholder="URL" value="${item.url || ''}" class="form-control">
                    <select class="form-control">
                        <option value="outline" ${item.style === 'outline' ? 'selected' : ''}>Outline</option>
                        <option value="primary" ${item.style === 'primary' ? 'selected' : ''}>Primary</option>
                        <option value="white" ${item.style === 'white' ? 'selected' : ''}>White</option>
                        <option value="outline-white" ${item.style === 'outline-white' ? 'selected' : ''}>Outline White</option>
                    </select>
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'stat':
                div.innerHTML = `
                    <input type="text" placeholder="Número" value="${item.number || ''}" class="form-control">
                    <input type="text" placeholder="Texto" value="${item.text || ''}" class="form-control">
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'pilar':
                div.innerHTML = `
                    <input type="text" placeholder="Icono (fas fa-...)" value="${item.icon || ''}" class="form-control">
                    <input type="text" placeholder="Título" value="${item.title || ''}" class="form-control">
                    <textarea placeholder="Descripción" rows="2" class="form-control">${item.description || ''}</textarea>
                    <input type="text" placeholder="Texto del enlace" value="${item.link?.text || ''}" class="form-control">
                    <input type="text" placeholder="URL del enlace" value="${item.link?.url || ''}" class="form-control">
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'valor':
            case 'principio':
                div.innerHTML = `
                    <input type="text" placeholder="Título del principio" value="${item.title || ''}" class="form-control">
                    <textarea placeholder="Descripción del principio" rows="2" class="form-control">${item.description || ''}</textarea>
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'historia':
                div.innerHTML = `
                    <input type="text" placeholder="Año" value="${item.year || ''}" class="form-control">
                    <input type="text" placeholder="Título" value="${item.title || ''}" class="form-control">
                    <textarea placeholder="Descripción del evento" rows="2" class="form-control">${item.description || ''}</textarea>
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'asociacion':
                div.innerHTML = `
                    <input type="text" placeholder="Nombre de la asociación" value="${item.nombre || ''}" class="form-control">
                    <input type="text" placeholder="Provincia" value="${item.provincia || ''}" class="form-control">
                    <input type="text" placeholder="Dirección" value="${item.direccion || ''}" class="form-control">
                    <input type="text" placeholder="Teléfono" value="${item.telefono || ''}" class="form-control">
                    <input type="email" placeholder="Email" value="${item.email || ''}" class="form-control">
                    <input type="text" placeholder="URL de la web" value="${item.web || ''}" class="form-control">
                    <textarea placeholder="Descripción" rows="2" class="form-control">${item.descripcion || ''}</textarea>
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'area':
                div.innerHTML = `
                    <input type="text" placeholder="Icono (fas fa-...)" value="${item.icono || ''}" class="form-control">
                    <input type="text" placeholder="Título del área" value="${item.titulo || ''}" class="form-control">
                    <textarea placeholder="Descripción del área" rows="3" class="form-control">${item.descripcion || ''}</textarea>
                    <input type="text" placeholder="Texto del enlace" value="${item.enlaceTexto || ''}" class="form-control">
                    <input type="text" placeholder="URL del enlace" value="${item.enlaceUrl || ''}" class="form-control">
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'noticia':
                div.innerHTML = `
                    <input type="text" placeholder="Título de la noticia" value="${item.titulo || ''}" class="form-control">
                    <input type="text" placeholder="Autor" value="${item.autor || ''}" class="form-control">
                    <input type="date" placeholder="Fecha" value="${item.fecha || ''}" class="form-control">
                    <textarea placeholder="Resumen" rows="2" class="form-control">${item.resumen || ''}</textarea>
                    <textarea placeholder="Contenido completo" rows="4" class="form-control">${item.contenido || ''}</textarea>
                    <input type="text" placeholder="URL de la imagen" value="${item.imagen || ''}" class="form-control">
                    <input type="text" placeholder="Etiquetas (separadas por comas)" value="${item.etiquetas || ''}" class="form-control">
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
            case 'red-social':
                div.innerHTML = `
                    <input type="text" placeholder="Nombre de la red social" value="${item.nombre || ''}" class="form-control">
                    <input type="text" placeholder="Icono (fab fa-...)" value="${item.icono || ''}" class="form-control">
                    <input type="url" placeholder="URL del perfil" value="${item.url || ''}" class="form-control">
                    <input type="text" placeholder="Texto del enlace" value="${item.texto || ''}" class="form-control">
                    <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                break;
        }

        return div;
    }

    async saveSection(sectionId) {
        try {
            // Recopilar datos del formulario
            const sectionData = this.collectSectionData(sectionId);
            
            // Actualizar datos actuales
            if (!this.currentData) this.currentData = {};
            
            // Determinar la clave correcta según la página
            let key;
            if (sectionId.startsWith('inicio-')) {
                const sectionName = sectionId.replace('inicio-', '');
                // Mapear nombres de sección a claves correctas
                if (sectionName === 'pilares') {
                    key = 'featuredSections';
                } else {
                    key = sectionName;
                }
            } else if (sectionId.startsWith('quienes-somos-')) {
                const sectionName = sectionId.replace('quienes-somos-', '');
                // Mapear nombres de sección a claves correctas
                if (sectionName === 'banner') {
                    key = 'hero';
                } else if (sectionName === 'mision-vision') {
                                    // Para misión y visión, necesitamos manejar todos los campos
                const misionVisionData = {
                    title: document.getElementById('quienes-somos-mision-vision-title')?.value || '',
                    subtitle: document.getElementById('quienes-somos-mision-vision-subtitle')?.value || '',
                    mision: {
                        title: document.getElementById('quienes-somos-mision-title')?.value || '',
                        description: document.getElementById('quienes-somos-mision-description')?.value || ''
                    },
                    vision: {
                        title: document.getElementById('quienes-somos-vision-title')?.value || '',
                        description: document.getElementById('quienes-somos-vision-description')?.value || ''
                    },
                    sede: {
                        title: document.getElementById('quienes-somos-sede-title')?.value || '',
                        description: document.getElementById('quienes-somos-sede-description')?.value || ''
                    },
                    familias: {
                        title: document.getElementById('quienes-somos-familias-title')?.value || '',
                        description: document.getElementById('quienes-somos-familias-description')?.value || ''
                    }
                };
                    
                    // Actualizar datos actuales
                    if (!this.currentData) this.currentData = {};
                    this.currentData.misionVision = misionVisionData;
                    
                    // Guardar directamente sin usar key
                    const response = await fetch(`${this.serverUrl}/api/content/${this.currentPage}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.currentData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    console.log('Misión y Visión guardadas:', result);
                    this.showNotification('Misión y Visión guardadas correctamente', 'success');
                    return; // Salir de la función
                } else {
                    key = sectionName;
                }
            } else {
                key = sectionId;
            }
            
            this.currentData[key] = sectionData;

            // Guardar en servidor
            const response = await fetch(`${this.serverUrl}/api/content/${this.currentPage}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.currentData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Sección guardada:', result);
            
            this.showNotification('Sección guardada correctamente', 'success');
            
        } catch (error) {
            console.error('Error guardando sección:', error);
            this.showNotification(`Error guardando sección: ${error.message}`, 'error');
        }
    }

    collectSectionData(sectionId) {
        const data = {};

        switch (sectionId) {
            case 'inicio-hero':
                data.title = document.getElementById('inicio-hero-title')?.value || '';
                data.description = document.getElementById('inicio-hero-description')?.value || '';
                data.image = document.getElementById('inicio-hero-image-url')?.value || '';
                data.buttons = this.collectDynamicListData('inicio-hero-buttons', 'button');
                break;
            case 'inicio-stats':
                data.items = this.collectDynamicListData('inicio-stats-list', 'stat');
                break;
            case 'inicio-pilares':
                data.title = document.getElementById('inicio-pilares-title')?.value || '';
                data.subtitle = document.getElementById('inicio-pilares-description')?.value || '';
                data.sections = this.collectDynamicListData('inicio-pilares-list', 'pilar');
                break;
            case 'inicio-cta':
                data.title = document.getElementById('inicio-cta-title')?.value || '';
                data.description = document.getElementById('inicio-cta-description')?.value || '';
                data.buttons = this.collectDynamicListData('inicio-cta-buttons', 'button');
                break;
            case 'quienes-somos-banner':
                data.title = document.getElementById('quienes-somos-banner-title')?.value || '';
                data.subtitle = document.getElementById('quienes-somos-banner-subtitle')?.value || '';
                data.description = document.getElementById('quienes-somos-banner-description')?.value || '';
                break;
            case 'quienes-somos-stats':
                data.items = this.collectDynamicListData('quienes-somos-stats-list', 'stat');
                break;
            case 'quienes-somos-mision-vision':
                data.title = document.getElementById('quienes-somos-mision-vision-title')?.value || '';
                data.subtitle = document.getElementById('quienes-somos-mision-vision-subtitle')?.value || '';
                data.mision = {
                    title: document.getElementById('quienes-somos-mision-title')?.value || '',
                    description: document.getElementById('quienes-somos-mision-description')?.value || ''
                };
                data.vision = {
                    title: document.getElementById('quienes-somos-vision-title')?.value || '',
                    description: document.getElementById('quienes-somos-vision-description')?.value || ''
                };
                data.sede = {
                    title: document.getElementById('quienes-somos-sede-title')?.value || '',
                    description: document.getElementById('quienes-somos-sede-description')?.value || ''
                };
                data.familias = {
                    title: document.getElementById('quienes-somos-familias-title')?.value || '',
                    description: document.getElementById('quienes-somos-familias-description')?.value || ''
                };
                break;
            case 'quienes-somos-principios':
                data.valores = this.collectDynamicListData('quienes-somos-principios-list', 'principio');
                break;
            case 'quienes-somos-historia':
                data.historia = this.collectDynamicListData('quienes-somos-historia-list', 'historia');
                break;
            case 'asociaciones-banner':
                data.title = document.getElementById('asociaciones-banner-title')?.value || '';
                data.subtitle = document.getElementById('asociaciones-banner-subtitle')?.value || '';
                data.description = document.getElementById('asociaciones-banner-description')?.value || '';
                break;
            case 'asociaciones-lista':
                data.asociaciones = this.collectDynamicListData('asociaciones-lista-items', 'asociacion');
                break;
            case 'areas-banner':
                data.title = document.getElementById('areas-banner-title')?.value || '';
                data.subtitle = document.getElementById('areas-banner-subtitle')?.value || '';
                data.description = document.getElementById('areas-banner-description')?.value || '';
                break;
            case 'areas-lista':
                data.areas = this.collectDynamicListData('areas-lista-items', 'area');
                break;
            case 'manifiesto-banner':
                data.title = document.getElementById('manifiesto-banner-title')?.value || '';
                data.subtitle = document.getElementById('manifiesto-banner-subtitle')?.value || '';
                data.description = document.getElementById('manifiesto-banner-description')?.value || '';
                break;
            case 'manifiesto-contenido':
                data.texto = document.getElementById('manifiesto-contenido-texto')?.value || '';
                break;
            case 'prensa-banner':
                data.title = document.getElementById('prensa-banner-title')?.value || '';
                data.subtitle = document.getElementById('prensa-banner-subtitle')?.value || '';
                data.description = document.getElementById('prensa-banner-description')?.value || '';
                break;
            case 'prensa-noticias':
                data.noticias = this.collectDynamicListData('prensa-noticias-items', 'noticia');
                break;
            case 'afiliate-banner':
                data.title = document.getElementById('afiliate-banner-title')?.value || '';
                data.subtitle = document.getElementById('afiliate-banner-subtitle')?.value || '';
                data.description = document.getElementById('afiliate-banner-description')?.value || '';
                break;
            case 'afiliate-formulario':
                data.titulo = document.getElementById('afiliate-formulario-titulo')?.value || '';
                data.descripcion = document.getElementById('afiliate-formulario-descripcion')?.value || '';
                break;
            case 'contacto-banner':
                data.title = document.getElementById('contacto-banner-title')?.value || '';
                data.subtitle = document.getElementById('contacto-banner-subtitle')?.value || '';
                data.description = document.getElementById('contacto-banner-description')?.value || '';
                break;
            case 'contacto-info':
                data.direccion = document.getElementById('contacto-info-direccion')?.value || '';
                data.telefono = document.getElementById('contacto-info-telefono')?.value || '';
                data.email = document.getElementById('contacto-info-email')?.value || '';
                data.horario = document.getElementById('contacto-info-horario')?.value || '';
                break;
            case 'redes-sociales-lista':
                data.redesSociales = this.collectDynamicListData('redes-sociales-items', 'red-social');
                break;
        }

        return data;
    }

    collectDynamicListData(containerId, type) {
        const container = document.getElementById(containerId);
        if (!container) return [];

        const items = [];
        const itemElements = container.querySelectorAll('.dynamic-item');

        itemElements.forEach(item => {
            const inputs = item.querySelectorAll('input, textarea, select');
            const itemData = {};

            switch (type) {
                case 'button':
                    itemData.text = inputs[0]?.value || '';
                    itemData.url = inputs[1]?.value || '';
                    itemData.style = inputs[2]?.value || 'primary';
                    break;
                case 'stat':
                    itemData.number = inputs[0]?.value || '';
                    itemData.text = inputs[1]?.value || '';
                    break;
                case 'pilar':
                    itemData.icon = inputs[0]?.value || '';
                    itemData.title = inputs[1]?.value || '';
                    itemData.description = inputs[2]?.value || '';
                    itemData.link = {
                        text: inputs[3]?.value || '',
                        url: inputs[4]?.value || ''
                    };
                    break;
                case 'valor':
                case 'principio':
                    itemData.title = inputs[0]?.value || '';
                    itemData.description = inputs[1]?.value || '';
                    break;
                            case 'historia':
                itemData.year = inputs[0]?.value || '';
                itemData.title = inputs[1]?.value || '';
                itemData.description = inputs[2]?.value || '';
                break;
            case 'asociacion':
                itemData.nombre = inputs[0]?.value || '';
                itemData.provincia = inputs[1]?.value || '';
                itemData.direccion = inputs[2]?.value || '';
                itemData.telefono = inputs[3]?.value || '';
                itemData.email = inputs[4]?.value || '';
                itemData.web = inputs[5]?.value || '';
                itemData.descripcion = inputs[6]?.value || '';
                break;
            case 'area':
                itemData.icono = inputs[0]?.value || '';
                itemData.titulo = inputs[1]?.value || '';
                itemData.descripcion = inputs[2]?.value || '';
                itemData.enlaceTexto = inputs[3]?.value || '';
                itemData.enlaceUrl = inputs[4]?.value || '';
                break;
            case 'noticia':
                itemData.titulo = inputs[0]?.value || '';
                itemData.autor = inputs[1]?.value || '';
                itemData.fecha = inputs[2]?.value || '';
                itemData.resumen = inputs[3]?.value || '';
                itemData.contenido = inputs[4]?.value || '';
                itemData.imagen = inputs[5]?.value || '';
                itemData.etiquetas = inputs[6]?.value || '';
                break;
            case 'red-social':
                itemData.nombre = inputs[0]?.value || '';
                itemData.icono = inputs[1]?.value || '';
                itemData.url = inputs[2]?.value || '';
                itemData.texto = inputs[3]?.value || '';
                break;
            }

            items.push(itemData);
        });

        return items;
    }

    resetSection(sectionId) {
        // Restaurar datos originales
        if (this.originalData) {
            this.updateInterface(this.originalData);
            this.showNotification('Sección restaurada', 'info');
        }
    }

    async saveAllChanges() {
        try {
            // Recopilar todos los datos del formulario
            const allData = this.collectAllData();
            
            // Guardar en servidor
            const response = await fetch(`${this.serverUrl}/api/content/${this.currentPage}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(allData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Todos los cambios guardados:', result);
            
            this.showNotification('Todos los cambios guardados correctamente', 'success');
            
        } catch (error) {
            console.error('Error guardando todos los cambios:', error);
            this.showNotification(`Error guardando cambios: ${error.message}`, 'error');
        }
    }

    collectAllData() {
        const allData = {};

        // Recopilar datos de todas las secciones
        if (this.currentPage === 'inicio') {
            allData.hero = this.collectSectionData('inicio-hero');
            allData.stats = this.collectSectionData('inicio-stats');
            allData.featuredSections = this.collectSectionData('inicio-pilares');
            allData.cta = this.collectSectionData('inicio-cta');
        } else if (this.currentPage === 'quienes-somos') {
            allData.hero = this.collectSectionData('quienes-somos-banner');
            allData.stats = this.collectSectionData('quienes-somos-stats');
            allData.misionVision = this.collectSectionData('quienes-somos-mision-vision');
            allData.valores = this.collectSectionData('quienes-somos-principios');
            allData.historia = this.collectSectionData('quienes-somos-historia');
        } else if (this.currentPage === 'asociaciones') {
            allData.hero = this.collectSectionData('asociaciones-banner');
            allData.asociaciones = this.collectSectionData('asociaciones-lista');
        } else if (this.currentPage === 'areas') {
            allData.hero = this.collectSectionData('areas-banner');
            allData.areas = this.collectSectionData('areas-lista');
        } else if (this.currentPage === 'manifiesto') {
            allData.hero = this.collectSectionData('manifiesto-banner');
            allData.contenido = this.collectSectionData('manifiesto-contenido');
        } else if (this.currentPage === 'prensa') {
            allData.hero = this.collectSectionData('prensa-banner');
            allData.noticias = this.collectSectionData('prensa-noticias');
        } else if (this.currentPage === 'afiliate') {
            allData.hero = this.collectSectionData('afiliate-banner');
            allData.formulario = this.collectSectionData('afiliate-formulario');
        } else if (this.currentPage === 'contacto') {
            allData.hero = this.collectSectionData('contacto-banner');
            allData.info = this.collectSectionData('contacto-info');
        } else if (this.currentPage === 'redes-sociales') {
            allData.redesSociales = this.collectSectionData('redes-sociales-lista');
        }

        return allData;
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Agregar estilos si no existen
        if (!document.getElementById('cms-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'cms-notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 5px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .notification-success { background-color: #28a745; }
                .notification-error { background-color: #dc3545; }
                .notification-info { background-color: #17a2b8; }
                .notification button {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Funciones globales necesarias para el dashboard
function addDynamicItem(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'dynamic-item';

    switch (type) {
        case 'button':
            div.innerHTML = `
                <input type="text" placeholder="Texto del botón" class="form-control">
                <input type="text" placeholder="URL" class="form-control">
                <select class="form-control">
                    <option value="outline">Outline</option>
                    <option value="primary" selected>Primary</option>
                    <option value="white">White</option>
                    <option value="outline-white">Outline White</option>
                </select>
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'stat':
            div.innerHTML = `
                <input type="text" placeholder="Número" class="form-control">
                <input type="text" placeholder="Texto" class="form-control">
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'pilar':
            div.innerHTML = `
                <input type="text" placeholder="Icono (fas fa-...)" class="form-control">
                <input type="text" placeholder="Título" class="form-control">
                <textarea placeholder="Descripción" rows="2" class="form-control"></textarea>
                <input type="text" placeholder="Texto del enlace" class="form-control">
                <input type="text" placeholder="URL del enlace" class="form-control">
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'valor':
        case 'principio':
            div.innerHTML = `
                <input type="text" placeholder="Título del principio" class="form-control">
                <textarea placeholder="Descripción del principio" rows="2" class="form-control"></textarea>
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'historia':
            div.innerHTML = `
                <input type="text" placeholder="Año" class="form-control">
                <input type="text" placeholder="Título" class="form-control">
                <textarea placeholder="Descripción del evento" rows="2" class="form-control"></textarea>
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'asociacion':
            div.innerHTML = `
                <input type="text" placeholder="Nombre de la asociación" class="form-control">
                <input type="text" placeholder="Provincia" class="form-control">
                <input type="text" placeholder="Dirección" class="form-control">
                <input type="text" placeholder="Teléfono" class="form-control">
                <input type="email" placeholder="Email" class="form-control">
                <input type="text" placeholder="URL de la web" class="form-control">
                <textarea placeholder="Descripción" rows="2" class="form-control"></textarea>
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'area':
            div.innerHTML = `
                <input type="text" placeholder="Icono (fas fa-...)" class="form-control">
                <input type="text" placeholder="Título del área" class="form-control">
                <textarea placeholder="Descripción del área" rows="3" class="form-control"></textarea>
                <input type="text" placeholder="Texto del enlace" class="form-control">
                <input type="text" placeholder="URL del enlace" class="form-control">
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'noticia':
            div.innerHTML = `
                <input type="text" placeholder="Título de la noticia" class="form-control">
                <input type="text" placeholder="Autor" class="form-control">
                <input type="date" placeholder="Fecha" class="form-control">
                <textarea placeholder="Resumen" rows="2" class="form-control"></textarea>
                <textarea placeholder="Contenido completo" rows="4" class="form-control"></textarea>
                <input type="text" placeholder="URL de la imagen" class="form-control">
                <input type="text" placeholder="Etiquetas (separadas por comas)" class="form-control">
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
        case 'red-social':
            div.innerHTML = `
                <input type="text" placeholder="Nombre de la red social" class="form-control">
                <input type="text" placeholder="Icono (fab fa-...)" class="form-control">
                <input type="url" placeholder="URL del perfil" class="form-control">
                <input type="text" placeholder="Texto del enlace" class="form-control">
                <button class="btn btn-danger btn-sm" onclick="removeDynamicItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            break;
    }

    container.appendChild(div);
}

function removeDynamicItem(button) {
    button.closest('.dynamic-item').remove();
}

function toggleCMSSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
        const header = section.previousElementSibling;
        if (header) {
            const button = header.querySelector('button');
            if (button) {
                const icon = button.querySelector('i');
                if (icon) {
                    if (section.classList.contains('collapsed')) {
                        icon.className = 'fas fa-chevron-down';
                        button.innerHTML = '<i class="fas fa-chevron-down"></i> Expandir';
                    } else {
                        icon.className = 'fas fa-chevron-up';
                        button.innerHTML = '<i class="fas fa-chevron-up"></i> Contraer';
                    }
                }
            }
        }
    }
}

// Inicializar integración cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.cmsIntegration = new CMSIntegration();
});
