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
        } catch (error) {
            // Archivo no existe, empezar con objeto vacío
            console.log('Creando nuevo archivo de datos CMS');
        }
        
        // Actualizar sección
        cmsData[section] = {
            ...data,
            lastModified: new Date().toISOString(),
            modifiedBy: req.body.user || 'admin'
        };
        
        // Guardar en archivo
        await fs.writeFile(CMS_DATA_FILE, JSON.stringify(cmsData, null, 2));
        
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
        res.json({ success: true, data: cmsData });
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Archivo no existe, devolver objeto vacío
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

app.listen(PORT, () => {
    console.log(`Servidor CMS corriendo en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api/cms/`);
    console.log(`API de archivos disponible en http://localhost:${PORT}/api/files/`);
});
