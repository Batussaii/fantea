/**
 * FANTEA Admin Dashboard - JavaScript
 * Funcionalidad principal del panel de administración
 */

// Variables globales
let currentSection = 'dashboard';
let activityChart = null;

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación de forma más simple
    if (!checkAuthentication()) {
        window.location.replace('login.html');
        return;
    }
    
    // Inicializar componentes
    initializeNavigation();
    initializeChart();
    loadUserInfo();
    startRealTimeUpdates();
    
    // Cargar datos iniciales
    loadDashboardData();
});

/**
 * Verificar autenticación del usuario
 */
function checkAuthentication() {
    try {
        const session = localStorage.getItem('fantea_admin_session') || 
                       sessionStorage.getItem('fantea_admin_session');
        
        if (!session) {
            console.log('No session found');
            return false;
        }
        
        const sessionData = JSON.parse(session);
        
        if (!sessionData.username || !sessionData.loginTime) {
            console.log('Invalid session data');
            clearSession();
            return false;
        }
        
        const hoursSinceLogin = (Date.now() - sessionData.loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            console.log('Session expired');
            clearSession();
            return false;
        }
        
        console.log('Authentication successful for user:', sessionData.username);
        return true;
        
    } catch (e) {
        console.error('Error checking authentication:', e);
        clearSession();
        return false;
    }
}

/**
 * Limpiar sesión
 */
function clearSession() {
    localStorage.removeItem('fantea_admin_session');
    sessionStorage.removeItem('fantea_admin_session');
}

/**
 * Cargar información del usuario
 */
function loadUserInfo() {
    try {
        const session = localStorage.getItem('fantea_admin_session') || 
                       sessionStorage.getItem('fantea_admin_session');
        
        if (session) {
            const sessionData = JSON.parse(session);
            
            const userNameElement = document.getElementById('userName');
            const userRoleElement = document.getElementById('userRole');
            
            if (userNameElement && userRoleElement) {
                const displayName = 
                    sessionData.username === 'admin' ? 'Administrador' :
                    sessionData.username === 'editor' ? 'Editor' : 
                    sessionData.username === 'moderador' ? 'Moderador' : 'Usuario';
                
                userNameElement.textContent = displayName;
                userRoleElement.textContent = sessionData.username;
            }
        }
    } catch (e) {
        console.error('Error loading user info:', e);
    }
}

/**
 * Inicializar navegación lateral
 */
function initializeNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });
}

/**
 * Cambiar sección activa
 */
function switchSection(sectionName) {
    // Actualizar menú activo
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Mostrar sección correspondiente
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(`${sectionName}-content`).classList.add('active');
    
    // Actualizar sección actual
    currentSection = sectionName;
    
    // Cargar datos específicos de la sección
    loadSectionData(sectionName);
}

/**
 * Cargar datos específicos de cada sección
 */
function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'noticias':
            loadNewsData();
            break;
        case 'eventos':
            loadEventsData();
            break;
        // Añadir más casos según sea necesario
    }
}

/**
 * Cargar datos del dashboard
 */
function loadDashboardData() {
    // Simular carga de datos
    const stats = {
        news: { current: 24, change: 3 },
        events: { current: 8, change: 2 },
        associations: { current: 35, change: 1 },
        downloads: { current: 156, change: 23 }
    };
    
    // Actualizar estadísticas con animación
    animateStats(stats);
    
    // Cargar actividad reciente
    loadRecentActivity();
}

/**
 * Animar estadísticas
 */
function animateStats(stats) {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        const numberElement = card.querySelector('h3');
        const changeElement = card.querySelector('.stat-change');
        
        if (numberElement) {
            const targetValue = Object.values(stats)[index].current;
            const change = Object.values(stats)[index].change;
            
            animateNumber(numberElement, 0, targetValue, 1500);
            
            if (changeElement) {
                changeElement.textContent = `+${change} este mes`;
                changeElement.classList.add('positive');
            }
        }
    });
}

/**
 * Animar números con efecto contador
 */
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const originalSuffix = element.textContent.replace(/\d+/g, '');
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = currentValue + originalSuffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Cargar actividad reciente
 */
