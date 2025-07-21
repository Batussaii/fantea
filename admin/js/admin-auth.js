/**
 * FANTEA Admin Authentication System
 * Sistema de autenticación para el panel administrativo
 */

// Configuración de autenticación
const AUTH_CONFIG = {
    SESSION_KEY: 'fantea_admin_session',
    MAX_SESSION_HOURS: 24,
    DEMO_MODE: true, // Cambiar a false en producción
    
    // Credenciales demo (en producción esto debería estar en el backend)
    DEMO_CREDENTIALS: {
        'admin': {
            password: 'fantea2024',
            role: 'administrator',
            permissions: ['read', 'write', 'delete', 'manage_users']
        },
        'editor': {
            password: 'editor123',
            role: 'editor',
            permissions: ['read', 'write']
        },
        'moderador': {
            password: 'mod2024',
            role: 'moderator',
            permissions: ['read']
        }
    }
};

/**
 * Clase principal de autenticación
 */
class AdminAuth {
    constructor() {
        this.currentUser = null;
        this.sessionData = null;
        this.init();
    }
    
    /**
     * Inicializar sistema de autenticación
     */
    init() {
        this.loadSession();
        this.setupEventListeners();
    }
    
    /**
     * Cargar sesión existente
     */
    loadSession() {
        const sessionData = this.getStoredSession();
        
        if (sessionData && this.isSessionValid(sessionData)) {
            this.currentUser = sessionData.user;
            this.sessionData = sessionData;
            return true;
        } else {
            this.clearSession();
            return false;
        }
    }
    
    /**
     * Obtener sesión almacenada
     */
    getStoredSession() {
        const localStorage_session = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        const sessionStorage_session = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        
        try {
            if (localStorage_session) {
                return JSON.parse(localStorage_session);
            } else if (sessionStorage_session) {
                return JSON.parse(sessionStorage_session);
            }
        } catch (e) {
            console.error('Error parsing session data:', e);
            this.clearSession();
        }
        
        return null;
    }
    
    /**
     * Verificar si la sesión es válida
     */
    isSessionValid(sessionData) {
        if (!sessionData || !sessionData.loginTime || !sessionData.user) {
            return false;
        }
        
        const hoursSinceLogin = (Date.now() - sessionData.loginTime) / (1000 * 60 * 60);
        
        return hoursSinceLogin < AUTH_CONFIG.MAX_SESSION_HOURS;
    }
    
    /**
     * Autenticar usuario
     */
    async authenticate(username, password, rememberMe = false) {
        try {
            // En modo demo, usar credenciales locales
            if (AUTH_CONFIG.DEMO_MODE) {
                return this.authenticateDemo(username, password, rememberMe);
            }
            
            // En producción, hacer llamada al backend
            return this.authenticateServer(username, password, rememberMe);
            
        } catch (error) {
            console.error('Authentication error:', error);
            throw new Error('Error de autenticación. Inténtalo de nuevo.');
        }
    }
    
    /**
     * Autenticación demo (desarrollo)
     */
    authenticateDemo(username, password, rememberMe) {
        const userCredentials = AUTH_CONFIG.DEMO_CREDENTIALS[username];
        
        if (!userCredentials || userCredentials.password !== password) {
            throw new Error('Usuario o contraseña incorrectos');
        }
        
        // Crear datos de usuario
        const userData = {
            username: username,
            role: userCredentials.role,
            permissions: userCredentials.permissions,
            loginTime: Date.now()
        };
        
        // Crear datos de sesión
        const sessionData = {
            user: userData,
            loginTime: Date.now(),
            persistent: rememberMe,
            sessionId: this.generateSessionId()
        };
        
        // Almacenar sesión
        this.storeSession(sessionData, rememberMe);
        
        // Actualizar estado actual
        this.currentUser = userData;
        this.sessionData = sessionData;
        
        return {
            success: true,
            user: userData,
            message: 'Inicio de sesión exitoso'
        };
    }
    
    /**
     * Autenticación servidor (producción)
     */
    async authenticateServer(username, password, rememberMe) {
        const response = await fetch('/admin/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                rememberMe: rememberMe
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error de autenticación');
        }
        
        // Almacenar sesión del servidor
        this.storeSession(data.session, rememberMe);
        this.currentUser = data.user;
        this.sessionData = data.session;
        
        return data;
    }
    
