# Use an official Node.js runtime as the base image
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the container
COPY . .

# Définir une variable d’environnement pour l'URL du backend
ARG BACKEND_URL
ENV BACKEND_URL=${BACKEND_URL}

# Remplacement dynamique de l'URL du backend
RUN sed -i "s|@BACKEND_URL@|${BACKEND_URL}|g" src/environment/environment.prod.ts

# Build the Angular app
RUN node_modules/.bin/ng build --configuration production

# Use NGINX as the production server
FROM nginx:alpine
COPY --from=build /app/dist/ndfrais /usr/share/nginx/html

# Copy the custom NGINX configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
