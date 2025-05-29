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

# Run the application
exec "$@"
