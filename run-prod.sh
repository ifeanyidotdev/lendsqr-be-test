#!/bin/sh
set -e

echo "Waiting for DB to be ready..."
# Add a delay to ensure the database container is fully up and running
sleep 5

echo "Running migrations..."
pnpm run prod:migrate:up
