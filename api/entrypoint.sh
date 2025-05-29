#!/bin/bash
set -e

# Fetch secret from Secrets Manager
SECRET_JSON=$(aws secretsmanager get-secret-value \
  --region ap-southeast-1 \
  --secret-id prod/Carental/Secret \
  --query SecretString \
  --output text)

# Export secrets as environment variables
export JWT_SECRET=$(echo "$SECRET_JSON" | jq -r '.JWT_SECRET')
export JWT_EXPIRATION=3600 # 1 hour

export POSTGRES_USERNAME=$(echo "$DATABASE_JSON" | jq -r '.username')
export POSTGRES_PASSWORD=$(echo "$DATABASE_JSON" | jq -r '.password')
export POSTGRES_HOST=$(echo "$DATABASE_JSON" | jq -r '.host')
export POSTGRES_PORT=$(echo "$DATABASE_JSON" | jq -r '.port')
export POSTGRES_DB=$(echo "$DATABASE_JSON" | jq -r '.dbname')
export DATABASE_URL="postgresql://$POSTGRES_USERNAME:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB"

# Run the application
exec "$@"
