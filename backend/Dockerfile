# Utiliser l'image Node.js 18 comme base
FROM node:18.20.2
# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install
# Reconstruire le module bcrypt
RUN npm install bcrypt
#RUN npm rebuild bcrypt --build-from-source
# Copier tout le reste des fichiers du backend

COPY . .

# Exposer le port sur lequel le serveur Express écoute
EXPOSE 3000

# Commande pour démarrer le serveur
CMD ["node", "server.js"]
