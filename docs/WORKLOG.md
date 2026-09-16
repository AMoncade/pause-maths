# WORKLOG — Pause Maths

Une entrée datée par tâche finie. La plus récente en haut. Chaque lot ajoute la sienne dans son worktree ; l'admin fusionne.

## 2026-09-16 — Engine jalon 1 : schema + gate (lot Engine, branche lot/engine)

- `src/lib/schema.ts` : `QuestionSchema` (union discriminée stricte : clé inconnue refusée), `QuestionFileSchema`, `CardStateSchema`, `SettingsSchema`, `ProgressSchema`. Aucune transformation des données.
- `src/lib/gate.ts` : `checkBank` (12 règles, `RULES`), `checkFiles` (+ `file-shape`, `file-route`, issues rattachées à leur fichier), `formatIssues`. Chaque règle est vérifiée indépendamment de la validité Zod.
- Règle des caractères de contrôle validée par l'admin : U+000A toléré seulement dans `solution` et hors formule ; tout le reste rejeté (`\nabla`, `\neq` dans une formule de solution = rejet).
- Contrôle du gate : `tests/fixtures/broken.json` (34 cas) ; `tests/gate.test.ts` vérifie que chaque cas lève exactement sa règle et que les cas couvrent toutes les règles. Vérifié aussi à la main : un fichier cassé temporaire dans `src/content/stt1700/` fait échouer `tests/content.test.ts` (control-char, topic-unknown, file-route), puis retiré.
- Trouvé et corrigé par l'admin (main@b433065) : `hasStrayDollar` signalait `\$` comme orphelin.
- Vérifié : `import.meta.glob` de `bank.ts` fonctionne sous Vitest 5 ; KaTeX `renderToString` tourne en node sans DOM. `vitest.config.ts` fixe `TZ=America/Toronto` et inclut `tests/**/*.test.{ts,tsx}`.
- `npm test` : 76 tests verts ; `tsc --noEmit` : OK.
## 2026-09-16 — Lot PWA : service worker, manifest, icônes, synchro, vercel.json

