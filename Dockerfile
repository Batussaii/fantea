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

# Exponer puerto
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["node", "server.js"] 