@echo off
setlocal
echo ========================================================
echo   WASTEWISE AI - SMART HOTSPOT & ROUTE COMMAND CENTER
echo   Team Snigger ^| Member: Snigdha Singh
echo   Problem Statement: CS11 (Geospatial Environment)
echo ========================================================
echo.

set "NODE_DIR=C:\Users\singh\.gemini\antigravity\scratch\tools\node"
set "PATH=%NODE_DIR%;%PATH%"

echo Starting Vite Local Server...
echo Prototype URL: http://localhost:3000
echo.

call npm run dev
pause
