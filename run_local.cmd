@echo off
setlocal enabledelayedexpansion

:: Ensure working directory is always this script's directory
cd /d "%~dp0"

title Manas Mishra Portfolio — Full-Stack Runner
echo =======================================================================
echo              MANAS MISHRA -- PORTFOLIO WORKSTATION
echo              DATA -^> INTELLIGENCE -^> APPLICATION
echo =======================================================================
echo.
echo Starting Full-Stack Developer Portfolio...
echo.

:: Detect Python environment for FastAPI backend
set "PYTHON_EXE="

:: 1. Check local backend .venv first
if exist "%~dp0backend\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0backend\.venv\Scripts\python.exe"
)

:: 2. Check standard uv python if local venv is missing
if not defined PYTHON_EXE (
    if exist "%USERPROFILE%\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe" (
        set "PYTHON_EXE=%USERPROFILE%\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe"
    )
)

:: 3. Check system Python only if it actually executes cleanly
if not defined PYTHON_EXE (
    python --version >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set "PYTHON_EXE=python"
    )
)

:: Launch FastAPI backend if python is available
if defined PYTHON_EXE (
    echo [INFO] Python detected: !PYTHON_EXE!
    echo [INFO] Launching FastAPI backend on port 8000...
    start "FastAPI Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && "!PYTHON_EXE!" -m uvicorn app.main:app --reload --port 8000"
) else (
    echo [NOTICE] Python executable not found or not configured with uvicorn.
    echo Next.js native API Route Handlers will serve as the active API layer.
)

echo.
echo [INFO] Starting React / Next.js Frontend...
echo -----------------------------------------------------------------------
echo  Frontend : http://localhost:3000
echo  Backend  : http://localhost:8000
echo  API Docs : http://localhost:8000/docs
echo -----------------------------------------------------------------------
echo.

:: Change into frontend directory and launch Next.js
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies first...
    call npm install
)

call npm run dev

:: Keep window open if dev server exits or encounters an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Frontend process exited with error code %ERRORLEVEL%.
    pause
)
