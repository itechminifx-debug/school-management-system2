@echo off
title School Management System Server
echo ============================================
echo   🏫 SCHOOL MANAGEMENT SYSTEM
echo ============================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server...
node server.js
pause