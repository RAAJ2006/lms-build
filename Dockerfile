# Use official Node.js image with Alpine Linux (lightweight)
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Clean npm cache to reduce image size
RUN npm cache clean --force

# Copy the rest of the application code
COPY . .

# Build the Next.js project with verbose output for debugging
RUN npm run build --verbose

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary build files from the build stage
COPY --from=build /app /app

# Set memory allocation and disable telemetry
ENV NODE_OPTIONS="--max-old-space-size=12288"
ENV NEXT_TELEMETRY_DISABLED=1


# Expose port 3000
EXPOSE 3000

# Install production dependencies
RUN npm ci --only=production

# Start the application
CMD ["npm", "start"]
