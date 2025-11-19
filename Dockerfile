# Frontend
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Backend
FROM node:18
WORKDIR /app
COPY server/package.json ./server/
WORKDIR /app/server
RUN npm install
COPY server/. .
WORKDIR /app
COPY --from=build /app/dist ./server/dist

EXPOSE 3000
CMD ["node", "server/index.js"]
