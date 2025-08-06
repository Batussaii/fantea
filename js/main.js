/**
 * Federación Nacional de Autismo - JavaScript
 * Funcionalidades interactivas y de accesibilidad
 */

// Variables globales
let currentFontSize = 16;
const minFontSize = 14;
const maxFontSize = 24;

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAccessibility();
    initializeAnimations();
    initializeScrollEffects();
});

/**
 * MENÚ SIMPLE - NUEVO ENFOQUE
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        console.log('✅ Menú simple: Elementos encontrados');
        
        // Función para abrir menú
        function openMenu() {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('📱 Menú simple abierto');
        }
        
        // Función para cerrar menú
        function closeMenu() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            console.log('📱 Menú simple cerrado');
        }
        
        // Event listener para el botón hamburguesa
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            console.log('🔘 Hamburger clickeado, menú estaba:', isActive ? 'abierto' : 'cerrado');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (navMenu.classList.contains('active') && 
                !hamburger.contains(event.target) && 
                !navMenu.contains(event.target)) {
                closeMenu();
            }
        });
        
        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Cerrar menú al redimensionar la ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
    } else {
        console.error('❌ Menú simple: Elementos no encontrados', { hamburger, navMenu });
    }
}

/**
 * Panel de accesibilidad
 */
function initializeAccessibility() {
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityOptions = document.getElementById('accessibility-options');
    
    if (accessibilityBtn && accessibilityOptions) {
        accessibilityBtn.addEventListener('click', function(e) {
            e.preventDefault();
            accessibilityOptions.classList.toggle('hidden');
        });
        
        // Cerrar panel al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!accessibilityBtn.contains(event.target) && !accessibilityOptions.contains(event.target)) {
                accessibilityOptions.classList.add('hidden');
            }
        });
    }
    
    // Cargar preferencias guardadas
    loadAccessibilityPreferences();
}

/**
 * Aumentar tamaño de fuente
 */
function increaseFontSize() {
    if (currentFontSize < maxFontSize) {
        currentFontSize += 2;
        document.documentElement.style.fontSize = currentFontSize + 'px';
        
        // Aplicar clase de texto grande
        if (currentFontSize >= 20) {
            document.body.classList.add('large-text');
        }
        if (currentFontSize >= 24) {
            document.body.classList.add('extra-large-text');
        }
        
        // Guardar preferencia
        localStorage.setItem('fontSize', currentFontSize);
    }
    
    // Feedback para usuario
    showAccessibilityFeedback(`Tamaño de fuente aumentado: ${currentFontSize}px`);
}

/**
 * Reducir tamaño de fuente
 */
function decreaseFontSize() {
    if (currentFontSize > minFontSize) {
        currentFontSize -= 2;
        document.documentElement.style.fontSize = currentFontSize + 'px';
        
        // Remover clases de texto grande
        if (currentFontSize < 20) {
            document.body.classList.remove('large-text');
        }
        if (currentFontSize < 24) {
            document.body.classList.remove('extra-large-text');
        }
        
        // Guardar preferencia
        localStorage.setItem('fontSize', currentFontSize);
    }
    
    // Feedback para usuario
    showAccessibilityFeedback(`Tamaño de fuente reducido: ${currentFontSize}px`);
}

/**
 * Toggle alto contraste
 */
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    
    // Guardar preferencia
    localStorage.setItem('highContrast', isActive);
    
    // Feedback para usuario
    showAccessibilityFeedback(isActive ? 'Alto contraste activado' : 'Alto contraste desactivado');
}

/**
 * Toggle fuente para dislexia
 */
function toggleDyslexiaFont() {
    document.body.classList.toggle('dyslexia-font');
    const isActive = document.body.classList.contains('dyslexia-font');
    
    // Guardar preferencia
    localStorage.setItem('dyslexiaFont', isActive);
    
    // Feedback para usuario
    showAccessibilityFeedback(isActive ? 'Fuente para dislexia activada' : 'Fuente estándar activada');
}

/**
 * Cargar preferencias de accesibilidad guardadas
 */
