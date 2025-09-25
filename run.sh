#!/bin/bash
# run.sh - Simple script to run the LLM Observability Demo

echo "🚀 Starting LLM Observability Demo..."
echo "======================================"

# Check if Python is available for simple HTTP server
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required but not installed."
    exit 1
fi

# Check if we have the web files
if [ ! -f "index.html" ]; then
    echo "❌ Web application files not found!"
    echo "   Make sure index.html, styles.css, and app.js are present."
    exit 1
fi

echo "🌐 Starting web server..."
echo "   Open your browser and go to: http://localhost:8000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start a simple HTTP server
python3 -m http.server 8000
