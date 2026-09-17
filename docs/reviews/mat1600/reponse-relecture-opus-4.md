# Réponse à la relecture complémentaire 3 Opus — MAT1600

Source : `docs/reviews/relecture-opus/mat1600.md`, section « Relecture complémentaire
3 — 2026-09-16 (main@28445f5) », 24 questions (matr-009..020, esp-009..020).

**Note de timing :** cette relecture a croisé le push du round 3
(`docs/reviews/mat1600/reponse-relecture-opus-3.md`) : elle listait les points 21-33
comme non appliqués sur `main@28445f5`, mais ils l'étaient déjà dans le commit
`16eac3a` poussé avant. Rien à refaire pour ces points-là. Un bug distinct a été
signalé séparément par l'admin dans le suivi de syst-015 (le `why` de $(1,3,2)$
affirmait à tort qu'aucune équation n'était vérifiée, alors que la première l'est) :
corrigé dans ce même lot.

## Décision sur les ids (transmise par l'admin)

Réutiliser un id en changeant le sens de la question (det-018/019/020, vect-013,
vect-014, et maintenant esp-014/016/017/matr-013/016/017 dans ce lot) est accepté tant
qu'aucune progression utilisateur n'existe (rien n'est déployé). La règle stricte
« nouvel id + `retired-ids.json` » s'appliquera au premier déploiement.

## Moyennes

### 34. esp-016 : ambiguïté

**Accepté verbatim.** Reformulé : « Tout sous-espace vectoriel de $\mathbb R^n$ ne
contient que le vecteur nul. » — élimine la lecture « $0$ est commun à tous les
sous-espaces » (vraie mais hors sujet).

### 35. esp-019 : espace ambiant non précisé

**Accepté verbatim.** $H\subset\mathbb R^7$ engendré par 5 vecteurs ; distracteur $7$
ajouté (« la dimension de l'espace ambiant borne aussi, mais ici les 5 générateurs
bornent d'abord »).

### 36. matr-017 : Défi de routine (produit seul)

**Accepté verbatim.** $AX=B$ → $XA=B$ avec $B=\begin{pmatrix}3&1\\1&1\end{pmatrix}$,
réponse $X=BA^{-1}=\begin{pmatrix}3&-5\\1&-1\end{pmatrix}$, distracteur piège
$A^{-1}B=\begin{pmatrix}1&-1\\1&1\end{pmatrix}$ (mauvais côté). Valeurs vérifiées par
SymPy.

### 37. esp-014 : doublon de vect-008, mal rangé

**Accepté verbatim.** Remplacé par un Défi propre à `esp` : base et dimension de
$H=\{(x,y,z,w)\in\mathbb R^4 : x+y=0,\ z=2w\}$, $\dim H=2$ (vérifié par SymPy : rang
de la matrice de contraintes $2\times4$ égal à $2$).

## Basses

| # | Sujet | Décision |
|---|---|---|
| 38 | esp-012, `why` ne nomment pas l'erreur réelle | **Accepté verbatim** : reformulés («$m-\text{rang}=3-2$, le théorème utilise les COLONNES» ; «$3$ est le nombre de lignes, pas une dimension du noyau»). |
| 39 | « espace nul » résiduel (esp-006, esp-015) | **Accepté** : esp-006 déjà uniformisé au round 3 ; esp-015 (`why` du choix 4) corrigé maintenant. |
| 40 | Redondances (matr-013/012, matr-016/015, matr-018/017, esp-017/008+013) | **Acceptées avec adaptation.** matr-013 et matr-016 remplacés par les cas concrets suggérés (donner $A,B,C$ avec $AB=AC$, $B\ne C$ ; quelle matrice fait coïncider $A^2$ et le carré terme à terme — une diagonale). esp-017 remplacé par une lecture concrète (rang à partir des positions de pivots d'une $4\times6$). **matr-018 laissé inchangé** : sa redondance était avec l'ANCIEN matr-017 ($AX=B$, $X=A^{-1}B$) ; le nouveau matr-017 (point 36) porte sur $XA=B$, $X=BA^{-1}$ — un fait différent et complémentaire, donc le recoupement disparaît de lui-même sans y toucher. |
| 41 | Distracteurs faibles (matr-015, esp-019, matr-009, esp-012) | **Acceptées.** matr-015 : « $A^2=A$ » → $\begin{pmatrix}5&3\\3&9\end{pmatrix}=A^TA$. esp-019 : « $10$ » → « $1$ » (croire qu'un espace engendré est toujours une droite). matr-009 : « transposer l'une des deux » → « additionner les entrées qui se correspondent en position » (tentative réelle malgré l'absence de correspondance). esp-012 choix 4 : réglé par le point 38 (même `why`). |
| 42 | Indice de longueur : esp-009 | **Accepté** : choix correct simplifié à « Oui » seul. |
| 43 | Pièges non nommés (11 questions) | **Toutes acceptées**, un « Le piège : … » ajouté à chaque explanation (esp-010,011,015,018,020 ; matr-010,011,012,017,019,020). |

## Vérification

`npm test` vert (363 tests, y compris `tests/bank-stats.test.ts`). Relecture aveugle
ciblée (sous-agent frais, sans clé) sur les 9 questions dont le contenu (choix,
valeurs ou reformulation ambiguë) a changé : `esp-014, esp-016, esp-017, esp-019,
matr-009, matr-013, matr-015, matr-016, matr-017` — voir les journaux
`docs/reviews/mat1600/mat1600-{esp,matr}.md`. Les corrections purement documentaires
(pièges ajoutés, `why` clarifiés sans changer la valeur) n'ont pas nécessité de
nouvelle relecture aveugle complète.

**Compte mesuré : 4 moyennes appliquées verbatim ; 6 basses appliquées (dont 3 points
groupés), une avec adaptation argumentée (matr-018 laissé inchangé car sa redondance
disparaît avec la correction de matr-017) ; 0 rejet net.**
