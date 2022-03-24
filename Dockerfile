FROM node:14.17-alpine

ENV NODE_ENV production

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]