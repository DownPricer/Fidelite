#!/bin/sh
set -eu
echo "[fifelite] prisma migrate deploy"
npx prisma migrate deploy
echo "[fifelite] démarrage de l'application"
exec "$@"
