@echo off
REM Build dan Run Script untuk Docker Container (Windows)

echo 🚀 Ayadesign Docker Deployment Script
echo.

REM Check if server/.env file exists
if not exist "server\.env" (
    echo ⚠️  Warning: server/.env file not found!
    echo 📝 Please create server/.env with your credentials:
    echo    - MongoDB Atlas URI
    echo    - JWT Secret
    echo    - Cloudinary credentials
    echo.
    echo Example server/.env:
    echo MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ayadesign
    echo JWT_SECRET=your-secret-key
    echo PORT=3001
    echo CLOUDINARY_CLOUD_NAME=your_cloud_name
    echo CLOUDINARY_API_KEY=your_api_key
    echo CLOUDINARY_API_SECRET=your_api_secret
    echo.
    pause
    exit /b 1
)

echo 🚀 Building Docker Image: team16-popl:submit-UTS
echo.

REM Build Docker Image
docker build -t team16-popl:submit-UTS .

if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker image built successfully!
    echo.
    
    echo 🔥 Running container...
    REM Run container dengan docker-compose
    docker-compose up -d
    
    echo.
    echo 🎉 Container is running!
    echo 📱 Frontend: http://localhost:5173
    echo 🔧 Backend API: http://localhost:3001
    echo 💚 Health Check: http://localhost:3001/
    
    echo.
    echo 📋 Container Info:
    docker ps | findstr team16-popl
    
    echo.
    echo 📝 Useful commands:
    echo    View logs: docker-compose logs -f
    echo    Stop: docker-compose down
    echo    Restart: docker-compose restart
    
) else (
    echo ❌ Docker build failed!
    exit /b 1
)