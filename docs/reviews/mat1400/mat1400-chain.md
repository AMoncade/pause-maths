# Relecture — mat1400-chain

8 questions (mat1400-chain-001 à 008). Relecture aveugle via `scripts/blind-review.ts` (seed 6),
vérification SymPy (règle de chaîne à une et deux variables intermédiaires, dérivation
implicite). Verdicts comparés à la clé : accord total (8/8).

| id | verdict | notes |
|---|---|---|
| mat1400-chain-001 | confirmé | $dz/dt=3t^2+2t$ |
| mat1400-chain-002 | confirmé | $\partial z/\partial s=f_x+f_y$ ; piège du signe $\partial y/\partial s$ vs $\partial y/\partial t$ vérifié |
| mat1400-chain-003 | confirmé | VF=Vrai ; $dy/dx=-F_x/F_y$, vérifié sur le cercle |
| mat1400-chain-004 | confirmé | 3 termes pour $z=f(x,y,w)$ |
| mat1400-chain-005 | confirmé | $dy/dx=-x/y$ pour le cercle |
| mat1400-chain-006 | confirmé | forme générale $dz/dt=f_xdx/dt+f_ydy/dt$ |
| mat1400-chain-007 | confirmé | VF=Faux ; vérifié par calcul symbolique explicite (deux résultats distincts selon $\partial/\partial s$ ou $\partial/\partial t$) |
| mat1400-chain-008 | confirmé | $\partial z/\partial s=14$ en $(1,2)$ ; distracteur C = piège "mauvaise variable" vérifié séparément |

Aucune correction ni retrait.