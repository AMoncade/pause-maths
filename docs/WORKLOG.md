# WORKLOG — Pause Maths

Une entrée datée par tâche finie. La plus récente en haut. Chaque lot ajoute la sienne dans son worktree ; l'admin fusionne.

## 2026-09-16 — MAT1400 Jalon 1 (lot mat1400)

- `src/content/mat1400/index.ts` : 8 thèmes intra réordonnés selon le calendrier réel de `Downloads/Info MAT1400.txt` (le cours enseigne le chap. 4.4 — gradient/dérivées directionnelles — avant 4.1-4.2 ; à noter, contre-intuitif si on suit l'ordre du manuel Stewart). `defaultOn` = déjà enseigné au 2026-09-16 : vect (annexes A-B), fonc (3.1-3.2), quad (3.3) seulement. 4 thèmes post-intra ajoutés (`exam:'final'`, sans questions).
- Jalon 1 : 10 questions sur ces 3 thèmes (6 qcm / 2 vf / 2 flash), distracteurs = erreurs d'étudiant réelles (signe oublié, confusion produit scalaire/vectoriel, rayon vs valeur de $z$, cercle vs cylindre en 3D).
- Relecture aveugle par sous-agent (choix mélangés, pas de flag correct) + vérification SymPy pour chaque calcul numérique : les 10 confirmées sans correction. Journal dans `docs/reviews/mat1400/`.
- `D:\Math\MAT1400` toujours vide (lot StudiUM pas encore terminé) : contenu tiré de `Downloads` (lecture seule), sources consignées dans `docs/sources/mat1400.md`.
- Gate officiel (`npm test`, 76 tests) passe après rebase sur main (26c884f). Écart assumé : j'avais d'abord écrit un script de validation local (scratchpad, hors dépôt) en attendant le gate réel — abandonné dès que `tests/content.test.ts` a été disponible, comme demandé par l'admin.
- Suite : Jalon 2, ~10-13 questions par thème sur les 8 thèmes intra (~100 au total, un thème à la fois, gate + relecture aveugle + SymPy pour chaque).

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
