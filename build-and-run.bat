@echo off
REM Build dan Run Script untuk Docker Container (Windows)

echo 🚀 Ayadesign Docker Deployment Script
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found!
    echo 📝 Creating .env from .env.docker template...
    copy .env.docker .env
    echo.
    echo ⚡ Please edit .env file and add your credentials:
    echo    - MongoDB Atlas URI
    echo    - JWT Secret
    echo    - Cloudinary credentials
    echo.
    echo Press any key after editing .env file...
    pause
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