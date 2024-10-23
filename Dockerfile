# Build stage
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server.js ./
COPY package*.json ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "server.js"]
