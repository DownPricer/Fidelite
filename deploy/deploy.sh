#!/usr/bin/env bash
# Déploiement FifeLite — à exécuter SUR le VPS, depuis /opt/fifelite/app/site/deploy
# Ne contacte aucun hôte distant et ne touche pas aux autres stacks.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$(dirname "$0")"

if [[ ! -f "$ROOT/.env" ]]; then
  echo "Fichier manquant : $ROOT/.env"
  echo "Copiez deploy/.env.production.example vers .env et renseignez les secrets."
  exit 1
fi

docker compose up -d --build
docker compose logs --tail=80 web
echo
echo "Migrations : appliquées au démarrage de fifelite-web (entrypoint)."
echo "Seed unique (premier déploiement seulement) :"
echo "  docker compose exec -e SEED_ALLOW_PRODUCTION=true web npm run db:seed"
