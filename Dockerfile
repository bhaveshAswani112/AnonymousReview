# Stage 1: Build
FROM node:20.12.0-alpine3.19 AS builder

WORKDIR /src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all the source code
COPY . .

# Define the ARGs for build-time variables
ARG MONGODB_URI
ARG RESEND_API_KEY
ARG NEXTAUTH_SECRET
ARG GROQ_API_KEY
ARG NEXTAUTH_URL

# Set environment variables based on these ARGs
ENV MONGODB_URI=$MONGODB_URI
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV GROQ_API_KEY=$GROQ_API_KEY
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:20.12.0-alpine3.19

WORKDIR /src/app

# Copy the build artifacts from the builder stage
COPY --from=builder /src/app ./

# Expose the application port
EXPOSE 3000

# Define environment variables again to ensure they are set at runtime
ENV MONGODB_URI=$MONGODB_URI
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV GROQ_API_KEY=$GROQ_API_KEY
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Start the application
CMD ["npm", "run", "start"]
