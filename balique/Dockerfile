# Use Node.js Alpine
FROM node:20-alpine

# Install bash (optional)
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install -g serve
RUN npm install

# Copy the rest of the project
COPY . .

# Build React app
RUN npm run build

# Expose port
EXPOSE 3001

# Serve the app
CMD ["serve", "-s", "build", "-l", "3001"]