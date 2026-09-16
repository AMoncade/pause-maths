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

**Résultat : 4/4 publiables, 0 correction nécessaire.**
