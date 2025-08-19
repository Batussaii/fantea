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
async function loadDashboardData() {
    try {
        // Mostrar loading
        const statCards = document.querySelectorAll('.stat-card h3');
        statCards.forEach(card => {
            card.textContent = '...';
        });
        
        // Obtener datos reales de la API
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Error obteniendo estadísticas');
        }
        
        const stats = result.data;
        
        // Actualizar estadísticas con animación
        animateStats(stats);
        
        // Cargar actividad reciente
        loadRecentActivity();
        
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        
        // Fallback a datos demo si hay error
        const fallbackStats = {
            news: { current: 0, change: 0 },
            events: { current: 0, change: 0 },
            associations: { current: 0, change: 0 },
            downloads: { current: 0, change: 0 }
        };
        
        animateStats(fallbackStats);
        
        // Mostrar notificación de error
        showNotification('Error cargando estadísticas. Mostrando datos demo.', 'warning');
    }
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
async function loadRecentActivity() {
    try {
        // Obtener historial de descargas real
        const response = await fetch('/api/dashboard/downloads/history');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Error obteniendo historial');
        }
        
        const downloadHistory = result.data;
        
        // Crear actividades basadas en descargas reales
        const activities = downloadHistory.slice(0, 4).map(download => {
            const downloadDate = new Date(download.timestamp);
            const timeAgo = getTimeAgo(downloadDate);
            
            return {
                type: 'document',
                icon: 'fas fa-download',
                title: `Descarga de Estatutos: ${download.filename}`,
                time: timeAgo
            };
        });
        
        // Si no hay descargas recientes, mostrar actividades demo
        if (activities.length === 0) {
            activities.push(
                {
                    type: 'info',
                    icon: 'fas fa-info-circle',
                    title: 'Sistema de estadísticas activado',
                    time: 'Recién'
                }
            );
        }
        
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
        
    } catch (error) {
        console.error('Error cargando actividad reciente:', error);
        
        // Fallback a actividades demo
        const activities = [
            {
                type: 'info',
                icon: 'fas fa-info-circle',
                title: 'Sistema de estadísticas en desarrollo',
                time: 'Recién'
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
}

/**
 * Función auxiliar para calcular tiempo transcurrido
 */
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
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
async function openNewsEditor() {
    try {
        // Registrar la creación de noticia
        const response = await fetch('/api/dashboard/record/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Actualizar dashboard con nuevos datos
            loadDashboardData();
            showNotification('Noticia registrada en estadísticas', 'success');
        }
    } catch (error) {
        console.error('Error registrando noticia:', error);
    }
    
    alert('Editor de noticias - Funcionalidad en desarrollo');
    // Implementar modal del editor de noticias
}

/**
 * Abrir editor de eventos
 */
async function openEventEditor() {
    try {
        // Registrar la creación de evento
        const response = await fetch('/api/dashboard/record/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Actualizar dashboard con nuevos datos
            loadDashboardData();
            showNotification('Evento registrado en estadísticas', 'success');
        }
    } catch (error) {
        console.error('Error registrando evento:', error);
    }
    
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
    
    // Verificar y actualizar contadores mensuales al cargar la página
    updateMonthlyCounters();
}

/**
 * Actualizar contadores mensuales
 */
async function updateMonthlyCounters() {
    try {
        const response = await fetch('/api/dashboard/update-monthly', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                console.log('Contadores mensuales actualizados');
            }
        }
    } catch (error) {
        console.error('Error actualizando contadores mensuales:', error);
    }
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
            data.title = document.getElementById('areas-header-title')?.value || '';
            data.description = document.getElementById('areas-header-description')?.value || '';
            data.image = document.getElementById('areas-header-image-preview')?.src || '';
            data.buttons = [
                {
                    text: document.getElementById('areas-header-button-ver')?.value || '',
                    url: document.getElementById('areas-header-url-ver')?.value || ''
                },
                {
                    text: document.getElementById('areas-header-button-manifiesto')?.value || '',
                    url: document.getElementById('areas-header-url-manifiesto')?.value || ''
                }
            ];
            break;
            
        case 'areas-stats':
            data.items = [
                {
                    number: document.getElementById('areas-stats-number1')?.value || '',
                    description: document.getElementById('areas-stats-description1')?.value || ''
                },
                {
                    number: document.getElementById('areas-stats-number2')?.value || '',
                    description: document.getElementById('areas-stats-description2')?.value || ''
                },
                {
                    number: document.getElementById('areas-stats-number3')?.value || '',
                    description: document.getElementById('areas-stats-description3')?.value || ''
                },
                {
                    number: document.getElementById('areas-stats-number4')?.value || '',
                    description: document.getElementById('areas-stats-description4')?.value || ''
                }
            ];
            break;
            
        case 'areas-list':
            data.title = document.getElementById('areas-list-title')?.value || '';
            data.subtitle = document.getElementById('areas-list-subtitle')?.value || '';
            data.areas = [
                {
                    title: document.getElementById('areas-list-area1-title')?.value || '',
                    emoji: document.getElementById('areas-list-area1-emoji')?.value || '',
                    description: document.getElementById('areas-list-area1-description')?.value || '',
                    features: [
                        document.getElementById('areas-list-area1-feature1')?.value || '',
                        document.getElementById('areas-list-area1-feature2')?.value || '',
                        document.getElementById('areas-list-area1-feature3')?.value || ''
                    ]
                },
                {
                    title: document.getElementById('areas-list-area2-title')?.value || '',
                    emoji: document.getElementById('areas-list-area2-emoji')?.value || '',
                    description: document.getElementById('areas-list-area2-description')?.value || '',
                    features: [
                        document.getElementById('areas-list-area2-feature1')?.value || '',
                        document.getElementById('areas-list-area2-feature2')?.value || '',
                        document.getElementById('areas-list-area2-feature3')?.value || ''
                    ]
                },
                {
                    title: document.getElementById('areas-list-area3-title')?.value || '',
                    emoji: document.getElementById('areas-list-area3-emoji')?.value || '',
                    description: document.getElementById('areas-list-area3-description')?.value || '',
                    features: [
                        document.getElementById('areas-list-area3-feature1')?.value || '',
                        document.getElementById('areas-list-area3-feature2')?.value || '',
                        document.getElementById('areas-list-area3-feature3')?.value || ''
                    ]
                },
                {
                    title: document.getElementById('areas-list-area4-title')?.value || '',
                    emoji: document.getElementById('areas-list-area4-emoji')?.value || '',
                    description: document.getElementById('areas-list-area4-description')?.value || '',
                    features: [
                        document.getElementById('areas-list-area4-feature1')?.value || '',
                        document.getElementById('areas-list-area4-feature2')?.value || '',
                        document.getElementById('areas-list-area4-feature3')?.value || ''
                    ]
                },
                {
                    title: document.getElementById('areas-list-area5-title')?.value || '',
                    emoji: document.getElementById('areas-list-area5-emoji')?.value || '',
                    description: document.getElementById('areas-list-area5-description')?.value || '',
                    features: [
                        document.getElementById('areas-list-area5-feature1')?.value || '',
                        document.getElementById('areas-list-area5-feature2')?.value || '',
                        document.getElementById('areas-list-area5-feature3')?.value || ''
                    ]
                }
            ];
            break;
            
        case 'areas-impact':
            data.title = document.getElementById('areas-impact-title')?.value || '';
            data.description = document.getElementById('areas-impact-description')?.value || '';
            data.image = document.getElementById('areas-impact-image-preview')?.src || '';
            data.stats = [
                {
                    percentage: document.getElementById('areas-impact-percentage1')?.value || '',
                    description: document.getElementById('areas-impact-description1')?.value || ''
                },
                {
                    percentage: document.getElementById('areas-impact-percentage2')?.value || '',
                    description: document.getElementById('areas-impact-description2')?.value || ''
                },
                {
                    percentage: document.getElementById('areas-impact-percentage3')?.value || '',
                    description: document.getElementById('areas-impact-description3')?.value || ''
                }
            ];
            break;
            
        case 'areas-cta':
            data.title = document.getElementById('areas-cta-title')?.value || '';
            data.description = document.getElementById('areas-cta-description')?.value || '';
            data.buttons = [
                {
                    text: document.getElementById('areas-cta-button-manifiesto')?.value || '',
                    url: document.getElementById('areas-cta-url-manifiesto')?.value || ''
                },
                {
                    text: document.getElementById('areas-cta-button-contactar')?.value || '',
                    url: document.getElementById('areas-cta-url-contactar')?.value || ''
                }
            ];
            break;
            
        case 'manifiesto-header':
            data.title = document.getElementById('manifiesto-header-title')?.value || '';
            data.description = document.getElementById('manifiesto-header-description')?.value || '';
            data.image = document.getElementById('manifiesto-header-image-preview')?.src || '';
            data.buttons = [
                {
                    text: document.getElementById('manifiesto-header-button-compromisos')?.value || '',
                    url: document.getElementById('manifiesto-header-url-compromisos')?.value || ''
                }
            ];
            break;
            
        case 'manifiesto-stats':
            data.items = [
                {
                    number: document.getElementById('manifiesto-stats-number1')?.value || '',
                    description: document.getElementById('manifiesto-stats-description1')?.value || ''
                },
                {
                    number: document.getElementById('manifiesto-stats-number2')?.value || '',
                    description: document.getElementById('manifiesto-stats-description2')?.value || ''
                },
                {
                    number: document.getElementById('manifiesto-stats-number3')?.value || '',
                    description: document.getElementById('manifiesto-stats-description3')?.value || ''
                },
                {
                    number: document.getElementById('manifiesto-stats-number4')?.value || '',
                    description: document.getElementById('manifiesto-stats-description4')?.value || ''
                }
            ];
            break;
            
        case 'manifiesto-commitments':
            data.title = document.getElementById('manifiesto-commitments-title')?.value || '';
            data.subtitle = document.getElementById('manifiesto-commitments-subtitle')?.value || '';
            data.commitments = [
                {
                    title: document.getElementById('manifiesto-commitments-commitment1-title')?.value || '',
                    description: document.getElementById('manifiesto-commitments-commitment1-description')?.value || '',
                    icon: document.getElementById('manifiesto-commitments-commitment1-icon')?.value || ''
                },
                {
                    title: document.getElementById('manifiesto-commitments-commitment2-title')?.value || '',
                    description: document.getElementById('manifiesto-commitments-commitment2-description')?.value || '',
                    icon: document.getElementById('manifiesto-commitments-commitment2-icon')?.value || ''
                },
                {
                    title: document.getElementById('manifiesto-commitments-commitment3-title')?.value || '',
                    description: document.getElementById('manifiesto-commitments-commitment3-description')?.value || '',
                    icon: document.getElementById('manifiesto-commitments-commitment3-icon')?.value || ''
                },
                {
                    title: document.getElementById('manifiesto-commitments-commitment4-title')?.value || '',
                    description: document.getElementById('manifiesto-commitments-commitment4-description')?.value || '',
                    icon: document.getElementById('manifiesto-commitments-commitment4-icon')?.value || ''
                },
                {
                    title: document.getElementById('manifiesto-commitments-commitment5-title')?.value || '',
                    description: document.getElementById('manifiesto-commitments-commitment5-description')?.value || '',
                    icon: document.getElementById('manifiesto-commitments-commitment5-icon')?.value || ''
                }
            ];
            break;
            
        case 'manifiesto-values':
            data.title = document.getElementById('manifiesto-values-title')?.value || '';
            data.subtitle = document.getElementById('manifiesto-values-subtitle')?.value || '';
            data.values = [
                {
                    title: document.getElementById('manifiesto-values-value1-title')?.value || '',
                    description: document.getElementById('manifiesto-values-value1-description')?.value || '',
                    icon: document.getElementById('manifiesto-values-value1-icon')?.value || ''
                },
                {
                    title: document.getElementById('manifiesto-values-value2-title')?.value || '',
                    description: document.getElementById('manifiesto-values-value2-description')?.value || '',
                    icon: document.getElementById('manifiesto-values-value2-icon')?.value || ''
                },
                {
                    title: document.getElementById('manifiesto-values-value3-title')?.value || '',
                    description: document.getElementById('manifiesto-values-value3-description')?.value || '',
                    icon: document.getElementById('manifiesto-values-value3-icon')?.value || ''
                },
                {
                    title: document.getElementById('manifiesto-values-value4-title')?.value || '',
                    description: document.getElementById('manifiesto-values-value4-description')?.value || '',
                    icon: document.getElementById('manifiesto-values-value4-icon')?.value || ''
                }
            ];
            break;
            
        case 'manifiesto-cta':
            data.title = document.getElementById('manifiesto-cta-title')?.value || '';
            data.description = document.getElementById('manifiesto-cta-description')?.value || '';
            data.buttons = [
                {
                    text: document.getElementById('manifiesto-cta-button-unirse')?.value || '',
                    url: document.getElementById('manifiesto-cta-url-unirse')?.value || ''
                },
                {
                    text: document.getElementById('manifiesto-cta-button-contactar')?.value || '',
                    url: document.getElementById('manifiesto-cta-url-contactar')?.value || ''
                }
            ];
            break;
            
        case 'prensa-header':
            data.title = document.getElementById('prensa-header-title')?.value || '';
            data.description = document.getElementById('prensa-header-description')?.value || '';
            data.image = document.getElementById('prensa-header-image-preview')?.src || '';
            data.buttons = [
                {
                    text: document.getElementById('prensa-header-button-noticias')?.value || '',
                    url: document.getElementById('prensa-header-url-noticias')?.value || ''
                },
                {
                    text: document.getElementById('prensa-header-button-recursos')?.value || '',
                    url: document.getElementById('prensa-header-url-recursos')?.value || ''
                }
            ];
            break;
            
        case 'prensa-stats':
            data.items = [
                {
                    number: document.getElementById('prensa-stats-number1')?.value || '',
                    description: document.getElementById('prensa-stats-description1')?.value || ''
                },
                {
                    number: document.getElementById('prensa-stats-number2')?.value || '',
                    description: document.getElementById('prensa-stats-description2')?.value || ''
                },
                {
                    number: document.getElementById('prensa-stats-number3')?.value || '',
                    description: document.getElementById('prensa-stats-description3')?.value || ''
                },
                {
                    number: document.getElementById('prensa-stats-number4')?.value || '',
                    description: document.getElementById('prensa-stats-description4')?.value || ''
                }
            ];
            break;
            
        case 'prensa-items':
            data.articles = [
                {
                    image: document.getElementById('prensa-items-article1-image-preview')?.src || '',
                    category: document.getElementById('prensa-items-article1-category')?.value || '',
                    date: document.getElementById('prensa-items-article1-date')?.value || '',
                    type: document.getElementById('prensa-items-article1-type')?.value || '',
                    typeIcon: document.getElementById('prensa-items-article1-typeIcon')?.value || '',
                    title: document.getElementById('prensa-items-article1-title')?.value || '',
                    description: document.getElementById('prensa-items-article1-description')?.value || '',
                    linkText: document.getElementById('prensa-items-article1-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-items-article1-linkUrl')?.value || ''
                },
                {
                    image: document.getElementById('prensa-items-article2-image-preview')?.src || '',
                    category: document.getElementById('prensa-items-article2-category')?.value || '',
                    date: document.getElementById('prensa-items-article2-date')?.value || '',
                    type: document.getElementById('prensa-items-article2-type')?.value || '',
                    typeIcon: document.getElementById('prensa-items-article2-typeIcon')?.value || '',
                    title: document.getElementById('prensa-items-article2-title')?.value || '',
                    description: document.getElementById('prensa-items-article2-description')?.value || '',
                    linkText: document.getElementById('prensa-items-article2-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-items-article2-linkUrl')?.value || ''
                },
                {
                    image: document.getElementById('prensa-items-article3-image-preview')?.src || '',
                    category: document.getElementById('prensa-items-article3-category')?.value || '',
                    date: document.getElementById('prensa-items-article3-date')?.value || '',
                    type: document.getElementById('prensa-items-article3-type')?.value || '',
                    typeIcon: document.getElementById('prensa-items-article3-typeIcon')?.value || '',
                    title: document.getElementById('prensa-items-article3-title')?.value || '',
                    description: document.getElementById('prensa-items-article3-description')?.value || '',
                    linkText: document.getElementById('prensa-items-article3-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-items-article3-linkUrl')?.value || ''
                },
                {
                    image: document.getElementById('prensa-items-article4-image-preview')?.src || '',
                    category: document.getElementById('prensa-items-article4-category')?.value || '',
                    date: document.getElementById('prensa-items-article4-date')?.value || '',
                    type: document.getElementById('prensa-items-article4-type')?.value || '',
                    typeIcon: document.getElementById('prensa-items-article4-typeIcon')?.value || '',
                    title: document.getElementById('prensa-items-article4-title')?.value || '',
                    description: document.getElementById('prensa-items-article4-description')?.value || '',
                    linkText: document.getElementById('prensa-items-article4-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-items-article4-linkUrl')?.value || ''
                },
                {
                    image: document.getElementById('prensa-items-article5-image-preview')?.src || '',
                    category: document.getElementById('prensa-items-article5-category')?.value || '',
                    date: document.getElementById('prensa-items-article5-date')?.value || '',
                    type: document.getElementById('prensa-items-article5-type')?.value || '',
                    typeIcon: document.getElementById('prensa-items-article5-typeIcon')?.value || '',
                    title: document.getElementById('prensa-items-article5-title')?.value || '',
                    description: document.getElementById('prensa-items-article5-description')?.value || '',
                    linkText: document.getElementById('prensa-items-article5-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-items-article5-linkUrl')?.value || ''
                },
                {
                    image: document.getElementById('prensa-items-article6-image-preview')?.src || '',
                    category: document.getElementById('prensa-items-article6-category')?.value || '',
                    date: document.getElementById('prensa-items-article6-date')?.value || '',
                    type: document.getElementById('prensa-items-article6-type')?.value || '',
                    typeIcon: document.getElementById('prensa-items-article6-typeIcon')?.value || '',
                    title: document.getElementById('prensa-items-article6-title')?.value || '',
                    description: document.getElementById('prensa-items-article6-description')?.value || '',
                    linkText: document.getElementById('prensa-items-article6-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-items-article6-linkUrl')?.value || ''
                }
            ];
            break;
            
        case 'prensa-resources':
            data.title = document.getElementById('prensa-resources-title')?.value || '';
            data.subtitle = document.getElementById('prensa-resources-subtitle')?.value || '';
            data.resources = [
                {
                    icon: document.getElementById('prensa-resources-resource1-icon')?.value || '',
                    title: document.getElementById('prensa-resources-resource1-title')?.value || '',
                    description: document.getElementById('prensa-resources-resource1-description')?.value || '',
                    linkText: document.getElementById('prensa-resources-resource1-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-resources-resource1-linkUrl')?.value || ''
                },
                {
                    icon: document.getElementById('prensa-resources-resource2-icon')?.value || '',
                    title: document.getElementById('prensa-resources-resource2-title')?.value || '',
                    description: document.getElementById('prensa-resources-resource2-description')?.value || '',
                    linkText: document.getElementById('prensa-resources-resource2-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-resources-resource2-linkUrl')?.value || ''
                },
                {
                    icon: document.getElementById('prensa-resources-resource3-icon')?.value || '',
                    title: document.getElementById('prensa-resources-resource3-title')?.value || '',
                    description: document.getElementById('prensa-resources-resource3-description')?.value || '',
                    linkText: document.getElementById('prensa-resources-resource3-linkText')?.value || '',
                    linkUrl: document.getElementById('prensa-resources-resource3-linkUrl')?.value || ''
                }
            ];
            break;
            
        case 'prensa-contact':
            data.title = document.getElementById('prensa-contact-title')?.value || '';
            data.description = document.getElementById('prensa-contact-description')?.value || '';
            data.contactInfo = {
                email: document.getElementById('prensa-contact-email')?.value || '',
                phone: document.getElementById('prensa-contact-phone')?.value || '',
                hours: document.getElementById('prensa-contact-hours')?.value || ''
            };
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
            
        case 'contacto-apoyo':
            data.title = document.getElementById('contacto-apoyo-title')?.value || '';
            data.number = document.getElementById('contacto-apoyo-number')?.value || '';
            data.description = document.getElementById('contacto-apoyo-description')?.value || '';
            break;
            
        case 'contacto-horarios':
            data.title = document.getElementById('contacto-horarios-title')?.value || '';
            data.note = document.getElementById('contacto-horarios-note')?.value || '';
            data.schedules = [];
            const horarioItems = document.querySelectorAll('#horarios-list-cms .horario-item-cms');
            horarioItems.forEach(item => {
                const day = item.querySelector('.horario-day-cms')?.value || '';
                const time = item.querySelector('.horario-time-cms')?.value || '';
                if (day.trim() && time.trim()) {
                    data.schedules.push({ day: day.trim(), time: time.trim() });
                }
            });
            break;
            
        case 'contacto-ubicacion':
            data.title = document.getElementById('contacto-ubicacion-title')?.value || '';
            data.description = document.getElementById('contacto-ubicacion-description')?.value || '';
            break;
            
        case 'contacto-transporte':
            data.title = document.getElementById('contacto-transporte-title')?.value || '';
            data.metro = {
                title: document.getElementById('contacto-transporte-metro-title')?.value || '',
                description: document.getElementById('contacto-transporte-metro-description')?.value || ''
            };
            data.bus = {
                title: document.getElementById('contacto-transporte-bus-title')?.value || '',
                description: document.getElementById('contacto-transporte-bus-description')?.value || ''
            };
            data.parking = {
                title: document.getElementById('contacto-transporte-parking-title')?.value || '',
                description: document.getElementById('contacto-transporte-parking-description')?.value || ''
            };
            break;
            
        case 'contacto-accesibilidad':
            data.title = document.getElementById('contacto-accesibilidad-title')?.value || '';
            data.features = [];
            const accesibilidadItems = document.querySelectorAll('#accesibilidad-list-cms .accesibilidad-feature-cms');
            accesibilidadItems.forEach(item => {
                if (item.value.trim()) {
                    data.features.push(item.value.trim());
                }
            });
            break;
            
        case 'contacto-faq':
            data.title = document.getElementById('contacto-faq-title')?.value || '';
            data.description = document.getElementById('contacto-faq-description')?.value || '';
            data.questions = [];
            const faqItems = document.querySelectorAll('#faq-list-cms .faq-item-cms');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question-cms')?.value || '';
                const answer = item.querySelector('.faq-answer-cms')?.value || '';
                if (question.trim() && answer.trim()) {
                    data.questions.push({ question: question.trim(), answer: answer.trim() });
                }
            });
            break;
            
        // Nuevas secciones de Afiliate
        case 'afiliate-solicitud':
            data.title = document.getElementById('afiliate-solicitud-title')?.value || '';
            data.description = document.getElementById('afiliate-solicitud-description')?.value || '';
            break;
            
        case 'afiliate-beneficios':
            data.title = document.getElementById('afiliate-beneficios-title')?.value || '';
            data.items = [];
            const beneficioItems = document.querySelectorAll('#beneficios-list-cms .beneficio-item-cms');
            beneficioItems.forEach(item => {
                if (item.value.trim()) {
                    data.items.push(item.value.trim());
                }
            });
            break;
            
        case 'afiliate-requisitos':
            data.title = document.getElementById('afiliate-requisitos-title')?.value || '';
            data.items = [];
            const requisitoItems = document.querySelectorAll('#requisitos-list-cms .requisito-item-cms');
            requisitoItems.forEach(item => {
                if (item.value.trim()) {
                    data.items.push(item.value.trim());
                }
            });
            break;
            
        case 'afiliate-formulario':
            data.title = document.getElementById('afiliate-formulario-title')?.value || '';
            data.description = document.getElementById('afiliate-formulario-description')?.value || '';
            data.note = document.getElementById('afiliate-formulario-note')?.value || '';
            break;
            
        case 'afiliate-impacto':
            data.title = document.getElementById('afiliate-impacto-title')?.value || '';
            data.description = document.getElementById('afiliate-impacto-description')?.value || '';
            data.stats = {
                personasBeneficiadas: document.getElementById('afiliate-impacto-personas-numero')?.value || '',
                personasBeneficiadasText: document.getElementById('afiliate-impacto-personas-texto')?.value || '',
                asociacionesAfiliadas: document.getElementById('afiliate-impacto-asociaciones-numero')?.value || '',
                asociacionesAfiliadasText: document.getElementById('afiliate-impacto-asociaciones-texto')?.value || '',
                voluntariosActivos: document.getElementById('afiliate-impacto-voluntarios-numero')?.value || '',
                voluntariosActivosText: document.getElementById('afiliate-impacto-voluntarios-texto')?.value || '',
                familiasColaboradoras: document.getElementById('afiliate-impacto-familias-numero')?.value || '',
                familiasColaboradorasText: document.getElementById('afiliate-impacto-familias-texto')?.value || ''
            };
            break;
            
        case 'afiliate-testimonios':
            data.testimonios = [];
            const testimonioItems = document.querySelectorAll('#testimonios-list-cms .testimonio-item-cms');
            testimonioItems.forEach(item => {
                const testimonio = {
                    texto: item.querySelector('.testimonio-texto-cms')?.value || '',
                    nombre: item.querySelector('.testimonio-nombre-cms')?.value || '',
                    cargo: item.querySelector('.testimonio-cargo-cms')?.value || '',
                    imagen: item.querySelector('.testimonio-imagen-cms')?.value || ''
                };
                if (testimonio.texto.trim() || testimonio.nombre.trim()) {
                    data.testimonios.push(testimonio);
                }
            });
            break;
            
        case 'afiliate-donaciones':
            data.title = document.getElementById('afiliate-donaciones-title')?.value || '';
            data.description = document.getElementById('afiliate-donaciones-description')?.value || '';
            break;
            
        case 'afiliate-documentos':
            data.title = document.getElementById('afiliate-documentos-title')?.value || '';
            data.description = document.getElementById('afiliate-documentos-description')?.value || '';
            break;
            
        case 'afiliate-ayuda':
            data.title = document.getElementById('afiliate-ayuda-title')?.value || '';
            data.description = document.getElementById('afiliate-ayuda-description')?.value || '';
            break;
            
        // Footer sections
        case 'footer-logo':
            data.title = document.getElementById('footer-logo-title')?.value || '';
            data.description = document.getElementById('footer-logo-description')?.value || '';
            break;
            
        case 'footer-social':
            data.facebook = document.getElementById('footer-social-facebook')?.value || '';
            data.twitter = document.getElementById('footer-social-twitter')?.value || '';
            data.instagram = document.getElementById('footer-social-instagram')?.value || '';
            data.linkedin = document.getElementById('footer-social-linkedin')?.value || '';
            data.youtube = document.getElementById('footer-social-youtube')?.value || '';
            break;
            
        case 'footer-navigation':
            data.title = document.getElementById('footer-navigation-title')?.value || '';
            data.links = [];
            const navigationItems = document.querySelectorAll('#footer-navigation-links .navigation-link-item');
            navigationItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 2) {
                    data.links.push({
                        text: inputs[0].value,
                        url: inputs[1].value
                    });
                }
            });
            break;
            
        case 'footer-resources':
            data.title = document.getElementById('footer-resources-title')?.value || '';
            data.links = [];
            const resourceItems = document.querySelectorAll('#footer-resources-links .resource-link-item');
            resourceItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 2) {
                    data.links.push({
                        text: inputs[0].value,
                        url: inputs[1].value
                    });
                }
            });
            break;
            
        case 'footer-contact':
            data.title = document.getElementById('footer-contact-title')?.value || '';
            data.address = document.getElementById('footer-contact-address')?.value || '';
            data.phone = document.getElementById('footer-contact-phone')?.value || '';
            data.email = document.getElementById('footer-contact-email')?.value || '';
            data.buttonText = document.getElementById('footer-contact-button')?.value || '';
            break;
            
        case 'footer-bottom':
            data.copyright = document.getElementById('footer-bottom-copyright')?.value || '';
            data.links = [];
            const bottomItems = document.querySelectorAll('#footer-bottom-links .bottom-link-item');
            bottomItems.forEach(item => {
                const inputs = item.querySelectorAll('.cms-input');
                if (inputs.length >= 2) {
                    data.links.push({
                        text: inputs[0].value,
                        url: inputs[1].value
                    });
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
            if (data.title) document.getElementById('areas-header-title').value = data.title;
            if (data.description) document.getElementById('areas-header-description').value = data.description;
            if (data.image) document.getElementById('areas-header-image-preview').src = data.image;
            if (data.buttons) {
                if (data.buttons[0]) {
                    document.getElementById('areas-header-button-ver').value = data.buttons[0].text;
                    document.getElementById('areas-header-url-ver').value = data.buttons[0].url;
                }
                if (data.buttons[1]) {
                    document.getElementById('areas-header-button-manifiesto').value = data.buttons[1].text;
                    document.getElementById('areas-header-url-manifiesto').value = data.buttons[1].url;
                }
            }
            break;
            
        case 'areas-stats':
            if (data.items) {
                data.items.forEach((stat, index) => {
                    if (stat.number) document.getElementById(`areas-stats-number${index + 1}`).value = stat.number;
                    if (stat.description) document.getElementById(`areas-stats-description${index + 1}`).value = stat.description;
                });
            }
            break;
            
        case 'areas-list':
            if (data.title) document.getElementById('areas-list-title').value = data.title;
            if (data.subtitle) document.getElementById('areas-list-subtitle').value = data.subtitle;
            
            if (data.areas) {
                data.areas.forEach((area, index) => {
                    if (area.title) document.getElementById(`areas-list-area${index + 1}-title`).value = area.title;
                    if (area.emoji) document.getElementById(`areas-list-area${index + 1}-emoji`).value = area.emoji;
                    if (area.description) document.getElementById(`areas-list-area${index + 1}-description`).value = area.description;
                    if (area.features) {
                        area.features.forEach((feature, featureIndex) => {
                            if (feature) document.getElementById(`areas-list-area${index + 1}-feature${featureIndex + 1}`).value = feature;
                        });
                    }
                });
            }
            break;
            
        case 'areas-impact':
            if (data.title) document.getElementById('areas-impact-title').value = data.title;
            if (data.description) document.getElementById('areas-impact-description').value = data.description;
            if (data.image) document.getElementById('areas-impact-image-preview').src = data.image;
            
            if (data.stats) {
                data.stats.forEach((stat, index) => {
                    if (stat.percentage) document.getElementById(`areas-impact-percentage${index + 1}`).value = stat.percentage;
                    if (stat.description) document.getElementById(`areas-impact-description${index + 1}`).value = stat.description;
                });
            }
            break;
            
        case 'areas-cta':
            if (data.title) document.getElementById('areas-cta-title').value = data.title;
            if (data.description) document.getElementById('areas-cta-description').value = data.description;
            if (data.buttons) {
                if (data.buttons[0]) {
                    document.getElementById('areas-cta-button-manifiesto').value = data.buttons[0].text;
                    document.getElementById('areas-cta-url-manifiesto').value = data.buttons[0].url;
                }
                if (data.buttons[1]) {
                    document.getElementById('areas-cta-button-contactar').value = data.buttons[1].text;
                    document.getElementById('areas-cta-url-contactar').value = data.buttons[1].url;
                }
            }
            break;
            
        case 'manifiesto-header':
            if (data.title) document.getElementById('manifiesto-header-title').value = data.title;
            if (data.description) document.getElementById('manifiesto-header-description').value = data.description;
            if (data.image) document.getElementById('manifiesto-header-image-preview').src = data.image;
            if (data.buttons) {
                if (data.buttons[0]) {
                    document.getElementById('manifiesto-header-button-compromisos').value = data.buttons[0].text;
                    document.getElementById('manifiesto-header-url-compromisos').value = data.buttons[0].url;
                }
            }
            break;
            
        case 'manifiesto-stats':
            if (data.items) {
                data.items.forEach((stat, index) => {
                    if (stat.number) document.getElementById(`manifiesto-stats-number${index + 1}`).value = stat.number;
                    if (stat.description) document.getElementById(`manifiesto-stats-description${index + 1}`).value = stat.description;
                });
            }
            break;
            
        case 'manifiesto-commitments':
            if (data.title) document.getElementById('manifiesto-commitments-title').value = data.title;
            if (data.subtitle) document.getElementById('manifiesto-commitments-subtitle').value = data.subtitle;
            
            if (data.commitments) {
                data.commitments.forEach((commitment, index) => {
                    if (commitment.title) document.getElementById(`manifiesto-commitments-commitment${index + 1}-title`).value = commitment.title;
                    if (commitment.description) document.getElementById(`manifiesto-commitments-commitment${index + 1}-description`).value = commitment.description;
                    if (commitment.icon) document.getElementById(`manifiesto-commitments-commitment${index + 1}-icon`).value = commitment.icon;
                });
            }
            break;
            
        case 'manifiesto-values':
            if (data.title) document.getElementById('manifiesto-values-title').value = data.title;
            if (data.subtitle) document.getElementById('manifiesto-values-subtitle').value = data.subtitle;
            
            if (data.values) {
                data.values.forEach((value, index) => {
                    if (value.title) document.getElementById(`manifiesto-values-value${index + 1}-title`).value = value.title;
                    if (value.description) document.getElementById(`manifiesto-values-value${index + 1}-description`).value = value.description;
                    if (value.icon) document.getElementById(`manifiesto-values-value${index + 1}-icon`).value = value.icon;
                });
            }
            break;
            
        case 'manifiesto-cta':
            if (data.title) document.getElementById('manifiesto-cta-title').value = data.title;
            if (data.description) document.getElementById('manifiesto-cta-description').value = data.description;
            if (data.buttons) {
                if (data.buttons[0]) {
                    document.getElementById('manifiesto-cta-button-unirse').value = data.buttons[0].text;
                    document.getElementById('manifiesto-cta-url-unirse').value = data.buttons[0].url;
                }
                if (data.buttons[1]) {
                    document.getElementById('manifiesto-cta-button-contactar').value = data.buttons[1].text;
                    document.getElementById('manifiesto-cta-url-contactar').value = data.buttons[1].url;
                }
            }
            break;
            
        case 'prensa-header':
            if (data.title) document.getElementById('prensa-header-title').value = data.title;
            if (data.description) document.getElementById('prensa-header-description').value = data.description;
            if (data.image) document.getElementById('prensa-header-image-preview').src = data.image;
            if (data.buttons) {
                if (data.buttons[0]) {
                    document.getElementById('prensa-header-button-noticias').value = data.buttons[0].text;
                    document.getElementById('prensa-header-url-noticias').value = data.buttons[0].url;
                }
                if (data.buttons[1]) {
                    document.getElementById('prensa-header-button-recursos').value = data.buttons[1].text;
                    document.getElementById('prensa-header-url-recursos').value = data.buttons[1].url;
                }
            }
            break;
            
        case 'prensa-stats':
            if (data.items) {
                data.items.forEach((stat, index) => {
                    if (stat.number) document.getElementById(`prensa-stats-number${index + 1}`).value = stat.number;
                    if (stat.description) document.getElementById(`prensa-stats-description${index + 1}`).value = stat.description;
                });
            }
            break;
            
        case 'prensa-items':
            if (data.articles) {
                data.articles.forEach((article, index) => {
                    if (article.image) document.getElementById(`prensa-items-article${index + 1}-image-preview`).src = article.image;
                    if (article.category) document.getElementById(`prensa-items-article${index + 1}-category`).value = article.category;
                    if (article.date) document.getElementById(`prensa-items-article${index + 1}-date`).value = article.date;
                    if (article.type) document.getElementById(`prensa-items-article${index + 1}-type`).value = article.type;
                    if (article.typeIcon) document.getElementById(`prensa-items-article${index + 1}-typeIcon`).value = article.typeIcon;
                    if (article.title) document.getElementById(`prensa-items-article${index + 1}-title`).value = article.title;
                    if (article.description) document.getElementById(`prensa-items-article${index + 1}-description`).value = article.description;
                    if (article.linkText) document.getElementById(`prensa-items-article${index + 1}-linkText`).value = article.linkText;
                    if (article.linkUrl) document.getElementById(`prensa-items-article${index + 1}-linkUrl`).value = article.linkUrl;
                });
            }
            break;
            
        case 'prensa-resources':
            if (data.title) document.getElementById('prensa-resources-title').value = data.title;
            if (data.subtitle) document.getElementById('prensa-resources-subtitle').value = data.subtitle;
            
            if (data.resources) {
                data.resources.forEach((resource, index) => {
                    if (resource.icon) document.getElementById(`prensa-resources-resource${index + 1}-icon`).value = resource.icon;
                    if (resource.title) document.getElementById(`prensa-resources-resource${index + 1}-title`).value = resource.title;
                    if (resource.description) document.getElementById(`prensa-resources-resource${index + 1}-description`).value = resource.description;
                    if (resource.linkText) document.getElementById(`prensa-resources-resource${index + 1}-linkText`).value = resource.linkText;
                    if (resource.linkUrl) document.getElementById(`prensa-resources-resource${index + 1}-linkUrl`).value = resource.linkUrl;
                });
            }
            break;
            
        case 'prensa-contact':
            if (data.title) document.getElementById('prensa-contact-title').value = data.title;
            if (data.description) document.getElementById('prensa-contact-description').value = data.description;
            if (data.contactInfo) {
                if (data.contactInfo.email) document.getElementById('prensa-contact-email').value = data.contactInfo.email;
                if (data.contactInfo.phone) document.getElementById('prensa-contact-phone').value = data.contactInfo.phone;
                if (data.contactInfo.hours) document.getElementById('prensa-contact-hours').value = data.contactInfo.hours;
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
            
        case 'contacto-apoyo':
            if (data.title) document.getElementById('contacto-apoyo-title').value = data.title;
            if (data.number) document.getElementById('contacto-apoyo-number').value = data.number;
            if (data.description) document.getElementById('contacto-apoyo-description').value = data.description;
            break;
            
        case 'contacto-horarios':
            if (data.title) document.getElementById('contacto-horarios-title').value = data.title;
            if (data.note) document.getElementById('contacto-horarios-note').value = data.note;
            if (data.schedules && Array.isArray(data.schedules)) {
                populateHorarios(data.schedules);
            }
            break;
            
        case 'contacto-ubicacion':
            if (data.title) document.getElementById('contacto-ubicacion-title').value = data.title;
            if (data.description) document.getElementById('contacto-ubicacion-description').value = data.description;
            break;
            
        case 'contacto-transporte':
            if (data.title) document.getElementById('contacto-transporte-title').value = data.title;
            if (data.metro) {
                if (data.metro.title) document.getElementById('contacto-transporte-metro-title').value = data.metro.title;
                if (data.metro.description) document.getElementById('contacto-transporte-metro-description').value = data.metro.description;
            }
            if (data.bus) {
                if (data.bus.title) document.getElementById('contacto-transporte-bus-title').value = data.bus.title;
                if (data.bus.description) document.getElementById('contacto-transporte-bus-description').value = data.bus.description;
            }
            if (data.parking) {
                if (data.parking.title) document.getElementById('contacto-transporte-parking-title').value = data.parking.title;
                if (data.parking.description) document.getElementById('contacto-transporte-parking-description').value = data.parking.description;
            }
            break;
            
        case 'contacto-accesibilidad':
            if (data.title) document.getElementById('contacto-accesibilidad-title').value = data.title;
            if (data.features && Array.isArray(data.features)) {
                populateAccesibilidad(data.features);
            }
            break;
            
        case 'contacto-faq':
            if (data.title) document.getElementById('contacto-faq-title').value = data.title;
            if (data.description) document.getElementById('contacto-faq-description').value = data.description;
            if (data.questions && Array.isArray(data.questions)) {
                populateFAQ(data.questions);
            }
            break;
            
        // Footer sections
        case 'footer-logo':
            if (data.title) document.getElementById('footer-logo-title').value = data.title;
            if (data.description) document.getElementById('footer-logo-description').value = data.description;
            break;
            
        case 'footer-social':
            if (data.facebook) document.getElementById('footer-social-facebook').value = data.facebook;
            if (data.twitter) document.getElementById('footer-social-twitter').value = data.twitter;
            if (data.instagram) document.getElementById('footer-social-instagram').value = data.instagram;
            if (data.linkedin) document.getElementById('footer-social-linkedin').value = data.linkedin;
            if (data.youtube) document.getElementById('footer-social-youtube').value = data.youtube;
            break;
            
        case 'footer-navigation':
            if (data.title) document.getElementById('footer-navigation-title').value = data.title;
            if (data.links && Array.isArray(data.links)) {
                populateNavigationLinks(data.links);
            }
            break;
            
        case 'footer-resources':
            if (data.title) document.getElementById('footer-resources-title').value = data.title;
            if (data.links && Array.isArray(data.links)) {
                populateResourceLinks(data.links);
            }
            break;
            
        case 'footer-contact':
            if (data.title) document.getElementById('footer-contact-title').value = data.title;
            if (data.address) document.getElementById('footer-contact-address').value = data.address;
            if (data.phone) document.getElementById('footer-contact-phone').value = data.phone;
            if (data.email) document.getElementById('footer-contact-email').value = data.email;
            if (data.buttonText) document.getElementById('footer-contact-button').value = data.buttonText;
            break;
            
        case 'footer-bottom':
            if (data.copyright) document.getElementById('footer-bottom-copyright').value = data.copyright;
            if (data.links && Array.isArray(data.links)) {
                populateBottomLinks(data.links);
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
        'contacto-info': collectSectionData('contacto-info'),
        'contacto-apoyo': collectSectionData('contacto-apoyo'),
        'contacto-horarios': collectSectionData('contacto-horarios'),
        'contacto-ubicacion': collectSectionData('contacto-ubicacion'),
        'contacto-transporte': collectSectionData('contacto-transporte'),
        'contacto-accesibilidad': collectSectionData('contacto-accesibilidad'),
        'contacto-faq': collectSectionData('contacto-faq'),
        
        // Footer page
        'footer-logo': collectSectionData('footer-logo'),
        'footer-social': collectSectionData('footer-social'),
        'footer-navigation': collectSectionData('footer-navigation'),
        'footer-resources': collectSectionData('footer-resources'),
        'footer-contact': collectSectionData('footer-contact'),
        'footer-bottom': collectSectionData('footer-bottom')
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

// Afiliate CMS Functions
window.addBeneficioCMS = addBeneficioCMS;
window.addRequisitoCMS = addRequisitoCMS;
window.addTestimonioCMS = addTestimonioCMS;
window.removeListItemCMS = removeListItemCMS;
window.removeTestimonioCMS = removeTestimonioCMS;

/**
 * Add beneficio to CMS list
 */
function addBeneficioCMS() {
    const container = document.getElementById('beneficios-list-cms');
    if (!container) return;
    
    const listItem = document.createElement('div');
    listItem.className = 'list-item-cms';
    listItem.innerHTML = `
        <input type="text" class="beneficio-item-cms" value="">
        <button type="button" class="btn-remove-cms" onclick="removeListItemCMS(this)">×</button>
    `;
    container.appendChild(listItem);
}

/**
 * Add requisito to CMS list
 */
function addRequisitoCMS() {
    const container = document.getElementById('requisitos-list-cms');
    if (!container) return;
    
    const listItem = document.createElement('div');
    listItem.className = 'list-item-cms';
    listItem.innerHTML = `
        <input type="text" class="requisito-item-cms" value="">
        <button type="button" class="btn-remove-cms" onclick="removeListItemCMS(this)">×</button>
    `;
    container.appendChild(listItem);
}

/**
 * Add testimonio to CMS list
 */
function addTestimonioCMS() {
    const container = document.getElementById('testimonios-list-cms');
    if (!container) return;
    
    const testimonioItem = document.createElement('div');
    testimonioItem.className = 'testimonio-item-cms';
    const index = container.children.length + 1;
    testimonioItem.innerHTML = `
        <h4>Testimonio ${index}</h4>
        <div class="form-group">
            <label>Texto del Testimonio</label>
            <textarea class="testimonio-texto-cms" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label>Nombre del Autor</label>
            <input type="text" class="testimonio-nombre-cms" value="">
        </div>
        <div class="form-group">
            <label>Cargo o Descripción</label>
            <input type="text" class="testimonio-cargo-cms" value="">
        </div>
        <div class="form-group">
            <label>Imagen del Autor</label>
            <input type="text" class="testimonio-imagen-cms" value="">
        </div>
        <button type="button" class="btn-small btn-danger" onclick="removeTestimonioCMS(this)">Eliminar Testimonio</button>
    `;
    container.appendChild(testimonioItem);
}

/**
 * Remove list item from CMS
 */
function removeListItemCMS(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        button.parentElement.remove();
    }
}

/**
 * Remove testimonio from CMS
 */
function removeTestimonioCMS(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este testimonio?')) {
        button.parentElement.remove();
        // Renumber testimonios
        const testimonios = document.querySelectorAll('#testimonios-list-cms .testimonio-item-cms');
        testimonios.forEach((testimonio, index) => {
            testimonio.querySelector('h4').textContent = `Testimonio ${index + 1}`;
        });
    }
}

// Contacto CMS Functions
window.addHorarioCMS = addHorarioCMS;
window.removeHorarioCMS = removeHorarioCMS;
window.addAccesibilidadCMS = addAccesibilidadCMS;
window.removeAccesibilidadCMS = removeAccesibilidadCMS;
window.addFAQCMS = addFAQCMS;
window.removeFAQCMS = removeFAQCMS;

/**
 * Add horario to CMS list
 */
function addHorarioCMS() {
    const container = document.getElementById('horarios-list-cms');
    if (!container) return;
    
    const index = container.children.length + 1;
    const horarioItem = document.createElement('div');
    horarioItem.className = 'horario-item-cms';
    horarioItem.innerHTML = `
        <div class="form-group">
            <label>Día ${index}</label>
            <input type="text" class="horario-day-cms" value="">
        </div>
        <div class="form-group">
            <label>Horario ${index}</label>
            <input type="text" class="horario-time-cms" value="">
        </div>
        <button type="button" class="btn-remove-cms" onclick="removeHorarioCMS(this)">×</button>
    `;
    container.appendChild(horarioItem);
}

/**
 * Remove horario from CMS
 */
function removeHorarioCMS(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este horario?')) {
        button.parentElement.remove();
        // Renumber horarios
        const horarios = document.querySelectorAll('#horarios-list-cms .horario-item-cms');
        horarios.forEach((horario, index) => {
            const dayLabel = horario.querySelector('label');
            const timeLabel = horario.querySelectorAll('label')[1];
            dayLabel.textContent = `Día ${index + 1}`;
            timeLabel.textContent = `Horario ${index + 1}`;
        });
    }
}

/**
 * Add accesibilidad feature to CMS list
 */
function addAccesibilidadCMS() {
    const container = document.getElementById('accesibilidad-list-cms');
    if (!container) return;
    
    const accesibilidadItem = document.createElement('div');
    accesibilidadItem.className = 'accesibilidad-item-cms';
    accesibilidadItem.innerHTML = `
        <input type="text" class="accesibilidad-feature-cms" value="">
        <button type="button" class="btn-remove-cms" onclick="removeAccesibilidadCMS(this)">×</button>
    `;
    container.appendChild(accesibilidadItem);
}

/**
 * Remove accesibilidad feature from CMS
 */
function removeAccesibilidadCMS(button) {
    if (confirm('¿Estás seguro de que quieres eliminar esta característica?')) {
        button.parentElement.remove();
    }
}

/**
 * Add FAQ to CMS list
 */
function addFAQCMS() {
    const container = document.getElementById('faq-list-cms');
    if (!container) return;
    
    const index = container.children.length + 1;
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item-cms';
    faqItem.innerHTML = `
        <div class="form-group">
            <label>Pregunta ${index}</label>
            <input type="text" class="faq-question-cms" value="">
        </div>
        <div class="form-group">
            <label>Respuesta ${index}</label>
            <textarea class="faq-answer-cms" rows="3"></textarea>
        </div>
        <button type="button" class="btn-remove-cms" onclick="removeFAQCMS(this)">×</button>
    `;
    container.appendChild(faqItem);
}

/**
 * Remove FAQ from CMS
 */
function removeFAQCMS(button) {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
        button.parentElement.remove();
        // Renumber FAQs
        const faqs = document.querySelectorAll('#faq-list-cms .faq-item-cms');
        faqs.forEach((faq, index) => {
            const questionLabel = faq.querySelector('label');
            const answerLabel = faq.querySelectorAll('label')[1];
            questionLabel.textContent = `Pregunta ${index + 1}`;
            answerLabel.textContent = `Respuesta ${index + 1}`;
        });
    }
} 

/**
 * Populate horarios list
 */
function populateHorarios(schedules) {
    const container = document.getElementById('horarios-list-cms');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    // Add each schedule
    schedules.forEach((schedule, index) => {
        const horarioItem = document.createElement('div');
        horarioItem.className = 'horario-item-cms';
        horarioItem.innerHTML = `
            <div class="form-group">
                <label>Día ${index + 1}</label>
                <input type="text" class="horario-day-cms" value="${schedule.day || ''}">
            </div>
            <div class="form-group">
                <label>Horario ${index + 1}</label>
                <input type="text" class="horario-time-cms" value="${schedule.time || ''}">
            </div>
            <button type="button" class="btn-remove-cms" onclick="removeHorarioCMS(this)">×</button>
        `;
        container.appendChild(horarioItem);
    });
}

/**
 * Populate accesibilidad features list
 */
function populateAccesibilidad(features) {
    const container = document.getElementById('accesibilidad-list-cms');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    // Add each feature
    features.forEach(feature => {
        const accesibilidadItem = document.createElement('div');
        accesibilidadItem.className = 'accesibilidad-item-cms';
        accesibilidadItem.innerHTML = `
            <input type="text" class="accesibilidad-feature-cms" value="${feature || ''}">
            <button type="button" class="btn-remove-cms" onclick="removeAccesibilidadCMS(this)">×</button>
        `;
        container.appendChild(accesibilidadItem);
    });
}

/**
 * Populate FAQ list
 */
function populateFAQ(questions) {
    const container = document.getElementById('faq-list-cms');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    // Add each question
    questions.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item-cms';
        faqItem.innerHTML = `
            <div class="form-group">
                <label>Pregunta ${index + 1}</label>
                <input type="text" class="faq-question-cms" value="${faq.question || ''}">
            </div>
            <div class="form-group">
                <label>Respuesta ${index + 1}</label>
                <textarea class="faq-answer-cms" rows="3">${faq.answer || ''}</textarea>
            </div>
            <button type="button" class="btn-remove-cms" onclick="removeFAQCMS(this)">×</button>
        `;
        container.appendChild(faqItem);
    });
}

