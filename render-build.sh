#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- [1/2] Installing Python Backend Dependencies ---"
pip install -r requirements.txt

echo "--- [2/2] Building React Frontend SPA ---"
cd frontend
npm install
npm run build
cd ..

echo "--- Single Unified Build Completed Successfully ---"
