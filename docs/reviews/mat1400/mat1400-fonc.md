# Relecture — mat1400-fonc

8 questions (mat1400-fonc-001 à 008). Relecture aveugle via `scripts/blind-review.ts` (seed 2),
vérification SymPy (domaine par évaluation numérique, limite le long de $y=mx$ et en polaire).
Verdicts comparés à la clé : accord total.

| id | verdict | notes |
|---|---|---|
| mat1400-fonc-001 | confirmé | domaine $x^2+y^2\le9$ ; SymPy confirme le bord inclus ($f(3,0)=0$) |
| mat1400-fonc-002 | confirmé | VF=Faux ; SymPy : le long de $y=mx$, la limite $=m/(m^2+1)$, dépend de la direction |
| mat1400-fonc-003 | confirmé | réponse flash = méthode des deux chemins ; agent note plusieurs formulations équivalentes valides, acceptable pour une carte flash |
| mat1400-fonc-004 | confirmé | courbes de niveau = cercles de rayon $\sqrt k$, pas $k$ |
| mat1400-fonc-005 | confirmé | domaine $x>y$ (inégalité stricte pour le log) |
| mat1400-fonc-006 | confirmé | SymPy en polaire : $r\cos^2\theta\sin\theta\to0$, limite $=0$ malgré la ressemblance avec fonc-002 |
| mat1400-fonc-007 | confirmé | VF=Faux ; continuité exige l'égalité limite=valeur, pas juste l'existence des deux |
| mat1400-fonc-008 | confirmé | domaine $\{y\ne x^2\}$, toute une parabole exclue |
| mat1400-fonc-009 (Défi) | confirmé | limite $=0$ par encadrement polaire, malgré la dépendance en $\theta$ du facteur borné |
| mat1400-fonc-010 | confirmé | tous les chemins linéaires $\to0$, mais $x=y^2\to1/2$ : limite n'existe pas |
| mat1400-fonc-011 | confirmé | VF=Vrai ; composition de fonctions continues |
| mat1400-fonc-012 | confirmé | domaine $x>y$ strict (racine + division) |

Aucune correction ni retrait.

**Suite à la relecture Opus** (`docs/reviews/relecture-opus/mat1400.md`) : fonc-001 (`why` corrigé, $\sqrt{x^2+y^2}\ne x+y$), fonc-006 (distracteur "$1$" remplacé par deux distracteurs ciblés : chemins qui donnent en fait la même valeur ici, et confusion "non défini au point" / "pas de limite"), fonc-007 (reformulé pour ne plus télégraphier la réponse, aucun changement de fond). Relecture aveugle refaite (nouveau seed) sur fonc-006 : reconfirmée contre la nouvelle clé. fonc-001 et fonc-007 non re-testées (changements de formulation seulement, réponse inchangée).
