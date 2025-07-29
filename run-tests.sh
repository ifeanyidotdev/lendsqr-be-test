#!/bin/sh
set -e

echo "Waiting for DB to be ready..."
# Add a delay to ensure the database container is fully up and running
sleep 5

echo "Running migrations rollback..."
pnpm run test:migrate:rollback

echo "Running migrations..."
pnpm run test:migrate

echo "Running tests..."
pnpm run test
