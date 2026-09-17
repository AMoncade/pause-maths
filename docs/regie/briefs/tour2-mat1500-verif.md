# Brief lot MAT1500 — vérification contre le matériel disponible (admin adrie-59, 2026-09-17)

Vérifier les thèmes, les `defaultOn` et les 96 questions MAT1500 contre le matériel StudiUM réel dans D:\Math\MAT1500 ; corriger ce qui diverge. Matériel mince : 5 fichiers StudiUM (structure du cours, équivalences logiques, devoirs 1 et 2, corrigé du devoir 1) plus des notes de l'utilisateur. Le calendrier et la date d'intra sont dans la page structure ; les lire avant tout.

## Vérifié par l'admin
- D:\Math\MAT1500 : 9 entrées (mesuré), relance studium-sync = rien de nouveau. Pas de quiz relu, pas d'anciens examens.
- Worktree `C:/Users/adrie/pause-maths-wt/mat1500`, branche `lot/mat1500`, avancé sur main@ccc05c7. 96 questions, 363 tests verts.
- Règle des ids ACTIVE : changement de sens, de réponse ou de thème = nouvel id, l'ancien va dans `src/content/retired-ids.json` (admin : envoie-moi la liste). Coquille ou notation = même id.
- Modèles à lire : `docs/reviews/mat1400/verification-studium.md` et `docs/reviews/mat1600/verification-studium.md` (calendrier daté, matière exacte de l'intra, classement intra/final, notation du cours, gaps comblés, relecture aveugle Haiku des ajouts).
- Lire d'abord CLAUDE.md, docs/WORKLOG.md, docs/sources/mat1500.md, docs/reviews/relecture-opus/ (MAT1500).

## Tâches
1. Calendrier : page structure → tableau semaine/sections/dates dans docs/sources/mat1500.md ; date et matière de l'intra ; `exam` et `defaultOn` (« déjà vu en classe » au 17 sept) de `src/content/mat1500/index.ts` corrigés.
2. Questions des thèmes intra confrontées aux devoirs, au corrigé et au PDF d'équivalences : notation du cours (symboles logiques, conventions), résultats et vocabulaire. Ne pas réécrire ce qui est juste ; avec si peu de matériel, écrire clairement ce qui n'a PAS pu être vérifié.
3. Gaps réels seulement, prouvés par le matériel (brouillon agy, gate `npm run import -- f.json --renumber`, relecture aveugle sous-agent Haiku).
4. `npm test` mesuré, docs/reviews/mat1500/verification-studium.md, entrée WORKLOG, `git add` explicite seulement, push lot/mat1500.
5. Rapport à adrie-59 : SHA, comptes, ids à retirer, écarts de calendrier, non vérifié. Puis STOP.

## Périmètre
`src/content/mat1500/**`, `docs/sources/mat1500.md`, `docs/reviews/mat1500/**`, `docs/WORKLOG.md`. Lecture seule sur D:\Math\MAT1500 ; aucun fichier de cours dans le dépôt. Pas de Chrome.

## Non vérifié par l'admin
Le contenu des fichiers ; la date de l'intra. Si une affirmation est fausse, le dire au lieu de l'exécuter.

## Économie
Un seul rapport à la fin ou dès blocage.
