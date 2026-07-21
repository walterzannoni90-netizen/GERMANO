@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error installing dependencies. Please run manually: npm install
    pause
    exit /b 1
)
echo Starting development server...
echo Open http://localhost:3000 in your browser
call npm run dev
