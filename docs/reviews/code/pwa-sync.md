# Relecture de code — synchro PWA (`api/sync.ts`, `src/lib/sync.ts`)

- **Relecteur :** lot Engine (Opus), à la demande de l'admin de la régie.
- **Date :** 2026-09-16.
- **Version relue :** main@2c50626.
- **Sources vérifiées :** le code sur main et les déclarations `.d.ts` de `@vercel/blob` 2.8.0 installé. Rien n'a été exécuté contre Vercel : le comportement exact du cache CDN et le contenu des logs sont **non vérifiés**.
- **Périmètre :** aucune correction faite par le relecteur (fichiers du lot PWA). Correctifs 1 à 9 transmis au lot PWA par l'admin.

## Résumé

11 anomalies, dont 2 élevées :
- lectures blob en cache suivies d'une écriture non conditionnelle, d'où des mises à jour perdues ;
- code de synchro stocké en clair dans le blob.

## Anomalies

### 1. ÉLEVÉE — Lecture en cache puis écriture non conditionnelle : des mises à jour sont perdues

`api/sync.ts:28` et `api/sync.ts:83-90`.

- `get(pathname, { access: 'private' })` passe par le cache CDN par défaut. Le `.d.ts` de `get()` : `useCache` vaut `true` par défaut, et `useCache: false` « bypasses the CDN cache and reads the latest content directly from origin storage ».
- Ensuite `put(..., { allowOverwrite: true })` écrit sans condition.
- Deux PUT proches (vraiment concurrents, ou simplement dans la fenêtre du cache après un overwrite) lisent le même état : le dernier écrase l'autre.
- Ça se répare seulement quand l'appareil perdant resynchronise, car son état local est intact. Si ce stockage local disparaît avant (éviction iOS, désinstallation), la perte est définitive.

**Correctif proposé :**
- Lire avec `get(..., { useCache: false })` et garder `result.blob.etag`.
- Écrire avec `put(..., etag ? { ifMatch: etag } : { allowOverwrite: false })`. `ifMatch` « implies allowOverwrite » ; `allowOverwrite: false` lève si le blob a été créé entre-temps.
- Sur `BlobPreconditionFailedError` (ou « already exists ») : relire, refusionner, réessayer, 3 fois au plus, puis répondre 409 « Synchro concurrente, réessaie ». Réessayer est sans risque : `merge` est commutatif, associatif et idempotent.
- Mettre à jour les mocks de `tests/api/sync.test.ts` et ajouter un test de 2 PUT entrelacés.

### 2. ÉLEVÉE — Le code de synchro part en clair et il est stocké

`src/lib/sync.ts:94-97`, `api/sync.ts:51`, `api/sync.ts:85` et `api/sync.ts:91`.

- Le commentaire « Le serveur ne voit jamais le code lui-même » (`api/sync.ts:2-3`) est faux.
- `Progress` contient `syncCode`, et `syncNow` envoie `JSON.stringify(merged)` avec le code.
- Le serveur le stocke dans le blob et le renvoie dans chaque GET/PUT. Le hachage SHA-256 de la clé ne protège donc rien.

**Correctif proposé :**
- Client : envoyer `{ ...merged, syncCode: undefined }` (ou omettre la clé), puis remettre le code local sur le résultat.
- Serveur : retirer `syncCode` du corps validé et du blob stocké, avant `merge` et avant `put`.

### 3. MOYENNE — Un blob stocké illisible est écrasé en silence

`api/sync.ts:31-33`, `api/sync.ts:47-49`, `api/sync.ts:83-84` et `src/lib/sync.ts:52`.

- Cas visé : JSON valide mais refusé par `ProgressSchema`. `readStoredProgress` renvoie alors `null`.
- Au PUT, `stored ? merge(...) : incoming` remplace tout l'historique distant par le corps reçu.
- Au GET, la réponse est 404 « Aucune progression pour ce code », que `checkSyncCode` traduit en « code inexistant » : message faux.
- Ça arrivera au prochain changement de schéma : ajout de `topicOverrides` le 2026-09-16, et tout futur `v`.

**Correctif proposé :**
- Distinguer « absent » (`get` → `null` → 404) de « illisible ».
- Appliquer `migrate()` de `src/lib/progress.ts` avant `safeParse`, comme `loadProgress`.
- Si c'est toujours illisible : copier le blob brut vers `sync/<key>.backup-<ts>.json` avant d'écrire, ou répondre 409 avec un message clair. Jamais d'écrasement muet.
- Même chose si `JSON.parse` lève : aujourd'hui, 502 à vie pour ce code, sans issue.

### 4. MOYENNE — Rate limit contournable, quota du stockage attaquable

`api/sync.ts:15-25`, `api/sync.ts:44-56` et `api/sync.ts:59`.

