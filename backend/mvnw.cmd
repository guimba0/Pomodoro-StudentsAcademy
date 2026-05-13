@echo off
setlocal enabledelayedexpansion

set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR%"=="" set "MAVEN_PROJECTBASEDIR=."
set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"

if not "%JAVA_HOME%"=="" (
  set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
) else (
  where java >nul 2>&1
  if !ERRORLEVEL! equ 0 (
    for /f "delims=" %%i in ('where java') do set "JAVA_EXE=%%i"
  ) else (
    echo ERROR: JAVA_HOME is not set and java is not in PATH.
    exit /b 1
  )
)

if not exist "%JAVA_EXE%" (
  echo ERROR: Java executable not found at %JAVA_EXE%
  exit /b 1
)

set "DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

for /f "usebackq tokens=1,2 delims==" %%a in ("%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties") do (
  if "%%a"=="wrapperUrl" set "DOWNLOAD_URL=%%b"
)

if not exist "%WRAPPER_JAR%" (
  echo Downloading maven-wrapper.jar...
  powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')"
  if !ERRORLEVEL! neq 0 (
    echo Failed to download maven-wrapper.jar
    exit /b 1
  )
)

"%JAVA_EXE%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*

endlocal
