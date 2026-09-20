/**
 * BUILD STATIQUE — aucune action manuelle par employé.
 * ----------------------------------------------------
 * 1. Lit tous les fichiers data/*.json
 * 2. Génère <slug>/index.html  (template commun src/template.js)
 * 3. Génère <slug>/<slug>.vcf  (vCard 3.0, compatible iOS + Android)
 * 4. Génère qr/<slug>.png      (QR code vers l'URL publique de la carte)
 * 5. Régénère index.html       (liste des cartes)
 *
 * URL publique : variable d'env BASE_URL, ex :
 *   BASE_URL=https://carte-de-visite-digitale.vercel.app npm run build
 * Sans BASE_URL, un domaine placeholder est utilisé puis remplacé après déploiement.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { generateCardPage, generateIndexPage } from "./template.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE_URL = (process.env.BASE_URL || "https://carte-de-visite-digitale.vercel.app").replace(/\/$/, "");

/** Construit une vCard 3.0 (iOS + Android) depuis le JSON employé. */
function buildVCard(data, pageUrl) {
  const fold = (line) =>
    // Les lignes vCard > 75 octets doivent être pliées (RFC 2426).
    line.length <= 75 ? line : line.match(/.{1,75}/g).join("\r\n ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.firstName} ${data.lastName}`,
    `N:${data.lastName};${data.firstName};;;`,
    `ORG:${data.company}`,
    `TITLE:${data.position} — ${data.department}`,
    ...data.phones.map((p) => `TEL;TYPE=${p.primary ? "WORK,VOICE,PREF" : "WORK,VOICE"}:${p.href}`),
    `EMAIL;TYPE=WORK:${data.email}`,
    `ADR;TYPE=WORK:;;${data.address};;;;`,
    `URL:${data.website.url}`,
    `NOTE:Carte digitale : ${pageUrl}`,
    "END:VCARD",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

const dataDir = path.join(root, "data");
const qrDir = path.join(root, "qr");
await mkdir(qrDir, { recursive: true });

const files = (await readdir(dataDir)).filter((f) => f.endsWith(".json"));
if (files.length === 0) throw new Error("Aucun fichier data/*.json trouvé.");

const entries = [];
for (const file of files) {
  const data = JSON.parse(await readFile(path.join(dataDir, file), "utf8"));
  if (!data.slug) throw new Error(`Champ "slug" manquant dans data/${file}`);

  const pageUrl = `${BASE_URL}/${data.slug}/`;
  const outDir = path.join(root, data.slug);
  await mkdir(outDir, { recursive: true });

  // 1. Page HTML
  await writeFile(path.join(outDir, "index.html"), generateCardPage(data, { vcfFile: `${data.slug}.vcf` }), "utf8");

  // 2. vCard téléchargeable par le bouton "Enregistrer"
  await writeFile(path.join(outDir, `${data.slug}.vcf`), buildVCard(data, pageUrl), "utf8");

  // 3. QR code PNG (à imprimer sur la carte physique) — 1024px, marge 2.
  await QRCode.toFile(path.join(qrDir, `${data.slug}.png`), pageUrl, {
    width: 1024,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  entries.push({ slug: data.slug, name: `${data.firstName} ${data.lastName}`, position: data.position });
  console.log(`OK  /${data.slug}/  +  /${data.slug}/${data.slug}.vcf  +  qr/${data.slug}.png  -> ${pageUrl}`);
}

// 4. Page d'accueil (liste des cartes)
await writeFile(path.join(root, "index.html"), generateIndexPage(entries), "utf8");
console.log(`OK  /index.html (${entries.length} carte(s))`);
console.log(`BASE_URL utilisée : ${BASE_URL}`);
