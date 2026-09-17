# Relecture — mat1600-matr (jalon 1)

Gate (`npm test`) : 0 erreur. Relecture aveugle (sous-agent, choix mélangés, sans flag
`correct` ni `explanation`), calculs vérifiés par SymPy dans un venv hors dépôt.

## mat1600-matr-001 (qcm)

Réponse : $B^TA^T$ — confiance haute (théorème standard, pas de calcul numérique
nécessaire). Réfutations correctes : $AB$ (la transposition change la matrice en
général), $A^TB^T$ (ordre non inversé — erreur classique), $A^T+B^T$ (confond avec
$(A+B)^T$).
Verdict : **OK**.

## mat1600-matr-002 (qcm, Défi)

Réponse : $\begin{pmatrix}3&-5\\-1&2\end{pmatrix}$ — confiance haute. SymPy :
`Matrix([[2,5],[1,3]]).det() = 1`, `.inv() = Matrix([[3,-5],[-1,2]])`,
`A*A.inv() = I`. Chaque distracteur vérifié par multiplication directe : aucun ne donne
l'identité (signes non inversés ; division par $3$ au lieu de $\det A=1$ ; diagonale non
échangée).
Verdict : **OK**.

## mat1600-matr-003 (qcm, jalon 2)

Réponse : $2\times4$ — confiance haute. SymPy confirme la forme $2\times3\cdot3\times4=2\times4$.
Réfutations correctes pour $2\times3$, $4\times2$, $3\times3$.
Verdict : **OK**.

## mat1600-matr-004 (vf, jalon 2)

Réponse : Faux — confiance haute. Contre-exemple SymPy : $A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$,
$B=\begin{pmatrix}1&0\\1&1\end{pmatrix}$ donnent $AB\ne BA$.
Verdict : **OK**.

## mat1600-matr-005 (qcm, jalon 2)

Réponse : $B^{-1}A^{-1}$ — confiance haute. SymPy avec $A,B$ $2\times2$ non commutatives
confirme $(AB)^{-1}=B^{-1}A^{-1}\ne A^{-1}B^{-1}$.
Verdict : **OK**.

## mat1600-matr-006 (vf, jalon 2)

Réponse : Faux — confiance haute. SymPy : $(kA)^{-1}=\tfrac1kA^{-1}\ne kA^{-1}$ pour
$k=3$ et une matrice $A$ inversible test.
Verdict : **OK**.

## mat1600-matr-007 (flash, jalon 2)

Réponse attendue : $I_n$ = diagonale de 1, élément neutre $AI_n=I_nA=A$, définit
l'inverse ($AA^{-1}=I_n$). Correspond à la banque.
Verdict : **OK**.

## mat1600-matr-008 (qcm, Défi, jalon 2)

Réponse : $A_2B_2=I$, donc oui $B_2=A_2^{-1}$ — confiance haute. SymPy confirme le
produit exact et vérifie individuellement que chaque distracteur ne correspond pas au
produit réel (dont le distracteur invoquant $\det A_2=0$, qui est aussi factuellement
faux : $\det A_2=1$).
Verdict : **OK**.

**Résultat (jalon 1, 1-2) : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-matr-001, 002, 005, 008 (corrigés suite aux relectures Opus)

- **matr-001 :** distracteur « $AB$, la transposée ne change rien » (pas une erreur
  réelle) remplacé par « $B^TA^T$ seulement si $A,B$ commutent ».
- **matr-002 :** `challenge` retiré (routine, pas un Défi) ; `why` corrigé (on divise
  toujours par $\det A$, diviser par $1$ ne change rien) ; distracteur remplacé par
  $-A^{-1}$ (erreur $bc-ad$ au lieu de $ad-bc$).
