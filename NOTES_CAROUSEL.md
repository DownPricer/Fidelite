# Notes pour le prochain agent - Carousel de cartes

## Fonctionnalité EN PAUSE

### Clics sur les cartes - DÉSACTIVÉ
- **NE PAS réactiver** les clics sur les cartes pour l'instant
- Actuellement, toutes les cartes ont `pointer-events-none`
- Les liens vers `/carte/identite` et les callbacks `onOpenMerchant` sont désactivés
- **Raison** : L'utilisateur veut se concentrer sur le mécanisme de rotation du carousel d'abord

### Emplacement du code
- Fichier : `src/components/fife-life/card-deck.tsx`
- Lignes concernées : création du `content` pour GlobalCard et PrismCard
- Rechercher le commentaire : `// FONCTIONNALITÉ EN PAUSE`

## Système de carousel actuel

### Concept
- C'est un **carousel qui ROULE** comme une roue de photos
- Les cartes sont **FIXES** sur la roue, elles ne peuvent pas être déplacées individuellement
- Quand on swipe/drag, c'est le **carousel qui tourne**, pas les cartes

### Implémentation
- Les cartes sont positionnées en fonction de `index` (carte active)
- Le drag détecte le mouvement et change l'index
- Les cartes ont `pointer-events-none` pour qu'on ne puisse pas les attraper
- Le conteneur a `cursor-grab` pour indiquer qu'on peut le faire tourner

### Paramètres actuels
- `VISIBLE_RANGE = 2` : affiche 2 cartes au-dessus et 2 en-dessous
- `SPREAD = 32px` : espacement vertical entre les cartes
- `RADIUS = 180px` : rayon du carousel 3D
- Rotation légère : `rotateX` de ±4° max

## À améliorer dans le futur
- Affiner l'effet de rotation 3D (si nécessaire)
- Améliorer la détection du swipe (sensibilité, momentum)
- Réactiver les clics sur les cartes **UNIQUEMENT** quand l'utilisateur le demande explicitement
