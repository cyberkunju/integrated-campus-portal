# Student Portal - Development Server
# This script starts and maintains the Vite dev server

$Host.UI.RawUI.WindowTitle = "Student Portal - Dev Server"
$Host.UI.RawUI.BackgroundColor = "DarkBlue"
$Host.UI.RawUI.ForegroundColor = "White"
Clear-Host

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Student Portal - Development Server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server at http://localhost:3000/" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "  - Keep this window OPEN while developing" -ForegroundColor White
Write-Host "  - Browser will AUTO-REFRESH on file save" -ForegroundColor White
Write-Host "  - Press Ctrl+C to stop server" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# Start the dev server
npm run dev

# Keep window open if server stops
Write-Host ""
Write-Host "Server stopped. Press any key to close..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
