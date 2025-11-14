@echo off
title Student Portal - Dev Server
color 0A
echo ========================================
echo   Student Portal - Development Server
echo ========================================
echo.
echo Starting server at http://localhost:3000/
echo.
echo IMPORTANT:
echo   - Keep this window OPEN while developing
echo   - Browser will AUTO-REFRESH on file save
echo   - Press Ctrl+C to stop server
echo.
echo ========================================
echo.

cd /d "%~dp0"

:START
npm run dev

echo.
echo Server stopped unexpectedly!
echo Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto START
