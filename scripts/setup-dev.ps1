# Check if .env files exist
$frontendEnvPath = "..\frontend\.env"
$backendEnvPath = "..\backend\.env"

function Generate-SecureSecret {
    $bytes = New-Object Byte[] 32
    $rand = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rand.GetBytes($bytes)
    $base64Secret = [Convert]::ToBase64String($bytes)
    return $base64Secret
}

# Generate a shared secret for both frontend and backend
$sharedSecret = Generate-SecureSecret

# Frontend .env setup
if (-not (Test-Path $frontendEnvPath)) {
    $frontendEnvContent = @"
# Authentication
NEXTAUTH_SECRET=$sharedSecret
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Environment
NODE_ENV=development
"@
    Set-Content -Path $frontendEnvPath -Value $frontendEnvContent -Encoding UTF8
    Write-Host "Created frontend .env file with secure configuration"
} else {
    Write-Host "Frontend .env file already exists"
}

# Backend .env setup
if (-not (Test-Path $backendEnvPath)) {
    $backendEnvContent = @"
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL="file:./dev.db"

# Authentication Configuration
NEXTAUTH_SECRET=$sharedSecret

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
"@
    Set-Content -Path $backendEnvPath -Value $backendEnvContent -Encoding UTF8
    Write-Host "Created backend .env file with secure configuration"
} else {
    Write-Host "Backend .env file already exists"
}

Write-Host "`nSetup complete! You can now start the development servers:"
Write-Host "1. Frontend: cd ../frontend && npm run dev"
Write-Host "2. Backend:  cd ../backend && npm run dev"
Write-Host "`nAccess the admin interface at: http://localhost:3000/auth/login"