    /**
     * Almacenar sesión
     */
    storeSession(sessionData, persistent = false) {
        const storage = persistent ? localStorage : sessionStorage;
        storage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(sessionData));
        
        // Limpiar el otro tipo de almacenamiento
        const otherStorage = persistent ? sessionStorage : localStorage;
        otherStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    }
    
    /**
     * Generar ID de sesión único
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Cerrar sesión
     */
    logout() {
        // Limpiar almacenamiento local
        this.clearSession();
        
        // En producción, notificar al servidor
        if (!AUTH_CONFIG.DEMO_MODE && this.sessionData) {
            fetch('/admin/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.sessionData.sessionId
                })
            }).catch(error => {
                console.error('Error during logout:', error);
            });
        }
        
        // Resetear estado
        this.currentUser = null;
        this.sessionData = null;
    }
    
    /**
     * Limpiar sesión almacenada
     */
    clearSession() {
        localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    }
    
    /**
     * Verificar si el usuario tiene permisos
     */
    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        
        return this.currentUser.permissions.includes(permission);
    }
    
    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        return this.currentUser !== null && this.sessionData !== null;
    }
    
    /**
     * Obtener información del usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }
    
    /**
     * Renovar sesión
     */
    async renewSession() {
        if (!this.sessionData) {
            return false;
        }
        
        try {
            if (AUTH_CONFIG.DEMO_MODE) {
                // En modo demo, simplemente actualizar el tiempo
                this.sessionData.loginTime = Date.now();
                this.storeSession(this.sessionData, this.sessionData.persistent);
                return true;
            } else {
                // En producción, renovar en el servidor
                const response = await fetch('/admin/api/auth/renew', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId: this.sessionData.sessionId
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.sessionData = data.session;
                    this.storeSession(this.sessionData, this.sessionData.persistent);
                    return true;
                }
            }
        } catch (error) {
            console.error('Error renewing session:', error);
        }
        
        return false;
    }
    
    /**
     * Configurar listeners de eventos
     */
    setupEventListeners() {
        // Renovar sesión automáticamente cada hora
        setInterval(() => {
            if (this.isAuthenticated()) {
                this.renewSession();
            }
        }, 3600000); // 1 hora
        
        // Limpiar sesión cuando se cierra la ventana/pestaña
        window.addEventListener('beforeunload', () => {
            if (this.sessionData && !this.sessionData.persistent) {
                // Solo limpiar sesiones no persistentes
                this.clearSession();
            }
        });
        
        // Detectar actividad del usuario para renovar sesión
        let activityTimer = null;
        const resetActivityTimer = () => {
            clearTimeout(activityTimer);
            activityTimer = setTimeout(() => {
                if (this.isAuthenticated()) {
                    this.renewSession();
                }
            }, 300000); // 5 minutos de inactividad
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetActivityTimer, { passive: true });
        });
    }
}

// Crear instancia global del sistema de autenticación
const adminAuth = new AdminAuth();

// Exponer funciones globales necesarias
window.adminAuth = adminAuth;

/**
 * Funciones de utilidad para el manejo de autenticación en las páginas
 */

/**
 * Proteger página - redirigir si no está autenticado
 */
function requireAuth() {
    if (!adminAuth.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Requerir permiso específico
 */
function requirePermission(permission) {
    if (!adminAuth.hasPermission(permission)) {
        showUnauthorizedMessage();
        return false;
    }
    return true;
}

/**
 * Mostrar mensaje de no autorizado
 */
function showUnauthorizedMessage() {
    alert('No tienes permisos suficientes para realizar esta acción.');
}

/**
 * Manejar formulario de login
 */
function handleLoginForm(formElement) {
    if (!formElement) return;
    
    formElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const username = formData.get('username');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe') === 'on';
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            // Mostrar estado de carga
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
            submitButton.disabled = true;
            
            // Autenticar
            const result = await adminAuth.authenticate(username, password, rememberMe);
            
            if (result.success) {
                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            }
            
        } catch (error) {
            // Mostrar error
            showLoginError(error.message);
            
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

/**
 * Mostrar error de login
 */
function showLoginError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Inicialización automática para formularios de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        handleLoginForm(loginForm);
    }
    
    // Auto-redirigir si ya está autenticado y está en login
    if (window.location.pathname.includes('login.html') && adminAuth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
});

// Exponer funciones globales
window.requireAuth = requireAuth;
window.requirePermission = requirePermission;
window.handleLoginForm = handleLoginForm; 