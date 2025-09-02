FROM node:22-alpine3.22

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

COPY ./dist /app/
WORKDIR /app

CMD [ "node", "main.js" ]
