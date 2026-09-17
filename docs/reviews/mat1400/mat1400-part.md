# Relecture — mat1400-part

8 questions (mat1400-part-001 à 008). Relecture aveugle via `scripts/blind-review.ts` (seed 5),
vérification SymPy (dérivées partielles, plan tangent, contre-exemple différentiabilité).
Verdicts comparés à la clé : accord total (8/8).

| id | verdict | notes |
|---|---|---|
| mat1400-part-001 | confirmé | $f_y=3x^2-6y^2$ |
| mat1400-part-002 | confirmé | plan tangent $z=2x+4y-5$ |
| mat1400-part-003 | confirmé | VF=Vrai ; Clairaut/Schwarz |
| mat1400-part-004 | confirmé | définition limite de $f_x(a,b)$ |
| mat1400-part-005 | confirmé | $f_x(1,2)=16$ pour $x^2y^3$ |
| mat1400-part-006 | confirmé | plan tangent horizontal $\Leftrightarrow f_x=f_y=0$ |
| mat1400-part-007 | confirmé | VF=Faux ; contre-exemple SymPy $xy/(x^2+y^2)$ : partielles nulles en $(0,0)$ mais $f$ pas même continue là |
| mat1400-part-008 | confirmé | $\partial f/\partial x = f_x$ |
| mat1400-part-009 (Défi) | confirmé | plan tangent implicite à une sphère via $\nabla F$, $2x+2y+z=9$ |

Aucune correction ni retrait.

**Suite à la relecture Opus** (`docs/reviews/relecture-opus/mat1400.md`) : phrase "Le piège : …" ajoutée aux `explanation` de part-003, part-004, part-008 (aucun changement de réponse ni de structure, pas de nouvelle relecture aveugle nécessaire). Voir `reponse-relecture-opus.md`.

**Ronde 2** (élevée) : part-010, le `why` du distracteur $4{,}996$ était mathématiquement incohérent (un simple signe sur $\Delta y$ donne $5{,}02$, pas $4{,}996$) ; corrigé pour décrire l'erreur réelle (inversion complète du déplacement, $\Delta x=-0{,}02$ ET $\Delta y=+0{,}01$). Décimales converties en virgule française ($5{,}004$ au lieu de $5.004$) dans tout le champ. Valeurs numériques inchangées, pas de nouvelle relecture aveugle nécessaire (vérifié manuellement : $5+0{,}6(-0{,}02)+0{,}8(0{,}01)=5-0{,}012+0{,}008=4{,}996$, cohérent).