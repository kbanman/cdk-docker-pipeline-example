FROM node:12-alpine

ARG PORT=8080
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node . .
RUN npm install
RUN npm run build

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]