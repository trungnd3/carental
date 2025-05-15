FROM node:22-slim AS development

WORKDIR /usr/src/app

COPY ./client/package.json ./
COPY ./client/package-lock.json ./
COPY ./client/tsconfig.json ./

RUN npm install --force

COPY ./client .

RUN npm run build

FROM node:22-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./client/package.json ./
COPY ./client/package-lock.json ./

RUN npm install --force --omit=dev

COPY --from=development /usr/src/app/public ./public
COPY --from=development /usr/src/app/.next ./.next

CMD [ "npm", "run", "start" ]
