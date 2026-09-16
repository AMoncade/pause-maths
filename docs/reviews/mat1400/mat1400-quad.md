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

Aucune correction ni retrait. Vigilance pédagogique notée par l'agent (pas une erreur) :
s'assurer que l'UI affiche bien "$\sqrt4=2$" et non "4" dans l'explication de quad-002 —
déjà le cas dans le JSON actuel.
