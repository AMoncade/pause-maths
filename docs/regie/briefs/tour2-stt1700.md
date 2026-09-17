# Brief lot STT1700 — tour 2 (admin adrie-59, 2026-09-17)

Dériver les thèmes de STT1700 du vrai matériel de cours, puis écrire le premier jalon de 10 questions d'intra (intra le 7 octobre). Ne rien inventer.

## Vérifié par l'admin
- D:\Math\STT1700 contient 45 fichiers de cours rapatriés de StudiUM (mesuré par le lot A) + INDEX.md + LIENS.md + une page « StudiUM - structure STT1700-A-A26.md » : notes (10 sections), 9 listes d'exercices, 3 énoncés de TP, solutionnaire chap. 1, formulaires intra2/final, tables. Le plan de cours PDF manque encore (le lot A le retente). Aucun quiz dans ce cours.
- Worktree `C:/Users/adrie/pause-maths-wt/stt1700`, branche `lot/stt1700`, avancé sur main@759017a. `src/content/stt1700/index.ts` a `topics: []`.
- Prod déployée : la règle des ids est active (CLAUDE.md) — un changement de sens = nouvel id.
- Lire d'abord CLAUDE.md, docs/WORKLOG.md, docs/PROCESSUS_QUESTIONS.md, HANDOFF.md §2 (STT1700) et la skill projet `.claude/skills/ajouter-questions/`.

## Tâches
1. Lire INDEX.md et la page structure, puis les notes et le formulaire intra. Écrire `docs/sources/stt1700.md` : quelles sections couvre l'intra du 7 octobre (d'après le matériel ; si le matériel ne le dit pas, l'écrire comme hypothèse et prendre les sections 1 à N vues avant le 7 oct selon l'horaire des séances), et la liste des thèmes avec leur `defaultOn`.
2. `src/content/stt1700/index.ts` : thèmes dérivés du matériel (ids courts, titres en français, `defaultOn` vrai pour l'intra).
3. Jalon 1 : 10 questions sur le premier thème, via `docs/PROCESSUS_QUESTIONS.md`. Essai d'économie du tour 2 : faire le brouillon initial avec la skill `agy` (Gemini, quota Google) à partir du processus et des PDF, puis toi seulement le gate (`npm run import -- f.json --renumber`), la relecture aveugle par sous-agent **Haiku** (`model: "haiku"`) avec SymPy, et les corrections. Noter dans le WORKLOG si agy a produit quelque chose d'utilisable (mesure : questions gardées / produites).
4. `npm test` mesuré (les proportions de bank-stats ne s'appliquent qu'à partir de 40 questions intra). Entrée datée `docs/WORKLOG.md`. `git add <chemins explicites>` seulement (jamais -A, ., commit -a ; `git diff --cached --name-only` avant chaque commit). Push `lot/stt1700`.
5. Rapport à adrie-59 : SHA poussé, thèmes (nombre, lesquels sont intra), questions mesurées (`npm test` + compte), ce qui manque dans le matériel. Puis STOP : l'utilisateur fera `/clear` avant le thème suivant.

## Périmètre
`src/content/stt1700/**`, `docs/sources/stt1700.md`, `docs/reviews/stt1700/**`, `docs/WORKLOG.md`. Lecture seule sur D:\Math\STT1700 ; aucun fichier de cours n'entre dans le dépôt. Pas de Chrome.

## Non vérifié par l'admin
Le contenu réel des PDF (je n'en ai lu aucun) ; que la structure du cours suive les 10 sections des notes ; que `agy` soit opérationnel aujourd'hui. Si une affirmation est fausse, le dire au lieu de l'exécuter.

## Économie
Aucun accusé de réception, aucun message intermédiaire. Un seul rapport à la fin du jalon 1 (ou dès blocage).
