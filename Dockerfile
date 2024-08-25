FROM node:20.12.0-alpine3.19 AS builder

WORKDIR /src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .


# Define the ARG in the Dockerfile
ARG MONGODB_URI

# Optionally, set an ENV variable based on this ARG
ENV MONGODB_URI=$MONGODB_URI



RUN npm run build

FROM node:20.12.0-alpine3.19

WORKDIR /src/app

COPY --from=builder /src/app ./




EXPOSE 3000

CMD ["npm", "run", "start"]