function loadRecentActivity() {
    const activities = [
        {
            type: 'news',
            icon: 'fas fa-plus',
            title: 'Nueva noticia publicada: "Jornada de Inclusión Educativa"',
            time: 'Hace 2 horas'
        },
        {
            type: 'event',
            icon: 'fas fa-calendar-plus',
            title: 'Evento creado: "Taller para Familias - Sevilla"',
            time: 'Hace 5 horas'
        },
        {
            type: 'affiliation',
            icon: 'fas fa-user-plus',
            title: 'Nueva afiliación: Asociación ASPANPAL Huelva',
            time: 'Hace 1 día'
        },
        {
            type: 'document',
            icon: 'fas fa-file-upload',
            title: 'Documento actualizado: Guía de Buenas Prácticas',
            time: 'Hace 2 días'
        }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.title.split(':')[0]}:</strong> ${activity.title.split(':')[1] || ''}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Inicializar gráfico de actividad
 */
function initializeChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    // Datos de ejemplo para el gráfico
    const chartData = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
            {
                label: 'Visitas al sitio web',
                data: [340, 290, 420, 380, 510, 280, 190],
                borderColor: '#1565C0',
                backgroundColor: 'rgba(21, 101, 192, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Descargas de documentos',
                data: [20, 35, 28, 42, 55, 25, 18],
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
    
    // Controles del gráfico
    const chartControls = document.querySelectorAll('.chart-controls .btn-small');
    chartControls.forEach(btn => {
        btn.addEventListener('click', function() {
            chartControls.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Aquí se actualizarían los datos del gráfico según el período seleccionado
            updateChartData(this.textContent);
        });
    });
}

/**
 * Actualizar datos del gráfico
 */
function updateChartData(period) {
    if (!activityChart) return;
    
    // Datos simulados según el período
    let newData;
    
    switch (period) {
        case '7 días':
            newData = [340, 290, 420, 380, 510, 280, 190];
            break;
        case '30 días':
            newData = [1200, 980, 1450, 1340, 1680, 920, 750];
            break;
        case '3 meses':
            newData = [3400, 2900, 4200, 3800, 5100, 2800, 1900];
            break;
        default:
            return;
    }
    
    activityChart.data.datasets[0].data = newData;
    activityChart.data.datasets[1].data = newData.map(val => Math.floor(val * 0.15));
    activityChart.update('active');
}

/**
 * Cargar datos de noticias
 */
function loadNewsData() {
    console.log('Cargando datos de noticias...');
    // Implementar carga de noticias
}

/**
 * Cargar datos de eventos
 */
function loadEventsData() {
    console.log('Cargando datos de eventos...');
    // Implementar carga de eventos
}

/**
 * Abrir editor de noticias
 */
function openNewsEditor() {
    alert('Editor de noticias - Funcionalidad en desarrollo');
    // Implementar modal del editor de noticias
}

/**
 * Abrir editor de eventos
 */
function openEventEditor() {
    alert('Editor de eventos - Funcionalidad en desarrollo');
    // Implementar modal del editor de eventos
}

/**
 * Cerrar sesión
 */
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        clearSession();
        window.location.replace('login.html');
    }
}

/**
 * Iniciar actualizaciones en tiempo real
 */
function startRealTimeUpdates() {
    // Actualizar notificaciones cada 30 segundos
    setInterval(() => {
        updateNotifications();
    }, 30000);
    
    // Actualizar estadísticas cada 5 minutos
    setInterval(() => {
        if (currentSection === 'dashboard') {
            loadDashboardData();
        }
    }, 300000);
}

/**
 * Actualizar notificaciones
 */
function updateNotifications() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        // Simular nuevas notificaciones
        const currentCount = parseInt(badge.textContent) || 0;
        if (Math.random() > 0.8) { // 20% probabilidad
            badge.textContent = currentCount + 1;
        }
    }
}

/**
 * Funciones de utilidad para filtros y búsquedas
 */

// Filtros de noticias
function filterNews() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchNews');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            console.log('Filtrar por estado:', this.value);
            // Implementar filtrado por estado
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            console.log('Filtrar por categoría:', this.value);
            // Implementar filtrado por categoría
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            console.log('Buscar:', this.value);
            // Implementar búsqueda en tiempo real
        });
    }
}

// Inicializar filtros cuando se carga la sección de noticias
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(filterNews, 1000); // Esperar a que se cargue todo
});

/**
 * Manejo de errores global
 */
window.addEventListener('error', function(event) {
    console.error('Error en el panel administrativo:', event.error);
    
    // Mostrar notificación de error al usuario
    showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
});

/**
 * Mostrar notificaciones
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/**
 * ==========================================================================
 * CMS (CONTENT MANAGEMENT SYSTEM) FUNCTIONS
 * ==========================================================================
 */

/**
 * Initialize CMS functionality
 */
function initializeCMS() {
    console.log('Starting CMS initialization...');
    
    // Remove existing event listeners to prevent duplicates
    const existingTabs = document.querySelectorAll('.cms-tab');
    existingTabs.forEach(tab => {
        tab.replaceWith(tab.cloneNode(true));
    });
    
    const existingToggleButtons = document.querySelectorAll('.toggle-section');
    existingToggleButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    // Initialize tab switching
    const cmsTabs = document.querySelectorAll('.cms-tab');
    console.log('Found CMS tabs:', cmsTabs.length);
    cmsTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            console.log('Switching to page:', page);
            switchCMSPage(page);
        });
    });
    
    // Initialize section toggling with direct onclick handlers
    const toggleButtons = document.querySelectorAll('.toggle-section');
    console.log('Found toggle buttons:', toggleButtons.length);
    toggleButtons.forEach(button => {
        // Remove existing onclick if any
        button.removeAttribute('onclick');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Toggle button clicked');
            toggleCMSSection(this);
        });
    });
    
    // Initialize image upload functionality
    initializeImageUploads();
    
    // Initialize action buttons
    initializeActionButtons();
    
    // Load saved content
    loadSavedContent();
    
    console.log('CMS initialization completed');
}

