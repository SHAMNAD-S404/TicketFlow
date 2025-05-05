FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN  npm install

# Copy just the prisma directory first
COPY src/prisma ./src/prisma/

# Generate Prisma client with the new schema path
RUN npx prisma generate --schema=./src/prisma/schema.prisma

COPY . .





EXPOSE 4800

ENV NODE_ENV=development


RUN  addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["npm", "run", "dev"]

