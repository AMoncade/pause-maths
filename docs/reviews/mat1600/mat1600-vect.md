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

**Résultat (jalon 1, 1-8) : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-vect-009 à 020 (extension à 20/thème)

Relecture aveugle (seed 103) sur les 12 nouvelles : appartenance à $\text{Vect}(v_1,v_2)$
vérifiée par système incompatible pour {009} ; test du pivot sur $\begin{pmatrix}1&2\\2&4\end{pmatrix}$
confirmé pour {011} ; indépendance de 3 vecteurs dans $\mathbb R^4$ (rang 3) confirmée
pour le Défi {013} ; résolution des coefficients $c_1,c_2,c_3$ confirmée pour {017} ;
calcul $2v_1-3v_2$ confirmé pour {020}. Concepts (010, 012, 014, 015, 016, 018, 019)
confirmés par raisonnement. 0 désaccord.

## mat1600-vect-001, 002, 004 (corrigés suite à la relecture Opus, round 1)

Voir `docs/reviews/mat1600/reponse-relecture-opus.md` pour le détail des correctifs
(vect-001 reformulé sans « base » ; vect-002 distracteur remplacé sans introduire
`det` ; vect-004 difficulty et typographie). Relecture aveugle ciblée (seed 203) sur
vect-001 et vect-002 : 0 désaccord, notant que le distracteur D de vect-001 (« non,
car $v_1,v_2,v_3$ ne sont pas indépendants ») a la bonne conclusion mais une prémisse
fausse — un piège volontaire, pas un défaut.

## mat1600-vect-009, 013, 014, 020 (corrigés suite à la relecture Opus, round 3)

- **vect-009 :** 2 distracteurs faibles remplacés par des calculs concrets vérifiés
  ($c_1=1,c_2=0$ et $c_1=0,c_2=1$, tous deux faux).
- **vect-013 :** Défi recalibré (difficulty 3) avec des vecteurs où $v_3=v_1+v_2$
  n'est pas visible sur les 3 premières composantes (contrairement à l'ancienne
  version, essentiellement une identité).
- **vect-014 :** remplacé par une version concrète à 2 vecteurs (« $\{v,0\}$ est-elle
  libre ? ») pour éliminer le recoupement avec le point clé de vect-007.
- **vect-020 :** 2 `why` faux corrigés ; un distracteur remplacé par $(2,-5,7)=2v_1-v_2$
  (aucune origine identifiable dans l'ancien $(2,1,3)$).

Relecture aveugle ciblée (seed 705) : 0 désaccord, tous les calculs reconfirmés par
SymPy (dont $v_3=v_1+v_2$ pour vect-013, et les trois combinaisons $2v_1\pm3v_2$,
$2v_1-v_2$ pour vect-020).

**Résultat final : 20/20 publiables, 0 correction nécessaire, 0 désaccord.**
