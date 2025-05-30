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

RUN apt-get update -y && apt-get install -y awscli jq

WORKDIR /usr/src/app

COPY ./client/package.json ./
COPY ./client/package-lock.json ./

RUN npm install --force --omit=dev

COPY --from=development /usr/src/app/public ./public
COPY --from=development /usr/src/app/.next ./.next

COPY ./client/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# The command to run the application in production
CMD [ "npm", "run", "start" ]
