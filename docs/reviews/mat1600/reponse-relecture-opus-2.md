# Réponse à la relecture complémentaire Opus — MAT1600 (det/esp/compléments)

Source : `docs/reviews/relecture-opus/mat1600.md`, section « Relecture complémentaire —
2026-09-16 (main@044fe93) », 30 questions (det, esp, matr-003..008, syst-005..008,
vect-005..008).

## Élevée

### 10. mat1600-esp-006 : `why` faux (dimension)

**Accepté verbatim (adapté à la formulation).** Le distracteur `{(1,0,0),(0,0,1)}`
utilisait des vecteurs $\mathbb R^3$ pour ce qui devait être les colonnes de $A$
($2\times3$, donc dans $\mathbb R^2$). Corrigé en `{(1,0),(0,1)}`, `why` reformulé pour
nommer explicitement le domaine ($\mathbb R^3$, une entrée par colonne de $A$) vs le
codomaine ($\mathbb R^2$, où vivent les colonnes de $A$).

## Moyennes

### 11. mat1600-matr-008 : indices copiés + Défi de routine

**Vérifié :** demandé à `agy` de comparer $A_2=\begin{pmatrix}2&1\\1&1\end{pmatrix}$,
$B_2=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}$ contre `3.6_Linverse_dune_matrice.pdf` —
**aucune correspondance** (« Non, rien de tel dans ce PDF »). Les indices `A_2`/`B_2`
n'étaient donc pas une copie du PDF, juste une habitude de nommage malheureuse.
**Accepté quand même** pour la calibration : remplacé par un vrai Défi paramétrique
(« pour quel $c$ a-t-on $\begin{pmatrix}2&1\\1&c\end{pmatrix}B=I$ ? », réponse $c=1$),
difficulty 3, vérifié par SymPy.

### 12. Calibration globale des Défi (difficulty 2 → 3)

**Accepté.** `det-006`, `esp-006`, `vect-008` passés en difficulty 3 (conservés tels
quels par ailleurs). `matr-008` remplacé (point 11). `syst-008` : **adapté plutôt que
remplacé** — plutôt que de supprimer la bonne question sur la forme vectorielle
paramétrique (elle reste correcte et utile), elle est **rétrogradée en qcm ordinaire**
(difficulty 2, `challenge` retiré, comme fait pour `matr-002` lors de la relecture
précédente) et un **nouveau** Défi `mat1600-syst-021` (difficulty 3) la remplace dans le
rôle de Défi : système à **deux** paramètres $h,k$ pour une infinité de solutions —
volontairement différent des questions à un seul paramètre déjà ajoutées dans
l'extension à 20 (`syst-009`, `syst-010`), pour éviter la redondance.
- Également appliqué par cohérence : `mat1600-vect-013` (nouveau Défi de l'extension à
  20, indépendance de 3 vecteurs dans $\mathbb R^4$) passé en difficulty 3, selon le même
  principe « Défi ⇒ difficulty 3 » établi par ce point.

## Basses

| # | Sujet | Décision |
|---|---|---|
| 13 | det-001 doublon avec mat1400-vect-004 | **Accepté verbatim** : matrice $\begin{pmatrix}5&2\\3&-1\end{pmatrix}$, réponse $-11$, distracteurs $1$ ($ad+bc$), $11$ ($bc-ad$), $17$ (mauvaises entrées $ac-bd$). Vérifié par SymPy. |
| 14 | det-002, « rangée » vs « ligne » | **Accepté** : uniformisé sur « rangée ». |
| 15 | det-008, formule en colonne manquante + typo | **Accepté** : ajouté $\det A=\sum_i a_{ij}C_{ij}$ le long d'une colonne ; « cofacteur ; ». |
| 16 | esp-003, « espace nul » vs « noyau » | **Accepté** : uniformisé sur « noyau » (déjà le terme dominant dans le reste du fichier). |
| 17 | matr-007, accord « sa propre inverse » | **Accepté** : « son propre inverse ». |
| 18 | matr-005, distracteur « $(AB)^T$ » pas une erreur réelle | **Accepté** : remplacé par $\tfrac1{\det(AB)}AB$, `why` : mauvaise application de la formule d'inverse $2\times2$ (confond avec l'adjointe). |
| 19 | Redondances vect-006/esp-007, esp-004/vect-001 | **esp-007 accepté** : inversé pour tester la version « famille génératrice de taille $n$ ⇒ base » (dual du théorème déjà testé par `vect-006`, plus de recoupement). **esp-004/vect-001 : déjà résolu** par la reformulation de `vect-001` lors de la relecture précédente (elle ne mentionne plus « engendre »/« base »), donc rien à faire ici. |
| 20 | Pièges non nommés (det-001, det-007, esp-008, matr-007, syst-007, vect-007) | **Accepté**, piège ajouté aux 6 `explanation` (det-001 intégré dans sa réécriture du point 13). |

## Vérification

`npm test` vert après tous les changements (315 tests). Relecture aveugle ciblée
(sous-agent frais, sans clé) sur les questions dont le contenu (pas seulement le texte
ou la difficulté) a changé : `det-001`, `esp-006`, `esp-007`, `matr-005`, `matr-008`,
`syst-021` — voir les journaux `docs/reviews/mat1600/mat1600-{det,esp,matr,syst}.md`
pour le verdict. Les questions dont seule l'`explanation`, la terminologie, la
grammaire ou la `difficulty` ont changé n'ont pas été resoumises à une relecture aveugle
complète (leur réponse correcte et leurs distracteurs sont inchangés).

**Compte mesuré : 1 élevée corrigée ; 2 moyennes appliquées (dont 1 adaptée pour éviter
une redondance avec du contenu déjà ajouté dans l'extension à 20) ; 8 basses, toutes
appliquées (2 points groupés, dont 1 déjà résolu par un correctif antérieur).**
