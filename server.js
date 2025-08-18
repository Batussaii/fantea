const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar ruta de datos persistente
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/app/data' : path.join(__dirname, 'data');
const CMS_DATA_FILE = path.join(DATA_DIR, 'cms-data.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentar límite para imágenes
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.')); // Servir archivos estáticos desde la app
// Servir archivos subidos desde el volumen persistente
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
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

app.listen(PORT, () => {
    console.log(`Servidor CMS corriendo en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api/cms/`);
});
