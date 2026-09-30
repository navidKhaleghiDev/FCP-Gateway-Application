FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci
COPY backend backend
RUN npm run build -w backend
EXPOSE 4000
CMD ["npm","run","start","-w","backend"]