/**
 * Switch between CMS pages
 */
function switchCMSPage(pageName) {
    // Update active tab
    document.querySelectorAll('.cms-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    
    // Show corresponding content
    document.querySelectorAll('.cms-page-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${pageName}-cms`).classList.add('active');
}

/**
 * Toggle CMS section expand/collapse
 */
function toggleCMSSection(button) {
    console.log('toggleCMSSection called', button);
    
    const section = button.closest('.cms-section');
    const content = section.querySelector('.section-content-cms');
    const icon = button.querySelector('i');
    
    console.log('Section:', section);
    console.log('Content:', content);
    console.log('Icon:', icon);
    
    if (!content) {
        console.error('No content section found');
        return;
    }
    
    if (content.classList.contains('collapsed')) {
        // Expand
        content.classList.remove('collapsed');
        content.style.display = 'block';
        if (icon) icon.className = 'fas fa-chevron-up';
        
        // Update button text
        const textNode = Array.from(button.childNodes).find(node => node.nodeType === 3);
        if (textNode) {
            textNode.textContent = ' Contraer';
        }
        
        button.setAttribute('aria-expanded', 'true');
        console.log('Section expanded');
    } else {
        // Collapse
        content.classList.add('collapsed');
        content.style.display = 'none';
        if (icon) icon.className = 'fas fa-chevron-down';
        
        // Update button text
        const textNode = Array.from(button.childNodes).find(node => node.nodeType === 3);
        if (textNode) {
            textNode.textContent = ' Expandir';
        }
        
        button.setAttribute('aria-expanded', 'false');
        console.log('Section collapsed');
    }
}

/**
 * Initialize image upload functionality
 */
function initializeImageUploads() {
    // Hero image upload
    const heroImageInput = document.getElementById('hero-image-input');
    if (heroImageInput) {
        heroImageInput.addEventListener('change', function(e) {
            handleImageUpload(e, 'hero-image-preview');
        });
    }
}

/**
 * Initialize action buttons
 */
function initializeActionButtons() {
    console.log('Initializing action buttons...');
    
    // Main action buttons
    const previewBtn = document.getElementById('preview-changes-btn');
    const saveAllBtn = document.getElementById('save-all-changes-btn');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', previewChanges);
        console.log('Preview button initialized');
    }
    
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllChanges);
        console.log('Save all button initialized');
    }
    
    // Section action buttons - using event delegation
    document.addEventListener('click', function(e) {
        // Save section buttons
        if (e.target.closest('.save-section-btn')) {
            e.preventDefault();
            const button = e.target.closest('.save-section-btn');
            const section = button.getAttribute('data-section') || button.onclick?.toString().match(/'([^']+)'/)?.[1];
            if (section) {
                console.log('Saving section:', section);
                saveSection(section);
            }
        }
        
        // Reset section buttons
        if (e.target.closest('.reset-section-btn')) {
            e.preventDefault();
            const button = e.target.closest('.reset-section-btn');
            const section = button.getAttribute('data-section') || button.onclick?.toString().match(/'([^']+)'/)?.[1];
            if (section) {
                console.log('Resetting section:', section);
                resetSection(section);
            }
        }
        
        // Upload image buttons
        if (e.target.closest('[onclick*="uploadImage"]')) {
            e.preventDefault();
            const button = e.target.closest('[onclick*="uploadImage"]');
            const imageId = button.onclick?.toString().match(/'([^']+)'/)?.[1];
            if (imageId) {
                console.log('Uploading image:', imageId);
                uploadImage(imageId);
            }
        }
        
        // Add timeline item buttons
        if (e.target.closest('[onclick*="addTimelineItem"]')) {
            e.preventDefault();
            console.log('Adding timeline item');
            addTimelineItem();
        }
        
        // Remove timeline item buttons
        if (e.target.closest('[onclick*="removeTimelineItem"]')) {
            e.preventDefault();
            const button = e.target.closest('[onclick*="removeTimelineItem"]');
            console.log('Removing timeline item');
            removeTimelineItem(button);
        }
    });
    
    console.log('Action buttons initialized');
}

/**
 * Handle image upload
 */
function uploadImage(imageId) {
    const input = document.getElementById(`${imageId}-input`);
    if (input) {
        input.click();
    }
}

/**
 * Handle image file selection
 */
function handleImageUpload(event, previewId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                
                // Show success notification
                showCMSNotification('Imagen cargada correctamente', 'success');
                
                // Mark as changed for saving
                markContentChanged();
            }
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Save individual section
 */
