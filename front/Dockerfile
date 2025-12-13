# Use Node 20 Alpine
FROM node:20-alpine

# Install bash and build tools
RUN apk add --no-cache bash

WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build Next.js
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start Next.js using npx to ensure the binary is found
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
