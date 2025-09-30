@echo off
REM Build dan Run Script untuk Docker Container (Windows)

echo 🚀 Building Docker Image: team16-popl:submit-UTS

REM Build Docker Image
docker build -t team16-popl:submit-UTS .

if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker image built successfully!
    
    echo 🔥 Running container...
    REM Run container dengan docker-compose
    docker-compose up -d
    
    echo 🎉 Container is running!
    echo 📱 Frontend: http://localhost:5173
    echo 🔧 Backend API: http://localhost:3000
    echo 📊 MongoDB: mongodb://localhost:27017
    
    echo.
    echo 📋 Container Info:
    docker ps | findstr team16-popl
    
) else (
    echo ❌ Docker build failed!
    exit /b 1
)