function saveSection(sectionName, buttonElement = null) {
    console.log('Saving section:', sectionName);
    
    // Find the button if not provided
    const button = buttonElement || document.querySelector(`[data-section="${sectionName}"].save-section-btn`) || 
                   Array.from(document.querySelectorAll('button')).find(btn => 
                       btn.onclick && btn.onclick.toString().includes(`'${sectionName}'`));
    
    let originalText = '';
    if (button) {
        originalText = button.innerHTML;
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        button.disabled = true;
    }
    
    // Simulate save operation
    setTimeout(() => {
        // Collect section data
        const sectionData = collectSectionData(sectionName);
        console.log('Section data collected:', sectionData);
        
        // Save to localStorage (in a real app, this would be sent to server)
        saveSectionData(sectionName, sectionData);
        
        // Restore button and show success
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
        
        showCMSNotification(`Sección "${sectionName}" guardada correctamente`, 'success');
        
        // Update the actual website content (simulation)
        updateWebsiteContent(sectionName, sectionData);
        
    }, 1500);
}

/**
 * Collect data from a section
 */
function collectSectionData(sectionName) {
    const data = {};
    
    switch (sectionName) {
        case 'hero':
            data.title = document.getElementById('hero-title')?.value || '';
            data.description = document.getElementById('hero-description')?.value || '';
            data.image = document.getElementById('hero-image-preview')?.src || '';
            break;
            
        case 'stats':
            data.stats = [];
            const statItems = document.querySelectorAll('.stat-item-cms');
            statItems.forEach((item, index) => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 2) {
                    data.stats.push({
                        number: inputs[0].value,
                        description: inputs[1].value
                    });
                }
            });
            break;
            
        case 'features':
            data.title = document.getElementById('features-title')?.value || '';
            data.subtitle = document.getElementById('features-subtitle')?.value || '';
            data.features = [];
            
            const featureItems = document.querySelectorAll('.feature-item-cms');
            featureItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 3) {
                    data.features.push({
                        title: inputs[0].value,
                        description: inputs[1].value,
                        icon: inputs[2].value
                    });
                }
            });
            break;
            
        case 'cta':
            data.title = document.getElementById('cta-title')?.value || '';
            data.description = document.getElementById('cta-description')?.value || '';
            break;
            
        case 'nosotros-header':
            data.title = document.getElementById('nosotros-title')?.value || '';
            data.description = document.getElementById('nosotros-description')?.value || '';
            break;
            
        case 'history':
            data.title = document.getElementById('history-title')?.value || '';
            data.subtitle = document.getElementById('history-subtitle')?.value || '';
            data.timeline = [];
            
            const timelineItems = document.querySelectorAll('.timeline-item-cms');
            timelineItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 3) {
                    data.timeline.push({
                        year: inputs[0].value,
                        title: inputs[1].value,
                        description: inputs[2].value
                    });
                }
            });
            break;
            
        // New sections for other pages
        case 'autismo-header':
            data.title = document.getElementById('autismo-title')?.value || '';
            data.description = document.getElementById('autismo-description')?.value || '';
            break;
            
        case 'autismo-intro':
            data.sectionTitle = document.getElementById('autismo-intro-title')?.value || '';
            data.subtitle = document.getElementById('autismo-intro-subtitle')?.value || '';
            data.definitionTitle = document.getElementById('autismo-definition-title')?.value || '';
            data.definitionText = document.getElementById('autismo-definition-text')?.value || '';
            data.keyPoints = [];
            
            const keyPointItems = document.querySelectorAll('.key-point-item .cms-input');
            keyPointItems.forEach(input => {
                if (input.value.trim()) {
                    data.keyPoints.push(input.value.trim());
                }
            });
            break;
            
        case 'servicios-header':
            data.title = document.getElementById('servicios-title')?.value || '';
            data.description = document.getElementById('servicios-description')?.value || '';
            break;
            
        case 'servicios-pilares':
            data.title = document.getElementById('servicios-pilares-title')?.value || '';
            data.subtitle = document.getElementById('servicios-pilares-subtitle')?.value || '';
            data.services = [];
            
            const serviceItems = document.querySelectorAll('.service-item-cms');
            serviceItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 3) {
                    data.services.push({
                        icon: inputs[0].value,
                        title: inputs[1].value,
                        description: inputs[2].value
                    });
                }
            });
            break;
            
        case 'actualidad-header':
            data.title = document.getElementById('actualidad-title')?.value || '';
            data.description = document.getElementById('actualidad-description')?.value || '';
            break;
            
        case 'actualidad-config':
            data.postsPerPage = document.getElementById('blog-posts-per-page')?.value || 6;
            data.featuredCount = document.getElementById('blog-featured-count')?.value || 3;
            data.introText = document.getElementById('blog-intro-text')?.value || '';
            data.categories = [];
            
            const categoryItems = document.querySelectorAll('.category-item');
            categoryItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 2 && inputs[0].value.trim()) {
                    data.categories.push({
                        name: inputs[0].value.trim(),
                        color: inputs[1].value.trim() || '#1565C0'
                    });
                }
            });
            break;
            
        case 'afiliate-header':
            data.title = document.getElementById('afiliate-title')?.value || '';
            data.description = document.getElementById('afiliate-description')?.value || '';
            break;
            
        case 'afiliate-membership':
            data.title = document.getElementById('participar-title')?.value || '';
            data.subtitle = document.getElementById('participar-subtitle')?.value || '';
            data.membershipTypes = [];
            
            const membershipItems = document.querySelectorAll('.membership-type-cms');
            membershipItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 3) {
                    data.membershipTypes.push({
                        tabName: inputs[0].value,
                        title: inputs[1].value,
                        description: inputs[2].value
                    });
                }
            });
            break;
            
        case 'contacto-header':
            data.title = document.getElementById('contacto-title')?.value || '';
            data.description = document.getElementById('contacto-description')?.value || '';
            break;
            
        case 'contacto-info':
            data.formTitle = document.getElementById('contacto-form-title')?.value || '';
            data.formSubtitle = document.getElementById('contacto-form-subtitle')?.value || '';
            data.contactInfo = {};
            data.socialLinks = {};
            
            // Contact info
            const contactItems = document.querySelectorAll('.contact-item-cms');
            contactItems.forEach(item => {
                const label = item.querySelector('label')?.textContent.toLowerCase().replace(/\s+/g, '') || '';
                const input = item.querySelector('.cms-input');
                if (input && input.value.trim()) {
                    data.contactInfo[label] = input.value.trim();
                }
            });
            
            // Social links
            const socialItems = document.querySelectorAll('.social-item-cms');
            socialItems.forEach(item => {
                const label = item.querySelector('label')?.textContent.toLowerCase().replace(/\s+/g, '') || '';
                const input = item.querySelector('.cms-input');
                if (input && input.value.trim()) {
                    data.socialLinks[label] = input.value.trim();
                }
            });
            break;
    }
    
    return data;
}

