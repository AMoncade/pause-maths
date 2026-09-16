# Relecture — mat1400-vect

8 questions (mat1400-vect-001 à 008). Relecture aveugle via `scripts/blind-review.ts` (seed 1,
choix mélangés, sans flag correct ni explanation), sous-agent + vérification SymPy des calculs
(produit scalaire, produit vectoriel, norme, déterminant 2×2, distance point-plan). Verdicts
comparés à la clé (`*-key.json`, jamais montrée au relecteur) : accord total, aucun désaccord,
pas de troisième agent nécessaire.

| id | verdict | notes |
|---|---|---|
| mat1400-vect-001 | confirmé | $\vec u\cdot\vec v=-4$, SymPy `u.dot(v)=-4` |
| mat1400-vect-002 | confirmé | VF=Faux ; critère d'orthogonalité = produit scalaire, pas produit vectoriel |
| mat1400-vect-003 | confirmé | $d=5/3$, SymPy confirme |
| mat1400-vect-004 | confirmé | $\det=10$, SymPy `M.det()=10` |
| mat1400-vect-005 | confirmé | $\vec u\times\vec v=(0,0,1)$, SymPy confirme (règle de la main droite) |
| mat1400-vect-006 | confirmé | VF=Faux ; $\|(3,4)\|=5$, pas $7$ |
| mat1400-vect-007 | confirmé | $\vec{AB}=(2,4,0)$, SymPy `B-A` confirme |
| mat1400-vect-008 | confirmé | $x-2z+4=0$, SymPy confirme |

Aucune correction ni retrait.
