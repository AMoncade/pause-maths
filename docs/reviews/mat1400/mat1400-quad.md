# Relecture — mat1400-quad

8 questions (mat1400-quad-001 à 008). Relecture aveugle via `scripts/blind-review.ts` (seed 3),
vérification SymPy (rayon $=\sqrt z$, semi-axes d'un ellipsoïde). Verdicts comparés à la clé :
accord total.

| id | verdict | notes |
|---|---|---|
| mat1400-quad-001 | confirmé | hyperboloïde à une nappe (un seul signe négatif, RHS $=1$) |
| mat1400-quad-002 | confirmé | rayon $=\sqrt4=2$, pas 4 ; SymPy confirme |
| mat1400-quad-003 | confirmé | cylindre (variable $z$ absente en $\mathbb R^3$), pas un simple cercle |
| mat1400-quad-004 | confirmé | ellipsoïde, semi-axes $2,3,1$ tous différents (pas une sphère) |
| mat1400-quad-005 | confirmé | cône elliptique ($z^2=x^2+y^2$, RHS nul) |
| mat1400-quad-006 | confirmé | paraboloïde hyperbolique (signes opposés sur $x^2,y^2$) |
| mat1400-quad-007 | confirmé | trace verticale $z=x^2$ = parabole, pas un cercle |
| mat1400-quad-008 | confirmé | VF=Faux ; une sphère EST un cas particulier d'ellipsoïde |
| mat1400-quad-009 | confirmé | somme de carrés $=-4$ impossible, ensemble vide |
| mat1400-quad-010 | confirmé | $y=x^2$ sans $z$ = cylindre parabolique |
| mat1400-quad-011 | confirmé | sphère $(x-1)^2+(y+2)^2+(z-3)^2=25$ |
| mat1400-quad-012 (Défi) | confirmé | aucun $k$ ne donne un hyperboloïde à deux nappes (coefficients $x^2,y^2$ toujours $+1$) |

Aucune correction ni retrait. Vigilance pédagogique notée par l'agent (pas une erreur) :
s'assurer que l'UI affiche bien "$\sqrt4=2$" et non "4" dans l'explication de quad-002 —
déjà le cas dans le JSON actuel.

**Suite à la relecture Opus** (`docs/reviews/relecture-opus/mat1400.md`) : quad-002 changé de $z=x^2+y^2$ (trace circulaire, redondant avec fonc-004) à $z=4x^2+y^2$ (trace elliptique, demi-axes $1$ en $x$ et $2$ en $y$) ; quad-004 (notation $4\ne9\ne1$ corrigée) ; quad-005 (label "Cône elliptique"→"Cône (circulaire)", `why` du choix Cylindre et Paraboloïde corrigés) ; quad-006 (`why` du choix Hyperboloïde corrigé). Relecture aveugle refaite (nouveau seed) sur quad-002 : reconfirmée contre la nouvelle clé (avec précision "en $x$"/"en $y$" ajoutée sur suggestion du relecteur pour lever toute ambiguïté résiduelle sur l'ordre des demi-axes). quad-004, quad-005, quad-006 non re-testées (formulation seulement, réponse et structure inchangées).
