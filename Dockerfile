# Usar Node.js como base
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar todo el código fuente
COPY . .

# Crear directorio para datos del CMS
RUN mkdir -p /app/data

# Dar permisos al directorio de datos
RUN chmod 755 /app/data

# Exponer puerto (fly.io usa 3001)
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["node", "server.js"] 