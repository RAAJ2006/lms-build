FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Environment optimizations
ENV NODE_OPTIONS=--max-old-space-size=6144
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
