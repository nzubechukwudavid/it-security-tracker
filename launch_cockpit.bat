@echo off
title Study Cockpit Launcher
start "" "C:\Python313\pythonw.exe" "%~dp0serve_study_media.py"
timeout /t 1 /nobreak >nul

set "PROFILE=%~dp0data\cache\app_profile"
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:8080 --user-data-dir="%PROFILE%" --start-maximized --no-first-run --no-default-browser-check
) else if exist "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" (
    start "" "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --app=http://localhost:8080 --user-data-dir="%PROFILE%" --start-maximized --no-first-run --no-default-browser-check
) else (
    start "" "http://localhost:8080"
)