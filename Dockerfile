FROM node:20.12.0-alpine3.19 AS builder

WORKDIR /src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Use build argument for MONGODB_URI
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

RUN npm run build

FROM node:20.12.0-alpine3.19

WORKDIR /src/app

COPY --from=builder /src/app ./

# Reuse the build argument in the final image
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

EXPOSE 3000

CMD ["npm", "run", "start"]
