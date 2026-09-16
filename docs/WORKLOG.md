# WORKLOG — Pause Maths

Une entrée datée par tâche finie. La plus récente en haut. Chaque lot ajoute la sienne dans son worktree ; l'admin fusionne.

## 2026-09-16 — MAT1500 Jalon 1 (lot mat1500)

- `src/content/mat1500/index.ts` : les 8 thèmes intra du scaffold + 2 thèmes finaux ajoutés
  (`mat1500-count` dénombrement ch. 4-5, `mat1500-graphs` graphes ch. 7, `exam:'final'`, sans
  questions). `defaultOn` corrigé d'après le calendrier réel : seuls `mat1500-logic` et
  `mat1500-quant` passent à `true` (le scaffold initial avait aussi `mat1500-sets` à `true`).
  Raisonnement : le premier quiz (17 sept.) ne porte que sur les devoirs 1-2, et le contenu de
  ces deux devoirs (lu via `agy`, gists seulement) est entièrement de la logique et des
  quantificateurs — aucune trace d'ensembles, fonctions, divisibilité ou induction. Détails et
  limites de cette inférence dans `docs/sources/mat1500.md`.
- Jalon 1 : 10 questions (5 `mat1500-logic`, 5 `mat1500-quant` ; 6 qcm / 2 vf / 2 flash dont 1
  Défi). Distracteurs = erreurs réelles vues dans les devoirs : négation d'un quantificateur
  imbriqué à moitié basculée, réciproque/contraposée confondues, De Morgan appliqué au mauvais
  connecteur, $\exists!$ pris pour $\exists$, ordre $\forall\exists$ vs $\exists\forall$.
- Relecture aveugle par sous-agent (choix mélangés, sans flag ni explication) + vérification
  SymPy (tautologies propositionnelles) et force brute sur domaines finis (négations de
  quantificateurs, unicité) dans un venv temporaire hors dépôt : verdict PASS, aucune
  ambiguïté. Deux flash cards remontées de difficulté 1 à 2 suite aux notes de calibration de
  l'agent (`mat1500-quant-003`, `mat1500-quant-005`). Journal dans `docs/reviews/mat1500/`.
- `D:\Math\MAT1500` toujours vide (lot StudiUM pas encore livré) : contenu tiré de `Downloads`
  (lecture seule), sources consignées dans `docs/sources/mat1500.md`.
- Écart assumé, comme pour mat1400 : script de gate local (scratchpad, hors dépôt) le temps que
  `tests/content.test.ts` soit disponible, abandonné dès le rebase sur main@26c884f.
- Gate officiel (`npm test`, 76 tests) vert après rebase sur main@72b6986.
- Suite : Jalon 2, ~8 questions par thème sur les 8 thèmes intra (~100 au total), un thème à la
  fois, via `scripts/blind-review.ts` (disponible depuis main@8af2316).

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
## 2026-09-16 — Part D, tâche intermédiaire : scripts/blind-review.ts (lot Part D)

- `scripts/blind-review.ts` : `npx tsx scripts/blind-review.ts <fichier.json|dossier> [--seed N] --key <chemin>`. Lit un fichier ou dossier de `Question[]`, valide chaque fichier avec `QuestionFileSchema` (`src/lib/schema.ts`, rebasé depuis le jalon 1 du lot Engine) — sort en erreur claire (chemin Zod + message) si le JSON n'a pas déjà passé le gate, mélange les choix `qcm` (mulberry32 seedé, seed par défaut 1, fisher-yates), imprime un Markdown sans `correct`/`why`/`explanation`/`solution` sur stdout, écrit la clé de correspondance (id → lettre correcte, id → mapping lettre→index d'origine ; pour `vf`/`flash`, la réponse attendue) dans le fichier `--key`, jamais sur stdout. `vf` affiche "Vrai / Faux" sans mélange (ordre fixe de l'app) ; `flash` n'affiche que le prompt + consigne. Ne modifie jamais `src/content`. Typecheck (`tsc --noEmit`) propre ; testé manuellement sur des fixtures (fichier seul, dossier, `--key` manquant, JSON rejeté par le schéma).
- `.claude/skills/ajouter-questions/SKILL.md` mise à jour : l'étape 4 (relecture aveugle) passe par ce script au lieu de construire le matériel aveugle à la main ; nouvelle règle "ne jamais montrer la clé au sous-agent".
- `npm test` après rebase sur main@26c884f : 76 tests verts, `tsc --noEmit` propre.

## 2026-09-16 — Part D, phase 1 : processus + skill d'import (lot Part D)

- `docs/PROCESSUS_QUESTIONS.md` : doc à uploader dans le projet claude.ai de l'utilisateur ; format JSON exact (dérivé de `src/lib/types.ts`), thèmes par cours (à jour au 2026-09-16, MAT1400/1500/1600 seulement — STT1700 vide, pas encore dérivé des PDFs), règles de style, 4 exemples, auto-vérification, consigne de sortie stricte.
- `.claude/skills/ajouter-questions/SKILL.md` : paste JSON → scratchpad → `npm run import -- <fichier>` → gate (`npm test` + relecture aveugle par sous-agent avec vérif SymPy hors dépôt) → désaccord → 3e agent → commit (chemins explicites) → push → rapport à l'admin de régie.
- `scripts/import-questions.ts` n'existe pas encore (lot Engine, en cours) ; la commande `npm run import` est déjà câblée dans `package.json`. La skill s'arrête et prévient l'admin si le script est absent ou que son contrat diffère — à réviser quand le lot Engine pousse.
- Phase 2 (contenu STT1700, ~100 questions) bloquée en attente de `D:\Math\STT1700` (lot A).

## 2026-09-16 — Étape 0 : scaffold (admin adrie-59)

- Vite 8 + Preact + TypeScript, Vitest 5, Zod 4, KaTeX, vite-plugin-pwa installés. Toutes les dépendances sont posées ici pour qu'aucun lot ne touche `package.json`.
- Vérifié : vitest 5.0.1 accepte vite ^8 en peer (`npm view vitest peerDependencies`).
- Contrat de types partagé dans `src/lib/types.ts` ; agrégateur `src/content/courses.ts` + `bank.ts` ; un `index.ts` par cours avec les thèmes initiaux du HANDOFF §2 (STT1700 vide, à dériver des PDFs).
- Écarts au HANDOFF, assumés par l'admin : `docs/SOURCES.md` devient `docs/sources/<cours>.md` (un fichier par session de contenu) ; les `vf` portent `answer: boolean` au lieu de `choices`.
- Dépôt GitHub privé `AMoncade/pause-maths`, 7 worktrees sous `C:\Users\adrie\pause-maths-wt\`.
