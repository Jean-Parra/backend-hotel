# Utiliza la imagen base de Node
FROM node

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración del backend al contenedor
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia el código fuente del backend al contenedor
COPY . .

# Expone el puerto 8080 para el backend
EXPOSE 8080

# Ejecuta el comando para iniciar el backend
CMD ["npm", "run", "dev"]