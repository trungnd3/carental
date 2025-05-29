SELECT 'CREATE DATABASE carental'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'carental')\gexec
