# Relecture — mat1400-grad

8 questions (mat1400-grad-001 à 008). Relecture aveugle via `scripts/blind-review.ts` (seed 4),
vérification SymPy (gradient, dérivée directionnelle, produit scalaire/Cauchy-Schwarz).
Verdicts comparés à la clé : accord total (8/8).

| id | verdict | notes |
|---|---|---|
| mat1400-grad-001 | confirmé | $\nabla f(1,2)=(4,4)$ |
| mat1400-grad-002 | confirmé | il faut normaliser $\vec v$ avant $\nabla f\cdot\hat u$ |
| mat1400-grad-003 | confirmé | VF=Vrai ; conséquence de Cauchy-Schwarz |
| mat1400-grad-004 | confirmé | $D_{\hat u}f=2\sqrt2$, SymPy confirme |
| mat1400-grad-005 | confirmé | $\nabla f\perp$ courbe de niveau, pointe vers les valeurs croissantes |
| mat1400-grad-006 | confirmé | $\partial_x e^{xy}=ye^{xy}$ |
| mat1400-grad-007 | confirmé | décroissance la plus rapide $=-\nabla f$ |
| mat1400-grad-008 | confirmé (confiance 4/5) | VF=Faux ; l'agent note que certains manuels définissent $D_v f=\nabla f\cdot v$ pour tout $v$ sans exigence d'unitarité, mais la convention du cours (confirmée par les notes Owens : dérivée directionnelle = produit scalaire avec un vecteur UNITAIRE) et par grad-002 dans le même thème rend Faux correct et cohérent — gardé tel quel |

Aucune correction ni retrait.