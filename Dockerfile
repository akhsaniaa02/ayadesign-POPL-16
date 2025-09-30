# Dockerfile untuk Ayadesign - Frontend & Backend dalam satu container
FROM node:16-alpine

# Install dependencies yang diperlukan
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Install serve globally untuk frontend
RUN npm install -g serve

# Copy dan install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy dan install frontend dependencies  
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy source code
COPY server/ ./server/
COPY client/ ./client/

# Build frontend
RUN cd client && npm run build

# Create uploads directory
RUN mkdir -p ./server/uploads

# Expose ports
EXPOSE 3000 5173

# Create and set startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting Ayadesign Application..."' >> /app/start.sh && \
    echo 'echo "📡 Starting backend server on port 3000..."' >> /app/start.sh && \
    echo 'cd /app/server && node index.js &' >> /app/start.sh && \
    echo 'echo "🌐 Starting frontend server on port 5173..."' >> /app/start.sh && \
    echo 'cd /app && serve -s client/dist -l 5173 &' >> /app/start.sh && \
    echo 'echo "✅ Application started successfully!"' >> /app/start.sh && \
    echo 'echo "Frontend: http://localhost:5173"' >> /app/start.sh && \
    echo 'echo "Backend: http://localhost:3000"' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start application
CMD ["/app/start.sh"]