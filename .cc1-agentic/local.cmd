@echo off
rem SPDX-License-Identifier: AGPL-3.0-only
setlocal
cd /d "%~dp0.."
if not exist "%~dp0bin" mkdir "%~dp0bin"
call corepack.cmd enable --install-directory "%~dp0bin"
if errorlevel 1 exit /b 1
set "PATH=%~dp0bin;%CD%\packages\dev\bin;%CD%\node_modules\supabase\bin;C:\Program Files\Git\bin;C:\Program Files\Docker\Docker\resources\bin;%PATH%"
set "npm_config_script_shell=C:/Program Files/Git/bin/bash.exe"
set "MSYS_NO_PATHCONV=1"
set "MSYS2_ARG_CONV_EXCL=*"
set "CARBON_DEV_APPS=erp,mes"
set "CARBON_PORTLESS=0"
if "%~1"=="" goto dev
if /i "%~1"=="dev" goto dev
if /i "%~1"=="background" goto background
if /i "%~1"=="install" goto install
if /i "%~1"=="test" goto test
if /i "%~1"=="build" goto build
if /i "%~1"=="status" goto status
echo Usage: local.cmd [dev^|background^|install^|test^|build^|status]
exit /b 2
:background
powershell.exe -NoProfile -Command "Start-Process -FilePath $env:ComSpec -ArgumentList '/c .cc1-agentic\local.cmd dev > .cc1-agentic\dev-server.log 2>&1' -WorkingDirectory (Get-Location).Path -WindowStyle Hidden"
exit /b %errorlevel%
:dev
docker info --format "{{.ServerVersion}}"
if errorlevel 1 exit /b 1
call corepack.cmd pnpm dev
exit /b %errorlevel%
:install
call corepack.cmd pnpm install --frozen-lockfile
exit /b %errorlevel%
:test
call corepack.cmd pnpm exec turbo run test --filter=@carbon/dev
exit /b %errorlevel%
:build
call corepack.cmd pnpm run build:erp
exit /b %errorlevel%
:status
node --env-file=.env.local --import tsx packages/dev/src/main.ts status
exit /b %errorlevel%
