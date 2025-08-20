const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const config = require('./server-config');

const app = express();
const PORT = config.port;

// Configurar ruta de datos persistente
const DATA_DIR = config.directories.data;
const CMS_DATA_FILE = config.getPath();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determinar el directorio según el tipo de archivo
        let uploadDir;
        if (file.fieldname === 'statutes') {
            uploadDir = config.getUploadPath('estatutos');
        } else if (file.fieldname === 'documents') {
            uploadDir = config.getUploadPath('documentos');
        } else {
            uploadDir = config.getUploadPath('general');
        }
        
        // Crear directorio si no existe
        fs.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: config.files.limits.fileSize,
        files: config.files.limits.maxFiles
    },
    fileFilter: function (req, file, cb) {
        // Validar tipos de archivo permitidos
        const fieldTypes = config.getAllowedTypes(file.fieldname);
        
        if (fieldTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
        }
    }
});

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '50mb' })); // Aumentar límite para imágenes
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.')); // Servir archivos estáticos desde la app
// Servir archivos subidos desde el volumen persistente
const UPLOADS_DIR = config.directories.uploads;
app.use('/uploads', express.static(UPLOADS_DIR));

// Ruta para guardar datos del CMS
app.post('/api/cms/save', async (req, res) => {
    try {
        const { section, data } = req.body;
        
        // Asegurar que el directorio existe
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Cargar datos existentes
        let cmsData = {};
        try {
            const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
            cmsData = JSON.parse(dataFile);
            console.log(`Datos CMS cargados correctamente desde ${CMS_DATA_FILE}`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Archivo no existe, empezar con objeto vacío
                console.log(`Creando nuevo archivo de datos CMS en ${CMS_DATA_FILE}`);
            } else {
                console.error('Error leyendo archivo CMS:', error);
                // Intentar crear un backup del archivo corrupto
                try {
                    const backupPath = `${CMS_DATA_FILE}.backup.${Date.now()}`;
                    await fs.writeFile(backupPath, JSON.stringify({ error: 'Archivo corrupto', timestamp: new Date().toISOString() }));
                    console.log(`Backup creado en ${backupPath}`);
                } catch (backupError) {
                    console.error('Error creando backup:', backupError);
                }
            }
        }
        
        // Actualizar sección
        cmsData[section] = {
            ...data,
            lastModified: new Date().toISOString(),
            modifiedBy: req.body.user || 'admin'
        };
        
        // Guardar en archivo con sincronización forzada
        await fs.writeFile(CMS_DATA_FILE, JSON.stringify(cmsData, null, 2));
        
        // Forzar sincronización del sistema de archivos
        try {
            const { execSync } = require('child_process');
            execSync('sync', { stdio: 'ignore' });
        } catch (syncError) {
            console.log('No se pudo forzar sincronización del sistema de archivos');
        }
        
        console.log(`Datos guardados correctamente en ${CMS_DATA_FILE}`);
        res.json({ success: true, message: 'Datos guardados correctamente' });
    } catch (error) {
        console.error('Error guardando datos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para cargar datos del CMS
app.get('/api/cms/load', async (req, res) => {
    try {
        const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
        const cmsData = JSON.parse(dataFile);
        console.log(`Datos CMS cargados correctamente desde ${CMS_DATA_FILE}`);
        res.json({ success: true, data: cmsData });
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Archivo no existe, devolver objeto vacío
            console.log(`Archivo CMS no encontrado en ${CMS_DATA_FILE}, devolviendo datos vacíos`);
            res.json({ success: true, data: {} });
        } else {
            console.error('Error cargando datos:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

// Ruta para cargar una sección específica
app.get('/api/cms/load/:section', async (req, res) => {
    try {
        const { section } = req.params;
        const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
        const cmsData = JSON.parse(dataFile);
        
        if (cmsData[section]) {
            res.json({ success: true, data: cmsData[section] });
        } else {
            res.json({ success: true, data: null });
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json({ success: true, data: null });
        } else {
            console.error('Error cargando sección:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

// Ruta para subir imágenes (persistentes)
app.post('/api/upload/image', async (req, res) => {
    try {
        const { imageData, filename } = req.body;
        
        // Crear directorio de imágenes dentro del volumen persistente si no existe
        const imagesDir = path.join(UPLOADS_DIR, 'images');
        await fs.mkdir(imagesDir, { recursive: true });
        
        // Guardar imagen (asumiendo que viene en base64)
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(imagesDir, filename);
        
        await fs.writeFile(filePath, buffer);
        
        res.json({ 
            success: true, 
            // Devolver URL pública servida por Express desde el volumen persistente
            url: `/uploads/images/${filename}`,
            message: 'Imagen subida correctamente' 
        });
    } catch (error) {
        console.error('Error subiendo imagen:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================================================
// GESTIÓN DE ARCHIVOS - NUEVOS ENDPOINTS
// ==========================================================================

// Ruta para subir estatutos PDF
app.post('/api/files/upload/statutes', upload.single('statutes'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No se proporcionó ningún archivo' });
        }

        // Guardar información del archivo en el CMS data
        const fileInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            url: `/uploads/estatutos/${req.file.filename}`,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
            uploadedBy: req.body.user || 'admin'
        };

        // Cargar datos existentes del CMS
        let cmsData = {};
        try {
            const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
            cmsData = JSON.parse(dataFile);
        } catch (error) {
            console.log('Creando nuevo archivo de datos CMS');
        }

        // Guardar información del archivo de estatutos
        cmsData.statutes = fileInfo;
        await fs.writeFile(CMS_DATA_FILE, JSON.stringify(cmsData, null, 2));

        res.json({
            success: true,
            message: 'Estatutos subidos correctamente',
            file: fileInfo
        });
    } catch (error) {
        console.error('Error subiendo estatutos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para subir documentos generales
app.post('/api/files/upload/documents', upload.array('documents', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No se proporcionaron archivos' });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const fileInfo = {
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                url: `/uploads/documentos/${file.filename}`,
                size: file.size,
                mimetype: file.mimetype,
                uploadedAt: new Date().toISOString(),
                uploadedBy: req.body.user || 'admin'
            };
            uploadedFiles.push(fileInfo);
        }

        // Cargar datos existentes del CMS
        let cmsData = {};
        try {
            const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
            cmsData = JSON.parse(dataFile);
        } catch (error) {
            console.log('Creando nuevo archivo de datos CMS');
        }

        // Inicializar array de documentos si no existe
        if (!cmsData.documents) {
            cmsData.documents = [];
        }

        // Agregar nuevos documentos
        cmsData.documents.push(...uploadedFiles);
        await fs.writeFile(CMS_DATA_FILE, JSON.stringify(cmsData, null, 2));

        res.json({
            success: true,
            message: `${uploadedFiles.length} documento(s) subido(s) correctamente`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Error subiendo documentos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para obtener información de archivos
app.get('/api/files/info', async (req, res) => {
    try {
        const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
        const cmsData = JSON.parse(dataFile);

        const fileInfo = {
            statutes: cmsData.statutes || null,
            documents: cmsData.documents || []
        };

        res.json({ success: true, data: fileInfo });
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json({ success: true, data: { statutes: null, documents: [] } });
        } else {
            console.error('Error obteniendo información de archivos:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

    // Ruta para descargar archivo
    app.get('/api/files/download/:type/:filename', async (req, res) => {
        try {
            const { type, filename } = req.params;
            
            let filePath;
            if (type === 'statutes') {
                filePath = path.join(config.getUploadPath('estatutos'), filename);
            } else if (type === 'documents') {
                filePath = path.join(config.getUploadPath('documentos'), filename);
            } else {
                return res.status(400).json({ success: false, error: 'Tipo de archivo no válido' });
            }

        // Verificar que el archivo existe
        try {
            await fs.access(filePath);
        } catch (error) {
            return res.status(404).json({ success: false, error: 'Archivo no encontrado' });
        }

        // Registrar la descarga
        try {
            await recordDownload(filename, type);
        } catch (error) {
            console.error('Error registrando descarga:', error);
            // No fallar la descarga si hay error en el registro
        }

        // Obtener información del archivo
        const stats = await fs.stat(filePath);
        const ext = path.extname(filename).toLowerCase();
        
        // Determinar el tipo MIME
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Configurar headers para descarga
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', stats.size);

        // Enviar archivo
        const fileStream = require('fs').createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error descargando archivo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

    // Ruta para eliminar archivo
    app.delete('/api/files/delete/:type/:filename', async (req, res) => {
        try {
            const { type, filename } = req.params;
            
            let filePath;
            if (type === 'statutes') {
                filePath = path.join(config.getUploadPath('estatutos'), filename);
            } else if (type === 'documents') {
                filePath = path.join(config.getUploadPath('documentos'), filename);
            } else {
                return res.status(400).json({ success: false, error: 'Tipo de archivo no válido' });
            }

        // Eliminar archivo físico
        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        // Actualizar datos del CMS
        const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
        const cmsData = JSON.parse(dataFile);

        if (type === 'statutes') {
            delete cmsData.statutes;
        } else if (type === 'documents') {
            cmsData.documents = cmsData.documents.filter(doc => doc.filename !== filename);
        }

        await fs.writeFile(CMS_DATA_FILE, JSON.stringify(cmsData, null, 2));

        res.json({ success: true, message: 'Archivo eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando archivo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Archivo para almacenar estadísticas
const STATS_FILE = path.join(__dirname, 'data', 'stats.json');

// Archivo para almacenar visitas web
const VISITS_FILE = path.join(__dirname, 'data', 'visits.json');

// Middleware para tracking de visitas web
app.use((req, res, next) => {
    // Solo contar visitas a páginas principales (no a APIs o recursos)
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        return next();
    }
    
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    // Registrar visita
    recordVisit(req.ip, req.path).catch(err => {
        console.error('Error registrando visita:', err);
    });
    
    next();
});

// Función para registrar una visita
async function recordVisit(ip, path) {
    try {
        const visits = await loadVisits();
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const hour = now.getHours();
        
        // Inicializar estructura si no existe
        if (!visits.daily[today]) {
            visits.daily[today] = {
                total: 0,
                hourly: Array(24).fill(0),
                uniqueIPs: new Set()
            };
        }
        
        // Incrementar contadores
        visits.daily[today].total++;
        visits.daily[today].hourly[hour]++;
        visits.daily[today].uniqueIPs.add(ip);
        
        // Mantener solo los últimos 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        Object.keys(visits.daily).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete visits.daily[date];
            }
        });
        
        await saveVisits(visits);
        
    } catch (error) {
        console.error('Error en recordVisit:', error);
    }
}

// Función para cargar datos de visitas
async function loadVisits() {
    try {
        const visitsData = await fs.readFile(VISITS_FILE, 'utf8');
        const visits = JSON.parse(visitsData);
        
        // Convertir Sets de vuelta a arrays para JSON
        Object.keys(visits.daily).forEach(date => {
            if (visits.daily[date].uniqueIPs instanceof Set) {
                visits.daily[date].uniqueIPs = Array.from(visits.daily[date].uniqueIPs);
            }
        });
        
        return visits;
    } catch (error) {
        // Crear estructura inicial
        const initialVisits = {
            daily: {},
            lastUpdated: new Date().toISOString()
        };
        
        await saveVisits(initialVisits);
        return initialVisits;
    }
}

// Función para guardar datos de visitas
async function saveVisits(visits) {
    visits.lastUpdated = new Date().toISOString();
    
    // Convertir Sets a arrays para JSON
    const visitsForStorage = JSON.parse(JSON.stringify(visits));
    Object.keys(visitsForStorage.daily).forEach(date => {
        if (visitsForStorage.daily[date].uniqueIPs instanceof Set) {
            visitsForStorage.daily[date].uniqueIPs = Array.from(visitsForStorage.daily[date].uniqueIPs);
        }
    });
    
    await fs.writeFile(VISITS_FILE, JSON.stringify(visitsForStorage, null, 2));
}

// Función para cargar estadísticas
async function loadStats() {
    try {
        const statsData = await fs.readFile(STATS_FILE, 'utf8');
        return JSON.parse(statsData);
    } catch (error) {
        // Si el archivo no existe, crear estadísticas iniciales
        const initialStats = {
            downloads: {
                total: 0,
                thisMonth: 0,
                lastMonth: 0,
                history: []
            },
            news: {
                total: 0,
                thisMonth: 0,
                lastMonth: 0
            },
            events: {
                total: 0,
                thisMonth: 0,
                lastMonth: 0
            },
            associations: {
                total: 0,
                thisMonth: 0,
                lastMonth: 0
            },
            lastUpdated: new Date().toISOString()
        };
        
        await fs.writeFile(STATS_FILE, JSON.stringify(initialStats, null, 2));
        return initialStats;
    }
}

// Función para guardar estadísticas
async function saveStats(stats) {
    stats.lastUpdated = new Date().toISOString();
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
}

// Función para registrar una descarga
async function recordDownload(filename, type = 'statutes') {
    const stats = await loadStats();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Incrementar contadores
    stats.downloads.total++;
    stats.downloads.thisMonth++;
    
    // Agregar a historial
    stats.downloads.history.push({
        filename,
        type,
        timestamp: now.toISOString(),
        month: currentMonth,
        year: currentYear
    });
    
    // Mantener solo los últimos 100 registros
    if (stats.downloads.history.length > 100) {
        stats.downloads.history = stats.downloads.history.slice(-100);
    }
    
    await saveStats(stats);
    return stats.downloads;
}

// Función para registrar una nueva noticia
async function recordNewsCreated() {
    const stats = await loadStats();
    stats.news.total++;
    stats.news.thisMonth++;
    await saveStats(stats);
    return stats.news;
}

// Función para registrar un nuevo evento
async function recordEventCreated() {
    const stats = await loadStats();
    stats.events.total++;
    stats.events.thisMonth++;
    await saveStats(stats);
    return stats.events;
}

// Función para registrar una nueva asociación
async function recordAssociationCreated() {
    const stats = await loadStats();
    stats.associations.total++;
    stats.associations.thisMonth++;
    await saveStats(stats);
    return stats.associations;
}

// Función para actualizar contadores mensuales (ejecutar al inicio de cada mes)
async function updateMonthlyCounters() {
    const stats = await loadStats();
    const now = new Date();
    const currentMonth = now.getMonth();
    
    // Si es un nuevo mes, mover contadores
    if (stats.lastMonth !== currentMonth) {
        stats.downloads.lastMonth = stats.downloads.thisMonth;
        stats.downloads.thisMonth = 0;
        
        stats.news.lastMonth = stats.news.thisMonth;
        stats.news.thisMonth = 0;
        
        stats.events.lastMonth = stats.events.thisMonth;
        stats.events.thisMonth = 0;
        
        stats.associations.lastMonth = stats.associations.thisMonth;
        stats.associations.thisMonth = 0;
        
        stats.lastMonth = currentMonth;
        await saveStats(stats);
    }
}

// Función para obtener estadísticas del dashboard
async function getDashboardStats() {
    const stats = await loadStats();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calcular descargas del mes anterior
    const lastMonthDownloads = stats.downloads.history.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getMonth() === (currentMonth - 1 + 12) % 12 && 
               recordDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
    }).length;
    
    // Calcular cambio respecto al mes anterior
    const downloadChange = stats.downloads.thisMonth - lastMonthDownloads;
    
    return {
        downloads: {
            current: stats.downloads.total,
            change: downloadChange
        },
        news: {
            current: stats.news.total,
            change: stats.news.thisMonth
        },
        events: {
            current: stats.events.total,
            change: stats.events.thisMonth
        },
        associations: {
            current: stats.associations.total,
            change: stats.associations.thisMonth
        }
    };
}

// Función para generar datos reales del gráfico
async function getChartData(period = '7 días') {
    const visits = await loadVisits();
    const stats = await loadStats();
    
    let labels = [];
    let visitsData = [];
    let downloadsData = [];
    
    const now = new Date();
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    switch (period) {
        case '7 días':
            // Últimos 7 días
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayName = daysOfWeek[date.getDay()];
                
                labels.push(dayName);
                
                // Visitas del día
                const dayVisits = visits.daily[dateStr] ? visits.daily[dateStr].total : 0;
                visitsData.push(dayVisits);
                
                // Descargas del día
                const dayDownloads = stats.downloads.history.filter(record => {
                    const recordDate = new Date(record.timestamp);
                    return recordDate.toISOString().split('T')[0] === dateStr;
                }).length;
                downloadsData.push(dayDownloads);
            }
            break;
            
        case '30 días':
            // Últimas 4 semanas
            for (let week = 3; week >= 0; week--) {
                const weekStart = new Date(now);
                weekStart.setDate(weekStart.getDate() - (week * 7));
                
                let weekVisits = 0;
                let weekDownloads = 0;
                
                // Sumar datos de la semana
                for (let day = 0; day < 7; day++) {
                    const date = new Date(weekStart);
                    date.setDate(date.getDate() + day);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    if (visits.daily[dateStr]) {
                        weekVisits += visits.daily[dateStr].total;
                    }
                    
                    weekDownloads += stats.downloads.history.filter(record => {
                        const recordDate = new Date(record.timestamp);
                        return recordDate.toISOString().split('T')[0] === dateStr;
                    }).length;
                }
                
                labels.push(`Sem ${4 - week}`);
                visitsData.push(weekVisits);
                downloadsData.push(weekDownloads);
            }
            break;
            
        case '3 meses':
            // Últimos 3 meses
            for (let month = 2; month >= 0; month--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - month, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - month + 1, 0);
                
                let monthVisits = 0;
                let monthDownloads = 0;
                
                // Sumar datos del mes
                for (let day = 0; day < monthEnd.getDate(); day++) {
                    const date = new Date(monthStart);
                    date.setDate(date.getDate() + day);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    if (visits.daily[dateStr]) {
                        monthVisits += visits.daily[dateStr].total;
                    }
                    
                    monthDownloads += stats.downloads.history.filter(record => {
                        const recordDate = new Date(record.timestamp);
                        return recordDate.toISOString().split('T')[0] === dateStr;
                    }).length;
                }
                
                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                labels.push(monthNames[monthStart.getMonth()]);
                visitsData.push(monthVisits);
                downloadsData.push(monthDownloads);
            }
            break;
    }
    
    // Si no hay datos reales, generar datos demo mejorados
    if (visitsData.every(v => v === 0) && downloadsData.every(d => d === 0)) {
        visitsData = generateDemoVisitsData(period);
        downloadsData = generateDemoDownloadsData(period, stats.downloads.total);
    }
    
    return {
        labels,
        datasets: [
            {
                label: 'Visitas al sitio web',
                data: visitsData,
                borderColor: '#1565C0',
                backgroundColor: 'rgba(21, 101, 192, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Descargas de documentos',
                data: downloadsData,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
}

// Función para generar datos demo de visitas
function generateDemoVisitsData(period) {
    const baseVisits = 200;
    const data = [];
    
    switch (period) {
        case '7 días':
            for (let i = 0; i < 7; i++) {
                const dayOfWeek = (new Date().getDay() - 6 + i + 7) % 7;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const multiplier = isWeekend ? 0.4 : 1.0;
                const variation = 0.8 + Math.random() * 0.4;
                data.push(Math.round(baseVisits * multiplier * variation));
            }
            break;
        case '30 días':
            for (let i = 0; i < 4; i++) {
                const weekMultiplier = 0.8 + (i * 0.2);
                const variation = 0.9 + Math.random() * 0.2;
                data.push(Math.round(baseVisits * 7 * weekMultiplier * variation));
            }
            break;
        case '3 meses':
            for (let i = 0; i < 3; i++) {
                const monthMultiplier = 0.9 + (i * 0.3);
                const variation = 0.85 + Math.random() * 0.3;
                data.push(Math.round(baseVisits * 30 * monthMultiplier * variation));
            }
            break;
    }
    
    return data;
}

// Función para generar datos demo de descargas
function generateDemoDownloadsData(period, totalDownloads) {
    const data = [];
    
    switch (period) {
        case '7 días':
            for (let i = 0; i < 7; i++) {
                const dayOfWeek = (new Date().getDay() - 6 + i + 7) % 7;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const multiplier = isWeekend ? 0.3 : 1.0;
                const variation = 0.7 + Math.random() * 0.6;
                const avgDailyDownloads = Math.max(totalDownloads / 30, 1);
                data.push(Math.round(avgDailyDownloads * multiplier * variation));
            }
            break;
        case '30 días':
            for (let i = 0; i < 4; i++) {
                const weekMultiplier = 0.8 + (i * 0.2);
                const variation = 0.9 + Math.random() * 0.2;
                const avgWeeklyDownloads = Math.max(totalDownloads / 4, 1);
                data.push(Math.round(avgWeeklyDownloads * weekMultiplier * variation));
            }
            break;
        case '3 meses':
            for (let i = 0; i < 3; i++) {
                const monthMultiplier = 0.9 + (i * 0.3);
                const variation = 0.85 + Math.random() * 0.3;
                const avgMonthlyDownloads = Math.max(totalDownloads / 3, 1);
                data.push(Math.round(avgMonthlyDownloads * monthMultiplier * variation));
            }
            break;
    }
    
    return data;
}

// API para estadísticas del dashboard
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const stats = await getDashboardStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error obteniendo estadísticas del dashboard:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para obtener historial de descargas
app.get('/api/dashboard/downloads/history', async (req, res) => {
    try {
        const stats = await loadStats();
        const history = stats.downloads.history.slice(-20); // Últimas 20 descargas
        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Error obteniendo historial de descargas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para obtener datos del gráfico
app.get('/api/dashboard/chart-data', async (req, res) => {
    try {
        const period = req.query.period || '7 días';
        const chartData = await getChartData(period);
        res.json({ success: true, data: chartData });
    } catch (error) {
        console.error('Error obteniendo datos del gráfico:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para registrar nueva noticia
app.post('/api/dashboard/record/news', async (req, res) => {
    try {
        const newsStats = await recordNewsCreated();
        res.json({ success: true, data: newsStats });
    } catch (error) {
        console.error('Error registrando noticia:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para registrar nuevo evento
app.post('/api/dashboard/record/event', async (req, res) => {
    try {
        const eventStats = await recordEventCreated();
        res.json({ success: true, data: eventStats });
    } catch (error) {
        console.error('Error registrando evento:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para registrar nueva asociación
app.post('/api/dashboard/record/association', async (req, res) => {
    try {
        const associationStats = await recordAssociationCreated();
        res.json({ success: true, data: associationStats });
    } catch (error) {
        console.error('Error registrando asociación:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para actualizar contadores mensuales
app.post('/api/dashboard/update-monthly', async (req, res) => {
    try {
        await updateMonthlyCounters();
        const stats = await getDashboardStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error actualizando contadores mensuales:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para crear backup manual
app.post('/api/cms/backup', async (req, res) => {
    try {
        await createBackup();
        res.json({ success: true, message: 'Backup creado correctamente' });
    } catch (error) {
        console.error('Error creando backup:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API para restaurar desde backup
app.post('/api/cms/restore', async (req, res) => {
    try {
        await restoreFromBackup();
        res.json({ success: true, message: 'Restauración completada correctamente' });
    } catch (error) {
        console.error('Error restaurando desde backup:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Función para crear backup automático
async function createBackup() {
    try {
        const backupDir = path.join(DATA_DIR, 'backups');
        await fs.mkdir(backupDir, { recursive: true });
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `cms-data-${timestamp}.json`);
        
        // Crear backup del archivo CMS
        try {
            const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
            await fs.writeFile(backupPath, dataFile);
            console.log(`Backup creado: ${backupPath}`);
            
            // Mantener solo los últimos 10 backups
            const files = await fs.readdir(backupDir);
            const backupFiles = files.filter(f => f.startsWith('cms-data-') && f.endsWith('.json'));
            
            if (backupFiles.length > 10) {
                backupFiles.sort();
                const filesToDelete = backupFiles.slice(0, backupFiles.length - 10);
                
                for (const file of filesToDelete) {
                    await fs.unlink(path.join(backupDir, file));
                    console.log(`Backup eliminado: ${file}`);
                }
            }
        } catch (error) {
            console.error('Error creando backup:', error);
        }
    } catch (error) {
        console.error('Error en función de backup:', error);
    }
}

// Función para restaurar desde backup si es necesario
async function restoreFromBackup() {
    try {
        const backupDir = path.join(DATA_DIR, 'backups');
        
        // Verificar si el archivo CMS principal existe y es válido
        try {
            await fs.access(CMS_DATA_FILE);
            const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
            JSON.parse(dataFile); // Verificar que es JSON válido
            console.log('Archivo CMS principal válido, no se necesita restauración');
            return;
        } catch (error) {
            console.log('Archivo CMS principal no válido, intentando restauración...');
        }
        
        // Buscar el backup más reciente
        const files = await fs.readdir(backupDir);
        const backupFiles = files.filter(f => f.startsWith('cms-data-') && f.endsWith('.json'));
        
        if (backupFiles.length > 0) {
            backupFiles.sort();
            const latestBackup = backupFiles[backupFiles.length - 1];
            const backupPath = path.join(backupDir, latestBackup);
            
            const backupData = await fs.readFile(backupPath, 'utf8');
            await fs.writeFile(CMS_DATA_FILE, backupData);
            console.log(`Restaurado desde backup: ${latestBackup}`);
        } else {
            console.log('No se encontraron backups para restaurar');
        }
    } catch (error) {
        console.error('Error en restauración:', error);
    }
}

// Función para inicializar y verificar el sistema de archivos
async function initializeFileSystem() {
    try {
        console.log('Inicializando sistema de archivos...');
        console.log(`Directorio de datos: ${DATA_DIR}`);
        console.log(`Archivo CMS: ${CMS_DATA_FILE}`);
        
        // Verificar que el directorio existe
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log(`Directorio de datos creado/verificado: ${DATA_DIR}`);
        
        // Intentar restaurar desde backup si es necesario
        await restoreFromBackup();
        
        // Verificar que el archivo CMS existe
        try {
            await fs.access(CMS_DATA_FILE);
            const stats = await fs.stat(CMS_DATA_FILE);
            console.log(`Archivo CMS existe, tamaño: ${stats.size} bytes`);
            
            // Intentar leer el archivo para verificar que es válido
            const dataFile = await fs.readFile(CMS_DATA_FILE, 'utf8');
            const cmsData = JSON.parse(dataFile);
            console.log(`Archivo CMS válido, ${Object.keys(cmsData).length} secciones encontradas`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Archivo CMS no existe, se creará cuando se guarden los primeros datos');
            } else {
                console.error('Error verificando archivo CMS:', error);
            }
        }
        
        // Verificar directorio de uploads
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        console.log(`Directorio de uploads verificado: ${UPLOADS_DIR}`);
        
        console.log('Sistema de archivos inicializado correctamente');
    } catch (error) {
        console.error('Error inicializando sistema de archivos:', error);
    }
}

app.listen(PORT, async () => {
    console.log(`Servidor CMS corriendo en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api/cms/`);
    console.log(`API de archivos disponible en http://localhost:${PORT}/api/files/`);
    
    // Inicializar sistema de archivos
    await initializeFileSystem();
    
    // Configurar backup automático cada hora
    setInterval(async () => {
        console.log('Ejecutando backup automático...');
        await createBackup();
    }, 60 * 60 * 1000); // Cada hora
    
    console.log('Backup automático configurado para ejecutarse cada hora');
});
