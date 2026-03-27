#!/usr/bin/env bash
set -e

# Check for localtunnel
if ! command -v lt &>/dev/null; then
  echo "localtunnel not found. Installing..."
  npm install -g localtunnel
fi

# Kill all background jobs on exit (Ctrl+C)
trap 'echo ""; echo "Shutting down..."; kill $(jobs -p) 2>/dev/null; exit 0' EXIT INT TERM

echo "================================================"
echo "  FosterGuide AZ — Tunnel Mode"
echo "================================================"
echo ""

# Start backend with relaxed CORS
echo "[1/3] Starting backend (port 3001)..."
(cd server && DEV_TUNNEL=true npm run dev 2>&1 | sed 's/^/  [server] /') &

# Start frontend
echo "[2/3] Starting frontend (port 5173)..."
(cd app && npm run dev 2>&1 | sed 's/^/  [app]    /') &

# Wait for servers to be ready
sleep 4

# Start localtunnel — URL will be printed to stdout
echo ""
echo "[3/3] Opening tunnel..."
echo ""
echo "  >>> Your public URL will appear below <<<"
echo "  >>> (first visit may show a localtunnel splash — click 'Continue') <<<"
echo ""
lt --port 5173

# Keep script alive
wait
