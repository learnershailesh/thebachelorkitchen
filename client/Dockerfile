# Stage 1: Build React app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package.json package-lock.json ./

# Install dependencies with clean install for reproducible builds
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config template
COPY nginx/thebachelorskitchens.conf.template /etc/nginx/templates/thebachelorskitchens.conf.template

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create entrypoint script inline for runtime env injection
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env-entrypoint.sh && \
    echo 'echo "window._env_ = {" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-env-entrypoint.sh && \
    echo 'echo "  VITE_API_BASE_URL: \"${VITE_API_BASE_URL}\"" >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-env-entrypoint.sh && \
    echo 'echo "};" >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-env-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.d/40-env-entrypoint.sh && \
    chmod +x /docker-entrypoint.d/40-env-entrypoint.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]