:: ============================================================
:: Zero2Earn — Database Setup Helper
:: Run this script as Administrator to set up the PostgreSQL database
:: Usage: db_setup.bat YOUR_POSTGRES_PASSWORD
:: ============================================================

@echo off
SET PG_PASS=%1
SET PG_EXE="C:\Program Files\PostgreSQL\bin\psql.exe"
SET PG_USER=postgres
SET PG_HOST=localhost
SET PG_PORT=5432

IF "%PG_PASS%"=="" (
    echo ERROR: Please provide PostgreSQL password as argument
    echo Usage: db_setup.bat your_postgres_password
    pause
    exit /b 1
)

echo [1/3] Testing PostgreSQL connection...
%PG_EXE% -U %PG_USER% -h %PG_HOST% -p %PG_PORT% -c "SELECT 'Connection OK';" 2>&1
IF ERRORLEVEL 1 (
    echo ERROR: Could not connect to PostgreSQL. Check your password and installation.
    pause
    exit /b 1
)

echo [2/3] Creating database...
%PG_EXE% -U %PG_USER% -h %PG_HOST% -p %PG_PORT% -c "CREATE DATABASE IF NOT EXISTS zero2earn;"
IF ERRORLEVEL 1 ( echo ERROR: Failed to create database. & pause & exit /b 1 )
echo Database 'zero2earn' created!

echo [3/3] Running schema + seed data...
%PG_EXE% -U %PG_USER% -h %PG_HOST% -p %PG_PORT% -d zero2earn -f "backend\src\main\resources\schema_postgres.sql"
IF ERRORLEVEL 1 ( echo ERROR: Schema import failed. & pause & exit /b 1 )
echo Schema imported successfully!

echo.
echo ============================================================
echo  SUCCESS! PostgreSQL database is ready.
echo  Backend application.properties is already configured for PostgreSQL.
echo  You can now start the backend with: mvn spring-boot:run
echo ============================================================
pause
