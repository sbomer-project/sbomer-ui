#!/usr/bin/env bash

# Intended to be run from the project root directory
set -e

echo "--- Building the TypeScript UI component ---"

# Navigate to the UI directory
cd ui

# Install dependencies
echo "Running npm install..."
npm install

# Build dev
echo "Running npm production build..."
npm run build

echo "--- Build Complete ---"
