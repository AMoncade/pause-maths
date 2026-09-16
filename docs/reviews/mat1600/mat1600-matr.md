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

**Résultat : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**
