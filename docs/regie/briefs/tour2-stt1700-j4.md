# Brief lot STT1700 — jalon 4, densification (admin adrie-59, 2026-09-17)

Porter les 3 thèmes d'intra de 34 à ~48 questions pour que `tests/bank-stats.test.ts` s'applique (seuil 40) et passe, avant la relecture Opus unique du cours.

## Vérifié par l'admin
- Jalons 1 à 3 intégrés : main@60fd71b, 34 questions STT1700 (descr 10, prob 12, var 12 ; 21 qcm / 8 vf / 5 flash ; 4 Défi). 363 tests, tsc/build OK. Avancer d'abord le worktree `C:/Users/adrie/pause-maths-wt/stt1700` sur main (ff-only).
- Bornes de bank-stats (lues dans le test) : Défi entre 5 % et 15 %, qcm entre 50 % et 70 %, au moins 8 questions par thème intra. Cible pour ~48 questions : 7 qcm, 3 vf, 4 flash, dont 1 ou 2 Défi — répartis descr +4, prob +5, var +5. Après ton import, `npm test` doit rester vert AVEC bank-stats actif : c'est la mesure du jalon.
- Ce que les 34 couvrent déjà : lire docs/reviews/stt1700/*.md et les JSON avant d'écrire, pour viser les sous-sujets absents (aide-mémoire d'intra 1 : chaque formule ou notion sans question est un candidat). Pas de doublon de forme avec une question existante.
- Méthode : agy en premier essai (un seul, timeout 10 min ; s'il expire, écrire toi-même comme au jalon 3), gate `npm run import -- f.json --renumber`, relecture aveugle par sous-agent Haiku avec vérification numérique hors dépôt, `defaultOn` inchangés (règle datée dans docs/sources/stt1700.md).

## Tâches
1. Lister les sous-sujets de l'aide-mémoire intra 1 non couverts (3 à 5 lignes dans docs/reviews/stt1700/jalon4-densification.md).
2. Écrire les ~14 questions, gate, relecture Haiku, corrections.
3. `npm test` mesuré (bank-stats maintenant actif), build, entrée WORKLOG, `git add` explicite, push lot/stt1700.
4. Rapport à adrie-59 : SHA, compte total et par thème, proportions mesurées (Défi %, qcm %), désaccords Haiku, agy gardées/produites ou expiré. Puis STOP.

## Périmètre
Inchangé : `src/content/stt1700/**`, `docs/sources/stt1700.md`, `docs/reviews/stt1700/**`, `docs/WORKLOG.md`. Pas de Chrome.

## Non vérifié par l'admin
Que 14 questions suffisent à respecter les bornes selon ta répartition finale : recalcule avant d'importer. Si une affirmation est fausse, le dire au lieu de l'exécuter.
