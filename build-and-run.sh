#!/bin/bash
# Build dan Run Script untuk Docker Container

echo "🚀 Building Docker Image: team16-popl:submit-UTS"

# Build Docker Image
docker build -t team16-popl:submit-UTS .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    
    echo "🔥 Running container..."
    # Run container dengan docker-compose
    docker-compose up -d
    
    echo "🎉 Container is running!"
    echo "📱 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:3000"
    echo "📊 MongoDB: mongodb://localhost:27017"
    
    echo ""
    echo "📋 Container Info:"
    docker ps | grep team16-popl
    
else
    echo "❌ Docker build failed!"
    exit 1
fi