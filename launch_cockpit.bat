@echo off
title Study Cockpit Launcher
start "" "C:\Python313\pythonw.exe" "%~dp0serve_study_media.py"
timeout /t 1 /nobreak >nul
start "" "https://it-security-tracker.vercel.app"