/**
 * Save section data to localStorage
 */
function saveSectionData(sectionName, data) {
    const currentData = JSON.parse(localStorage.getItem('fantea_cms_data') || '{}');
    currentData[sectionName] = {
        ...data,
        lastModified: new Date().toISOString(),
        modifiedBy: getCurrentUser()
    };
    localStorage.setItem('fantea_cms_data', JSON.stringify(currentData));
}

/**
 * Load saved content on page load
 */
function loadSavedContent() {
    const savedData = JSON.parse(localStorage.getItem('fantea_cms_data') || '{}');
    
    Object.keys(savedData).forEach(sectionName => {
        loadSectionData(sectionName, savedData[sectionName]);
    });
}

/**
 * Load data into a section
 */
function loadSectionData(sectionName, data) {
    switch (sectionName) {
        case 'hero':
            if (data.title) document.getElementById('hero-title').value = data.title;
            if (data.description) document.getElementById('hero-description').value = data.description;
            if (data.image) document.getElementById('hero-image-preview').src = data.image;
            break;
            
        case 'stats':
            if (data.stats) {
                const statItems = document.querySelectorAll('.stat-item-cms');
                data.stats.forEach((stat, index) => {
                    if (statItems[index]) {
                        const inputs = statItems[index].querySelectorAll('.cms-input');
                        if (inputs[0]) inputs[0].value = stat.number;
                        if (inputs[1]) inputs[1].value = stat.description;
                    }
                });
            }
            break;
            
        case 'features':
            if (data.title) document.getElementById('features-title').value = data.title;
            if (data.subtitle) document.getElementById('features-subtitle').value = data.subtitle;
            
            if (data.features) {
                const featureItems = document.querySelectorAll('.feature-item-cms');
                data.features.forEach((feature, index) => {
                    if (featureItems[index]) {
                        const inputs = featureItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = feature.title;
                        if (inputs[1]) inputs[1].value = feature.description;
                        if (inputs[2]) inputs[2].value = feature.icon;
                    }
                });
            }
            break;
            
        case 'cta':
            if (data.title) document.getElementById('cta-title').value = data.title;
            if (data.description) document.getElementById('cta-description').value = data.description;
            break;
            
        case 'nosotros-header':
            if (data.title) document.getElementById('nosotros-title').value = data.title;
            if (data.description) document.getElementById('nosotros-description').value = data.description;
            break;
            
        case 'history':
            if (data.title) document.getElementById('history-title').value = data.title;
            if (data.subtitle) document.getElementById('history-subtitle').value = data.subtitle;
            
            if (data.timeline) {
                const timelineItems = document.querySelectorAll('.timeline-item-cms');
                data.timeline.forEach((item, index) => {
                    if (timelineItems[index]) {
                        const inputs = timelineItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = item.year;
                        if (inputs[1]) inputs[1].value = item.title;
                        if (inputs[2]) inputs[2].value = item.description;
                    }
                });
            }
            break;
            
        // New sections loading
        case 'autismo-header':
            if (data.title) document.getElementById('autismo-title').value = data.title;
            if (data.description) document.getElementById('autismo-description').value = data.description;
            break;
            
        case 'autismo-intro':
            if (data.sectionTitle) document.getElementById('autismo-intro-title').value = data.sectionTitle;
            if (data.subtitle) document.getElementById('autismo-intro-subtitle').value = data.subtitle;
            if (data.definitionTitle) document.getElementById('autismo-definition-title').value = data.definitionTitle;
            if (data.definitionText) document.getElementById('autismo-definition-text').value = data.definitionText;
            
            if (data.keyPoints) {
                const keyPointItems = document.querySelectorAll('.key-point-item .cms-input');
                data.keyPoints.forEach((point, index) => {
                    if (keyPointItems[index]) {
                        keyPointItems[index].value = point;
                    }
                });
            }
            break;
            
        case 'servicios-header':
            if (data.title) document.getElementById('servicios-title').value = data.title;
            if (data.description) document.getElementById('servicios-description').value = data.description;
            break;
            
        case 'servicios-pilares':
            if (data.title) document.getElementById('servicios-pilares-title').value = data.title;
            if (data.subtitle) document.getElementById('servicios-pilares-subtitle').value = data.subtitle;
            
            if (data.services) {
                const serviceItems = document.querySelectorAll('.service-item-cms');
                data.services.forEach((service, index) => {
                    if (serviceItems[index]) {
                        const inputs = serviceItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = service.icon;
                        if (inputs[1]) inputs[1].value = service.title;
                        if (inputs[2]) inputs[2].value = service.description;
                    }
                });
            }
            break;
            
        case 'actualidad-header':
            if (data.title) document.getElementById('actualidad-title').value = data.title;
            if (data.description) document.getElementById('actualidad-description').value = data.description;
            break;
            
        case 'actualidad-config':
            if (data.postsPerPage) document.getElementById('blog-posts-per-page').value = data.postsPerPage;
            if (data.featuredCount) document.getElementById('blog-featured-count').value = data.featuredCount;
            if (data.introText) document.getElementById('blog-intro-text').value = data.introText;
            
            if (data.categories) {
                const categoryItems = document.querySelectorAll('.category-item');
                data.categories.forEach((category, index) => {
                    if (categoryItems[index]) {
                        const inputs = categoryItems[index].querySelectorAll('.cms-input');
                        if (inputs[0]) inputs[0].value = category.name;
                        if (inputs[1]) inputs[1].value = category.color;
                    }
                });
            }
            break;
            
        case 'afiliate-header':
            if (data.title) document.getElementById('afiliate-title').value = data.title;
            if (data.description) document.getElementById('afiliate-description').value = data.description;
            break;
            
        case 'afiliate-membership':
            if (data.title) document.getElementById('participar-title').value = data.title;
            if (data.subtitle) document.getElementById('participar-subtitle').value = data.subtitle;
            
            if (data.membershipTypes) {
                const membershipItems = document.querySelectorAll('.membership-type-cms');
                data.membershipTypes.forEach((membership, index) => {
                    if (membershipItems[index]) {
                        const inputs = membershipItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = membership.tabName;
                        if (inputs[1]) inputs[1].value = membership.title;
                        if (inputs[2]) inputs[2].value = membership.description;
                    }
                });
            }
            break;
            
        case 'contacto-header':
            if (data.title) document.getElementById('contacto-title').value = data.title;
            if (data.description) document.getElementById('contacto-description').value = data.description;
            break;
            
        case 'contacto-info':
            if (data.formTitle) document.getElementById('contacto-form-title').value = data.formTitle;
            if (data.formSubtitle) document.getElementById('contacto-form-subtitle').value = data.formSubtitle;
            
            // Load contact info
            if (data.contactInfo) {
                const contactItems = document.querySelectorAll('.contact-item-cms');
                contactItems.forEach(item => {
                    const label = item.querySelector('label')?.textContent.toLowerCase().replace(/\s+/g, '') || '';
                    const input = item.querySelector('.cms-input');
                    if (input && data.contactInfo[label]) {
                        input.value = data.contactInfo[label];
                    }
                });
            }
            
            // Load social links
            if (data.socialLinks) {
                const socialItems = document.querySelectorAll('.social-item-cms');
                socialItems.forEach(item => {
                    const label = item.querySelector('label')?.textContent.toLowerCase().replace(/\s+/g, '') || '';
                    const input = item.querySelector('.cms-input');
                    if (input && data.socialLinks[label]) {
                        input.value = data.socialLinks[label];
                    }
                });
            }
            break;
    }
}

