# Réponse à la relecture complémentaire 2 Opus — MAT1600

Source : `docs/reviews/relecture-opus/mat1600.md`, section « Relecture complémentaire
2 — 2026-09-16 (main@9a992ef) ». 37 questions nouvelles (det-009..020, syst-009..021,
vect-009..020) + suivi des 25 questions modifiées par les deux rondes précédentes.

## Écart documentaire (matr-017)

**Résolu automatiquement.** `matr` était resté à 8 questions sur `main@9a992ef` (les
extensions locales `matr-009..020` n'avaient pas encore été poussées à ce moment). Le
push suivant (`7a34f4c`/`438cd00`) inclut `matr-017`, qui existe désormais et
correspond exactement à ce que décrivait `reponse-relecture-opus.md`.

## Élevées

### 21. det-015 : `why` faux

**Accepté verbatim.** Le choix « 3 » est en fait $\det A+\det B=1+2=3$, pas une
entrée erronée d'$AB$. `why` corrigé.

### 22. det-017 : explanation fausse (comptage de zéros)

**Accepté verbatim.** Les colonnes 1 $(1,0,5)$ et 2 $(2,0,1)$ ont chacune un zéro
(2 termes), pas zéro comme l'affirmait l'explanation. Corrigé.

### 23. det-019 : `why` faux

**Accepté, avec la question remplacée** (voir aussi point 30 ci-dessous : la question
originale était aussi un doublon de det-001). Nouvelle question : développement complet
d'un $3\times3$ sans aucun zéro, testant l'oubli du signe alterné plutôt qu'une simple
erreur $ad$ vs $bc$.

### 24. vect-020 : deux `why` faux

**Accepté verbatim.** $(2,-1,3)=2v_1+3v_2$ (signe sur $3v_2$, pas « $2v_1+v_2$ ») ;
$(2,1,3)$ n'a aucune origine identifiable, remplacé par $(2,-5,7)=2v_1-v_2$ (facteur
$3$ oublié), vérifié par SymPy.

## Moyenne

### 25. Calibration syst-015 et vect-013

**Accepté verbatim pour les deux.**
- `syst-015` : difficulty 3 ; distracteurs remplacés par $(-1,1,6)$ (vérifie les
  équations 1 et 2) et $(4,0,2)$ (vérifie 1 et 3), empêchant une élimination par test
  partiel.
- `vect-013` : vecteurs remplacés par $(1,2,0,1),(0,1,1,1),(1,3,1,2)$ où
  $v_3=v_1+v_2$ (vérifié par SymPy) — dépendance non visible sur les 3 premières
  composantes, contrairement à l'ancienne version.

## Basses

| # | Sujet | Décision |
|---|---|---|
| 26 | esp-006 suivi, « espace nul » résiduel | **Accepté** : uniformisé sur « noyau » dans le prompt et la solution. |
| 27 | matr-008 suivi, `why` confus + distracteur faible | **Accepté** : `why` de $c=2$ reformulé ; $c=0$ remplacé par $c=\tfrac12$ (résout $2c-1=0$ au lieu de $2c-1=1$). |
| 28 | det-013, parenthèse trompeuse + distracteur faible | **Accepté** : parenthèse retirée ; distracteur remplacé par « le facteur $k$ », `why` expliquant qu'il n'intervient pas. |
| 29 | det-018, question redondante avec det-008/017 | **Accepté** : remplacé par un calcul (développement selon la colonne 2 de $[[3,0,1],[2,0,4],[1,5,2]]$, $\det=-50$), vérifié par SymPy. |
| 30 | Redondances (det-019/001, det-020/003, vect-014/007, syst-016) | **Toutes acceptées**, avec adaptation pour det-020 (voir ci-dessous) : det-019 devient un calcul $3\times3$ sans zéro (voir point 23) ; det-020 devient $\det(-A)=\det A$ (Faux) pour une taille impaire plutôt que $\det(2A)$ en taille 4 — teste le piège du signe plutôt que l'exposant déjà testé par det-003 ; vect-014 devient « la famille $\{v,0\}$ est-elle libre ? » (concret, 2 vecteurs) plutôt que l'énoncé général déjà couvert par vect-007 ; syst-016 : un des deux choix « ignorer la ligne » remplacé par « autant de lignes non nulles que d'inconnues » (idée différente). |
| 31 | syst-012, précision matrice augmentée + mêmes inconnues | **Accepté** : prompt et explanation précisés. |
| 32 | Distracteurs faibles (det-010, det-012, syst-010, vect-009 choix 3-4) | **Toutes acceptées** : det-010 « $-4$ » → « $-\tfrac14$ » (signe ET inverse confondus) ; det-012 « non défini » → « dépend de la position de la rangée nulle » ; syst-010 « $h=-6$ » → « $h=\tfrac52$ » (rapport des constantes au lieu des coefficients) ; vect-009 choix 3-4 remplacés par $c_1=1,c_2=0$ et $c_1=0,c_2=1$ (calculs concrets vérifiés faux). |
| 33 | Pièges non nommés (17 questions) | **Toutes acceptées**, un « Le piège : … » ajouté à chaque explanation listée (det-009,010,012,013,016,020 ; syst-012,013,017,018,020 ; vect-010,014,015,016,018,019). |

## Vérification

`npm test` vert (334 tests) après tous les changements. Relecture aveugle ciblée
(sous-agent frais, sans clé) sur les 15 questions dont le contenu (choix, valeurs ou
calibration) a changé : `det-010,012,013,015,018,019,020`, `syst-010,015,016`,
`vect-009,013,014,020`, `matr-008` — voir les journaux
`docs/reviews/mat1600/mat1600-{det,syst,vect,matr}.md` pour le verdict. Les
corrections purement documentaires (pièges ajoutés, terminologie, précision de
formulation) n'ont pas nécessité de nouvelle relecture aveugle.

**Compte mesuré : 4 élevées corrigées (toutes verbatim, une avec remplacement complet
de la question pour aussi régler une redondance signalée) ; 1 moyenne appliquée
verbatim (couvrant 2 questions) ; 8 basses appliquées (dont 3 points groupés
touchant plusieurs questions chacun) ; 0 rejet.**