// ==========================================================================
// FOOTER CMS FUNCTIONS
// ==========================================================================

/**
 * Add navigation link to footer
 */
function addNavigationLink() {
    const container = document.getElementById('footer-navigation-links');
    const linkItems = container.querySelectorAll('.navigation-link-item');
    const newIndex = linkItems.length + 1;
    
    const linkItem = document.createElement('div');
    linkItem.className = 'navigation-link-item';
    linkItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Texto del Enlace</label>
                <input type="text" class="cms-input" value="Nuevo Enlace">
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="text" class="cms-input" value="#">
            </div>
            <button type="button" class="btn-remove-cms" onclick="removeNavigationLink(this)">×</button>
        </div>
    `;
    container.appendChild(linkItem);
}

/**
 * Remove navigation link from footer
 */
function removeNavigationLink(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
        button.closest('.navigation-link-item').remove();
    }
}

/**
 * Add resource link to footer
 */
function addResourceLink() {
    const container = document.getElementById('footer-resources-links');
    const linkItems = container.querySelectorAll('.resource-link-item');
    const newIndex = linkItems.length + 1;
    
    const linkItem = document.createElement('div');
    linkItem.className = 'resource-link-item';
    linkItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Texto del Enlace</label>
                <input type="text" class="cms-input" value="Nuevo Recurso">
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="text" class="cms-input" value="#">
            </div>
            <button type="button" class="btn-remove-cms" onclick="removeResourceLink(this)">×</button>
        </div>
    `;
    container.appendChild(linkItem);
}