/**
 * Reset section to original values
 */
function resetSection(sectionName) {
    if (confirm('¿Estás seguro de que quieres deshacer los cambios en esta sección?')) {
        // Remove from saved data
        const currentData = JSON.parse(localStorage.getItem('fantea_cms_data') || '{}');
        delete currentData[sectionName];
        localStorage.setItem('fantea_cms_data', JSON.stringify(currentData));
        
        // Reload the page to reset values
        location.reload();
    }
}

/**
 * Save all changes
 */
function saveAllChanges(buttonElement = null) {
    console.log('Saving all changes...');
    
    const button = buttonElement || document.getElementById('save-all-changes-btn') || event?.target;
    let originalText = '';
    
    if (button) {
        originalText = button.innerHTML;
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        button.disabled = true;
    }
    
    // Collect all data
    const allData = {
        // Inicio page
        hero: collectSectionData('hero'),
        stats: collectSectionData('stats'),
        features: collectSectionData('features'),
        cta: collectSectionData('cta'),
        
        // Nosotros page
        'nosotros-header': collectSectionData('nosotros-header'),
        history: collectSectionData('history'),
        
        // Autismo page
        'autismo-header': collectSectionData('autismo-header'),
        'autismo-intro': collectSectionData('autismo-intro'),
        
        // Servicios page
        'servicios-header': collectSectionData('servicios-header'),
        'servicios-pilares': collectSectionData('servicios-pilares'),
        
        // Actualidad page
        'actualidad-header': collectSectionData('actualidad-header'),
        'actualidad-config': collectSectionData('actualidad-config'),
        
        // Afiliate page
        'afiliate-header': collectSectionData('afiliate-header'),
        'afiliate-membership': collectSectionData('afiliate-membership'),
        
        // Contacto page
        'contacto-header': collectSectionData('contacto-header'),
        'contacto-info': collectSectionData('contacto-info')
    };
    
    // Simulate save operation
    setTimeout(() => {
        // Save all data
        Object.keys(allData).forEach(sectionName => {
            saveSectionData(sectionName, allData[sectionName]);
            updateWebsiteContent(sectionName, allData[sectionName]);
        });
        
        // Restore button and show success
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
        
        showCMSNotification('Todos los cambios han sido guardados correctamente', 'success');
        
        // Show summary of changes
        const changeCount = Object.keys(allData).filter(key => 
            Object.keys(allData[key]).length > 0
        ).length;
        
        setTimeout(() => {
            showCMSNotification(`Se actualizaron ${changeCount} secciones del sitio web`, 'info');
        }, 2000);
        
    }, 2000);
}

