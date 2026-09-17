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
| mat1400-grad-009 (Défi) | confirmé | dérivée directionnelle max $=\|\nabla f\|=6$ en 3 variables, direction $(1/3,2/3,2/3)$ |
| mat1400-grad-010 | confirmé | $D_{\hat u}f=4\cos60°=2$ |
| mat1400-grad-011 | confirmé | VF=Vrai ; gradient d'une constante $=\vec0$ |
| mat1400-grad-012 | confirmé | $\nabla f=(yz,xz,xy)$ pour $f=xyz$ |

Aucune correction ni retrait.

**Suite à la relecture Opus** (`docs/reviews/relecture-opus/mat1400.md`) : grad-008 reformulé sur la dérivée directionnelle en direction de $\vec v=(3,4)$ (lève l'ambiguïté de convention) ; grad-002 (distracteur "multiplier par $\|\nabla f\|$" remplacé par "confondre point et direction") ; grad-006 transformé en question de gradient COMPLET pour $f=e^{xy}$ en $(1,0)$ (au lieu d'une simple dérivée partielle, mal attribuée au thème gradient) ; grad-003, grad-005 : hypothèse $\nabla f\ne\vec0$ ajoutée, piège nommé explicitement dans grad-005. Relecture aveugle refaite (nouveau seed) sur grad-002, grad-006, grad-008 : 3/3 reconfirmées contre la nouvelle clé, aucun désaccord (l'agent note que grad-008 reste dépendant de la convention Stewart, mais cohérente avec grad-002 dans le même thème — voir aussi la note existante sur grad-008 ci-dessus). grad-003, grad-005 non re-testées (ajout d'hypothèse/piège nommé seulement, réponse inchangée).

**Ronde 2** : grad-010 — français corrigé ("en direction" → "dans une direction"), aucun changement de fond.