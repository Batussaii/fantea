#!/bin/bash

# Script de despliegue para FANTEA en fly.io
echo "🚀 Desplegando FANTEA en fly.io..."

# Verificar que flyctl esté instalado
if ! command -v flyctl &> /dev/null; then
    echo "❌ Error: flyctl no está instalado. Instálalo desde https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Verificar que estés logueado en fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Iniciando sesión en fly.io..."
    flyctl auth login
fi

# Crear volumen persistente si no existe
echo "💾 Verificando volumen persistente..."
if ! flyctl volumes list | grep -q "fantea_data"; then
    echo "📦 Creando volumen persistente..."
    flyctl volumes create fantea_data --size 1 --region mad
else
    echo "✅ Volumen persistente ya existe"
fi

# Verificar que el archivo cms-data.json existe
if [ ! -f "cms-data.json" ]; then
    echo "⚠️  Advertencia: cms-data.json no existe, creando archivo inicial..."
    echo '{"hero":{"title":"Unidos por la diversidad, comprometidos con el autismo en Andalucía","description":"FANTEA es la federación que une a las asociaciones de autismo de toda Andalucía para defender derechos, promover inclusión y ofrecer recursos especializados a personas autistas y sus familias.","image":"images/hero-inclusive.jpg","buttons":{"about":"Conócenos","affiliate":"Afíliate","donate":"Haz una Donación"},"lastModified":"2025-01-15T10:00:00.000Z","modifiedBy":"admin"},"stats":{"stats":[{"number":"1 de 100","description":"niños tienen autismo"},{"number":"500+","description":"familias andaluzas apoyadas"},{"number":"15","description":"años de experiencia"},{"number":"35+","description":"asociaciones afiliadas"}]},"features":{"title":"Nuestros Pilares Fundamentales","subtitle":"Trabajamos en múltiples frentes para construir una sociedad más inclusiva","features":[{"title":"Quiénes Somos","description":"Conoce FANTEA, la Federación Andaluza TEA que defiende los derechos de las personas autistas y sus familias en Andalucía.","icon":"fas fa-users","linkText":"Conoce más"},{"title":"Asociaciones Federadas","description":"Descubre las asociaciones que forman parte de FANTEA y cómo trabajamos de forma coordinada.","icon":"fas fa-handshake","linkText":"Ver asociaciones"},{"title":"Áreas de Trabajo","description":"Educación, salud, vida adulta, inclusión social y vivienda. Trabajamos en todos los ámbitos de la vida.","icon":"fas fa-briefcase","linkText":"Ver áreas"},{"title":"Nuestro Manifiesto","description":"Conoce nuestros compromisos y valores para defender los derechos del colectivo TEA en Andalucía.","icon":"fas fa-file-alt","linkText":"Leer manifiesto"}]},"cta":{"title":"Únete a Nuestra Comunidad","description":"Forma parte del cambio hacia una sociedad más inclusiva y accesible para las personas autistas y sus familias.","buttons":{"primary":"Afíliate Ahora","secondary":"Contactar"}}}' > cms-data.json
fi

# Desplegar la aplicación
echo "🚀 Desplegando aplicación..."
flyctl deploy

# Verificar el estado
echo "🔍 Verificando estado del despliegue..."
flyctl status

echo ""
echo "✅ ¡Despliegue completado!"
echo ""
echo "🌐 URLs disponibles:"
echo "   - Sitio web: https://fantea.fly.dev"
echo "   - Dashboard CMS: https://fantea.fly.dev/admin/login.html"
echo "   - API CMS: https://fantea.fly.dev/api/cms/load"
echo ""
echo "📊 Características del despliegue:"
echo "   - Servidor Node.js siempre activo"
echo "   - Datos persistentes en volumen fly.io"
echo "   - Cambios del CMS visibles para todos los usuarios"
echo "   - HTTPS automático"
echo "   - Son visibles para todos los usuarios"
echo "   - El servidor está siempre activo (no se para)"
echo ""
echo "🔧 Comandos útiles:"
echo "   - Ver logs: flyctl logs"
echo "   - Reiniciar: flyctl restart"
echo "   - Ver estado: flyctl status"
