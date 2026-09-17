# Brief lot PWA — tour 2 (admin adrie-59, 2026-09-17)

Créer le projet Vercel pause-maths, le Blob store, déployer main en prod et mesurer.

## Vérifié par l'admin
- `npx vercel whoami` → amoncade, équipe am-oncade-s-projects. `npx vercel project ls` → aucun projet pause-maths.
- Worktree `C:/Users/adrie/pause-maths-wt/pwa`, branche `lot/pwa`, avancé (ff) sur main@6c6d468 = origin/main.
- `.vercel/` est dans .gitignore.

## Tâches, dans l'ordre
1. Dans le worktree : `npx vercel link` (projet `pause-maths`, équipe am-oncade-s-projects), puis `npx vercel git connect` (auto-deploy sur main). Vérifier framework Vite et prise en compte de `vercel.json`.
2. Blob store : d'abord en CLI (`npx vercel blob store add pause-maths-sync`, lier au projet, `npx vercel env pull` pour `BLOB_READ_WRITE_TOKEN`). Si le CLI ne sait pas : ne rien demander à l'utilisateur, écrire à l'admin le chemin exact du dashboard, et passer à l'étape 3 sans Blob (le statique doit marcher).
3. `npx vercel --prod` (ou push via l'intégration git). Puis `curl -sI` sur l'URL prod, `/sw.js`, `/manifest.webmanifest`, `/api/sync` : 200 + en-têtes de vercel.json. Coller les mesures dans le rapport.
4. Synchro SANS Chrome (réservé au lot A) : deux profils via curl/node contre le vrai `/api/sync` : écriture, lecture, conflit `ifMatch` → comparer à `tests/api/sync.test.ts`. Si le service diffère du mock, corriger `api/sync.ts` + test, `npm test` mesuré.
5. Entrée datée `docs/WORKLOG.md`. `git add <chemins explicites>` seulement (jamais -A, ., commit -a ; `git diff --cached --name-only` avant chaque commit). Push `lot/pwa`. Ne pas toucher `CLAUDE.md` (l'admin écrit l'URL prod).

## Périmètre
vite.config.ts, vercel.json, api/**, public/**, src/lib/{sync,pwa}.ts, index.html, tests/api/**, package*.json, docs/reviews/code/pwa-sync.md, docs/WORKLOG.md.

## Non vérifié par l'admin
Que `vercel blob store add` existe dans le CLI 59.20 ; que la protection des déploiements soit désactivée en prod. Si une affirmation est fausse, le dire au lieu de l'exécuter.

## Économie
Aucun accusé de réception, aucun message intermédiaire. Un seul rapport à adrie-59 à la fin (ou dès blocage) : SHA poussé, URL prod, codes curl, résultat ifMatch réel, non fait et pourquoi.
