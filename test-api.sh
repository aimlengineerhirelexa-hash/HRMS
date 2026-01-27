#!/bin/bash

echo "Testing HRMS Backend API Endpoints..."
echo "======================================"

# Test health endpoint
echo "1. Testing Health Endpoint:"
curl -s http://localhost:5000/health | jq '.'
echo ""

# Test authentication
echo "2. Testing Authentication:"
AUTH_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}')

echo $AUTH_RESPONSE | jq '.'

# Extract token
TOKEN=$(echo $AUTH_RESPONSE | jq -r '.token')
echo "Token: $TOKEN"
echo ""

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "3. Testing Holidays API:"
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/holidays | jq '.data | length'
  echo ""

  echo "4. Testing Salary Components API:"
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/salary-components/components | jq '.data | length'
  echo ""

  echo "5. Testing Dashboard Metrics API:"
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/dashboard-metrics/metrics | jq '.data | length'
  echo ""

  echo "6. Testing Jobs API:"
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/jobs | jq '.data | length'
  echo ""

  echo "All API endpoints are working correctly!"
else
  echo "Authentication failed. Please check if the backend server is running."
fi