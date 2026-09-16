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
| mat1400-vect-009 (Défi) | confirmé | plan par 3 points, $x+y+z=1$ |
| mat1400-vect-010 | confirmé | projection scalaire $=3$ |
| mat1400-vect-011 | confirmé | VF=Vrai ; plans parallèles distincts |
| mat1400-vect-012 | confirmé | angle $=\pi/4$ |

Aucune correction ni retrait.

**Suite à la relecture Opus** (`docs/reviews/relecture-opus/mat1400.md`) : vect-007 (`why` du choix $(2,4,4)$ corrigé — additionné au lieu de soustrait, pas "valeur de B gardée"), vect-004 (distracteur $11\to7$, piège trace vs déterminant), vect-005 (distracteur $(1,1,0)\to(1,1,1)$), vect-003 (notation $d$ désambiguïsée, plan $ax+by+cz=e$, distance $D$). Relecture aveugle refaite (nouveau seed) sur vect-004, vect-005, vect-007 : 3/3 reconfirmées contre la nouvelle clé, aucun désaccord. vect-003 non re-testée (changement de notation seulement, aucune valeur touchée).
