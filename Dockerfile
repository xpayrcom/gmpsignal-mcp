FROM node:20-alpine

WORKDIR /app
COPY package.json README.md LICENSE ./
COPY bin ./bin

ENTRYPOINT ["node", "/app/bin/cli.js"]
