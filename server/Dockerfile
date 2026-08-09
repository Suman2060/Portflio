# Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install bash for running prisma/migrations scripts
RUN apk add --no-cache bash

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 5500

CMD ["node", "src/server.js"]
