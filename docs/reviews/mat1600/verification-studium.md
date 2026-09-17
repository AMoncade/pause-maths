# Vérification MAT1600 contre le vrai matériel StudiUM (tour 2, 2026-09-17)

Brief : `docs/regie/briefs/tour2-mat1600-verif.md`. Worktree `pause-maths-wt/mat1600`, branche
`lot/mat1600`. Matériel comparé : `D:\Math\MAT1600` (lecture seule, aucun fichier de cours
commité).

## Ce qui a été comparé

- Calendrier complet : `01 Plan de cours/StudiUM - structure MAT1600-AB-A26.md` (site AB, contient
  le calendrier semaine par semaine, la matière officielle de l'intra citée mot pour mot sur la
  page StudiUM elle-même, les consignes d'examen). Comparé aux 7 thèmes de
  `src/content/mat1600/index.ts` (label, `exam`, `defaultOn`).
- Notes de séance 4 (« Espace vectoriel ») et séance 5 (« Transformations linéaires ») lues en
  entier (PDF, 22 et 30 pages) pour la notation exacte (axiomes, définitions, théorèmes).
- Suppléments de séance 2 : `Compléments/Factorisation LU - plus 1.pdf` (exercices + solutions),
  `Compléments/Factorisation LU - plus 2.pdf` (théorie + algorithme, Eric Brunelle).
- `03 Exercices & TP/Consignes TP/TP02...md` et `TP05...md` (contenus + exercices incontournables
  par section du Lay).
- Les 101 questions existantes des 5 thèmes intra, une par une, contre ce matériel.

## Ce qui divergeait

1. **`mat1600-det` : `defaultOn: false` alors que la théorie (séance 3, lundi 14 septembre) avait
   déjà eu lieu à la date du build (17 septembre).** Corrigé à `true`.
2. **`mat1600-esp` s'appelait « Espaces vectoriels et bases ».** Les notes réelles de séance 4 ne
   contiennent ni « base » ni « dimension » (ces notions sont de séance 6, après l'intra).
   Renommé « Espaces vectoriels, noyau et image ».
3. **« Transformations linéaires » (séance 5) est un des 4 thèmes explicitement listés par
   StudiUM comme matière de l'intra, et n'avait ni thème ni question.** Ajouté `mat1600-trans`
   (`exam: 'intra'`).
4. **15 des 20 questions `mat1600-esp` portaient sur la dimension, une base ou le rang** (théorème
   du rang, base de $\text{Col}(A)$/$\text{Nul}(A)$, espace ligne, bornes de dimension) : matière
   de séance 6-7 (Lay 2.9, 4.3-4.7), donc **après** l'intra du 16 octobre. Elles étaient classées
   `intra` alors que le badge affiché à l'étudiant ("Intra") était trompeur pour une révision
   ciblée. Déplacées vers un nouveau thème `mat1600-dim` (« Bases, dimension et rang »,
   `exam: 'final'`).
5. **Notation : le cours utilise `Ker(A)`/`Im(A)`, jamais `Nul(A)`/`Col(A)` du manuel Lay.**
   Confirmé sur les diapositives de séance 4 et 5 (« Noyau et image d'une matrice », « Ker(T) »,
   « Im(T) »). Les 8 questions déplacées qui utilisaient `\text{Nul}`/`\text{Col}` ont été
   corrigées vers `\text{Ker}`/`\text{Im}` — traité comme une coquille (le sens et la bonne
   réponse ne changent pas), donc id conservé pour les 7 restées sous `mat1600-esp`, mais un
   nouvel id était de toute façon nécessaire pour celles déplacées vers `mat1600-dim` (voir plus
   bas).
6. **Gap réel, comblé (méthode `PROCESSUS_QUESTIONS.md`, brouillon fait moi-même — pas via agy
   cette fois, volume trop petit pour justifier l'aller-retour) :**
   - Factorisation LU et matrices élémentaires (séance 2, 2 suppléments PDF dédiés, exercices
     numérotés dans les exercices supplémentaires) : 0 question. Ajouté 3 questions
     (`mat1600-matr-021` à `-023`).
   - Transformations linéaires (séance 5, TP5) : 0 question. Ajouté 8 questions
     (`mat1600-trans-001` à `-008`).
   - 3 questions supplémentaires sur `mat1600-esp` (sous-espace, Ker, Im — séance 4, pas
     dimension/base) pour respecter le minimum de 8 questions/thème intra (`tests/bank-stats.test.ts`,
     déclenché car la banque MAT1600 dépasse 40 questions intra).
7. **Ordre pédagogique de la liste des thèmes** : orthogonalité (séances 8-9) apparaissait après
   diagonalisation (séances 10-11). Inversé.

Détail complet dans `docs/sources/mat1600.md`.

## Ids à retirer (pour `src/content/retired-ids.json`, admin)

Les 15 questions suivantes ont changé de thème (`mat1600-esp` → `mat1600-dim`), donc d'id — le
format d'id est `<thème>-nnn` et le classement `intra`/`final` affiché à l'étudiant change
réellement. Contenu mathématique et bonne réponse inchangés (seule la notation `Nul`/`Col` a été
corrigée vers `Ker`/`Im` au passage).

```
mat1600-esp-002
mat1600-esp-003
mat1600-esp-004
mat1600-esp-005
mat1600-esp-006
mat1600-esp-007
mat1600-esp-008
mat1600-esp-012
mat1600-esp-013
mat1600-esp-014
mat1600-esp-015
mat1600-esp-017
mat1600-esp-018
mat1600-esp-019
mat1600-esp-020
```

Correspondance (dans l'ordre) : `mat1600-dim-001` à `mat1600-dim-015`.

## Relecture aveugle des 14 nouvelles questions

`scripts/blind-review.ts`, seed 7, clé jamais montrée au sous-agent. Sous-agent **Haiku** frais :
13/14 réponses rapportées, toutes conformes à la clé (lettre exacte + raisonnement correct) ; la
14e (`mat1600-trans-008`, taille de la matrice canonique $2\times3$) a été omise du rapport de
l'agent (fichier présent, réponse non listée dans le résumé) — vérifiée manuellement, sans
ambiguïté. **14/14 confirmées, 0 désaccord.**

## Non lu / non vérifié

- Le contenu détaillé des quiz-TP 3 à 11 (seuls Quiz-tp1 et Quiz-tp2 ont une relecture) et les
  anciens examens/corrigés extraits des zips (lot A les a récupérés, contenu non ouvert ici).
- Les notes théoriques des séances 6 à 11 en détail (hors intra, hors périmètre de ce tour — le
  nouveau thème `mat1600-dim` reprend seulement les questions déjà existantes, reformulées avec
  la bonne notation ; son contenu n'a pas été vérifié contre les vraies notes de séance 6-7).
- Les vidéos Zoom (liens seulement).

## Mesures

- `npm test` : 363 tests verts (inchangé — le gate valide dynamiquement, pas un test par
  question), `npm run build` : OK.
- Comptes : 101 → 115 questions MAT1600 (+14). Thèmes : `mat1600-esp` 20→8 (-15 déplacées +3
  ajoutées), `mat1600-dim` 0→15 (nouveau, toutes déplacées), `mat1600-trans` 0→8 (nouveau, toutes
  ajoutées), `mat1600-matr` 20→23 (+3 ajoutées). Aucune question retirée sans remplacement.