function loadAccessibilityPreferences() {
    // Tamaño de fuente
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        document.documentElement.style.fontSize = currentFontSize + 'px';
        
        if (currentFontSize >= 20) {
            document.body.classList.add('large-text');
        }
        if (currentFontSize >= 24) {
            document.body.classList.add('extra-large-text');
        }
    }
    
    // Alto contraste
    const savedHighContrast = localStorage.getItem('highContrast');
    if (savedHighContrast === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Fuente para dislexia
    const savedDyslexiaFont = localStorage.getItem('dyslexiaFont');
    if (savedDyslexiaFont === 'true') {
        document.body.classList.add('dyslexia-font');
    }
}

/**
 * Mostrar feedback de accesibilidad
 */
function showAccessibilityFeedback(message) {
    // Remover feedback anterior si existe
    const existingFeedback = document.querySelector('.accessibility-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Crear nuevo feedback
    const feedback = document.createElement('div');
    feedback.className = 'accessibility-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10001;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Mostrar con animación
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    // Ocultar después de 2 segundos
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

/**
 * Inicializar animaciones
 */
function initializeAnimations() {
    // Animar elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar tarjetas y elementos animables
    const animatedElements = document.querySelectorAll('.feature-card, .news-card, .stat-item');
    animatedElements.forEach((el, index) => {
        // Configurar estado inicial
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        observer.observe(el);
    });
}

/**
 * Efectos de scroll
 */
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header transparente en scroll
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scroll para enlaces internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Validación de formularios (para páginas que los tengan)
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // Remover errores anteriores
        input.classList.remove('error');
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        
        // Validar campo
        if (!input.value.trim()) {
            showFieldError(input, 'Este campo es obligatorio');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showFieldError(input, 'Por favor ingresa un email válido');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            showFieldError(input, 'Por favor ingresa un teléfono válido');
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Mostrar error en campo del formulario
 */
function showFieldError(input, message) {
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 14px;
        margin-top: 4px;
        display: block;
    `;
    
    input.parentNode.appendChild(errorDiv);
}

/**
 * Validar email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validar teléfono
 */
function isValidPhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return re.test(phone);
}

/**
 * Manejo de formularios de contacto/afiliación
 */
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                // Aquí se enviaría el formulario
                showSuccessMessage('¡Formulario enviado correctamente! Te contactaremos pronto.');
                form.reset();
            }
        });
    });
}

/**
 * Mostrar mensaje de éxito
 */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10001;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 300);
    }, 5000);
}

/**
 * Navegación activa basada en scroll
 */
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPosition = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }
}

/**
 * Manejo de teclas de accesibilidad
 */
document.addEventListener('keydown', function(e) {
    // ESC para cerrar menús
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const accessibilityOptions = document.getElementById('accessibility-options');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.querySelector('.nav-toggle').classList.remove('active');
        }
        
        if (accessibilityOptions && !accessibilityOptions.classList.contains('hidden')) {
            accessibilityOptions.classList.add('hidden');
        }
    }
    
    // Alt + A para abrir panel de accesibilidad
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        const accessibilityBtn = document.getElementById('accessibility-btn');
        if (accessibilityBtn) {
            accessibilityBtn.click();
        }
    }
});

// Inicializar navegación activa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeActiveNavigation();
    initializeForms();
});

// Exponer funciones globalmente para uso en HTML
window.increaseFontSize = increaseFontSize;
window.decreaseFontSize = decreaseFontSize;
window.toggleHighContrast = toggleHighContrast;
window.toggleDyslexiaFont = toggleDyslexiaFont;

/**
 * MAPA INTERACTIVO DE ANDALUCÍA - FANTEA
 * Funcionalidad para mostrar asociaciones miembros por provincias
 */

// Datos de asociaciones por provincia
const provinceData = {
    huelva: {
        name: 'Huelva',
        associations: [
            { name: 'ASPERGER HUELVA', location: 'Huelva capital', type: 'Síndrome de Asperger' },
            { name: 'AUTISMO AISLANA', location: 'Isla Cristina', type: 'Trastorno del Espectro Autista' },
            { name: 'ASPANPAL', location: 'Palos de la Frontera', type: 'Parálisis Cerebral y Autismo' }
        ],
        email: 'huelva@fantea.org',
        phone: '+34 959 123 456'
    },
    sevilla: {
        name: 'Sevilla',
        associations: [
            { name: 'AUTISMO SEVILLA', location: 'Sevilla capital', type: 'Trastorno del Espectro Autista' },
            { name: 'ASPERGER ANDALUCÍA', location: 'Sevilla capital', type: 'Síndrome de Asperger' },
            { name: 'AMAYSE', location: 'Los Palacios y Villafranca', type: 'Autismo y Discapacidad' },
            { name: 'ASPANRI', location: 'Dos Hermanas', type: 'Atención Integral Autismo' },
            { name: 'APRONA', location: 'Alcalá de Guadaíra', type: 'Necesidades Especiales' },
            { name: 'ASPALI', location: 'Lebrija', type: 'Autismo y Asperger' },
            { name: 'ASPANDEM', location: 'Morón de la Frontera', type: 'Demarcación Autismo' },
            { name: 'ASTEA', location: 'Tomares', type: 'Trastornos del Espectro Autista' }
        ],
        email: 'sevilla@fantea.org',
        phone: '+34 954 123 456'
    },
    cadiz: {
        name: 'Cádiz',
        associations: [
            { name: 'ASPAMAG', location: 'San Fernando', type: 'Autismo y Asperger' },
            { name: 'AUTISMO CÁDIZ', location: 'Cádiz capital', type: 'Espectro Autista' },
            { name: 'APROMPSI', location: 'Jerez de la Frontera', type: 'Promoción Psicológica' },
            { name: 'ASPERGER BAHÍA', location: 'Puerto de Santa María', type: 'Síndrome de Asperger' },
            { name: 'AUTISMO CAMPO', location: 'Los Barrios', type: 'Autismo Campo de Gibraltar' }
        ],
        email: 'cadiz@fantea.org',
        phone: '+34 956 123 456'
    },
    cordoba: {
        name: 'Córdoba',
        associations: [
            { name: 'AUTISMO CÓRDOBA', location: 'Córdoba capital', type: 'Federación Provincial' },
            { name: 'ASPERGER CÓRDOBA', location: 'Córdoba capital', type: 'Síndrome de Asperger' },
            { name: 'ASPANIP', location: 'Pozoblanco', type: 'Autismo Los Pedroches' },
            { name: 'APROACU', location: 'Lucena', type: 'Atención Temprana Autismo' }
        ],
        email: 'cordoba@fantea.org',
        phone: '+34 957 123 456'
    },
    malaga: {
        name: 'Málaga',
        associations: [
            { name: 'AUTISM MÁLAGA', location: 'Málaga capital', type: 'Federación Provincial' },
            { name: 'ASPANAES', location: 'Estepona', type: 'Autismo Costa del Sol' },
            { name: 'ASPERGER MÁLAGA', location: 'Málaga capital', type: 'Síndrome de Asperger' },
            { name: 'ASPANDEM ANTEQUERA', location: 'Antequera', type: 'Demarcación Antequera' },
            { name: 'APROA RINCÓN', location: 'Rincón de la Victoria', type: 'Autismo Axarquía' },
            { name: 'ASPANPAL MÁLAGA', location: 'Torremolinos', type: 'Parálisis Cerebral y Autismo' }
        ],
        email: 'malaga@fantea.org',
        phone: '+34 952 123 456'
    },
    jaen: {
        name: 'Jaén',
        associations: [
            { name: 'APROMPSI JAÉN', location: 'Jaén capital', type: 'Promoción Psicológica' },
            { name: 'ASPANJAN', location: 'Linares', type: 'Autismo Santo Reino' }
        ],
        email: 'jaen@fantea.org',
        phone: '+34 953 123 456'
    },
    granada: {
        name: 'Granada',
        associations: [
            { name: 'ASPROGRADES', location: 'Granada capital', type: 'Síndrome de Asperger' },
            { name: 'AUTISMO GRANADA', location: 'Granada capital', type: 'Espectro Autista' },
            { name: 'ASPANPAL GRANADA', location: 'Motril', type: 'Costa Tropical' },
            { name: 'APROMPSI GUADIX', location: 'Guadix', type: 'Promoción Psicológica' }
        ],
        email: 'granada@fantea.org',
        phone: '+34 958 123 456'
    },
    almeria: {
        name: 'Almería',
        associations: [
            { name: 'ASPERGER ALMERÍA', location: 'Almería capital', type: 'Síndrome de Asperger' },
            { name: 'AUTISMO PONIENTE', location: 'El Ejido', type: 'Poniente Almeriense' },
            { name: 'APROMPSI VERA', location: 'Vera', type: 'Levante Almeriense' }
        ],
        email: 'almeria@fantea.org',
        phone: '+34 950 123 456'
    }
};

/**
 * Inicializar mapa interactivo cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeAndalusiaMap();
});

/**
 * Inicializar funcionalidad del mapa de Andalucía
 */
function initializeAndalusiaMap() {
    const provinces = document.querySelectorAll('.province');
    const detailsPanel = document.getElementById('province-details');
    const closeBtn = document.getElementById('close-details');
    
    if (!provinces.length || !detailsPanel) return;
    
    // Crear overlay para modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    
    // Event listeners para provincias
    provinces.forEach(province => {
        province.addEventListener('click', function(e) {
            e.preventDefault();
            const provinceName = this.getAttribute('data-province');
            showProvinceDetails(provinceName);
        });
        
        // Efecto hover mejorado
        province.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2) saturate(1.1)';
            this.style.transform = 'scale(1.02)';
        });
        
        province.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.filter = 'none';
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    // Cerrar panel
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProvinceDetails);
    }
    
    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', closeProvinceDetails);
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProvinceDetails();
        }
    });
}

/**
 * Mostrar detalles de una provincia
 */
function showProvinceDetails(provinceName) {
    const data = provinceData[provinceName];
    if (!data) return;
    
    const detailsPanel = document.getElementById('province-details');
    const overlay = document.querySelector('.modal-overlay');
    
    // Actualizar contenido
    document.getElementById('province-name').textContent = data.name;
    document.getElementById('associations-count').textContent = data.associations.length;
    document.getElementById('region-email').textContent = data.email;
    document.getElementById('region-phone').textContent = data.phone;
    
    // Llenar lista de asociaciones
    const associationsList = document.getElementById('associations-list');
    associationsList.innerHTML = data.associations.map(association => `
        <div class="association-item">
            <i class="fas fa-users"></i>
            <div class="association-info">
                <h5>${association.name}</h5>
                <p>${association.location} - ${association.type}</p>
            </div>
        </div>
    `).join('');
    
    // Resaltar provincia activa
    document.querySelectorAll('.province').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-province="${provinceName}"]`).classList.add('active');
    
    // Mostrar panel y overlay
    detailsPanel.classList.remove('hidden');
    overlay.classList.add('visible');
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    
    // Focus en el panel para accesibilidad
    detailsPanel.focus();
    
    // Animación suave
    setTimeout(() => {
        detailsPanel.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

/**
 * Cerrar panel de detalles de provincia
 */
function closeProvinceDetails() {
    const detailsPanel = document.getElementById('province-details');
    const overlay = document.querySelector('.modal-overlay');
    
    if (!detailsPanel.classList.contains('hidden')) {
        // Ocultar panel y overlay
        detailsPanel.classList.add('hidden');
        overlay.classList.remove('visible');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Quitar resaltado de provincia
        document.querySelectorAll('.province').forEach(p => {
            p.classList.remove('active');
            p.style.filter = 'none';
            p.style.transform = 'scale(1)';
        });
    }
}

/**
 * Función para animar estadísticas cuando son visibles
 */
function animateMapStats() {
    const statNumbers = document.querySelectorAll('.stat-card .stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = element.textContent;
                
                // Solo para números (no porcentajes)
                if (finalValue.includes('%')) return;
                
                const numValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
                animateCounter(element, 0, numValue, 2000);
                
                observer.unobserve(element);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * Animar contador numérico
 */
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    const suffix = originalText.replace(/[0-9]/g, '');
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Inicializar animaciones de estadísticas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Delay para asegurar que el mapa esté cargado
    setTimeout(animateMapStats, 500);
}); 