- La limite est indexée par `key`, choisie par l'appelant : il suffit de varier la clé.
- GET n'est pas limité du tout.
- Chaque clé nouvelle crée un blob de ≤ 200 Ko. N'importe qui peut remplir le stockage ou épuiser les opérations du plan gratuit ; un store suspendu casse la synchro de l'utilisateur.
- La `Map` `hits` grossit sans borne sur une instance chaude.

**Correctif proposé :**
- Limiter aussi par IP (`x-forwarded-for`, 1re valeur, ou `x-real-ip`) sur GET et PUT.
- Plafonner les créations de nouvelles clés par IP (ex. 5/h).
- Purger `hits` des entrées vides quand la `Map` dépasse ~1 000 clés.
- Documenter la limite assumée : c'est du best-effort par instance.

### 5. MOYENNE — La clé (équivalente à un mot de passe) passe dans l'URL `?key=`

`src/lib/sync.ts:51`, `src/lib/sync.ts:82`, `src/lib/sync.ts:94` et `api/sync.ts:37`.

- La clé suffit pour lire et écrire la progression.
- Dans la query string, elle finit dans les logs de requêtes Vercel et de tout proxy (probable, non vérifié).

**Correctif proposé :**
- En-tête `X-Sync-Key` côté client, `req.headers['x-sync-key']` côté serveur.
- `Cache-Control: no-store` sur toutes les réponses de `api/sync`.

### 6. MOYENNE — `fetch` sans délai d'expiration

`src/lib/sync.ts:51`, `src/lib/sync.ts:82` et `src/lib/sync.ts:94`.

- Sur un réseau mobile qui pend, `syncNow` et `checkSyncCode` ne se terminent jamais : l'UI reste en « synchro… ».

**Correctif proposé :**
- `AbortSignal.timeout(10_000)` sur chaque `fetch`.
- En cas d'abort, renvoyer « Réseau trop lent : la synchro reprendra plus tard ».

### 7. BASSE — Erreurs client peu claires

`src/lib/sync.ts:53`, `src/lib/sync.ts:86`, `src/lib/sync.ts:90`, `src/lib/sync.ts:102` et `src/lib/sync.ts:104-105`.

- Les erreurs serveur s'affichent brutes, ex. « Erreur serveur (502) ».
- `getRes.json()` peut lever sur une réponse non JSON (ex. HTML servi par `vite preview` sans la fonction). L'erreur tombe dans le `catch` et affiche « Hors ligne », ce qui est faux.
- Un GET 200 refusé par `ProgressSchema` est ignoré sans rien dire.

**Correctif proposé :**
- 502 → « Stockage de synchro indisponible, réessaie plus tard ».
- 400 → « Version de l'app périmée : ferme et rouvre l'app pour la mettre à jour ». Une vieille PWA (`registerType: 'prompt'`) envoie l'ancien format, que le serveur refuse avec 400.
- Mettre `getRes.json()` dans un `try/catch` séparé → « Réponse du serveur illisible ».
- GET 200 refusé par `ProgressSchema` → même message « version périmée ».

### 8. BASSE — Le client ignore la réponse du PUT

`src/lib/sync.ts:99-108`.

- Le client renvoie sa fusion locale au lieu de `await putRes.json()`.
- La réponse du PUT est la fusion serveur : elle inclut ce qu'un autre appareil a poussé entre le GET et le PUT.

**Correctif proposé :**
- Valider la réponse avec `ProgressSchema`, puis renvoyer `merge(merged, serveur)`. Le client converge dès cette synchro-ci.

### 9. BASSE — Taille du résultat fusionné non vérifiée

`api/sync.ts:84-85`.

- Stocké 200 Ko + entrant 200 Ko disjoints → blob > 200 Ko.
- Ensuite le client ne peut plus jamais pousser : 413 permanent pour ce code.
- Peu probable : environ 80 octets par carte.

**Correctif proposé :** si `JSON.stringify(merged)` dépasse la limite, répondre 413 sans écrire.

### 10. BASSE — Bruit dans le contrôle de taille

`api/sync.ts:64` et `api/sync.ts:71`.

- Content-Length absent ou non numérique : `Number(...)` donne 0 ou NaN, et le premier contrôle laisse passer.
- Le second contrôle (re-stringify du corps déjà parsé) rattrape, mais seulement après le parsing complet (limite Vercel ~4,5 Mo).

**Correctif proposé :** aucun changement nécessaire ; documenter que le vrai plafond d'entrée est celui de Vercel.

### 11. INFO — Vérifié sans problème

- `generateSyncCode` : `b % 32` sur un octet est sans biais (256 = 8 × 32), 60 bits d'entropie.
- `normalizeSyncCode` est correct.
- Aucun `runtimeCaching` dans workbox : le service worker n'intercepte pas `/api/sync`.
- `merge` et `ProgressSchema` sont bien importés des deux côtés, sans DOM ni navigateur côté serveur.
- Côté serveur, `resetAt` est bien pris en compte via `merge`.

## Ordre conseillé

1. Anomalies 1 et 2.
2. Anomalies 3, 4 et 5, dans le même passage.
3. Anomalies 6 et 7.
