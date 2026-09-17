# Relecture — mat1400-extr

8 questions (mat1400-extr-001 à 008). Relecture aveugle via `scripts/blind-review.ts` (seed 7),
vérification SymPy (résolution du système $f_x=f_y=0$, calcul du hessien $D$). Verdicts
comparés à la clé : accord total (8/8).

| id | verdict | notes |
|---|---|---|
| mat1400-extr-001 | confirmé | point critique $(2,-1)$ |
| mat1400-extr-002 | confirmé | $D=-4<0$ : point-selle |
| mat1400-extr-003 | confirmé | VF=Faux ; $D=0$ non concluant |
| mat1400-extr-004 | confirmé | $D=4>0,f_{xx}>0$ : minimum |
| mat1400-extr-005 | confirmé | procédure des 3 étapes |
| mat1400-extr-006 | confirmé | extrema absolus : intérieur ET frontière |
| mat1400-extr-007 | confirmé | $(0,0)$, $D=8>0,f_{xx}=2>0$ : minimum, malgré le terme croisé $xy$ |
| mat1400-extr-008 | confirmé | VF=Faux ; un point critique peut être une selle |
| mat1400-extr-009 (Défi) | confirmé | deux points critiques $(1,2)$ min, $(-1,2)$ selle ; ne pas oublier la racine négative |
| mat1400-extr-010 | confirmé | max de $x^2+y^2$ sur disque fermé $=4$ sur la frontière |
| mat1400-extr-011 | confirmé | VF=Faux ; $\mathbb R^2$ non borné, pas de max absolu |
| mat1400-extr-012 | confirmé | $D=-12<0$ malgré $f_{xx}>0$ : point-selle |

Aucune correction ni retrait.

**Ronde 2** : extr-004, difficulté surévaluée, $2\to1$. extr-007, le choix correct affichait "(D=8>0, f_xx=2>0)" en clair alors qu'aucun distracteur n'avait d'annotation équivalente — retiré du texte du choix (le calcul reste dans l'`explanation`) pour ne plus se distinguer par sa longueur/son détail. extr-011, précisé que $\mathbb R^2$ est fermé mais pas borné (et non "ni fermé ni borné", ce qui était inexact). Réponses inchangées, pas de nouvelle relecture aveugle nécessaire.