# Configuration du widget Google Reviews (Elfsight)

## Étape 1 — Créer un compte Elfsight

1. Allez sur **https://elfsight.com**
2. Cliquez **Sign Up Free** (le plan gratuit affiche 5 avis, le plan Basic à ~5 €/mois = illimité)
3. Connectez-vous avec votre compte Google

---

## Étape 2 — Créer le widget Google Reviews

1. Dans le tableau de bord Elfsight → **Create Widget**
2. Cherchez **"Google Reviews"** → sélectionnez-le
3. Dans le champ **Business Name / URL**, entrez :
   ```
   Maître Rokia ADJAGBA Commissaire de Justice
   ```
   ou collez directement l'URL Google Maps de l'étude
4. Elfsight trouve automatiquement votre fiche Google et charge vos avis

---

## Étape 3 — Personnaliser le widget

| Paramètre | Valeur recommandée |
|---|---|
| **Layout** | Slider ou Grid |
| **Background** | Transparent (pour fond navy du site) |
| **Text color** | White |
| **Stars color** | #fbbc04 (jaune Google) |
| **Show reviews** | 5 étoiles uniquement (optionnel) |
| **Min rating** | 4 (masque les avis négatifs) |
| **Sort by** | Most recent |
| **Show "Write a review" button** | Oui |

---

## Étape 4 — Récupérer l'ID du widget

Après avoir cliqué **Publish**, Elfsight vous donne un code comme :

```html
<script src="https://static.elfsight.com/platform/platform.js" async></script>
<div class="elfsight-app-a1b2c3d4-e5f6-7890-abcd-ef1234567890" data-elfsight-app-lazy></div>
```

Notez l'ID : `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

## Étape 5 — Intégrer dans le site (2 modifications)

### Dans `index.html`

**Décommentez le script** (ligne ~12) :
```html
<!-- AVANT -->
<!-- <script src="https://static.elfsight.com/platform/platform.js" async></script> -->

<!-- APRÈS -->
<script src="https://static.elfsight.com/platform/platform.js" async></script>
```

**Décommentez et remplacez le widget** (cherchez `VOTRE_APP_ID`) :
```html
<!-- AVANT -->
<!-- <div class="elfsight-app-VOTRE_APP_ID" data-elfsight-app-lazy></div> -->

<!-- APRÈS -->
<div class="elfsight-app-a1b2c3d4-e5f6-7890-abcd-ef1234567890" data-elfsight-app-lazy></div>
```

---

## Étape 6 — Mettre à jour le lien "Laisser un avis"

Dans `index.html`, cherchez `VOTRE_PLACE_ID` et remplacez par votre Place ID Google :

```html
<!-- AVANT -->
<a href="https://search.google.com/local/reviews?placeid=VOTRE_PLACE_ID" ...>

<!-- APRÈS (exemple) -->
<a href="https://search.google.com/local/reviews?placeid=ChIJxxxxxxxxxxxxxxxx" ...>
```

> **Trouver votre Place ID** : https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder

---

## Étape 7 — Déployer

```bash
git add index.html
git commit -m "feat: activate Elfsight Google Reviews widget"
git push
```

GitHub Pages se met à jour automatiquement en ~1 minute.

---

## Résultat final

- ✅ Avis Google vrais et vérifiés
- ✅ Mise à jour automatique à chaque nouvel avis
- ✅ Aucune intervention manuelle
- ✅ Bouton "Laisser un avis" intégré
- ✅ Filtre automatique (min. 4 étoiles configurable)

---

## Plan tarifaire Elfsight

| Plan | Prix | Avis affichés | Mise à jour |
|------|------|---------------|-------------|
| Free | 0 € | 5 | Manuelle (sync) |
| Basic | ~5 €/mois | Illimité | Automatique |
| Pro | ~10 €/mois | Illimité | Temps réel |

> Pour un cabinet, le plan **Basic** est largement suffisant.
