FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci
COPY frontend frontend
ARG VITE_API_URL=http://localhost:4000
ARG VITE_SOCKET_URL=http://localhost:4000
RUN npm run build -w frontend
FROM nginx:1.27-alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
