# Cartes de fidélité — pack pour Cursor

## Démarrage

Décompresser tout le dossier, puis ouvrir `index.html` dans un navigateur récent.
Tout fonctionne localement, sans installation, CDN, framework ou compilation.

- `cartes.css` : style des quatre cartes, cadrage des fonds, typographie et barres.
- `cartes.js` : composant facultatif pour injecter et mettre à jour les données.
- `exemple-simple.html` : HTML/CSS minimal, sans JavaScript.
- `index.html`, `demo.css`, `demo.js` : démonstration avec champs modifiables.
- `assets/fond-*.png` : quatre fonds générés sans texte, QR ni barre ; emblèmes conservés.
- `assets/qr-demo.svg` : un vrai QR d'exemple encodant `DEMO-CARTE-NON-CLIENT`.
- `assets/fonts/` : police légère embarquée et sa licence.

Les fonds sont de nouvelles versions générées à partir des images fournies.
Les reflets peuvent donc différer légèrement des originaux. La police embarquée
est une approximation libre de droits de redistribution, pas une identification
de la police exacte des images.

## À donner à Cursor

> Intègre le composant de cartes de fidélité fourni dans ce dossier à mon application.
> Réutilise cartes.css et les quatre fonds existants. Conserve le ratio 5/3,
> les cadrages CSS, les positions, la typographie et les couleurs par niveau.
> Les fonds sont purement décoratifs : affiche le nom, le niveau, le nombre de
> points, le QR et la progression par-dessus en HTML. Branche ces valeurs sur
> le client connecté et sur les règles de fidélité déjà présentes dans mon
> application. Le niveau et les points doivent provenir du backend.
> Génère un vrai QR propre au client avec notre bibliothèque QR habituelle et
> fournis son image à qrSrc. N'utilise pas qr-demo.svg en production.
> Vérifie les vrais paliers avant de configurer les seuils ; ne déduis pas
> les règles métier des images. Reprends le composant existant ou adapte son
> HTML à notre framework sans changer le style. Vérifie le rendu sur mobile,
> les noms longs et le scan du QR sur les appareils utilisés.

## Intégration minimale avec données dynamiques

Conserver l'arborescence `cartes.css` + `assets/`, ou mettre à jour les URL dans le CSS.

```html
<link rel="stylesheet" href="/cartes/cartes.css">
<div id="carte-client" style="width:100%;max-width:900px"></div>
<script src="/cartes/cartes.js"></script>
<script>
  const carte = LoyaltyCard.mount('#carte-client', {
    tier: 'bronze',                  // bronze | argent | or | diamant
    name: 'Marie Terese',
    points: 12450,
    qrSrc: '/qr/client-123.svg',      // image réellement générée par l'application
    qrMode: 'engraved',              // engraved | standard
    currentThreshold: 0,
    nextThreshold: 50000,
    nextTier: 'Argent'
  });

  // Après une mise à jour des données du client :
  carte.update({ points: 18000, name: 'Marie Terese' });

  // Lors du démontage d'une vue : carte.destroy();
</script>
```

`qrSrc` peut être une URL locale, HTTPS, Blob ou data URL d'image.
Sans QR, un emplacement « QR CLIENT » apparaît. Si l'image est invalide,
« QR INDISPONIBLE » apparaît. Aucune information client n'est insérée via innerHTML.

## Paramètres

| Champ | Type | Rôle |
|---|---|---|
| `tier` | chaîne requise | `bronze`, `argent`, `or`, `diamant` |
| `name` | chaîne requise | Nom, affiché en vrai texte |
| `points` | nombre requis | Total positif ou nul, affichage arrondi en français |
| `qrSrc` | chaîne facultative | Image QR noir sur blanc fournie par l'application |
| `qrMode` | chaîne | `engraved` par défaut ; `standard` pour noir sur blanc |
| `currentThreshold` | nombre | Début du palier courant, zéro par défaut |
| `nextThreshold` | nombre | Objectif supérieur au début du palier |
| `nextTier` | chaîne | Nom du prochain niveau, requis avec un objectif |
| `isMaxTier` | booléen | Niveau maximal : barre pleine et message de statut atteint |
| `progressPercent` | nombre | Remplace le calcul par un pourcentage fourni, borné à 100 |
| `statusText` | chaîne | Remplace le texte de progression |

La progression normale est calculée **à l'intérieur du palier courant** :

```js
progress = (points - currentThreshold) / (nextThreshold - currentThreshold) * 100;
// Bornage de 0 à 100 ; points restants = max(0, nextThreshold - points).
```

Pour une progression mesurée depuis zéro, transmettre `currentThreshold: 0`.
Sans objectif, niveau maximal ou pourcentage explicite, la barre est masquée.
Le composant ne change jamais automatiquement le niveau : l'application le fournit.

Lors d'un changement de niveau, fournir aussi les nouveaux paramètres de palier.
Pour passer à un statut final, effacer l'ancien objectif et les éventuelles surcharges :

```js
carte.update({
  tier: 'diamant',
  points: 250000,
  currentThreshold: null,
  nextThreshold: null,
  nextTier: null,
  progressPercent: null,
  statusText: null,
  isMaxTier: true
});
```

## Paliers et images de référence

Les exemples Bronze et Argent utilisent respectivement des objectifs de 50 000
et 100 000 points, lus dans les textes des images. Le visuel Or dit « Statut maximal
atteint » alors qu'un visuel Diamant existe aussi : la relation entre ces deux
niveaux reste à définir par ton application. Aucun seuil de passage Or → Diamant
n'a été inventé dans le composant.

Les remplissages des barres de référence ne correspondent pas aux points affichés.
La démo calcule des progressions cohérentes : Bronze 24,9 % ; Argent 44,9 %
à l'intérieur de son palier. Pour reprendre approximativement les longueurs
dessinées dans les images, fournir `progressPercent: 50` pour Bronze et `67`
pour Argent. Ce réglage reproduit un dessin, pas une règle de fidélité.

## Fonds, cadrage et QR

Les PNG sources comportent des marges extérieures issues de la génération.
Le composant les retire à l'affichage avec `--bg-size`, `--bg-position` et
le rayon des coins. **Ne pas remplacer ces réglages par `background-size: cover`
ou afficher les PNG comme une carte complète sans ce cadrage.**
Le métal et l'emblème restent dans le fond ; tous les textes sont indépendants.

Le mode `engraved` inverse un QR noir sur blanc et fond son arrière-plan dans le
métal, comme les images de référence. Le QR fourni doit conserver sa marge
silencieuse de quatre modules. Ce mode doit être testé avec les lecteurs réels,
notamment pour les petits affichages. `standard` conserve le noir sur blanc et
la marge d'origine. Ne pas fournir un QR déjà inversé au mode `engraved`.

Le code QR de démonstration a une marge correcte ; son motif visible est donc
un peu plus petit que les QR sans marge dessinés dans les références.

## Adaptation et validation

Les unités `cqw` dimensionnent les éléments d'après la largeur de la carte :
pas besoin de modifier les positions pour un affichage plus petit.
La démo propose une largeur de 340 px. Les noms longs passent sur deux lignes
avec une police réduite ; les noms exceptionnellement longs sont tronqués à
deux lignes mais restent disponibles dans l'attribut `title` et le texte DOM.

Les fonds ont été inspectés visuellement ; les calculs et la syntaxe JavaScript
ont été vérifiés. Le navigateur de prévisualisation de cet environnement a
bloqué l'ouverture des fichiers locaux : le rendu HTML final et le scan des QR
restent à valider dans ton navigateur avant intégration en production.
