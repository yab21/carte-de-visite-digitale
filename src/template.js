/**
 * TEMPLATE COMMUN des cartes de visite digitales.
 * ------------------------------------------------
 * generateCardPage(data) : reçoit UN objet JSON (ex: data/williams-ano.json)
 * et retourne la page HTML complète. Pour un nouvel employé : dupliquer le
 * JSON, changer les données, relancer `npm run build`. Aucun HTML à copier.
 *
 * Rendu : maquette validée (pastilles orange, lignes de contact arrondies).
 * Stack : Boosted 5.3.8 (CDN) + css/style.css (tokens ODS uniquement).
 * Icônes : sprite SVG inline (stroke = currentColor), aucune dépendance.
 */

// Version Boosted vérifiée comme la plus récente de la branche 5.3.x.
export const BOOSTED_VERSION = "5.3.8";

/** Échappe les données JSON injectées dans le HTML. */
export function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Sprite SVG : chaque symbole est réutilisé via <use href="#i-...">. */
function iconSprite() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">
    <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6.5 3.5h2.6l1.8 4.6-2.2 1.4a12.5 12.5 0 0 0 5.8 5.8l1.4-2.2 4.6 1.8v2.6a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.5 5.6a2 2 0 0 1 2-2.1z"/>
    </symbol>
    <symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 5.5h16v10.5H10l-5 3.5v-3.5H4z"/>
      <path d="M8 9.5h8M8 12.5h5"/>
    </symbol>
    <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/>
      <path d="M4 7l8 6 8-6"/>
    </symbol>
    <symbol id="i-userplus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="8" r="3.5"/>
      <path d="M3.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/>
      <path d="M18.5 8v6M15.5 11h6"/>
    </symbol>
    <symbol id="i-geo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21s-6-6.1-6-10.8a6 6 0 1 1 12 0C18 14.9 12 21 12 21z"/>
      <circle cx="12" cy="10" r="2.2"/>
    </symbol>
    <symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8.5"/>
      <path d="M3.5 12h17M12 3.5c3 3.2 3 13.8 0 17M12 3.5c-3 3.2-3 13.8 0 17"/>
    </symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.5 6l6 6-6 6"/>
    </symbol>
    <symbol id="i-linkedin" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3.5a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6zM3.2 9.2h3.6V21H3.2zM9.4 9.2h3.4v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6V21h-3.6v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21H9.4z"/>
    </symbol>
    <symbol id="i-whatsapp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z"/>
      <path d="M9.2 8.2c.3-.7.6-.7.9-.7h.7c.2 0 .5 0 .7.6l.8 2c.1.3 0 .6-.2.9l-.6.7c.5 1 1.2 1.7 2.2 2.2l.7-.6c.3-.2.6-.3.9-.2l2 .8c.6.2.6.5.6.7v.7c0 .3 0 .6-.7.9-2.8 1.2-7.4-1.2-8.9-4.9-.4-.9-.5-1.8-.1-3.1z" fill="currentColor" stroke="none"/>
    </symbol>
  </svg>`;
}

/** Petit helper : <svg><use ...></svg> avec classe. */
function icon(name, cls = "") {
  return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${name}"></use></svg>`;
}

/**
 * Page complète d'une carte de visite (rendu maquette validée).
 * @param {object} data - Contenu de data/<slug>.json
 * @param {object} opts - { vcfFile } nom du fichier vCard généré à côté de la page
 */
