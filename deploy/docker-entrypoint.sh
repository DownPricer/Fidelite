#!/bin/sh
set -eu

fail() {
  echo "[fifelite] ERREUR: $1" >&2
  exit 1
}

is_placeholder_secret() {
  value="$1"
  case "$value" in
    ""|CHANGE_ME|changeme|ChangeMe|CHANGE-ME|change-me|REPLACE_ME|replace_me|remplacez*|changez-moi*|123456*|password|secret|example|demo|test)
      return 0
      ;;
  esac
  return 1
}

validate_production_secrets() {
  if is_placeholder_secret "${POSTGRES_PASSWORD:-}"; then
    fail "POSTGRES_PASSWORD contient encore une valeur d'exemple. Générez-en une avec : openssl rand -hex 24"
  fi

  if is_placeholder_secret "${QR_SECRET:-}"; then
    fail "QR_SECRET contient encore une valeur d'exemple. Générez-en une avec : openssl rand -hex 32"
  fi

  qr_len=$(printf '%s' "$QR_SECRET" | wc -c | tr -d ' ')
  if [ "$qr_len" -lt 32 ]; then
    fail "QR_SECRET doit contenir au moins 32 caractères aléatoires (actuel : $qr_len)."
  fi
}

validate_production_secrets

echo "[fifelite] prisma migrate deploy"
npx prisma migrate deploy
echo "[fifelite] démarrage de l'application"
exec "$@"