/**
 * Remove resource link from footer
 */
function removeResourceLink(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
        button.closest('.resource-link-item').remove();
    }
}

/**
 * Add bottom link to footer
 */
function addBottomLink() {
    const container = document.getElementById('footer-bottom-links');
    const linkItems = container.querySelectorAll('.bottom-link-item');
    const newIndex = linkItems.length + 1;
    
    const linkItem = document.createElement('div');
    linkItem.className = 'bottom-link-item';
    linkItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Texto del Enlace</label>
                <input type="text" class="cms-input" value="Nuevo Enlace">
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="text" class="cms-input" value="#">
            </div>
            <button type="button" class="btn-remove-cms" onclick="removeBottomLink(this)">×</button>
        </div>
    `;
    container.appendChild(linkItem);
}

/**
 * Remove bottom link from footer
 */
function removeBottomLink(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
        button.closest('.bottom-link-item').remove();
    }
}

/**
 * Populate navigation links
 */
function populateNavigationLinks(links) {
    const container = document.getElementById('footer-navigation-links');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    // Add each link
    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'navigation-link-item';
        linkItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Texto del Enlace</label>
                    <input type="text" class="cms-input" value="${link.text || ''}">
                </div>
                <div class="form-group">
                    <label>URL</label>
                    <input type="text" class="cms-input" value="${link.url || ''}">
                </div>
                <button type="button" class="btn-remove-cms" onclick="removeNavigationLink(this)">×</button>
            </div>
        `;
        container.appendChild(linkItem);
    });
}

/**
 * Populate resource links
 */
function populateResourceLinks(links) {
    const container = document.getElementById('footer-resources-links');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    // Add each link
    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'resource-link-item';
        linkItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Texto del Enlace</label>
                    <input type="text" class="cms-input" value="${link.text || ''}">
                </div>
                <div class="form-group">
                    <label>URL</label>
                    <input type="text" class="cms-input" value="${link.url || ''}">
                </div>
                <button type="button" class="btn-remove-cms" onclick="removeResourceLink(this)">×</button>
            </div>
        `;
        container.appendChild(linkItem);
    });
}

/**
 * Populate bottom links
 */
function populateBottomLinks(links) {
    const container = document.getElementById('footer-bottom-links');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    // Add each link
    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'bottom-link-item';
        linkItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Texto del Enlace</label>
                    <input type="text" class="cms-input" value="${link.text || ''}">
                </div>
                <div class="form-group">
                    <label>URL</label>
                    <input type="text" class="cms-input" value="${link.url || ''}">
                </div>
                <button type="button" class="btn-remove-cms" onclick="removeBottomLink(this)">×</button>
            </div>
        `;
        container.appendChild(linkItem);
    });
}