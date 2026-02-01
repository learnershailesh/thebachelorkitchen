# Production runtime with PM2
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install PM2 globally for process management
RUN npm install -g pm2

# Install curl for ECS health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs -s /bin/sh

# Create home directory for PM2 permissions
RUN mkdir -p /home/appuser/.pm2 && \
    chown -R appuser:nodejs /home/appuser

# Set ownership of app directory
RUN chown -R appuser:nodejs /app

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Switch to non-root user
USER appuser

# Start application with PM2
CMD ["pm2-runtime", "server.js"]