FROM node:18-slim AS builder

WORKDIR /aplication


COPY package.json package-lock.json ./
RUN npm ci

COPY /app ./app
COPY server.js ./


FROM node:18-slim

WORKDIR /aplication
RUN apt-get -y update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*


COPY --from=builder /aplication/app ./app
COPY --from=builder /aplication/node_modules ./node_modules
COPY --from=builder /aplication/package.json ./
COPY --from=builder /aplication/server.js ./




CMD [ "node", "server.js"]