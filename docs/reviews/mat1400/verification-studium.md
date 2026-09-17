# Vérification MAT1400 contre le vrai matériel StudiUM (tour 2, 2026-09-17)

Brief : `docs/regie/briefs/tour2-mat1400-verif.md`. Worktree `pause-maths-wt/mat1400`, branche
`lot/mat1400`, partie de `main@481abbb`. Matériel comparé : `D:\Math\MAT1400` (lecture seule,
aucun fichier de cours commité). Méthode et livrable calqués sur la vérification MAT1600
(`docs/reviews/mat1600/verification-studium.md`).

## Ce qui a été comparé

- **Calendrier complet** : `01 Plan de cours\StudiUM - structure MAT1400-AB-A26.md` (calendrier
  daté séance par séance, matière officielle de l'intra, consignes d'examen, barème) et
  `StudiUM - structure MAT1400-A-A26.md` (exercices supplémentaires pré-intra du forum).
  Comparé aux 12 thèmes de `src/content/mat1400/index.ts` (label, `exam`, `defaultOn`, ordre).
- **Feuille de formules de l'intra** : `01 Plan de cours\Aide-mémoire MAT1400 - Intra.md`
  (transcription de `formules.pdf`, le document remis pendant l'examen). C'est la référence de
  notation la plus forte du cours — lue en entier et confrontée à chaque thème.
- **Liste des exercices des TP** (`03 Exercices & TP\Liste des exercices des TPs.md`) : sections
  et numéros du Stewart par séance, TP1 à TP12, plus les exercices supplémentaires pré-intra.
- **Le seul quiz rapatrié** : `05 Quiz & solutions\Quiz obligatoire-Thème 1 — Résumé de la
  tentative 1 (relecture).md`, lu en entier.
- **Les 5 anciens intras + le corrigé de révision A24** (`06 Examens passés\Intras\`,
  `Corrigés (section A)\`), dépouillés question par question (sujet + section du Stewart) via
  agy, puis 4 questions clés retranscrites verbatim pour vérifier le dépouillement.
- **Les 96 questions existantes**, une par une, contre ce matériel.

## Ce qui divergeait

1. **`mat1400-grad` avait `defaultOn: false`** alors que le chap. 4.4 est enseigné le jeudi
   17 septembre de 8h30 à 10h30, soit avant la date du build (17 septembre). Corrigé à `true`.
   Seul `defaultOn` en écart sur les 12 ; les 11 autres étaient justes.
2. **Libellé de `mat1400-tint`** : s'arrêtait aux coordonnées sphériques alors que le chapitre 7
   va jusqu'à 7.5 (changement de variables, 12 novembre). Complété.
3. **En-tête de `index.ts` et commentaires de dates** : la source du calendrier était
   `Downloads/Info MAT1400.txt` ; c'est maintenant la page de structure StudiUM. Date et heure
   de l'intra précisées (lundi 26 octobre, 15h30-17h20), date de référence de `defaultOn`
   passée du 16 au 17 septembre.
4. **Trois gaps réels, comblés par 11 questions** — chacun confirmé par au moins deux sources
   indépendantes :
   - **Équations paramétriques de droites : 0 question sur 96.** Le seul quiz StudiUM rapatrié
     porte entièrement là-dessus, la feuille de formules donne $\vec r(t)=\vec r_0+t\vec v$, et
     5 anciens intras sur 6 ont une question complète bâtie dessus. Ajouté 6 questions
     (`mat1400-vect-013` à `-018`), dont un Défi « plan contenant un point et une droite ».
   - **Différentiabilité : 2 Vrai/Faux seulement.** C'est le thème 4 du cours sur StudiUM, un
     bloc entier de la feuille de formules, et le sujet des questions longues de 4.2 dans
     4 anciens intras. Ajouté 4 questions (`mat1400-part-013` à `-016`).
   - **Fonction auxiliaire de Lagrange : 0 question.** Les 12 questions du thème utilisaient
     toutes $\nabla f=\lambda\nabla g$, alors que la feuille de formules remise à l'examen écrit
     la méthode « optimiser $F=f-\lambda g$ ». Ajouté 1 question (`mat1400-lagr-015`).

## Ce qui ne divergeait pas (vérifié, laissé tel quel)

- **`exam` des 12 thèmes.** La matière de l'intra est citée deux fois sur StudiUM (calendrier et
  forum de consignes) : « annexes A et B ; chapitres 3, 4 et 5 ». Les 8 thèmes `intra` couvrent
  exactement ça, les 4 thèmes `final` couvrent les chapitres 6, 7, 1, 2 enseignés après le
  26 octobre. **Aucune question n'était mal classée intra/final** — contrairement à MAT1600, où
  15 questions avaient dû changer de thème. Rien à retirer.
- **Ordre des thèmes**, y compris le 4.4 avant 4.1-4.3 : conforme au calendrier officiel.
- **Notation et conventions des 96 questions existantes** : test du hessien
  $D=f_{xx}f_{yy}-(f_{xy})^2$, gradient, dérivée directionnelle, linéarisation, plan tangent par
  $\nabla F$, tableau des quadriques — tout concorde avec la feuille de formules de l'intra.
  Aucune question existante n'a été modifiée. **Aucun id à retirer.**

## Piège signalé : les anciens intras portent sur une autre matière

Les 5 anciens intras consacrent **tous** leurs questions 1 et 2 aux séries numériques et aux
séries de Taylor (chapitres 1 et 2), et aucun ne contient de question sur les quadriques, le
gradient, l'optimisation ou Lagrange. En A26 les séries sont enseignées en novembre et évaluées
au **final** : le cours a déplacé cette matière. Réviser l'intra du 26 octobre sur ces PDF
ferait travailler en bonne partie la mauvaise matière. Ce qui reste transférable — et qui a
guidé les ajouts ci-dessus — c'est la géométrie des droites et plans (5 fichiers sur 6), les
limites et la continuité (6 sur 6), et le plan tangent avec différentiabilité (4 sur 6).

## Écarts sur le matériel lui-même (rien à corriger dans le dépôt)

- **`05 Quiz & solutions` ne contient qu'un seul fichier**, pas 16 comme l'annonçait le brief :
  la relecture du « Quiz obligatoire-Thème 1 ». StudiUM liste 11 quiz hebdomadaires + 2 quiz
  récapitulatifs ; les thèmes 2 à 6 n'ont **aucune** relecture rapatriée. La vérification des
  thèmes intra contre les quiz n'a donc pu se faire que pour le thème 1.
- Le forum « CONSIGNES DE L'EXAMEN INTRA » annonce l'intra le **lundi 23 février** avec des
  locaux d'hiver : reliquat d'une offre H26. Le calendrier et le tableau d'évaluations de la
  même page donnent tous deux le **26 octobre**, retenu. Le PDF des TP porte aussi l'en-tête
  « MAT1400 – Automne 2025 » avec des dates de séances périmées.
- Les corrigés de TP et les anciens examens sont présents **en double** (une copie à plat, une
  sous `Documents (anciens examens, corrigés des TP)\`). Curation manuelle de l'utilisateur :
  rien n'a été déplacé ni renommé.

## Relecture aveugle des 11 nouvelles questions

`scripts/blind-review.ts`, seed 23, clé écrite dans un fichier séparé et jamais montrée au
sous-agent. Sous-agent **Haiku** frais, interdit de lire tout autre fichier du dépôt :
**11/11 réponses conformes à la clé** (lettre exacte ou réponse libre équivalente), chacune avec
un raisonnement correct — dont le Défi `mat1400-vect-018`, résolu avec une normale de signe
opposé à la mienne ($\vec{BA}\times\vec v$ plutôt que $\vec v\times\vec{BA}$), qui donne bien le
même plan. **0 désaccord, 0 ambiguïté signalée.**

## Mesures

- `npm test` : **363 tests verts** (14 fichiers) — inchangé, le gate valide dynamiquement.
  `npm run build` : OK.
- Gate d'import : `npm run import -- <fichier> --renumber`, 11 questions acceptées
  (7 qcm, 2 vf, 2 flash, dont 1 Défi), aucune renumérotation nécessaire.
- Comptes MAT1400 : **96 → 107 questions** (+11). `mat1400-vect` 12→18, `mat1400-part` 12→16,
  `mat1400-lagr` 12→13 ; les 5 autres thèmes intra inchangés à 12.
- Équilibre (`tests/bank-stats.test.ts`) : Défi 9/107 = 8,4 % (borne 5-15 %), qcm 67/107 =
  62,6 % (borne 50-70 %), minimum par thème intra 12 (borne 8).
- **0 question modifiée, 0 question retirée, 0 id à retirer.**

## Non lu / non vérifié

- Le contenu des PDF volumineux : notes de cours Owens (183 p.), corrigés des TP1 à TP11,
  examens finaux. Les 5 anciens intras et le corrigé de révision A24 ont été dépouillés au
  niveau « sujet par question » (via agy, vérifié par transcription verbatim de 4 questions),
  pas recalculés.
- Les quiz des thèmes 2 à 6 : absents du dossier.
- Les énoncés du manuel Stewart : le manuel n'est pas dans `D:\Math`. La liste des TP a servi à
  situer les sections, pas à valider des énoncés.
- Les capsules vidéo et playlists (liens seulement).
