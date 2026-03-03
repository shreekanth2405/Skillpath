# SkillPath - Start All Services
Write-Host "🚀 Starting SkillPath Ecosystem..." -ForegroundColor Cyan

# 1. Start Backend
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -NoExit -Command ""cd backend; cmd /c npm run dev"""

# 2. Start Frontend
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -NoExit -Command ""cd frontend; cmd /c npm run dev"""

Write-Host "✅ Both servers are launching in separate windows." -ForegroundColor Green
Write-Host "---------------------------------------------------"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend:  http://localhost:5000"
Write-Host "---------------------------------------------------"
Write-Host "💡 Note: Ensure your environment variables are configured correctly." -ForegroundColor Yellow

