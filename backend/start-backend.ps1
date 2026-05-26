$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
Set-Location -LiteralPath "$PSScriptRoot"
Start-Process -NoNewWindow -Wait ".\mvnw.cmd" "spring-boot:run"
if (-not $?) {
  Read-Host "Pressione Enter para sair"
}
