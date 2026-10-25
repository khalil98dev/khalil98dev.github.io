# Deploy script for Khalil Bachir's Digital CV & Portfolio
Write-Host "Pushing to GitHub (khalil98dev.github.io)..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Your automated GitHub Actions CI/CD will now build and deploy the site." -ForegroundColor Cyan
    Write-Host "Live URL: https://khalil98dev.github.io" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. Please ensure https://github.com/new has the repository 'khalil98dev.github.io' created." -ForegroundColor Yellow
}