/**
 * Preview changes (simulation)
 */
function previewChanges() {
    const allData = {
        hero: collectSectionData('hero'),
        stats: collectSectionData('stats'),
        features: collectSectionData('features'),
        cta: collectSectionData('cta')
    };
    
    // In a real application, this would open a preview window
    showCMSNotification('Vista previa: se abrirá en una nueva ventana', 'info');
    
    // Simulate opening preview
    setTimeout(() => {
        if (confirm('¿Quieres abrir la página de inicio con los cambios aplicados?')) {
            // Store preview data temporarily
            sessionStorage.setItem('fantea_preview_data', JSON.stringify(allData));
            // Open in new window (simulation)
            showCMSNotification('Vista previa generada correctamente', 'success');
        }
    }, 1000);
}

/**
 * Update website content (simulation)
 */
function updateWebsiteContent(sectionName, data) {
    console.log(`Updating ${sectionName} with data:`, data);
    
    // Notify all open tabs/windows through localStorage change event
    try {
        // Trigger storage event by updating localStorage
        const currentData = JSON.parse(localStorage.getItem('fantea_cms_data') || '{}');
        currentData[sectionName] = data;
        localStorage.setItem('fantea_cms_data', JSON.stringify(currentData));
        
        // Also trigger a custom storage event for immediate updates
        window.dispatchEvent(new CustomEvent('cms-data-updated', {
            detail: { section: sectionName, data: data }
        }));
        
        console.log('CMS data updated and event dispatched');
    } catch (error) {
        console.warn('Error updating CMS data:', error);
    }
    
    // Try to notify parent window if opened from main site
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.postMessage({
                type: 'CMS_UPDATE',
                section: sectionName,
                data: data,
                timestamp: Date.now()
            }, '*');
            console.log('Message sent to parent window');
        } catch (e) {
            console.log('Could not send update to parent window:', e);
        }
    }
    
    // Try to notify all windows in the same origin
    try {
        // Use BroadcastChannel for cross-tab communication (modern browsers)
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('fantea-cms');
            channel.postMessage({
                type: 'CMS_UPDATE',
                section: sectionName,
                data: data,
                timestamp: Date.now()
            });
            channel.close();
            console.log('Broadcast message sent');
        }
    } catch (e) {
        console.log('BroadcastChannel not available or failed:', e);
    }
}

/**
 * Add timeline item
 */
