# 设置错误时停止执行
$ErrorActionPreference = "Stop"

Write-Host "Starting deployment..." -ForegroundColor Green

try {
    # 1. 构建项目
    Write-Host "1. Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # 2. 添加所有更改到git
    Write-Host "2. Adding changes to Git..." -ForegroundColor Yellow
    git add .
    if ($LASTEXITCODE -ne 0) { throw "Git add failed" }

    # 3. 获取当前时间作为提交信息
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "Update: $timestamp"

    # 4. 提交更改
    Write-Host "3. Committing changes..." -ForegroundColor Yellow
    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed" }

    # 5. 推送到GitHub
    Write-Host "4. Pushing to GitHub..." -ForegroundColor Yellow
    git push
    if ($LASTEXITCODE -ne 0) { throw "Git push failed" }

    Write-Host "Deployment completed!" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
} 