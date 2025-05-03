FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Clean npm cache
RUN npm cache clean --force

# Set memory allocation and disable telemetry
ENV NODE_OPTIONS=--max-old-space-size=6144
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the rest of the app
COPY . .

# Build the project with verbose output for debugging
RUN npm run build --verbose

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
