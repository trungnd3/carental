#!/bin/bash
set -e

# Fetch secret from Secrets Manager
DATABASE_JSON=$(aws secretsmanager get-secret-value \
  --region ap-southeast-1 \
  --secret-id prod/Carental/PostgresQL \
  --query SecretString \
  --output text)

export POSTGRES_USERNAME=$(echo "$DATABASE_JSON" | jq -r '.username')
export POSTGRES_PASSWORD=$(echo "$DATABASE_JSON" | jq -r '.password')
export POSTGRES_HOST=$(echo "$DATABASE_JSON" | jq -r '.host')
export POSTGRES_PORT=$(echo "$DATABASE_JSON" | jq -r '.port')
export POSTGRES_DB=$(echo "$DATABASE_JSON" | jq -r '.dbname')

# Run the application
exec "$@"
