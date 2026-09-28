FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY packages/shared/package.json packages/shared/
RUN npm ci
COPY backend backend
COPY packages/shared packages/shared
RUN npm run build -w packages/shared && npm run build -w backend
EXPOSE 4000
CMD ["npm","run","start","-w","backend"]