export function generateCardPage(data, opts = {}) {
  const vcfFile = opts.vcfFile || `${data.slug}.vcf`;
  // Préfixe des assets selon l'emplacement de la page : ".." pour /<slug>/,
  // "." pour la racine (cas carte unique servie directement à la racine).
  const ap = opts.assetPrefix || "..";
  const asset = (p) => `${ap}/${String(p).replace(/^\.\.\//, "")}`;
  const primary = data.phones.find((p) => p.primary) || data.phones[0];
  const fullName = `${data.firstName} ${data.lastName}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
  const addressLines = data.addressLines && data.addressLines.length > 0 ? data.addressLines : [data.address];

  // Lignes de contact : pastille orange + texte + chevron (maquette).
  const phoneRows = data.phones
    .map(
      (p) => `
      <li class="list-group-item cv-row">
        <a href="tel:${esc(p.href)}" class="stretched-link text-decoration-none text-body d-flex align-items-center gap-2">
          <span class="cv-row-ic">${icon("i-phone")}</span>
          <span>
            <strong class="d-block">${esc(p.display)}</strong>
            <span class="cv-row-sub d-block">${esc(p.label)}</span>
          </span>
          ${icon("i-chevron", "cv-chevron ms-auto")}
        </a>
      </li>`
    )
    .join("");

  // Réseaux sociaux : pastilles aux couleurs officielles des marques.
  const socialBlock =
    data.social && data.social.length > 0
      ? `
      <div class="d-flex justify-content-center gap-3 mt-4" aria-label="Réseaux sociaux">
        ${data.social
          .map(
            (s) => `
          <a class="cv-social-brand cv-social-${esc(s.icon)}" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}" title="${esc(s.label)}">
            ${icon(`i-${esc(s.icon)}`)}
          </a>`
          )
          .join("")}
      </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullName)} — ${esc(data.company)}</title>
  <meta name="description" content="Carte de visite digitale de ${esc(fullName)}, ${esc(data.position)} — ${esc(data.company)}.">
  <script>
    // Thème Boosted : suit le réglage clair/sombre du téléphone, sans code maison.
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    }
  </script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boosted@${BOOSTED_VERSION}/dist/css/orange-helvetica.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boosted@${BOOSTED_VERSION}/dist/css/boosted.min.css">
  <link rel="stylesheet" href="${ap}/css/style.css">