- **matr-005 :** distracteur « $(AB)^T$ » (pas une erreur réelle) remplacé par
  $\tfrac1{\det(AB)}AB$ (mauvaise application de la formule d'inverse $2\times2$).
- **matr-008 :** vérifié auprès d'`agy` que les indices $A_2/B_2$ n'étaient pas copiés
  d'une source (confirmé : aucune correspondance dans `3.6_Linverse_dune_matrice.pdf`).
  Remplacé quand même par un vrai Défi paramétrique (trouver $c$ tel que
  $\begin{pmatrix}2&1\\1&c\end{pmatrix}B=I$, réponse $c=1$), difficulty 3.

Relecture aveugle ciblée (seed 201/305) sur les 4 questions modifiées/remplacées :
0 désaccord, chaque distracteur vérifié par SymPy comme correspondant à une erreur de
calcul distincte et identifiable.

**Résultat (jalon 1-2, 1-8) : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-matr-009 à 020 (extension à 20/thème)

Relecture aveugle (seed 601) sur les 12 nouvelles : $2A-B$ confirmé par SymPy pour
{011} ; contre-exemple concret ($A$ singulière non nulle) construit pour {012}
($AB=AC$ sans $B=C$) ; les 4 candidats de {014} vérifiés un par un (seule la matrice
d'échange donne $A^2=I$) ; produit matriciel vs carré entrée par entrée distingués
numériquement pour {015} ; résolution $X=A^{-1}B$ confirmée pour le Défi {017}.
Concepts (009, 010, 013, 016, 018, 019, 020) confirmés par raisonnement dans le cadre
du cours (matr-019 : inverse à sens unique hors programme, noté explicitement). 0
désaccord.

**Résultat (jalon 1-2, 1-20) : 20/20 publiables, 0 correction nécessaire, 0 désaccord.**

## Corrections suite à la relecture Opus, round 4 (complémentaire 3)

- **matr-017 (Défi mal calibré) :** $AX=B$ → $XA=B$ avec $B=\begin{pmatrix}3&1\\1&1\end{pmatrix}$,
  réponse $X=BA^{-1}=\begin{pmatrix}3&-5\\1&-1\end{pmatrix}$, distracteur piège
  $A^{-1}B$ (mauvais côté), vérifié SymPy.
- **matr-013 (redondant avec matr-012) :** remplacé par un cas concret ($A,B,C$
  vérifiés avec $AB=AC$, $B\ne C$, $A$ singulière).
- **matr-016 (redondant avec matr-015) :** remplacé par une question sur le type de
  matrice où $A^2$ (produit) et le carré terme à terme coïncident (diagonale),
  triangulaire et symétrique vérifiés comme des contre-exemples.
- **matr-015 :** distracteur faible « $A^2=A$ » remplacé par $A^TA$ (confusion
  transposée/carré, valeur vérifiée).
- **matr-009 :** distracteur faible remplacé par une tentative réelle (addition
  entrée par entrée malgré l'absence de correspondance).
- **matr-018 : laissé inchangé.** Sa redondance signalée était avec l'ancien
  matr-017 ($AX=B$) ; le nouveau matr-017 porte sur $XA=B$, un fait complémentaire
  distinct — le recoupement disparaît sans y toucher.
- Pièges nommés ajoutés à matr-010, 011, 012, 017, 019, 020.

Relecture aveugle ciblée (seed 803) sur matr-009, 013, 015, 016, 017 : 0 désaccord.
SymPy reconfirme $X=BA^{-1}=\begin{pmatrix}3&-5\\1&-1\end{pmatrix}$ pour matr-017 (et
que $A^{-1}B$, $BA$ sont bien différents et faux) ; $A^TA=\begin{pmatrix}5&3\\3&9\end{pmatrix}\ne A^2$
pour matr-015 ; coïncidence uniquement pour une matrice diagonale pour matr-016.

**Résultat final : 20/20 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-matr-008 (suivi, round 3)

`why` du distracteur $c=2$ reformulé (clarté) ; distracteur $c=0$ (faible) remplacé
par $c=\tfrac12$ (résout $2c-1=0$ au lieu de $2c-1=1$, une erreur réelle). Relecture
aveugle ciblée (seed 707) : confiance 5/5, $c=1$ reconfirmé, $c=\tfrac12$ vérifié
comme un vrai échec ($AB\ne I$). 0 désaccord.
