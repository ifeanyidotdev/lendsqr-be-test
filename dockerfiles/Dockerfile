FROM node:23.4-bullseye-slim 

RUN npm install -g pnpm 

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install 

COPY . .

EXPOSE 3000


