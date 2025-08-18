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
    loadSectionSpecificData(sectionName);
}

/**
 * Cargar datos específicos de cada sección
 */
function loadSectionSpecificData(section) {
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
    // Attach change listeners to all image file inputs that follow the pattern *-image-input
    const imageInputs = document.querySelectorAll('input[type="file"][id$="-image-input"]');
    imageInputs.forEach((input) => {
        input.addEventListener('change', function(e) {
            // Derive the base id (remove the trailing -input) to build the preview id
            const inputId = e.target.id; // e.g., quienes-somos-header-image-input
            const baseId = inputId.replace(/-input$/, ''); // e.g., quienes-somos-header-image
            const previewId = `${baseId}-preview`; // e.g., quienes-somos-header-image-preview
            handleImageUpload(e, previewId);
        });
    });
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
            const section = button.getAttribute('data-section');
            if (section) {
                console.log('Saving section:', section);
                saveSection(section, button);
            }
        }
        
        // Reset section buttons
        if (e.target.closest('.reset-section-btn')) {
            e.preventDefault();
            const button = e.target.closest('.reset-section-btn');
            const section = button.getAttribute('data-section');
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
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const preview = document.getElementById(previewId);
        if (preview) {
            // Set immediate preview using base64 while uploading
            preview.src = e.target.result;
            showCMSNotification('Imagen cargada, subiendo...', 'info');

            try {
                // Build a safe filename
                const timePart = Date.now();
                const sanitizedName = (file.name || 'image').replace(/[^a-zA-Z0-9_.-]/g, '_');
                const filename = `${previewId.replace(/-preview$/, '')}_${timePart}_${sanitizedName}`;

                // Upload to server
                const uploadedUrl = await uploadImageData(e.target.result, filename);
                if (uploadedUrl) {
                    preview.src = uploadedUrl; // ensure persisted URL is saved
                    // Mark as changed for saving
                    markContentChanged();
                    showCMSNotification('Imagen subida correctamente', 'success');
                } else {
                    showCMSNotification('No se pudo subir la imagen. Se usará vista previa local.', 'warning');
                }
            } catch (err) {
                console.warn('Error uploading image:', err);
                showCMSNotification('Error subiendo imagen. Se usará vista previa local.', 'error');
            }
        }
    };
    reader.readAsDataURL(file);
}

// Upload base64 image data to server and return the URL
async function uploadImageData(imageBase64, filename) {
    try {
        const response = await fetch(CMS_CONFIG.apiUrls.upload, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: imageBase64, filename })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        const result = await response.json();
        return result && result.url ? result.url : null;
    } catch (error) {
        console.error('uploadImageData error:', error);
        return null;
    }
}

/**
 * Save individual section
 */
