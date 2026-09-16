# Relecture aveugle — mat1500-sets (jalon 2)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification par force brute (`frozenset`, énumération de tous les
sous-ensembles ou toutes les paires sur un petit univers) et SymPy (De Morgan, tautologie
propositionnelle) dans un venv temporaire hors dépôt, supprimé après usage.

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-sets-001 | $\{2\} \in A$ | haute | énumération directe des éléments de $A=\{1,\{2\}\}$ | conforme |
| mat1500-sets-002 | $\overline{A} \cap \overline{B}$ | haute | tautologie SymPy + contre-exemple exhaustif sur $U$ à 4 éléments (256 paires) | conforme |
| mat1500-sets-003 | Faux | haute | $\vert\emptyset\vert=0$, $\vert\{\emptyset\}\vert=1$ | conforme |
| mat1500-sets-004 | $8$ | haute | énumération des 8 sous-ensembles de $\{1,2,3\}$ | conforme |
| mat1500-sets-005 | Faux | haute | brute force sur 256 paires : égalité seulement quand $A=B$ | conforme |
| mat1500-sets-006 | $6$ | haute | `itertools.product`, 6 paires | conforme |
| mat1500-sets-007 (flash) | $\subseteq$ permet l'égalité, $\subsetneq$ l'exclut | haute | analyse conceptuelle | conforme |
| mat1500-sets-008 (flash, défi) | preuve à double implication | haute | relecture de la structure de preuve | conforme |

**Verdict global : PASS.** Aucune ambiguïté, aucun choix à deux réponses défendables.

**Calibration appliquée** (suggestion non bloquante de l'agent, suivie) : `mat1500-sets-001`
remontée de difficulté 1 à 2 — distinguer $\in$ de $\subseteq$ sur un ensemble imbriqué demande
un peu plus qu'un simple rappel direct.
