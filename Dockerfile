FROM node:22-alpine

COPY package.json package-lock.json bun.lock jsconfig.json ./
COPY src ./
COPY .env ./
COPY README.md .gitignore ./


WORKDIR /



RUN npm install

CMD ["npm","start"]




