# Relecture — mat1600-vect (jalon 1)

Gate (`npm test`) : 0 erreur. Relecture aveugle (sous-agent, choix mélangés, sans flag
`correct` ni `explanation`), calculs vérifiés par SymPy dans un venv hors dépôt.

## mat1600-vect-001 (qcm)

Réponse : « Non : ils sont liés ($v_4=v_1+v_2+v_3$), une base doit aussi être libre » —
confiance haute. SymPy : $v_1+v_2+v_3=(1,1,1)=v_4$ exactement ; rang de
$[v_1\,v_2\,v_3\,v_4]=3<4$ vecteurs ⇒ liés. Réfutations correctes pour les 3 autres choix
(spécifiquement : ils engendrent bien $\mathbb R^3$, contrairement à ce qu'affirme un des
distracteurs — mais ce distracteur reste faux pour la bonne conclusion).
Verdict : **OK**.

## mat1600-vect-002 (qcm)

Réponse : « Non : $w=\tfrac32u$, ils sont colinéaires » — confiance haute. SymPy :
$\tfrac32(2,4)=(3,6)=w$ exactement. Réfutations correctes (inégalité des vecteurs et
absence de coordonnées nulles ne prouvent rien sur l'indépendance).
Verdict : **OK**.

## mat1600-vect-003 (vf)

Réponse : Vrai — confiance haute. 3 vecteurs dans $\mathbb R^2$ (dimension 2) sont
toujours liés, peu importe qu'ils soient non nuls.
Verdict : **OK**.

## mat1600-vect-004 (flash)

Réponse attendue du relecteur : combinaison linéaire = $c_1v_1+\cdots+c_kv_k$ pour des
scalaires $c_i$. Correspond à la réponse de la banque.
Verdict : **OK**.

## mat1600-vect-005 (qcm, jalon 2)

Réponse : $c_1=5,c_2=-2$ — confiance haute. SymPy `linsolve` confirme $(5,-2)$ ; chaque
distracteur vérifié par substitution directe, aucun ne redonne $(3,-2)$.
Verdict : **OK**.

## mat1600-vect-006 (vf, jalon 2)

Réponse : Vrai — confiance haute. Argument de rang : 2 vecteurs indépendants dans
$\mathbb R^2$ forment une matrice $2\times2$ de rang plein, donc engendrent $\mathbb R^2$.
Verdict : **OK**.

## mat1600-vect-007 (flash, jalon 2)

Réponse attendue : seule solution de $c_1v_1+\cdots+c_kv_k=0$ est $c_1=\cdots=c_k=0$.
Correspond à la banque.
Verdict : **OK**.

## mat1600-vect-008 (qcm, Défi, jalon 2)

Réponse : « Non : $v_3=v_1-v_2$ » — confiance haute. SymPy : rang de la matrice
$[v_1\,v_2\,v_3]=2<3$, $v_1-v_2=v_3$ confirmé exactement. Réfutations correctes,
notant que le distracteur « non, car pas orthogonaux » a la bonne conclusion mais un
raisonnement invalide (piège pédagogique volontaire, pas un défaut de la question).
Verdict : **OK**.

**Résultat : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**