function addTimelineItem() {
    const timeline = document.querySelector('.timeline-cms');
    const newItem = document.createElement('div');
    newItem.className = 'timeline-item-cms';
    
    const itemCount = document.querySelectorAll('.timeline-item-cms').length + 1;
    
    newItem.innerHTML = `
        <h4>Evento Histórico ${itemCount}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Año</label>
                <input type="text" class="cms-input" placeholder="2024">
            </div>
            <div class="form-group">
                <label>Título del Evento</label>
                <input type="text" class="cms-input" placeholder="Nuevo hito">
            </div>
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea class="cms-textarea" rows="4" placeholder="Descripción del evento histórico..."></textarea>
        </div>
        <button class="btn-small btn-outline" onclick="removeTimelineItem(this)" style="margin-top: 10px;">
            <i class="fas fa-trash"></i>
            Eliminar
        </button>
    `;
    
    // Insert before the "Add" button
    const addButton = timeline.querySelector('.btn-outline');
    timeline.insertBefore(newItem, addButton);
}

/**
 * Remove timeline item
 */
function removeTimelineItem(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        button.closest('.timeline-item-cms').remove();
    }
}

/**
 * Add key point to autism section
 */
function addKeyPoint() {
    const keyPointsContainer = document.querySelector('.key-points-cms');
    if (!keyPointsContainer) return;
    
    const newKeyPoint = document.createElement('div');
    newKeyPoint.className = 'key-point-item';
    newKeyPoint.innerHTML = `
        <input type="text" class="cms-input" placeholder="Nuevo punto clave">
        <button class="btn-small btn-outline" onclick="removeKeyPoint(this)" style="margin-left: 10px; margin-top: 5px;">
            <i class="fas fa-trash"></i>
            Eliminar
        </button>
    `;
    
    // Insert before the "Add" button
    const addButton = keyPointsContainer.querySelector('.btn-outline');
    keyPointsContainer.insertBefore(newKeyPoint, addButton);
}

/**
 * Remove key point
 */
function removeKeyPoint(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este punto?')) {
        button.closest('.key-point-item').remove();
    }
}

/**
 * Add category to actualidad section
 */
function addCategory() {
    const categoriesContainer = document.querySelector('.categories-cms');
    if (!categoriesContainer) return;
    
    const newCategory = document.createElement('div');
    newCategory.className = 'category-item';
    newCategory.innerHTML = `
        <input type="text" class="cms-input" placeholder="Nombre categoría">
        <input type="text" class="cms-input" value="#1565C0" placeholder="Color (hex)">
        <button class="btn-small btn-outline" onclick="removeCategory(this)" style="margin-left: 10px;">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    // Insert before the "Add" button
    const addButton = categoriesContainer.querySelector('.btn-outline');
    categoriesContainer.insertBefore(newCategory, addButton);
}

/**
 * Remove category
 */
function removeCategory(button) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        button.closest('.category-item').remove();
    }
}

/**
 * Show CMS notification
 */
function showCMSNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.cms-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `cms-notification ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="cms-notification-content">
            <i class="fas ${iconMap[type] || iconMap.info}"></i>
            <span>${message}</span>
        </div>
        <button class="cms-notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Mark content as changed
 */
function markContentChanged() {
    // Add change indicators
    document.body.classList.add('content-changed');
    
    // Update save button state
    const saveButton = document.querySelector('button[onclick="saveAllChanges()"]');
    if (saveButton && !saveButton.classList.contains('btn-warning')) {
        saveButton.classList.add('btn-warning');
        saveButton.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios *';
    }
}

/**
 * Get current user
 */
function getCurrentUser() {
    const session = localStorage.getItem('fantea_admin_session') || 
                   sessionStorage.getItem('fantea_admin_session');
    if (session) {
        const sessionData = JSON.parse(session);
        return sessionData.username || 'admin';
    }
    return 'admin';
}

/**
 * Initialize CMS when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize CMS after a short delay to ensure everything is loaded
    setTimeout(() => {
        if (document.querySelector('.cms-tabs')) {
            console.log('Initializing CMS...');
            initializeCMS();
        }
    }, 1000);
    
    // Also initialize when switching to content section
    const contentMenuItem = document.querySelector('[data-section="contenido"]');
    if (contentMenuItem) {
        contentMenuItem.addEventListener('click', function() {
            setTimeout(() => {
                if (document.querySelector('.cms-tabs')) {
                    console.log('Re-initializing CMS after section switch...');
                    initializeCMS();
                }
            }, 100);
        });
    }
});

/**
 * Exportar funciones globales
 */
window.switchSection = switchSection;
window.openNewsEditor = openNewsEditor;
window.openEventEditor = openEventEditor;
window.logout = logout;

// CMS Functions
window.switchCMSPage = switchCMSPage;
window.toggleCMSSection = toggleCMSSection;
window.uploadImage = uploadImage;
window.saveSection = saveSection;
window.resetSection = resetSection;
window.saveAllChanges = saveAllChanges;
window.previewChanges = previewChanges;
window.addTimelineItem = addTimelineItem;
window.removeTimelineItem = removeTimelineItem;
window.addKeyPoint = addKeyPoint;
window.removeKeyPoint = removeKeyPoint;
window.addCategory = addCategory;
window.removeCategory = removeCategory; 