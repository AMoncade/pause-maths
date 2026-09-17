# Brief lot STT1700 — jalon 3 (admin adrie-59, 2026-09-17)

Thème `stt1700-var` (section 3 : variables aléatoires discrètes, espérance et variance, lois binomiale et multinomiale) : ~12 questions d'intra, même méthode que les jalons 1 et 2.

## Vérifié par l'admin
- Jalons 1 et 2 intégrés : main ≥ c1019f2 (22 questions : descr 10, prob 12 ; 363 tests, tsc/build OK). Worktree `C:/Users/adrie/pause-maths-wt/stt1700` à avancer d'abord : `git merge --ff-only main` (ou `git pull --ff-only origin main` sur lot/stt1700).
- Calendrier : semaine 1 = 31 août (horaire-udem-A26.ics), donc le 17 septembre est en semaine 3 (fin de la section 1) ; la section 2 commence en semaine 4 (21 sept), la section 3 en semaine 5 (28 sept), intra en semaine 6 (7 oct).
- Décision sur `defaultOn` (contrat types.ts : « déjà vu en classe à la date du build ») : `stt1700-descr` vrai ; `stt1700-prob` vrai seulement si ton push a lieu le 21 septembre ou après, sinon faux ; `stt1700-var` faux jusqu'au 28 septembre (donc faux à ce jalon, sauf push le 28 ou après). Noter la règle et les dates dans docs/sources/stt1700.md pour que le prochain jalon la suive sans redemander.
- Méthode validée aux jalons 1 et 2 : brouillon agy (jalon 2 : 12/12 gardées sans correction), gate `npm run import -- f.json --renumber`, relecture aveugle par sous-agent Haiku avec vérification numérique hors dépôt. Reconduire tel quel ; vérifier en particulier le LaTeX (backslashs doublés par agy) et la cohérence numérique de chaque distracteur.

## Tâches
1. Lire les notes de la section 3 et les listes d'exercices correspondantes (docs/sources/stt1700.md dit lesquelles ; Liste4 bascule au chapitre 6, à vérifier) dans D:\Math\STT1700 (lecture seule). Cibler la matière de l'intra 1 telle que l'aide-mémoire la donne.
2. ~12 questions `stt1700-var` ; avec ce jalon le cours dépasse 40 questions intra si tu en fais ≥ 18 — sinon bank-stats ne s'applique pas encore ; vise quand même (proportions visées : voir docs/PROCESSUS_QUESTIONS.md ; bank-stats s'applique dès 40 questions intra, donc vise dès maintenant les bonnes proportions Défi ≤ 15 %, flash ≈ 20 %).
3. Gate, relecture aveugle Haiku, corrections, `npm test` mesuré, docs/reviews/stt1700/stt1700-var.md, entrée WORKLOG, `git add` explicite, push lot/stt1700.
4. Rapport à adrie-59 : SHA, compte mesuré, désaccords de relecture, ratio agy gardées/produites. Puis STOP (l'utilisateur fera /clear).

## Périmètre
Inchangé : `src/content/stt1700/**`, `docs/sources/stt1700.md`, `docs/reviews/stt1700/**`, `docs/WORKLOG.md`. Pas de Chrome.

## Non vérifié par l'admin
Le contenu de la section 3 des notes. Si une affirmation est fausse, le dire au lieu de l'exécuter.
