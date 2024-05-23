# Utiliser l'image Node.js 18 comme base
FROM node:18 AS builder
# Définir le répertoire de travail dans le conteneur
WORKDIR /app
RUN npm install -g @angular/cli
# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./ 
# Installer les dépendances
RUN npm install

# Copier tout le reste des fichiers du frontend
COPY . .
# Exposer le port sur lequel Nginx écoute
EXPOSE 4200
#CMD ["npm", "start"]

CMD ["ng", "serve", "--host", "0.0.0.0"]
