#!/bin/sh
set -e

echo "Waiting for DB to be ready..."
sleep 5

echo "Running migrations..."
pnpm run prod:migrate

echo "Building project..."
pnpm run build

echo "Running app..."
pnpm run start
