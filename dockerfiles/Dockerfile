FROM node:23.4-bullseye-slim as builder 

RUN npm install -g pnpm 

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-localfile

COPY . .

EXPOSE 3000


