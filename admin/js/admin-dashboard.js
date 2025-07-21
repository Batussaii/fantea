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
 * Exportar funciones globales
 */
window.switchSection = switchSection;
window.openNewsEditor = openNewsEditor;
window.openEventEditor = openEventEditor;
window.logout = logout; 