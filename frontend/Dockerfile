# AI Workflow Builder - Dockerfile (Frontend)
FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

## Clean up node_modules and package-lock.json to avoid npm/rollup bugs
RUN rm -rf node_modules package-lock.json || true
RUN npm install --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5175

# Start the application
CMD ["npm", "run", "preview", "--", "--port", "5175", "--host"]