async function saveSection(sectionName, buttonElement = null) {
    console.log('Saving section:', sectionName);
    
    // Find the button if not provided
    let button = buttonElement;
    if (!button) {
        // Try to find button by data-section attribute
        button = document.querySelector(`[data-section="${sectionName}"].save-section-btn`);
        
        // If not found, try to find by onclick attribute
        if (!button) {
            const allButtons = document.querySelectorAll('button');
            button = Array.from(allButtons).find(btn => 
                btn.onclick && btn.onclick.toString().includes(`'${sectionName}'`));
        }
        
        // If still not found, try to find by text content
        if (!button) {
            const allButtons = document.querySelectorAll('button');
            button = Array.from(allButtons).find(btn => 
                btn.textContent.includes('Guardar Sección') && 
                btn.closest('.cms-section') && 
                btn.closest('.cms-section').querySelector(`[id*="${sectionName}"]`));
        }
    }
    
    let originalText = '';
    if (button) {
        originalText = button.innerHTML;
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        button.disabled = true;
    }
    
    try {
        // Collect section data
        const sectionData = collectSectionData(sectionName);
        console.log('Section data collected:', sectionData);
        
        // Save to server
        const savedToServer = await saveSectionData(sectionName, sectionData);
        
        // Restore button and show success
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
        
        if (savedToServer) {
            showCMSNotification(`Sección "${sectionName}" guardada correctamente en servidor`, 'success');
        } else {
            showCMSNotification(`Sección "${sectionName}" guardada en localStorage (servidor no disponible)`, 'warning');
        }
        
        // Update the actual website content (simulation)
        updateWebsiteContent(sectionName, sectionData);
        
    } catch (error) {
        console.error('Error saving section:', error);
        
        // Restore button and show error
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
        
        showCMSNotification(`Error guardando sección "${sectionName}": ${error.message}`, 'error');
    }
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
            data.buttons = {
                about: document.getElementById('hero-button-about')?.value || 'Conócenos',
                affiliate: document.getElementById('hero-button-affiliate')?.value || 'Afíliate',
                donate: document.getElementById('hero-button-donate')?.value || 'Haz una Donación'
            };
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
                if (inputs.length >= 4) {
                    data.features.push({
                        title: inputs[0].value,
                        description: inputs[1].value,
                        icon: inputs[2].value,
                        linkText: inputs[3].value
                    });
                }
            });
            break;
            
        case 'cta':
            data.title = document.getElementById('cta-title')?.value || '';
            data.description = document.getElementById('cta-description')?.value || '';
            data.buttons = {
                primary: document.getElementById('cta-button-primary')?.value || 'Afíliate Ahora',
                secondary: document.getElementById('cta-button-secondary')?.value || 'Contactar'
            };
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
            
        // New sections for updated pages
        case 'quienes-somos-header':
            data.title = document.getElementById('quienes-somos-header-title')?.value || '';
            data.subtitle = document.getElementById('quienes-somos-header-subtitle')?.value || '';
            data.image = document.getElementById('quienes-somos-header-image-preview')?.src || '';
            data.buttons = {
                mision: document.getElementById('quienes-somos-button-mision')?.value || 'Nuestra Misión',
                valores: document.getElementById('quienes-somos-button-valores')?.value || 'Nuestros Valores'
            };
            break;
            
        case 'quienes-somos-stats':
            data.stats = [];
            const quienesSomosStatItems = document.querySelectorAll('.stat-item-cms');
            quienesSomosStatItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 2) {
                    data.stats.push({
                        number: inputs[0].value,
                        description: inputs[1].value
                    });
                }
            });
            break;
            
        case 'quienes-somos-mision':
            data.title = document.getElementById('quienes-somos-mision-title')?.value || '';
            data.subtitle = document.getElementById('quienes-somos-mision-subtitle')?.value || '';
            data.cards = [];
            
            const quienesSomosFeatureItems = document.querySelectorAll('.feature-item-cms');
            quienesSomosFeatureItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 4) {
                    data.cards.push({
                        icon: inputs[0].value,
                        title: inputs[1].value,
                        description: inputs[2].value,
                        highlight: inputs[3].value
                    });
                }
            });
            break;
            
        case 'quienes-somos-valores':
            data.title = document.getElementById('quienes-somos-valores-title')?.value || '';
            data.subtitle = document.getElementById('quienes-somos-valores-subtitle')?.value || '';
            data.values = [];
            
            const valueItems = document.querySelectorAll('.value-item-cms');
            valueItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 3) {
                    data.values.push({
                        icon: inputs[0].value,
                        title: inputs[1].value,
                        description: inputs[2].value
                    });
                }
            });
            break;
            
        case 'quienes-somos-historia':
            data.title = document.getElementById('quienes-somos-historia-title')?.value || '';
            data.subtitle = document.getElementById('quienes-somos-historia-subtitle')?.value || '';
            data.timeline = [];
            
            const quienesSomosTimelineItems = document.querySelectorAll('.timeline-item-cms');
            quienesSomosTimelineItems.forEach(item => {
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
            
        case 'quienes-somos-cta':
            data.title = document.getElementById('quienes-somos-cta-title')?.value || '';
            data.description = document.getElementById('quienes-somos-cta-description')?.value || '';
            data.buttons = [];
            
            const ctaButtonItems = document.querySelectorAll('.cta-button-item-cms');
            ctaButtonItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, select');
                if (inputs.length >= 3) {
                    data.buttons.push({
                        text: inputs[0].value,
                        url: inputs[1].value,
                        type: inputs[2].value
                    });
                }
            });
            break;
            
        case 'asociaciones-header':
            data.title = document.getElementById('asociaciones-title')?.value || '';
            data.description = document.getElementById('asociaciones-description')?.value || '';
            data.image = document.getElementById('asociaciones-image-preview')?.src || '';
            data.buttons = {
                ver: document.getElementById('asociaciones-button-ver')?.value || 'Ver Asociaciones',
                verUrl: document.getElementById('asociaciones-url-ver')?.value || '#associations',
                unirse: document.getElementById('asociaciones-button-unirse')?.value || 'Unirse a FANTEA',
                unirseUrl: document.getElementById('asociaciones-url-unirse')?.value || '#join',
                estatutos: document.getElementById('asociaciones-button-estatutos')?.value || 'Descarga Nuestros Estatutos',
                estatutosUrl: document.getElementById('asociaciones-url-estatutos')?.value || '#download-statutes'
            };
            break;
            
        case 'asociaciones-list':
            data.sectionTitle = document.getElementById('asociaciones-intro-title')?.value || '';
            data.subtitle = document.getElementById('asociaciones-intro-subtitle')?.value || '';
            data.introText = document.getElementById('asociaciones-intro-text')?.value || '';
            data.associations = [];
            
            const associationItems = document.querySelectorAll('.association-item-cms');
            associationItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 4) {
                    data.associations.push({
                        name: inputs[0].value,
                        province: inputs[1].value,
                        description: inputs[2].value,
                        website: inputs[3].value
                    });
                }
            });
            break;

        case 'asociaciones-stats':
            data.stats = [];
            const asociacionesStatsItems = document.querySelectorAll('.stats-grid-cms .stat-item-cms');
            asociacionesStatsItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 2) {
                    data.stats.push({
                        number: inputs[0].value,
                        description: inputs[1].value
                    });
                }
            });
            break;

        case 'asociaciones-join':
            data.title = document.getElementById('asociaciones-join-title')?.value || '';
            data.description = document.getElementById('asociaciones-join-text')?.value || '';
            data.buttons = {
                primary: document.getElementById('asociaciones-join-button-primary')?.value || '',
                primaryUrl: document.getElementById('asociaciones-join-url-primary')?.value || '',
                secondary: document.getElementById('asociaciones-join-button-secondary')?.value || '',
                secondaryUrl: document.getElementById('asociaciones-join-url-secondary')?.value || ''
            };
            break;

        case 'asociaciones-benefits':
            data.benefits = [];
            const benefitItems = document.querySelectorAll('.benefits-list-cms .benefit-item-cms');
            benefitItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 3) {
                    data.benefits.push({
                        icon: inputs[0].value,
                        title: inputs[1].value,
                        description: inputs[2].value
                    });
                }
            });
            break;

        case 'asociaciones-cta':
            data.title = document.getElementById('asociaciones-cta-title')?.value || '';
            data.description = document.getElementById('asociaciones-cta-description')?.value || '';
            data.buttons = {
                primary: document.getElementById('asociaciones-cta-button-primary')?.value || '',
                primaryUrl: document.getElementById('asociaciones-cta-url-primary')?.value || '',
                secondary: document.getElementById('asociaciones-cta-button-secondary')?.value || '',
                secondaryUrl: document.getElementById('asociaciones-cta-url-secondary')?.value || ''
            };
            break;

        case 'asociaciones-statutes':
            data.title = document.getElementById('asociaciones-statutes-title')?.value || '';
            data.description = document.getElementById('asociaciones-statutes-description')?.value || '';
            data.features = [
                document.getElementById('asociaciones-statutes-feature1')?.value || '',
                document.getElementById('asociaciones-statutes-feature2')?.value || '',
                document.getElementById('asociaciones-statutes-feature3')?.value || ''
            ];
            break;
            
        case 'areas-header':
            data.title = document.getElementById('areas-title')?.value || '';
            data.description = document.getElementById('areas-description')?.value || '';
            break;
            
        case 'areas-list':
            data.sectionTitle = document.getElementById('areas-intro-title')?.value || '';
            data.subtitle = document.getElementById('areas-intro-subtitle')?.value || '';
            data.areas = [];
            
            const areaItems = document.querySelectorAll('.area-item-cms');
            areaItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 3) {
                    data.areas.push({
                        icon: inputs[0].value,
                        title: inputs[1].value,
                        description: inputs[2].value
                    });
                }
            });
            break;
            
        case 'manifiesto-header':
            data.title = document.getElementById('manifiesto-title')?.value || '';
            data.description = document.getElementById('manifiesto-description')?.value || '';
            break;
            
        case 'manifiesto-content':
            data.sectionTitle = document.getElementById('manifiesto-intro-title')?.value || '';
            data.introText = document.getElementById('manifiesto-intro-text')?.value || '';
            data.principles = [];
            
            const principleItems = document.querySelectorAll('.principle-item-cms');
            principleItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 2) {
                    data.principles.push({
                        title: inputs[0].value,
                        description: inputs[1].value
                    });
                }
            });
            break;
            
        case 'prensa-header':
            data.title = document.getElementById('prensa-title')?.value || '';
            data.description = document.getElementById('prensa-description')?.value || '';
            break;
            
        case 'prensa-content':
            data.sectionTitle = document.getElementById('prensa-intro-title')?.value || '';
            data.introText = document.getElementById('prensa-intro-text')?.value || '';
            data.contactInfo = {};
            data.pressReleases = [];
            
            // Contact info
            const pressContactItems = document.querySelectorAll('.press-contact-cms .cms-input');
            pressContactItems.forEach((input, index) => {
                const labels = ['email', 'phone', 'hours'];
                if (input.value.trim()) {
                    data.contactInfo[labels[index]] = input.value.trim();
                }
            });
            
            // Press releases
            const pressReleaseItems = document.querySelectorAll('.press-release-item-cms');
            pressReleaseItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input, .cms-textarea');
                if (inputs.length >= 4) {
                    data.pressReleases.push({
                        date: inputs[0].value,
                        title: inputs[1].value,
                        summary: inputs[2].value,
                        pdfUrl: inputs[3].value
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
async function saveSectionData(sectionName, data) {
    try {
        // Intentar guardar en el servidor primero
        const response = await fetch(CMS_CONFIG.apiUrls.save, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                section: sectionName,
                data: data,
                user: getCurrentUser()
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Datos guardados en servidor:', result);
            
            // Actualizar localStorage con los datos del servidor
            const currentData = JSON.parse(localStorage.getItem('fantea_cms_data') || '{}');
            currentData[sectionName] = {
                ...data,
                lastModified: new Date().toISOString(),
                modifiedBy: getCurrentUser()
            };
            localStorage.setItem('fantea_cms_data', JSON.stringify(currentData));
            
            // Notificar a todas las pestañas abiertas
            notifyAllTabs(sectionName, data);
            
            return true;
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Error del servidor: ${response.status} - ${errorData.error || 'Error desconocido'}`);
        }
    } catch (error) {
        console.warn('Error guardando en servidor, usando localStorage como fallback:', error);
        
        // Fallback a localStorage
        const currentData = JSON.parse(localStorage.getItem('fantea_cms_data') || '{}');
        currentData[sectionName] = {
            ...data,
            lastModified: new Date().toISOString(),
            modifiedBy: getCurrentUser()
        };
        localStorage.setItem('fantea_cms_data', JSON.stringify(currentData));
        
        return false;
    }
}

// Notificar a todas las pestañas abiertas
function notifyAllTabs(sectionName, data) {
    // BroadcastChannel para comunicación entre pestañas
    if (typeof BroadcastChannel !== 'undefined') {
        try {
            const channel = new BroadcastChannel('fantea-cms');
            channel.postMessage({
                type: 'CMS_UPDATE',
                section: sectionName,
                data: data,
                timestamp: Date.now()
            });
            channel.close();
        } catch (e) {
            console.log('BroadcastChannel no disponible:', e);
        }
    }

    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('cms-data-updated', {
        detail: { section: sectionName, data: data }
    }));
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
            if (data.buttons) {
                if (data.buttons.about) document.getElementById('hero-button-about').value = data.buttons.about;
                if (data.buttons.affiliate) document.getElementById('hero-button-affiliate').value = data.buttons.affiliate;
                if (data.buttons.donate) document.getElementById('hero-button-donate').value = data.buttons.donate;
            }
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
                        if (inputs[3]) inputs[3].value = feature.linkText || '';
                    }
                });
            }
            break;
            
        case 'cta':
            if (data.title) document.getElementById('cta-title').value = data.title;
            if (data.description) document.getElementById('cta-description').value = data.description;
            if (data.buttons) {
                if (data.buttons.primary) document.getElementById('cta-button-primary').value = data.buttons.primary;
                if (data.buttons.secondary) document.getElementById('cta-button-secondary').value = data.buttons.secondary;
            }
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
            
        // New sections loading for updated pages
        case 'quienes-somos-header':
            if (data.title) document.getElementById('quienes-somos-header-title').value = data.title;
            if (data.subtitle) document.getElementById('quienes-somos-header-subtitle').value = data.subtitle;
            if (data.image) document.getElementById('quienes-somos-header-image-preview').src = data.image;
            if (data.buttons) {
                if (data.buttons.mision) document.getElementById('quienes-somos-button-mision').value = data.buttons.mision;
                if (data.buttons.valores) document.getElementById('quienes-somos-button-valores').value = data.buttons.valores;
            }
            break;
            
        case 'quienes-somos-stats':
            if (data.stats) {
                const quienesSomosStatItems = document.querySelectorAll('.stat-item-cms');
                data.stats.forEach((stat, index) => {
                    if (quienesSomosStatItems[index]) {
                        const inputs = quienesSomosStatItems[index].querySelectorAll('.cms-input');
                        if (inputs[0]) inputs[0].value = stat.number;
                        if (inputs[1]) inputs[1].value = stat.description;
                    }
                });
            }
            break;
            
        case 'quienes-somos-mision':
            if (data.title) document.getElementById('quienes-somos-mision-title').value = data.title;
            if (data.subtitle) document.getElementById('quienes-somos-mision-subtitle').value = data.subtitle;
            
            if (data.cards) {
                const quienesSomosFeatureItems = document.querySelectorAll('.feature-item-cms');
                data.cards.forEach((card, index) => {
                    if (quienesSomosFeatureItems[index]) {
                        const inputs = quienesSomosFeatureItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = card.icon;
                        if (inputs[1]) inputs[1].value = card.title;
                        if (inputs[2]) inputs[2].value = card.description;
                        if (inputs[3]) inputs[3].value = card.highlight;
                    }
                });
            }
            break;
            
        case 'quienes-somos-valores':
            if (data.title) document.getElementById('quienes-somos-valores-title').value = data.title;
            if (data.subtitle) document.getElementById('quienes-somos-valores-subtitle').value = data.subtitle;
            
            if (data.values) {
                const quienesSomosValueItems = document.querySelectorAll('.value-item-cms');
                data.values.forEach((value, index) => {
                    if (quienesSomosValueItems[index]) {
                        const inputs = quienesSomosValueItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = value.icon;
                        if (inputs[1]) inputs[1].value = value.title;
                        if (inputs[2]) inputs[2].value = value.description;
                    }
                });
            }
            break;
            
        case 'quienes-somos-historia':
            if (data.title) document.getElementById('quienes-somos-historia-title').value = data.title;
            if (data.subtitle) document.getElementById('quienes-somos-historia-subtitle').value = data.subtitle;
            
            if (data.timeline) {
                const quienesSomosTimelineItems = document.querySelectorAll('.timeline-item-cms');
                data.timeline.forEach((item, index) => {
                    if (quienesSomosTimelineItems[index]) {
                        const inputs = quienesSomosTimelineItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = item.year;
                        if (inputs[1]) inputs[1].value = item.title;
                        if (inputs[2]) inputs[2].value = item.description;
                    }
                });
            }
            break;
            
        case 'quienes-somos-cta':
            if (data.title) document.getElementById('quienes-somos-cta-title').value = data.title;
            if (data.description) document.getElementById('quienes-somos-cta-description').value = data.description;
            
            if (data.buttons) {
                const ctaButtonItems = document.querySelectorAll('.cta-button-item-cms');
                data.buttons.forEach((button, index) => {
                    if (ctaButtonItems[index]) {
                        const inputs = ctaButtonItems[index].querySelectorAll('.cms-input, select');
                        if (inputs[0]) inputs[0].value = button.text;
                        if (inputs[1]) inputs[1].value = button.url;
                        if (inputs[2]) inputs[2].value = button.type;
                    }
                });
            }
            break;
            
        case 'asociaciones-header':
            if (data.title) document.getElementById('asociaciones-title').value = data.title;
            if (data.description) document.getElementById('asociaciones-description').value = data.description;
            if (data.image) document.getElementById('asociaciones-image-preview').src = data.image;
            if (data.buttons) {
                if (data.buttons.ver) document.getElementById('asociaciones-button-ver').value = data.buttons.ver;
                if (data.buttons.verUrl) document.getElementById('asociaciones-url-ver').value = data.buttons.verUrl;
                if (data.buttons.unirse) document.getElementById('asociaciones-button-unirse').value = data.buttons.unirse;
                if (data.buttons.unirseUrl) document.getElementById('asociaciones-url-unirse').value = data.buttons.unirseUrl;
                if (data.buttons.estatutos) document.getElementById('asociaciones-button-estatutos').value = data.buttons.estatutos;
                if (data.buttons.estatutosUrl) document.getElementById('asociaciones-url-estatutos').value = data.buttons.estatutosUrl;
            }
            break;
            
        case 'asociaciones-list':
            if (data.sectionTitle) document.getElementById('asociaciones-intro-title').value = data.sectionTitle;
            if (data.subtitle) document.getElementById('asociaciones-intro-subtitle').value = data.subtitle;
            if (data.introText) document.getElementById('asociaciones-intro-text').value = data.introText;
            
            if (data.associations) {
                const associationItems = document.querySelectorAll('.association-item-cms');
                data.associations.forEach((association, index) => {
                    if (associationItems[index]) {
                        const inputs = associationItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = association.name;
                        if (inputs[1]) inputs[1].value = association.province;
                        if (inputs[2]) inputs[2].value = association.description;
                        if (inputs[3]) inputs[3].value = association.website;
                    }
                });
            }
            break;

        case 'asociaciones-stats':
            if (data.stats) {
                const asociacionesStatsItems = document.querySelectorAll('.stats-grid-cms .stat-item-cms');
                data.stats.forEach((stat, index) => {
                    if (asociacionesStatsItems[index]) {
                        const inputs = asociacionesStatsItems[index].querySelectorAll('.cms-input');
                        if (inputs[0]) inputs[0].value = stat.number;
                        if (inputs[1]) inputs[1].value = stat.description;
                    }
                });
            }
            break;

        case 'asociaciones-join':
            if (data.title) document.getElementById('asociaciones-join-title').value = data.title;
            if (data.description) document.getElementById('asociaciones-join-text').value = data.description;
            if (data.buttons) {
                if (data.buttons.primary) document.getElementById('asociaciones-join-button-primary').value = data.buttons.primary;
                if (data.buttons.primaryUrl) document.getElementById('asociaciones-join-url-primary').value = data.buttons.primaryUrl;
                if (data.buttons.secondary) document.getElementById('asociaciones-join-button-secondary').value = data.buttons.secondary;
                if (data.buttons.secondaryUrl) document.getElementById('asociaciones-join-url-secondary').value = data.buttons.secondaryUrl;
            }
            break;

        case 'asociaciones-benefits':
            if (data.benefits) {
                const benefitItems = document.querySelectorAll('.benefits-list-cms .benefit-item-cms');
                data.benefits.forEach((benefit, index) => {
                    if (benefitItems[index]) {
                        const inputs = benefitItems[index].querySelectorAll('.cms-input');
                        if (inputs[0]) inputs[0].value = benefit.icon;
                        if (inputs[1]) inputs[1].value = benefit.title;
                        if (inputs[2]) inputs[2].value = benefit.description;
                    }
                });
            }
            break;

        case 'asociaciones-cta':
            if (data.title) document.getElementById('asociaciones-cta-title').value = data.title;
            if (data.description) document.getElementById('asociaciones-cta-description').value = data.description;
            if (data.buttons) {
                if (data.buttons.primary) document.getElementById('asociaciones-cta-button-primary').value = data.buttons.primary;
                if (data.buttons.primaryUrl) document.getElementById('asociaciones-cta-url-primary').value = data.buttons.primaryUrl;
                if (data.buttons.secondary) document.getElementById('asociaciones-cta-button-secondary').value = data.buttons.secondary;
                if (data.buttons.secondaryUrl) document.getElementById('asociaciones-cta-url-secondary').value = data.buttons.secondaryUrl;
            }
            break;

        case 'asociaciones-statutes':
            if (data.title) document.getElementById('asociaciones-statutes-title').value = data.title;
            if (data.description) document.getElementById('asociaciones-statutes-description').value = data.description;
            if (data.features) {
                if (data.features[0]) document.getElementById('asociaciones-statutes-feature1').value = data.features[0];
                if (data.features[1]) document.getElementById('asociaciones-statutes-feature2').value = data.features[1];
                if (data.features[2]) document.getElementById('asociaciones-statutes-feature3').value = data.features[2];
            }
            break;
            
        case 'areas-header':
            if (data.title) document.getElementById('areas-title').value = data.title;
            if (data.description) document.getElementById('areas-description').value = data.description;
            break;
            
        case 'areas-list':
            if (data.sectionTitle) document.getElementById('areas-intro-title').value = data.sectionTitle;
            if (data.subtitle) document.getElementById('areas-intro-subtitle').value = data.subtitle;
            
            if (data.areas) {
                const areaItems = document.querySelectorAll('.area-item-cms');
                data.areas.forEach((area, index) => {
                    if (areaItems[index]) {
                        const inputs = areaItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = area.icon;
                        if (inputs[1]) inputs[1].value = area.title;
                        if (inputs[2]) inputs[2].value = area.description;
                    }
                });
            }
            break;
            
        case 'manifiesto-header':
            if (data.title) document.getElementById('manifiesto-title').value = data.title;
            if (data.description) document.getElementById('manifiesto-description').value = data.description;
            break;
            
        case 'manifiesto-content':
            if (data.sectionTitle) document.getElementById('manifiesto-intro-title').value = data.sectionTitle;
            if (data.introText) document.getElementById('manifiesto-intro-text').value = data.introText;
            
            if (data.principles) {
                const principleItems = document.querySelectorAll('.principle-item-cms');
                data.principles.forEach((principle, index) => {
                    if (principleItems[index]) {
                        const inputs = principleItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = principle.title;
                        if (inputs[1]) inputs[1].value = principle.description;
                    }
                });
            }
            break;
            
        case 'prensa-header':
            if (data.title) document.getElementById('prensa-title').value = data.title;
            if (data.description) document.getElementById('prensa-description').value = data.description;
            break;
            
        case 'prensa-content':
            if (data.sectionTitle) document.getElementById('prensa-intro-title').value = data.sectionTitle;
            if (data.introText) document.getElementById('prensa-intro-text').value = data.introText;
            
            // Load contact info
            if (data.contactInfo) {
                const pressContactItems = document.querySelectorAll('.press-contact-cms .cms-input');
                const labels = ['email', 'phone', 'hours'];
                labels.forEach((label, index) => {
                    if (pressContactItems[index] && data.contactInfo[label]) {
                        pressContactItems[index].value = data.contactInfo[label];
                    }
                });
            }
            
            // Load press releases
            if (data.pressReleases) {
                const pressReleaseItems = document.querySelectorAll('.press-release-item-cms');
                data.pressReleases.forEach((release, index) => {
                    if (pressReleaseItems[index]) {
                        const inputs = pressReleaseItems[index].querySelectorAll('.cms-input, .cms-textarea');
                        if (inputs[0]) inputs[0].value = release.date;
                        if (inputs[1]) inputs[1].value = release.title;
                        if (inputs[2]) inputs[2].value = release.summary;
                        if (inputs[3]) inputs[3].value = release.pdfUrl;
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
        
        // Quiénes Somos page
        'quienes-somos-header': collectSectionData('quienes-somos-header'),
        'quienes-somos-stats': collectSectionData('quienes-somos-stats'),
        'quienes-somos-mision': collectSectionData('quienes-somos-mision'),
        'quienes-somos-valores': collectSectionData('quienes-somos-valores'),
        'quienes-somos-historia': collectSectionData('quienes-somos-historia'),
        'quienes-somos-cta': collectSectionData('quienes-somos-cta'),
        
        // Asociaciones page
        'asociaciones-header': collectSectionData('asociaciones-header'),
        'asociaciones-stats': collectSectionData('asociaciones-stats'),
        'asociaciones-list': collectSectionData('asociaciones-list'),
        'asociaciones-join': collectSectionData('asociaciones-join'),
        'asociaciones-benefits': collectSectionData('asociaciones-benefits'),
        'asociaciones-cta': collectSectionData('asociaciones-cta'),
        'asociaciones-statutes': collectSectionData('asociaciones-statutes'),
        
        // Areas page
        'areas-header': collectSectionData('areas-header'),
        'areas-list': collectSectionData('areas-list'),
        
        // Manifiesto page
        'manifiesto-header': collectSectionData('manifiesto-header'),
        'manifiesto-content': collectSectionData('manifiesto-content'),
        
        // Prensa page
        'prensa-header': collectSectionData('prensa-header'),
        'prensa-content': collectSectionData('prensa-content'),
        
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
 * Add association to asociaciones section
 */
function addAssociation() {
    const associationsContainer = document.querySelector('.associations-list-cms');
    if (!associationsContainer) return;
    
    const newAssociation = document.createElement('div');
    newAssociation.className = 'association-item-cms';
    
    const itemCount = document.querySelectorAll('.association-item-cms').length + 1;
    
    newAssociation.innerHTML = `
        <h4>Asociación ${itemCount}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="cms-input" placeholder="Nombre de la asociación">
            </div>
            <div class="form-group">
                <label>Provincia</label>
                <input type="text" class="cms-input" placeholder="Provincia">
            </div>
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea class="cms-textarea" rows="3" placeholder="Descripción de la asociación..."></textarea>
        </div>
        <div class="form-group">
            <label>Enlace Web</label>
            <input type="url" class="cms-input" placeholder="https://ejemplo.org">
        </div>
        <button class="btn-small btn-outline" onclick="removeAssociation(this)" style="margin-top: 10px;">
            <i class="fas fa-trash"></i>
            Eliminar
        </button>
    `;
    
    // Insert before the "Add" button
    const addButton = associationsContainer.querySelector('.btn-outline');
    associationsContainer.insertBefore(newAssociation, addButton);
}

/**
 * Remove association
 */
function removeAssociation(button) {
    if (confirm('¿Estás seguro de que quieres eliminar esta asociación?')) {
        button.closest('.association-item-cms').remove();
    }
}

/**
 * Add principle to manifiesto section
 */
function addPrinciple() {
    const principlesContainer = document.querySelector('.principles-list-cms');
    if (!principlesContainer) return;
    
    const newPrinciple = document.createElement('div');
    newPrinciple.className = 'principle-item-cms';
    
    const itemCount = document.querySelectorAll('.principle-item-cms').length + 1;
    
    newPrinciple.innerHTML = `
        <h4>Principio ${itemCount}</h4>
        <div class="form-group">
            <label>Título</label>
            <input type="text" class="cms-input" placeholder="Título del principio">
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea class="cms-textarea" rows="3" placeholder="Descripción del principio..."></textarea>
        </div>
        <button class="btn-small btn-outline" onclick="removePrinciple(this)" style="margin-top: 10px;">
            <i class="fas fa-trash"></i>
            Eliminar
        </button>
    `;
    
    // Insert before the "Add" button
    const addButton = principlesContainer.querySelector('.btn-outline');
    principlesContainer.insertBefore(newPrinciple, addButton);
}

/**
 * Remove principle
 */
function removePrinciple(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este principio?')) {
        button.closest('.principle-item-cms').remove();
    }
}

/**
 * Add press release to prensa section
 */
function addPressRelease() {
    const pressReleasesContainer = document.querySelector('.press-releases-cms');
    if (!pressReleasesContainer) return;
    
    const newPressRelease = document.createElement('div');
    newPressRelease.className = 'press-release-item-cms';
    
    const itemCount = document.querySelectorAll('.press-release-item-cms').length + 1;
    
    newPressRelease.innerHTML = `
        <h4>Comunicado ${itemCount}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Fecha</label>
                <input type="date" class="cms-input" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Título</label>
                <input type="text" class="cms-input" placeholder="Título del comunicado">
            </div>
        </div>
        <div class="form-group">
            <label>Resumen</label>
            <textarea class="cms-textarea" rows="3" placeholder="Resumen del comunicado..."></textarea>
        </div>
        <div class="form-group">
            <label>Enlace al PDF</label>
            <input type="url" class="cms-input" placeholder="/comunicados/comunicado.pdf">
        </div>
        <button class="btn-small btn-outline" onclick="removePressRelease(this)" style="margin-top: 10px;">
            <i class="fas fa-trash"></i>
            Eliminar
        </button>
    `;
    
    // Insert before the "Add" button
    const addButton = pressReleasesContainer.querySelector('.btn-outline');
    pressReleasesContainer.insertBefore(newPressRelease, addButton);
}

/**
 * Remove press release
 */
function removePressRelease(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este comunicado?')) {
        button.closest('.press-release-item-cms').remove();
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
window.addAssociation = addAssociation;
window.removeAssociation = removeAssociation;
window.addPrinciple = addPrinciple;
window.removePrinciple = removePrinciple;
window.addPressRelease = addPressRelease;
window.removePressRelease = removePressRelease;
window.addCategory = addCategory;
window.removeCategory = removeCategory; 