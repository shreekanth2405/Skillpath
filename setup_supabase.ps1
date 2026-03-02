# Supabase Setup Script for Skillpath Backend

Write-Host "🚀 Starting Supabase Setup..." -ForegroundColor Cyan

# 1. Check for DATABASE_URL in backend/.env
$envFile = "backend/.env"
if (Test-Path $envFile) {
    $content = Get-Content $envFile
    if ($content -match "DATABASE_URL=.*supabase\.co") {
        Write-Host "✅ Supabase DATABASE_URL detected." -ForegroundColor Green
    } else {
        Write-Host "⚠️  Supabase DATABASE_URL not detected in backend/.env." -ForegroundColor Yellow
        Write-Host "Please ensure your DATABASE_URL in backend/.env points to your Supabase project." -ForegroundColor Gray
    }
} else {
    Write-Host "❌ backend/.env not found." -ForegroundColor Red
    exit 1
}

# 2. Run Prisma Generate
Write-Host "📦 Generating Prisma Client..." -ForegroundColor Cyan
Set-Location backend
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma Generate failed." -ForegroundColor Red
    Set-Location ..
    exit 1
}

# 3. Push Schema to Supabase
Write-Host "📤 Pushing Schema to Supabase..." -ForegroundColor Cyan
Write-Host "This will create the tables in your Supabase project." -ForegroundColor Gray
# npx prisma db push --accept-data-loss # Uncomment this to auto-push
Write-Host "Please run 'npx prisma db push' manually in the backend directory to apply the schema." -ForegroundColor Yellow

# 4. Success Message
Write-Host "🎉 Backend is ready for Supabase!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Gray
Write-Host "1. cd backend" -ForegroundColor Gray
Write-Host "2. npx prisma db push" -ForegroundColor Gray
Write-Host "3. node seed_admin.js" -ForegroundColor Gray
Write-Host "4. node seed_jobs.js" -ForegroundColor Gray
Write-Host "5. npm run dev" -ForegroundColor Gray

Set-Location ..
