# Use a newer Node version for better compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Set Node options to avoid memory issues during build
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy the rest of the application code
COPY . .

# Build the Next.js project
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
