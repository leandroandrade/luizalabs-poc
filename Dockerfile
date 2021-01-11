FROM node:10

RUN mkdir -p /home/node/index/node_modules && chown -R node:node /home/node/index

WORKDIR /home/node/index

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 3333

CMD [ "npm", "start" ]
