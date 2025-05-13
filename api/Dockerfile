FROM node:22-slim AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

RUN npm install

COPY . .

RUN apt-get update -y && apt-get install -y openssl

RUN npm run build

FROM node:22-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY nest-cli.json ./

RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

RUN apt-get update -y && apt-get install -y openssl

CMD [ "node", "dist/main" ]
