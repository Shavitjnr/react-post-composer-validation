# ==============================================================================
# STAGE 1: Build Stage (Vite + React)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm install

# Copy application source code
COPY . .

# Compile optimized production bundle
RUN npm run build

# ==============================================================================
# STAGE 2: Production Nginx Server
# ==============================================================================
FROM nginx:1.27-alpine AS runner

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing rules
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check to ensure Nginx is serving content
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
