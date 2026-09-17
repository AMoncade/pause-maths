# Relecture — mat1600-det (jalon 2)

Gate (`npm test`) : 0 erreur. Relecture aveugle via `scripts/blind-review.ts` (seed 42,
clé dans le scratchpad, jamais montrée au relecteur), sous-agent frais, vérification
SymPy dans un venv hors dépôt.

## mat1600-det-001 (qcm)

Réponse : $10$ — confiance 5/5. SymPy `Matrix([[3,1],[2,4]]).det() = 10`.
Réfutations correctes pour $14$ (addition au lieu de soustraction), $-10$ (opérandes
inversés) et $2$ (mauvaises entrées).
Verdict : **OK**.

## mat1600-det-002 (qcm)

Réponse : $-42$ — confiance 5/5. SymPy confirme le déterminant complet ($-42$), le
mineur $M_{12}=14$, le cofacteur $C_{12}=-14$, et le terme $3\cdot(-14)=-42$.
Réfutations correctes pour $14$ (mineur seul), $42$ (signe oublié) et $-14$ (cofacteur
seul, sans multiplier par $a_{12}=3$).
Verdict : **OK**.

## mat1600-det-003 (qcm)

Réponse : $40$ — confiance 5/5. SymPy : matrice concrète $3\times3$ avec $\det A=5$ donne
$\det(2A)=40$ ; vérification symbolique $\det(kA)-k^3\det A\equiv0$.
Réfutations correctes pour $5$, $20$ et $10$ (exposant $n$ oublié ou mal appliqué).
Verdict : **OK**.

## mat1600-det-004 (vf)

Réponse : Faux — confiance 5/5. Contre-exemple vérifié : $A=B=I_2$,
$\det(A+B)=\det(2I)=4\ne1+1=2$.
Verdict : **OK**.

## mat1600-det-005 (qcm)

Réponse : $-8$ — confiance 5/5. SymPy confirme le déterminant ($-8$) = produit de la
diagonale. Réfutations correctes pour $8$ (signe oublié), $56$ (mauvaise entrée hors
diagonale) et $5$ (confondu avec la trace).
Verdict : **OK**.

## mat1600-det-006 (qcm, Défi)

Réponse : $-6$ — confiance 5/5. SymPy (matrice concrète construite avec $\det=6$) :
après échange de lignes → $-6$ ; après remplacement $L_2\to L_2+3L_1$ → toujours $-6$
(invariance confirmée). Réfutations correctes pour $6$ (signe de l'échange oublié),
$18$ et $-18$ (confusion entre « ajouter un multiple d'une ligne » et « multiplier une
ligne par un scalaire »).
Verdict : **OK**.

## mat1600-det-007 (vf)

Réponse : Vrai — confiance 5/5. Théorème central (partie du théorème de la matrice
inversible), vérifié par sanity-check SymPy (matrice singulière vs non singulière).
Verdict : **OK**.

## mat1600-det-008 (flash)

Réponse attendue du relecteur : développement par cofacteurs
$\det A=\sum_j a_{ij}C_{ij}$, résultat identique quelle que soit la rangée choisie,
signe $(-1)^{i+j}$ en damier, intérêt de choisir une rangée avec des zéros. Correspond
à la réponse de la banque.
Verdict : **OK**.

**Résultat (jalon 2, 1-8) : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-det-001 (réécrit suite à la relecture Opus)

Doublon avec `mat1400-vect-004` signalé par la relecture pédagogique Opus : matrice
changée pour $\begin{pmatrix}5&2\\3&-1\end{pmatrix}$. Relecture aveugle (seed 301) :
confiance 5/5, $\det=-11$ confirmé par SymPy ; les 3 distracteurs ($1=ad+bc$,
$11=bc-ad$, $17=ac-bd$) vérifiés comme des erreurs distinctes et identifiables.
Verdict : **OK**.

## mat1600-det-009 à 020 (extension à 20/thème)

Relecture aveugle (seed 401) sur les 12 nouvelles : $\det(A^{-1})=1/\det A$ vérifié
avec un exemple concret ; développement en colonne de {011} confirmé ($21$) avec le
détail de chaque terme ; $\det(AB)=\det A\det B$ vérifié numériquement pour {015} ;
matrice diagonale {016} et calcul $2\times2$ {019} confirmés ; $\det(2A)=2^4\det A$
pour une $4\times4$ confirmé pour {020} (exemple aléatoire : $\det A=99$,
$\det(2A)=1584=16\times99$). Concepts (009, 012, 013, 014, 017, 018) confirmés par
raisonnement. 0 désaccord.

**Résultat final : 20/20 publiables, 0 correction nécessaire, 0 désaccord.**
