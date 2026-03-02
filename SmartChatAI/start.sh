#!/bin/bash

# SmartChat AI - Complete Startup Script
# This script starts all services: AI Service, Backend, and Frontend

set -e

echo "========================================"
echo "SmartChat AI - Starting All Services"
echo "========================================"

PROJECT_DIR="/home/nikhi/Downloads/newwwww/SmartChatAI"
AI_SERVICE_DIR="$PROJECT_DIR/ai-service"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# Check if MongoDB is running
print_info "Checking MongoDB..."
if ! pgrep -x "mongod" >/dev/null 2>&1; then
    print_info "Starting MongoDB..."
    mongod --dbpath /data/db >/dev/null 2>&1 &
    sleep 2
    print_status "MongoDB started"
else
    print_status "MongoDB is already running"
fi

# Start AI Service
print_info "Starting AI Service..."
cd "$AI_SERVICE_DIR"
if [ ! -d "venv" ]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
python3 app.py > ai.log 2>&1 &
AI_PID=$!
sleep 2
print_status "AI Service started (PID: $AI_PID) on http://localhost:5001"

# Start Backend
print_info "Starting Backend..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    print_info "Installing backend dependencies..."
    npm install --silent
fi
npm start > backend.log 2>&1 &
BACKEND_PID=$!
sleep 3
print_status "Backend started (PID: $BACKEND_PID) on http://localhost:5000"

# Start Frontend
print_info "Starting Frontend..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install --silent
fi
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3
print_status "Frontend started (PID: $FRONTEND_PID) on http://localhost:3000"

echo ""
echo "========================================"
echo "All Services Started Successfully!"
echo "========================================"
echo ""
echo -e "${GREEN}Access your application:${NC}"
echo "  Frontend:    http://localhost:3000"
echo "  Backend:     http://localhost:5000"
echo "  AI Service:  http://localhost:5001"
echo ""
echo -e "${YELLOW}Log Files:${NC}"
echo "  AI Service:  $AI_SERVICE_DIR/ai.log"
echo "  Backend:     $BACKEND_DIR/backend.log"
echo "  Frontend:    $FRONTEND_DIR/frontend.log"
echo ""
echo -e "${YELLOW}To stop all services, run:${NC}"
echo "  killall python3 node npm"
echo ""
echo "========================================"
