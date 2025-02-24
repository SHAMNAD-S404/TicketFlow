

FROM node:20-alpine3.18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

EXPOSE  3000

# set env variables
ENV NODE_ENV=development

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER adduser

CMD [ "npm" , "run" , "dev" ]