</head>
<body>
  ${iconSprite()}

  <main class="container px-3 py-3 py-sm-4" style="max-width: 560px;">
    <div class="cv-sheet">
      <!-- Décor de marque : visuel officiel OmLogo1 (filigrane haut + flèche bas) -->
      <img class="cv-deco cv-deco-top" src="${asset("assets/om-arrows.svg")}" alt="">
      <img class="cv-deco cv-deco-bottom" src="${asset("assets/om-arrow-orange.svg")}" alt="">
      <!-- Haut : logo + slogan + baseline corporate -->
      <header class="cv-top">
        <div>
          <img class="cv-logo" src="${asset(data.logo)}" alt="Orange Money">
          <p class="cv-logo-slogan">${esc(data.slogan)}</p>
        </div>
        <p class="cv-tagline">${esc(data.tagline)}<span class="cv-tagline-bar"></span></p>
      </header>

      <!-- Identité -->
      <div class="text-center cv-id">
        <img class="cv-avatar" src="${asset(data.photo)}" alt="Photo de ${esc(fullName)}">
        <h1 class="cv-name mt-3 mb-1">${esc(fullName)}</h1>
        <p class="cv-role mb-1">${esc(data.position)}</p>
        <p class="cv-dept mb-2">${esc(data.department)}</p>
        <span class="cv-rule" aria-hidden="true"></span>
      </div>

      <!-- 4 actions rapides : pastilles orange -->
      <nav class="cv-quick" aria-label="Actions rapides">
        <a class="cv-qa" href="tel:${esc(primary.href)}">
          <span class="cv-qa-circle">${icon("i-phone")}</span><span>Appeler</span>
        </a>
        <a class="cv-qa" href="sms:${esc(primary.href)}">
          <span class="cv-qa-circle">${icon("i-chat")}</span><span>Message</span>
        </a>
        <a class="cv-qa" href="mailto:${esc(data.email)}">
          <span class="cv-qa-circle">${icon("i-mail")}</span><span>Email</span>
        </a>
        <a class="cv-qa" id="saveContactBtn" href="./${esc(vcfFile)}" download="${esc(data.slug)}.vcf">
          <span class="cv-qa-circle">${icon("i-userplus")}</span><span>Enregistrer le contact</span>
        </a>
      </nav>

      <!-- Coordonnées cliquables -->
      <ul class="list-group cv-rows">
        ${phoneRows}
        <li class="list-group-item cv-row">
          <a href="mailto:${esc(data.email)}" class="stretched-link text-decoration-none text-body d-flex align-items-center gap-2">
            <span class="cv-row-ic">${icon("i-mail")}</span>
            <strong class="d-block cv-row-email">${esc(data.email)}</strong>
            ${icon("i-chevron", "cv-chevron ms-auto")}
          </a>
        </li>
        <li class="list-group-item cv-row">
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="stretched-link text-decoration-none text-body d-flex align-items-center gap-2">
            <span class="cv-row-ic">${icon("i-geo")}</span>
            <span class="d-block cv-row-addr">${addressLines.map((l) => esc(l)).join("<br>")}</span>
            ${icon("i-chevron", "cv-chevron ms-auto")}
          </a>
        </li>
        <li class="list-group-item cv-row">
          <a href="${esc(data.website.url)}" target="_blank" rel="noopener" class="stretched-link text-decoration-none text-body d-flex align-items-center gap-2">
            <span class="cv-row-ic">${icon("i-globe")}</span>
            <strong class="d-block">${esc(data.website.label)}</strong>
            ${icon("i-chevron", "cv-chevron ms-auto")}
          </a>
        </li>
      </ul>
      ${socialBlock}

      <footer class="cv-foot">
        <span class="cv-foot-tick" aria-hidden="true"></span>
        <p class="cv-foot-slogan">Trust the future</p>
        <p class="cv-footer mb-0">${esc(data.company)} · Prototype</p>
      </footer>
    </div>
  </main>

  <!-- Toast de confirmation "contact enregistré" (vert fonctionnel ODS) -->
  <div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
    <div id="savedToast" class="toast cv-toast-ok align-items-center" role="status" aria-live="polite">
      <div class="d-flex">
        <div class="toast-body">Contact enregistré dans votre téléphone.</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/boosted@${BOOSTED_VERSION}/dist/js/boosted.bundle.min.js"></script>
  <script>
    // Affiche le toast quand l'utilisateur télécharge la vCard.
    document.getElementById("saveContactBtn").addEventListener("click", function () {
      var el = document.getElementById("savedToast");
      if (window.boosted && boosted.Toast) {
        boosted.Toast.getOrCreateInstance(el).show();
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Page d'accueil : si une seule carte (cas du prototype), la carte est servie
 * DIRECTEMENT à la racine (aucune redirection, aucun flash). Sinon (plusieurs
 * employés), affiche la liste des cartes.
 */
export function generateIndexPage(entries, datas = []) {
  if (entries.length === 1 && datas.length === 1) {
    const data = datas[0];
    return generateCardPage(data, { vcfFile: `${data.slug}/${data.slug}.vcf`, assetPrefix: "." });
  }

  const cards = entries
    .map(
      (e) => `
      <div class="col-12 col-sm-6">
        <a class="card cv-card h-100 text-decoration-none text-body" href="./${esc(e.slug)}/">
          <div class="card-body d-flex align-items-center gap-2">
            <img src="./assets/photo.svg" alt="" width="56" height="56" style="border-radius:50%;object-fit:cover;border:2px solid var(--ods-white-100)">
            <span>
              <strong class="d-block">${esc(e.name)}</strong>
              <span class="text-secondary-custom text-secondary d-block">${esc(e.position)}</span>
            </span>
          </div>
        </a>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cartes de visite digitales — Orange Money Liberia</title>
  <script>
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    }
  </script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boosted@${BOOSTED_VERSION}/dist/css/orange-helvetica.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boosted@${BOOSTED_VERSION}/dist/css/boosted.min.css">
  <link rel="stylesheet" href="./css/style.css">
</head>
<body>
  <main class="container px-3 py-4" style="max-width: 720px;">
    <header class="text-center mb-4">
      <img class="cv-logo" src="./assets/logo.svg" alt="Orange Money">
      <p class="cv-slogan mt-2 mb-0">Trust the future</p>
      <h1 class="h4 mt-3">Cartes de visite digitales (prototype)</h1>
    </header>
    <div class="row g-3">${cards}</div>
    <footer class="cv-footer text-center mt-4">
      <p class="mb-0">Orange Money Liberia · Chaque carte est générée depuis <code>data/&lt;slug&gt;.json</code></p>
    </footer>
  </main>
  <script src="https://cdn.jsdelivr.net/npm/boosted@${BOOSTED_VERSION}/dist/js/boosted.bundle.min.js"></script>
</body>
</html>`;
}
