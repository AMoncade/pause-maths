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

## 2026-09-16 — Étape 0 : scaffold (admin adrie-59)

- Vite 8 + Preact + TypeScript, Vitest 5, Zod 4, KaTeX, vite-plugin-pwa installés. Toutes les dépendances sont posées ici pour qu'aucun lot ne touche `package.json`.
- Vérifié : vitest 5.0.1 accepte vite ^8 en peer (`npm view vitest peerDependencies`).
- Contrat de types partagé dans `src/lib/types.ts` ; agrégateur `src/content/courses.ts` + `bank.ts` ; un `index.ts` par cours avec les thèmes initiaux du HANDOFF §2 (STT1700 vide, à dériver des PDFs).
- Écarts au HANDOFF, assumés par l'admin : `docs/SOURCES.md` devient `docs/sources/<cours>.md` (un fichier par session de contenu) ; les `vf` portent `answer: boolean` au lieu de `choices`.
- Dépôt GitHub privé `AMoncade/pause-maths`, 7 worktrees sous `C:\Users\adrie\pause-maths-wt\`.
