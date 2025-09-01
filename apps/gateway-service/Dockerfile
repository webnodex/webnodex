FROM oven/bun:1-alpine

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

COPY ./dist /app/

WORKDIR /app

RUN bun install --production

CMD [ "bun", "run", "main.js" ]
