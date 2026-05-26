$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
Set-Location -LiteralPath "$PSScriptRoot"
& ".\mvnw.cmd" clean package
if ($?) {
  java -jar ".\target\pomodoro-backend-1.0.0.jar"
}
