#!/bin/bash
# Build dan Run Script untuk Docker Container

echo "🚀 Ayadesign Docker Deployment Script"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Creating .env from .env.docker template..."
    cp .env.docker .env
    echo ""
    echo "⚡ Please edit .env file and add your credentials:"
    echo "   - MongoDB Atlas URI"
    echo "   - JWT Secret"
    echo "   - Cloudinary credentials"
    echo ""
    echo "Press Enter after editing .env file..."
    read
fi

echo "🚀 Building Docker Image: team16-popl:submit-UTS"
echo ""

# Build Docker Image
docker build -t team16-popl:submit-UTS .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    
    echo "🔥 Running container..."
    # Run container dengan docker-compose
    docker-compose up -d
    
    echo ""
    echo "🎉 Container is running!"
    echo "📱 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:3001"
    echo "💚 Health Check: http://localhost:3001/"
    
    echo ""
    echo "📋 Container Info:"
    docker ps | grep team16-popl
    
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop: docker-compose down"
    echo "   Restart: docker-compose restart"
    
else
    echo "❌ Docker build failed!"
    exit 1
fi