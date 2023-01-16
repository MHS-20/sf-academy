FROM node:18

# Copying folders
COPY ./src/backend root/exchange_microservice/src/backend
COPY ./src/frontend root/exchange_microservice/src/frontend
COPY ./public root/exchange_microservice/public

# Copying files
COPY ./*.yml root/exchange_microservice/
COPY ./*.json root/exchange_microservice/
COPY ./private.key root/exchange_microservice/private.key
COPY ./README.md root/exchange_microservice/README.md
COPY ./env root/exchange_microservice/.env

## ---- Installing dependencies 
# COPY ./package.json root/exchange_microservice/package.json
RUN npm install root/exchange_microservice/package.json

EXPOSE 3000
CMD npm run server