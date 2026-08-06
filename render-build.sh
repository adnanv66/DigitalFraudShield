#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "--- Installing Python Backend Dependencies ---"
pip install -r requirements.txt

echo "--- Installing & Building React Frontend Assets ---"
npm --prefix frontend install
npm --prefix frontend run build

echo "--- Build Completed Successfully! ---"
