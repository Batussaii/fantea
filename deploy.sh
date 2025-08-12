#!/bin/bash

echo "🚀 Desplegando FANTEA CMS a Fly.io..."

# Verificar que flyctl esté instalado
if ! command -v flyctl &> /dev/null; then
    echo "❌ Error: flyctl no está instalado"
    echo "Instala flyctl desde: https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Verificar que estés logueado
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Iniciando sesión en Fly.io..."
    flyctl auth login
fi

# Construir y desplegar
echo "📦 Construyendo aplicación..."
flyctl deploy

echo "✅ Despliegue completado!"
echo "🌐 Tu aplicación está disponible en: https://fantea.fly.dev"
echo "📊 Dashboard CMS: https://fantea.fly.dev/admin/dashboard.html"
