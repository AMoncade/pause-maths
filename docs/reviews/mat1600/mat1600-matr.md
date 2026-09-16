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

**Résultat : 2/2 publiables, 0 correction nécessaire.**