- `vite.config.ts` : `VitePWA` en `registerType: 'prompt'` (pas `autoUpdate`), `injectRegister: false` (l'enregistrement du SW est fait à la main dans `src/lib/pwa.ts`), `workbox.globPatterns` + `cleanupOutdatedCaches`, manifest complet (id, scope, lang fr-CA, standalone, icônes 192/512 + maskable).
- **Vérifié par un build temporaire** (import jetable de `katex/dist/katex.min.css` dans `main.tsx`, retiré ensuite) : les `.woff2` de KaTeX atterrissent bien dans `dist/assets/*.woff2` et passent par `globPatterns` sans avoir besoin d'`includeAssets`.
- Icônes générées hors dépôt (SVG source + `sharp`, dans le scratchpad de la session, jamais commité) : `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (fond dégradé violet/indigo, `π` blanc), `apple-touch-icon.png` (180 px, **opaque**, vérifié sans canal alpha), `favicon-32.png`.
- `index.html` : liens icônes + meta `apple-mobile-web-app-*`. Le lien `<link rel="manifest">` est injecté automatiquement par le plugin (vérifié dans `dist/index.html`).
- `src/lib/pwa.ts` : `initPwa()` enregistre le SW via `virtual:pwa-register`, `onUpdateReady(cb)` / `applyUpdate()` pour que le lot UI choisisse le moment (Home/Recap), `visibilitychange` → `registration.update()` au plus 1×/heure.
- `src/lib/sync.ts` : `generateSyncCode` / `formatSyncCode` / `normalizeSyncCode` (alphabet 32 sans 0/O/1/I), `syncNow(p)` (GET puis PUT sur `/api/sync`, clé = SHA-256(code) en hex), plus `checkSyncCode(code)` (ajout hors contrat, pour que l'écran "Entrer un code" distingue un code inexistant d'une simple première activation — sinon un 404 sur un code tapé par erreur est silencieusement pris pour une activation neuve). **Fusion temporaire locale (`tempMerge`)** en attendant `src/lib/merge.ts` (lot Engine, toujours absent) : remplacer l'import dès qu'il existe, signature identique à celle du contrat.
- `api/sync.ts` (fonction Vercel Node) : GET/PUT, clé validée par regex (64 hex), taille ≤ 200 Ko (content-length + mesure réelle), rate limit en mémoire (20 PUT/min par clé, best-effort — repart à zéro sur une instance froide, documenté comme tel), même `tempMerge` dupliqué côté serveur.
- `vercel.json` : `Cache-Control: no-cache` sur `/sw.js`, `/index.html`, `/manifest.webmanifest` ; `Content-Type: application/manifest+json` sur le manifest ; `/assets/(.*)` en immutable 1 an.
- **Stockage — décision (item 5 du brief) : Vercel Blob, pas Upstash.** Recherché (WebSearch) : le tier gratuit Upstash **archive la base après 30 jours d'inactivité** (l'endpoint est supprimé, restauration manuelle possible depuis la console) — même défaut que Supabase, risque réel vu l'usage par intermittence (semaines sans ouvrir l'app entre les sessions d'étude). Rien trouvé indiquant une suppression par inactivité pour Vercel Blob. `access: 'private'` est disponible sur `put`/`get` (`@vercel/blob` 2.8.0) : le blob n'est lisible qu'avec le token du projet, pas par URL publique devinée — donc **aucune intégration Marketplace à accepter**, ce point du brief tombe.
- Ajouté à `package.json` (dépendance runtime) : `@vercel/blob@^2.8.0`. `@vite-pwa/assets-generator` **pas** installé : icônes générées via `sharp` en dehors du dépôt (scratchpad de la session), donc aucune dépendance de génération d'icônes ajoutée au projet.
- Tests : `tests/api/sync.test.ts`, 9 cas (`@vercel/blob` mocké en mémoire) — clé mal formée, 404 sur code inconnu, PUT puis GET identique, fusion sur deux PUT successifs, carte la plus récente gagne même stockée, corps trop gros (413), corps invalide (400), rate limit (429 après 20), méthode non supportée (405). `npm run typecheck`, `npm test`, `npm run build` passent tous les trois.
- **Écart au brief, signalé à l'admin :** `CLAUDE.md` dit "aucun lot ne touche `package.json`" ; le brief de l'admin m'a explicitement autorisé à le faire pour ce lot. Les deux ne sont pas alignés — à corriger dans `CLAUDE.md` si l'admin confirme l'exception.
- **Zone grise trouvée :** `src/main.tsx` n'a pas de propriétaire dans le tableau des périmètres de `CLAUDE.md`. Personne n'appelle encore `initPwa()` — non touché ici pour rester dans mon périmètre déclaré ; signalé à l'admin.
- **Bloqué :** ni le MCP Vercel (`list_teams`/`list_projects` renvoient vide ou une erreur générique) ni le CLI (`npx vercel whoami` → "A new login is required") ne sont authentifiés dans cette session. Impossible de créer le projet Vercel, donc impossible d'obtenir l'URL de prod, d'activer Vercel Blob, ou de vérifier avec `curl` (items 7 et 11 du brief). Détails envoyés à l'admin par SendMessage.

## 2026-09-16 — Étape 0 : scaffold (admin adrie-59)

- Vite 8 + Preact + TypeScript, Vitest 5, Zod 4, KaTeX, vite-plugin-pwa installés. Toutes les dépendances sont posées ici pour qu'aucun lot ne touche `package.json`.
- Vérifié : vitest 5.0.1 accepte vite ^8 en peer (`npm view vitest peerDependencies`).
- Contrat de types partagé dans `src/lib/types.ts` ; agrégateur `src/content/courses.ts` + `bank.ts` ; un `index.ts` par cours avec les thèmes initiaux du HANDOFF §2 (STT1700 vide, à dériver des PDFs).
- Écarts au HANDOFF, assumés par l'admin : `docs/SOURCES.md` devient `docs/sources/<cours>.md` (un fichier par session de contenu) ; les `vf` portent `answer: boolean` au lieu de `choices`.
- Dépôt GitHub privé `AMoncade/pause-maths`, 7 worktrees sous `C:\Users\adrie\pause-maths-wt\`.
