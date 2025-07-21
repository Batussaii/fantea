# Usar nginx como servidor web
FROM nginx:alpine

# Copiar archivos del sitio web al directorio de nginx
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 8080 (requerido por Fly.io)
EXPOSE 8080

# Nginx se ejecuta automáticamente 