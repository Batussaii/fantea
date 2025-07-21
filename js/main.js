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
 * Navegación responsive
 */
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animación del botón hamburguesa
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
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