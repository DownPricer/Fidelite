# FifeLite

Plateforme de fidélité pour commerces. Une seule PWA responsive, installable depuis le navigateur.

Domaines de production :

- `fidelite.sitereadyshd.fr` : espace client, inscription et carte
- `app-fidelite.sitereadyshd.fr` : espace commerçant et mode caisse
- `admin-fidelite.sitereadyshd.fr` : super-admin FifeLite

Ne pas utiliser `app.sitereadyshd.fr` ni `admin.sitereadyshd.fr` (déjà pris par d’autres projets).

## Prérequis (développement)

- Node.js 20 ou plus
- npm
- Un navigateur moderne (caméra requise pour le scan QR)

Le démarrage local de Docker ou PostgreSQL sous Windows n’est pas requis. L’application se déploie sur le VPS existant.

## Installation locale (sans Docker)

```bash
cp .env.example .env
```

Sur Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Renseignez `QR_SECRET` et, si une base distante est disponible, `DATABASE_URL`. Puis :

```bash
npm install
npm test
npm run icons
npm run dev
```

Ouvrez `http://localhost:3000`. En local, les chemins `/c/cafe-demo`, `/app/caisse` et `/admin` restent utilisables sans les sous-domaines.

Comptes de démonstration : uniquement via les variables `SEED_*` de votre `.env`. Aucun mot de passe de production n’est dans le dépôt.

Commerce de démo : **Café Demo**, slug `cafe-demo`, règle `10 passages = 1 boisson offerte`.

## Déploiement VPS sans Docker local

Le reverse proxy Nginx Docker `downpricer-nginx` et son réseau `downpricer_downpricer-network` existent déjà. FifeLite ajoute uniquement ses propres conteneurs, volumes et son réseau interne. Ne pas modifier, redémarrer, supprimer, renommer ni reconstruire les autres stacks.

Chemins et noms :

| Élément | Valeur |
| --- | --- |
| Code | `/opt/fifelite/app/site` |
| Compose | `/opt/fifelite/app/site/deploy/docker-compose.yml` |
| Web | `fifelite-web` |
| PostgreSQL | `fifelite-postgres` (non exposé) |
| Volume | `fifelite-postgres-data` |
| Réseau interne | `fifelite-internal` |
| Réseau proxy | `downpricer_downpricer-network` |

### Déploiement initial

Générez d’abord vos secrets (en local ou sur le VPS) :

```bash
openssl rand -hex 24   # POSTGRES_PASSWORD
openssl rand -hex 32   # QR_SECRET
```

Copiez la **même** valeur générée pour `POSTGRES_PASSWORD` dans le mot de passe de `DATABASE_URL`.

```bash
ssh ubuntu@51.210.179.212
sudo mkdir -p /opt/fifelite/app/site
sudo chown -R ubuntu:ubuntu /opt/fifelite
cd /opt/fifelite/app/site
git clone https://github.com/DownPricer/Fidelite.git .
cp deploy/.env.production.example .env
nano .env   # remplacer CHANGE_ME par les secrets générés ci-dessus
cd deploy
docker compose up -d --build
```

Les migrations Prisma s’exécutent automatiquement au démarrage de `fifelite-web` (entrypoint).

Nginx : copier **uniquement** le fichier d’exemple additif, sans toucher aux autres vhosts :

```bash
sudo cp /opt/fifelite/app/site/deploy/nginx/fifelite.conf.example /opt/downpricer/nginx/conf.d/fifelite.conf
docker exec downpricer-nginx nginx -t
docker exec downpricer-nginx nginx -s reload
```

Détails HTTPS : voir les commentaires dans `deploy/nginx/fifelite.conf.example`.

### Migrations et seed

Les migrations sont déjà lancées à chaque démarrage du conteneur web. Pour les relancer à la main :

```bash
cd /opt/fifelite/app/site/deploy
docker compose exec web npx prisma migrate deploy
```

Seed **une seule fois** après le premier déploiement (le seed refuse `NODE_ENV=production` sauf `SEED_ALLOW_PRODUCTION=true`) :

