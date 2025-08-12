const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentar límite para imágenes
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.')); // Servir archivos estáticos

// Ruta para guardar datos del CMS
app.post('/api/cms/save', async (req, res) => {
    try {
        const { section, data } = req.body;
        
        // Cargar datos existentes
        let cmsData = {};
        try {
            const dataFile = await fs.readFile('cms-data.json', 'utf8');
            cmsData = JSON.parse(dataFile);
        } catch (error) {
            // Archivo no existe, empezar con objeto vacío
        }
        
        // Actualizar sección
        cmsData[section] = {
            ...data,
            lastModified: new Date().toISOString(),
            modifiedBy: req.body.user || 'admin'
        };
        
        // Guardar en archivo
        await fs.writeFile('cms-data.json', JSON.stringify(cmsData, null, 2));
        
        res.json({ success: true, message: 'Datos guardados correctamente' });
    } catch (error) {
        console.error('Error guardando datos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para cargar datos del CMS
app.get('/api/cms/load', async (req, res) => {
    try {
        const dataFile = await fs.readFile('cms-data.json', 'utf8');
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
        const dataFile = await fs.readFile('cms-data.json', 'utf8');
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

// Ruta para subir imágenes
app.post('/api/upload/image', async (req, res) => {
    try {
        const { imageData, filename } = req.body;
        
        // Crear directorio de imágenes si no existe
        const imagesDir = path.join(__dirname, 'images', 'cms');
        await fs.mkdir(imagesDir, { recursive: true });
        
        // Guardar imagen (asumiendo que viene en base64)
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(imagesDir, filename);
        
        await fs.writeFile(filePath, buffer);
        
        res.json({ 
            success: true, 
            url: `/images/cms/${filename}`,
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
