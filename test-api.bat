@echo off
echo Testing HRMS Backend API Endpoints...
echo ======================================

echo 1. Testing Health Endpoint:
curl -s http://localhost:5000/health
echo.

echo 2. Testing Authentication:
curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@company.com\",\"password\":\"admin123\"}" > auth_response.json
type auth_response.json
echo.

echo 3. If authentication successful, you can test other endpoints manually with the token from auth_response.json
echo.

echo Backend API test completed!
pause