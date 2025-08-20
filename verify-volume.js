#!/usr/bin/env node

/**
 * Script para verificar la integridad del volumen persistente
 * Uso: node verify-volume.js
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = process.env.NODE_ENV === 'production' ? '/app/data' : path.join(__dirname, 'data');
const CMS_DATA_FILE = path.join(DATA_DIR, 'cms-data.json');

async function verifyVolume() {
    console.log('=== Verificación de Integridad del Volumen Persistente ===\n');
    
    try {
        // Verificar que el directorio existe
        console.log(`1. Verificando directorio de datos: ${DATA_DIR}`);
        try {
            const stats = await fs.stat(DATA_DIR);
            console.log(`   ✓ Directorio existe`);
            console.log(`   - Permisos: ${stats.mode.toString(8)}`);
            console.log(`   - Propietario: ${stats.uid}:${stats.gid}`);
        } catch (error) {
            console.log(`   ✗ Error: ${error.message}`);
            return;
        }
        
        // Verificar archivo CMS
        console.log(`\n2. Verificando archivo CMS: ${CMS_DATA_FILE}`);
        try {
            const stats = await fs.stat(CMS_DATA_FILE);
            console.log(`   ✓ Archivo existe`);
            console.log(`   - Tamaño: ${stats.size} bytes`);
            console.log(`   - Última modificación: ${stats.mtime.toISOString()}`);
            
            // Verificar contenido JSON
            const content = await fs.readFile(CMS_DATA_FILE, 'utf8');
            const data = JSON.parse(content);
            console.log(`   ✓ JSON válido`);
            console.log(`   - Secciones: ${Object.keys(data).length}`);
            
            // Mostrar algunas secciones
            const sections = Object.keys(data).slice(0, 5);
            console.log(`   - Primeras secciones: ${sections.join(', ')}`);
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`   ⚠ Archivo no existe`);
            } else if (error instanceof SyntaxError) {
                console.log(`   ✗ JSON inválido: ${error.message}`);
            } else {
                console.log(`   ✗ Error: ${error.message}`);
            }
        }
        
        // Verificar directorio de backups
        console.log(`\n3. Verificando directorio de backups: ${path.join(DATA_DIR, 'backups')}`);
        try {
            const backupDir = path.join(DATA_DIR, 'backups');
            const files = await fs.readdir(backupDir);
            const backupFiles = files.filter(f => f.startsWith('cms-data-') && f.endsWith('.json'));
            
            console.log(`   ✓ Directorio de backups existe`);
            console.log(`   - Backups encontrados: ${backupFiles.length}`);
            
            if (backupFiles.length > 0) {
                backupFiles.sort();
                const latestBackup = backupFiles[backupFiles.length - 1];
                const backupPath = path.join(backupDir, latestBackup);
                const backupStats = await fs.stat(backupPath);
                
                console.log(`   - Último backup: ${latestBackup}`);
                console.log(`   - Tamaño: ${backupStats.size} bytes`);
                console.log(`   - Fecha: ${backupStats.mtime.toISOString()}`);
            }
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`   ⚠ Directorio de backups no existe`);
            } else {
                console.log(`   ✗ Error: ${error.message}`);
            }
        }
        
        // Verificar directorio de uploads
        console.log(`\n4. Verificando directorio de uploads: ${path.join(DATA_DIR, 'uploads')}`);
        try {
            const uploadsDir = path.join(DATA_DIR, 'uploads');
            const stats = await fs.stat(uploadsDir);
            console.log(`   ✓ Directorio de uploads existe`);
            
            // Contar archivos en uploads
            const files = await fs.readdir(uploadsDir, { recursive: true });
            console.log(`   - Archivos totales: ${files.length}`);
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`   ⚠ Directorio de uploads no existe`);
            } else {
                console.log(`   ✗ Error: ${error.message}`);
            }
        }
        
        // Verificar espacio disponible
        console.log(`\n5. Verificando espacio disponible`);
        try {
            const { execSync } = require('child_process');
            const dfOutput = execSync(`df -h ${DATA_DIR}`, { encoding: 'utf8' });
            console.log(`   Información de espacio:`);
            console.log(dfOutput);
        } catch (error) {
            console.log(`   ⚠ No se pudo obtener información de espacio: ${error.message}`);
        }
        
        console.log(`\n=== Verificación completada ===`);
        
    } catch (error) {
        console.error('Error durante la verificación:', error);
    }
}

// Ejecutar verificación
verifyVolume();
