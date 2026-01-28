#!/bin/bash

# TeslaDrive Sound Playback Test Runner
# This script starts the Expo dev server and runs the Playwright test

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "=========================================="
echo "TeslaDrive Sound Playback Test"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo ""
fi

# Check if Playwright is installed
if ! npm list @playwright/test > /dev/null 2>&1; then
  echo "Installing Playwright..."
  npm install --save-dev @playwright/test playwright
  echo ""
fi

# Kill any existing Expo servers
echo "Cleaning up any existing Expo servers..."
pkill -f "expo start" || true
sleep 2

# Start Expo dev server in background
echo "Starting Expo dev server..."
npm start -- --web > /tmp/expo-server.log 2>&1 &
EXPO_PID=$!
echo "Expo PID: $EXPO_PID"

# Wait for server to be ready
echo "Waiting for server to start (10 seconds)..."
sleep 10

# Check if server is responding
echo "Checking if server is ready..."
for i in {1..30}; do
  if curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo "Server is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "ERROR: Server failed to start after 30 seconds"
    echo "Expo server output:"
    cat /tmp/expo-server.log
    kill $EXPO_PID 2>/dev/null || true
    exit 1
  fi
  echo "Waiting... ($i/30)"
  sleep 1
done

echo ""
echo "=========================================="
echo "Running Playwright Test..."
echo "=========================================="
echo ""

# Run the test
node test-playback.js
TEST_RESULT=$?

# Cleanup
echo ""
echo "Cleaning up..."
kill $EXPO_PID 2>/dev/null || true
sleep 2

# Show results
echo ""
echo "=========================================="
if [ $TEST_RESULT -eq 0 ]; then
  echo "Test completed successfully!"
  echo "Check test-results/ directory for detailed report and screenshots"
else
  echo "Test encountered errors. Check test-results/ for details."
fi
echo "=========================================="

exit $TEST_RESULT
