FROM node:20-alpine3.18

WORKDIR /app

COPY package.json package-lock.json ./

RUN  npm install

COPY . .

EXPOSE 4100

ENV NODE_ENV=development

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD [ "npm" , "run" , "dev" ]

