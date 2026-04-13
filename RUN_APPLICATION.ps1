# Zero2Earn - Complete Setup & Run Script
# Run with: powershell -ExecutionPolicy Bypass -File RUN_APPLICATION.ps1

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Zero2Earn - Application Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check and Configure Java
Write-Host "[1/5] Configuring Java Environment..." -ForegroundColor Yellow

# Try common Java installation paths
$javaPaths = @(
    "C:\Program Files\OpenJDK\openjdk-21",
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Java\openjdk-21",
    "C:\Program Files (x86)\Java\jdk-21"
)

$javaFound = $false
foreach ($path in $javaPaths) {
    if (Test-Path "$path\bin\java.exe") {
        $env:JAVA_HOME = $path
        $env:PATH = "$path\bin;$env:PATH"
        Write-Host "✓ Java found at: $path" -ForegroundColor Green
        $javaFound = $true
        break
    }
}

if (-not $javaFound) {
    Write-Host "❌ Java 21 not found. Please install OpenJDK 21 from:" -ForegroundColor Red
    Write-Host "   https://adoptopenjdk.net/ or https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    exit 1
}

java -version 2>&1
Write-Host ""

# Step 2: Check PostgreSQL
Write-Host "[2/5] Checking PostgreSQL Installation..." -ForegroundColor Yellow

# Try common PostgreSQL paths
$pgPaths = @(
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin",
    "C:\Program Files\PostgreSQL\13\bin",
    "C:\Program Files (x86)\PostgreSQL\15\bin"
)

$pgFound = $false
foreach ($path in $pgPaths) {
    if (Test-Path "$path\psql.exe") {
        $env:PATH = "$path;$env:PATH"
        Write-Host "✓ PostgreSQL found at: $path" -ForegroundColor Green
        $pgFound = $true
        break
    }
}

if (-not $pgFound) {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL from:" -ForegroundColor Red
    Write-Host "   https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

$pgVersion = & psql --version 2>&1
Write-Host "✓ $pgVersion" -ForegroundColor Green
Write-Host ""

# Step 3: Setup Database
Write-Host "[3/5] Setting up PostgreSQL Database..." -ForegroundColor Yellow

try {
    # Test connection
    $connectionTest = & psql -U postgres -h localhost -c "SELECT 'OK';" 2>&1
    
    if ($connectionTest -like "*OK*") {
        Write-Host "✓ PostgreSQL connection successful" -ForegroundColor Green
        
        # Create database
        & psql -U postgres -h localhost -c "CREATE DATABASE IF NOT EXISTS zero2earn;" 2>&1
        Write-Host "✓ Database 'zero2earn' created/verified" -ForegroundColor Green
        
        # Import schema
        $schemaPath = "backend\src\main\resources\schema_postgres.sql"
        if (Test-Path $schemaPath) {
            & psql -U postgres -h localhost -d zero2earn -f $schemaPath 2>&1 | Out-Null
            Write-Host "✓ Schema imported successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠ Schema file not found at: $schemaPath" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Cannot connect to PostgreSQL. Make sure it's running." -ForegroundColor Red
        Write-Host "   Hint: Start PostgreSQL from Services or command line." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Error setting up database: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Start Backend
Write-Host "[4/5] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "       Launching in background..." -ForegroundColor Cyan

Push-Location backend
Start-Process -NoNewWindow -PassThru -FilePath "cmd.exe" -ArgumentList "/c mvn spring-boot:run" -ErrorAction SilentlyContinue | Out-Null
Write-Host "✓ Backend starting on http://localhost:8080" -ForegroundColor Green
Write-Host "  (Please wait 30-40 seconds for full startup...)" -ForegroundColor Gray
Pop-Location
Write-Host ""

# Wait a bit for backend to start
Write-Host "   Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Step 5: Start Frontend
Write-Host "[5/5] Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "      Launching in new window..." -ForegroundColor Cyan

Push-Location frontend
Start-Process -NoNewWindow -PassThru -FilePath "cmd.exe" -ArgumentList "/c npm install && npm run dev" -ErrorAction SilentlyContinue | Out-Null
Write-Host "✓ Frontend starting on http://localhost:5173" -ForegroundColor Green
Pop-Location
Write-Host ""

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ APPLICATION SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Access URLs:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:   http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "   Database:  localhost:5432 (PostgreSQL)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test Accounts:" -ForegroundColor Yellow
Write-Host "   Admin:    admin@zero2earn.com / admin123" -ForegroundColor Cyan
Write-Host "   Student:  student@zero2earn.com / password123" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - See DEPLOYEMENT_READY.md for detailed setup" -ForegroundColor Cyan
Write-Host "   - See IMPLEMENTATION_COMPLETE.md for features" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️  First load may take 30-40 seconds. Please be patient!" -ForegroundColor Gray
Write-Host ""
