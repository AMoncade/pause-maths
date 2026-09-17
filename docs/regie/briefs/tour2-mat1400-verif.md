# Brief lot MAT1400 — vérification contre le vrai matériel (admin adrie-59, 2026-09-17)

Vérifier les thèmes, les `defaultOn` et les 96 questions MAT1400 contre le matériel StudiUM réel dans D:\Math\MAT1400 ; corriger ce qui diverge. Intra MAT1400 le **26 octobre** (index.ts du tour 1, à confirmer dans le matériel). Les questions du tour 1 ont été écrites depuis Downloads + descriptions officielles, jamais depuis StudiUM.

## Vérifié par l'admin
- D:\Math\MAT1400 : 29/29 fichiers StudiUM rapatriés (lot A, relance = rien de nouveau), 16 quiz dont 1 relecture (Quiz obligatoire-Thème 1), plus des fichiers et notes ajoutés à la main par l'utilisateur (doublons possibles : la curation manuelle fait autorité, ne rien déplacer ni renommer). INDEX.md et LIENS.md en tête, mais leurs chemins peuvent être périmés si l'utilisateur a réorganisé.
- Worktree `C:/Users/adrie/pause-maths-wt/mat1400`, branche `lot/mat1400`, avancé sur main (≥ 7b8aca6). 96 questions, 363 tests verts.
- Règle des ids ACTIVE : un changement de sens ou de réponse = nouvel id ; un changement de thème = nouvel id aussi (le préfixe change) ; l'ancien id va dans `src/content/retired-ids.json` (fichier admin : envoie-moi la liste, je l'écris). Une coquille ou une notation garde son id.
- Méthode et livrable identiques à la vérification MAT1600 qui vient d'être intégrée : lire `docs/reviews/mat1600/verification-studium.md` et `docs/sources/mat1600.md` comme modèle (calendrier daté, matière exacte de l'intra, thèmes manquants, questions mal classées intra/final, notation du cours, gaps comblés à ≥ 8 questions par thème intra, relecture aveugle Haiku des ajouts).
- Lire d'abord CLAUDE.md, docs/WORKLOG.md, docs/sources/mat1400.md, docs/reviews/relecture-opus/ (MAT1400).

## Tâches
1. Calendrier : page structure + plan de cours → tableau semaine/sections/dates dans docs/sources/mat1400.md ; matière exacte de l'intra ; `exam` et `defaultOn` (« déjà vu en classe » au 17 sept) de `src/content/mat1400/index.ts` corrigés.
2. Questions des thèmes intra confrontées aux notes, TP, quiz relu et anciens examens. Corriger ; nouvel id si sens/réponse/thème change. Ne pas réécrire ce qui est juste.
3. Gaps réels comblés seulement (brouillon agy, gate `npm run import -- f.json --renumber`, relecture aveugle sous-agent Haiku).
4. `npm test` mesuré, docs/reviews/mat1400/verification-studium.md, entrée WORKLOG, `git add` explicite seulement, push lot/mat1400.
5. Rapport à adrie-59 : SHA, comptes (questions, modifiées, retirées, ajoutées), ids à retirer, écarts de calendrier, non vérifié. Puis STOP (l'utilisateur fera /clear).

## Périmètre
`src/content/mat1400/**`, `docs/sources/mat1400.md`, `docs/reviews/mat1400/**`, `docs/WORKLOG.md`. Lecture seule sur D:\Math\MAT1400 ; aucun fichier de cours dans le dépôt. Pas de Chrome.

## Non vérifié par l'admin
Le contenu des PDF ; la date exacte de l'intra ; que les 16 quiz correspondent aux thèmes. Si une affirmation est fausse, le dire au lieu de l'exécuter.

## Économie
Un seul rapport à la fin ou dès blocage ; s'arrêter après les thèmes intra si c'est long.
