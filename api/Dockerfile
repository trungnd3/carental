FROM node:22-slim AS development

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY ./api/package.json ./
COPY ./api/package-lock.json ./
COPY ./api/tsconfig.json ./
COPY ./api/tsconfig.build.json ./
COPY ./api/nest-cli.json ./

RUN npm install

COPY ./api .

ENV NODE_ENV=development

RUN npm run build

FROM node:22-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get update -y && apt-get install -y openssl awscli jq

WORKDIR /usr/src/app

COPY ./api/package.json ./
COPY ./api/package-lock.json ./
COPY ./api/nest-cli.json ./

RUN npm install --omit=dev

COPY --from=development /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/dist ./dist

RUN apt-get update -y && apt-get install -y openssl

COPY ./api/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# The command to run the application in production
CMD ["npm", "run", "start:seed:prod"]
