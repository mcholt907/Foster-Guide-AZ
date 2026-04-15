# FosterHub AZ — Scheduled git pull
# Runs via Windows Task Scheduler after Monday GitHub Actions complete.
# Log written to scripts/git-pull.log

$repoPath = "C:\Users\farkh\OneDrive\Documents\Foster Guide AZ"
$logFile  = Join-Path $repoPath "scripts\git-pull.log"

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Set-Location $repoPath

$output = git pull origin master 2>&1
$exitCode = $LASTEXITCODE

Add-Content -Path $logFile -Value ""
Add-Content -Path $logFile -Value "[$timestamp] git pull origin master"
Add-Content -Path $logFile -Value $output
Add-Content -Path $logFile -Value "Exit code: $exitCode"