```bash
cd /opt/fifelite/app/site/deploy
docker compose exec -e SEED_ALLOW_PRODUCTION=true web npm run db:seed
```

Ne pas répéter le seed à chaque mise à jour.

### Vérifications

```bash
docker ps
cd /opt/fifelite/app/site/deploy
docker compose logs --tail=100
docker exec downpricer-nginx nginx -t
docker exec downpricer-nginx nginx -s reload
curl -I https://fidelite.sitereadyshd.fr
curl -I https://app-fidelite.sitereadyshd.fr
curl -I https://admin-fidelite.sitereadyshd.fr
```

Contrôler que `fifelite-web` et `fifelite-postgres` sont `Up`, et qu’aucun autre projet n’a été recréé.

### Déploiement d’une mise à jour

```bash
cd /opt/fifelite/app/site
git pull origin main
cd deploy
docker compose up -d --build
docker compose logs --tail=100
```

Les migrations partent à nouveau via l’entrypoint. Ne pas relancer le seed.

Script optionnel, à exécuter **sur le VPS** depuis `deploy/` :

```bash
bash deploy.sh
```

## Création des sous-domaines DNS

Chez votre registrar, créez des enregistrements A vers `51.210.179.212` :

| Hôte | Type | Valeur |
| --- | --- | --- |
| `fidelite.sitereadyshd.fr` | A | `51.210.179.212` |
| `app-fidelite.sitereadyshd.fr` | A | `51.210.179.212` |
| `admin-fidelite.sitereadyshd.fr` | A | `51.210.179.212` |

Dans `.env` de production :

- `CUSTOMER_ORIGIN=https://fidelite.sitereadyshd.fr`
- `APP_ORIGIN=https://app-fidelite.sitereadyshd.fr`
- `ADMIN_ORIGIN=https://admin-fidelite.sitereadyshd.fr`
- `CUSTOMER_HOST`, `APP_HOST`, `ADMIN_HOST` alignés
- `APP_URL=https://fidelite.sitereadyshd.fr`

Le middleware réécrit les chemins selon l’hôte : `app-fidelite.sitereadyshd.fr/caisse` devient l’espace caisse.

## Configuration Google Wallet

L’intégration est isolée dans `src/lib/google-wallet.ts`. Sans les variables, la PWA fonctionne et le bouton client est masqué.

Variables (aucune clé dans Git) :

```env
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_WALLET_ORIGINS=https://fidelite.sitereadyshd.fr
```

## Checklist de déploiement

- [ ] `.env` renseigné : `POSTGRES_PASSWORD` = mot de passe dans `DATABASE_URL`, `QR_SECRET` ≥ 32 caractères aléatoires
- [ ] DNS des trois sous-domaines FifeLite uniquement
- [ ] `docker compose up -d --build` depuis `/opt/fifelite/app/site/deploy`
- [ ] Seed une seule fois si besoin
- [ ] `fifelite.conf` ajouté dans le Nginx central, `nginx -t` puis reload
- [ ] HTTPS selon la méthode déjà utilisée par `downpricer-nginx`
- [ ] Aucun autre conteneur du VPS modifié

## Tests

```bash
npm test
```

## Limites connues de la V1

- Pas d’Apple Wallet
- Pas de paiement, SMS marketing, commandes ni lien caisse / ERP
- Rate limiting en mémoire
- Google Wallet optionnel
- Mode caisse strictement en ligne
- Logo commerçant via URL
- Un seul programme simple : `X passages = 1 récompense`

## Structure utile

- `deploy/` : Compose, Dockerfile, Nginx d’exemple, variables de production
- `prisma/schema.prisma` : modèle de données
- `src/lib/session.ts` : sessions HTTP-only
- `src/lib/qr.ts` : QR signé, temporaire, à usage unique
- `src/lib/google-wallet.ts` : intégration Wallet isolée
- `src/app/c/[slug]` : page publique du commerce
- `src/app/app/caisse` : mode caisse
- `src/app/admin` : super-admin
