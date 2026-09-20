# Carte de visite digitale — Orange Money Liberia (prototype)

Landing pages statiques, une par employé, accessibles via QR code imprimé sur
carte physique. Exemple : `https://<projet>.vercel.app/williams-ano/`

## Principe (données ≠ template)

- **Template commun** : `src/template.js` (`generateCardPage`) — le seul HTML à maintenir.
- **Données** : un fichier par personne, ex `data/williams-ano.json`.
- **Build** : `src/build.js` lit tous les JSON et génère, par personne :
  - `<slug>/index.html` — la page (URL propre `/<slug>/`)
  - `<slug>/<slug>.vcf` — vCard 3.0 (bouton « Enregistrer », iOS + Android)
  - `qr/<slug>.png` — QR code 1024px vers l'URL publique (à imprimer)
  - + régénère `index.html` (liste des cartes).
- **Ajouter une personne = ajouter un JSON + `npm run build`.** Aucun HTML à copier.

## Structure

```
├── data/williams-ano.json   ← seul fichier à dupliquer par employé
├── src/template.js          ← template commun (Boosted + sprite SVG)
├── src/build.js             ← génère pages + vCard + QR + index
├── css/style.css            ← TOKENS ODS centralisés (seul endroit avec valeurs en dur)
├── assets/logo.svg          ← logo Orange Money (fourni)
├── assets/photo.svg         ← placeholder, à remplacer par assets/photo.jpg
├── williams-ano/            ← généré (page + .vcf)
├── qr/williams-ano.png      ← généré (à imprimer)
├── index.html               ← généré (liste des cartes)
└── vercel.json              ← config déploiement
```

## Design system

- **Boosted 5.3.8** (dernière 5.3.x vérifiée le 2026-09-20) via CDN dans le template.
- Composants réutilisés : `card`, `btn`, `list-group`, `toast`, `btn-close`.
- Couleurs/typo : variables `--ods-*` / `--cv-*` en tête de `css/style.css`.
- Thème sombre : `data-bs-theme="dark"` posé selon `prefers-color-scheme`
  (mécanisme natif Boosted, aucun système maison).
- Réseaux sociaux (LinkedIn / X / YouTube) : **commentés en V1**
  (`"social": []` dans le JSON masque la section ; remplir le tableau pour l'afficher,
  icônes `i-linkedin`, `i-x`, `i-youtube` déjà prévues dans le sprite).

## Commandes

```bash
npm install
npm run build            # BASE_URL placeholder (vercel.app)
npm run build:prod       # BASE_URL = https://carte-de-visite-digitale.vercel.app
```

## Hébergeur gratuit — comparatif et choix

| Hébergeur | URL gratuite | URLs `/slug` | + | − |
|---|---|---|---|---|
| **Vercel ✅** | `projet.vercel.app` | natives | HTTPS auto, import GitHub en 2 clics, `vercel.json` déjà prêt | 100 Go/mois (largement suffisant) |
| Netlify | `projet.netlify.app` | natives | équivalent, drag & drop | rien de déterminant pour ce besoin |
| Cloudflare Pages | `projet.pages.dev` | natives | edge très rapide | builds limités, config DNS liée à Cloudflare |
| GitHub Pages | `user.github.io/projet` | via config | simple | pas d'edge, sous-chemin `/projet` imposé (QR plus longs) |

**Choix : Vercel** — URLs propres courtes (QR plus denses donc plus fiables),
déploiement Git automatique, HTTPS gratuit.

### Déployer (à exécuter — non fait ici, nécessite ton compte)

Option A — via GitHub (recommandé) :

```bash
git init && git add -A && git commit -m "Prototype carte de visite digitale"
# pousse sur GitHub, puis sur vercel.com : Add New → Project → Import
# Vercel détecte vercel.json (build: npm run build) et déploie.
```

Option B — via CLI :

```bash
npx vercel          # premier déploiement (preview)
npx vercel --prod   # production → https://carte-de-visite-digitale.vercel.app
```

Après le 1er déploiement, si l'URL réelle diffère du placeholder :
1. Dans Vercel → Settings → Environment Variables : `BASE_URL=https://<vraie-url>`
2. Redeploy (les QR `qr/*.png` sont régénérés avec la bonne URL).
3. Réimprimer les QR depuis `qr/`.

## Domaine macartedevisite.com (plus tard — NON exécuté)

1. Acheter le domaine chez un registrar.
2. Vercel → Project → Settings → Domains → Add `macartedevisite.com`
   (+ `www.macartedevisite.com` redirigé vers l'apex).
3. Chez le registrar, créer les enregistrements indiqués par Vercel :
   - apex : `A 76.76.21.21` (ou CNAME/ALIAS selon le registrar),
   - `www` : `CNAME cname.vercel-dns.com`.
4. Attendre la propagation DNS, vérifier le certificat HTTPS auto.
5. Rebuilder avec `BASE_URL=https://macartedevisite.com` et réimprimer les QR.

## Remplacer la photo

Dépose `assets/photo.jpg` puis change `"photo": "../assets/photo.svg"`
en `"photo": "../assets/photo.jpg"` dans `data/williams-ano.json` et rebuild.
