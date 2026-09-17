# Relecture aveugle — mat1500-sets (jalon 2, 12 questions)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification par force brute (`frozenset`, énumération exhaustive) et SymPy (De
Morgan) dans un venv temporaire hors dépôt, supprimé après usage. Deux passes : 001-008 puis
009-012 (complément à 12).

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-sets-001 | $\{2\} \in A$ | haute | énumération directe | conforme |
| mat1500-sets-002 | $\overline{A} \cap \overline{B}$ | haute | tautologie SymPy + 256 paires | conforme |
| mat1500-sets-003 | Faux | haute | $\vert\emptyset\vert=0$, $\vert\{\emptyset\}\vert=1$ | conforme |
| mat1500-sets-004 | $8$ | haute | énumération des 8 sous-ensembles | conforme |
| mat1500-sets-005 | Faux | haute | brute force sur 256 paires | conforme |
| mat1500-sets-006 | $6$ | haute | `itertools.product` | conforme |
| mat1500-sets-007 (flash) | $\subseteq$ vs $\subsetneq$ | haute | analyse conceptuelle | conforme |
| mat1500-sets-008 (flash, défi) | preuve $A\subseteq B \iff A\cap B=A$ | haute | relecture de la structure | conforme |
| mat1500-sets-009 | $7$ | haute | inclusion-exclusion + 2 constructions concrètes | conforme |
| mat1500-sets-010 | Vrai | haute | brute force exhaustive, 1024 paires (univers à 5) | conforme |
| mat1500-sets-011 | $(A-B)\cup(B-A)$ | haute | brute force, 200 essais + exemple concret | conforme |
| mat1500-sets-012 (flash, défi) | preuve $A\cup(A\cap B)=A$ | haute | brute force exhaustive, 4096 paires (univers à 6) | conforme |

**Verdict global : PASS** sur les deux passes. Aucune ambiguïté, aucune correction nécessaire.

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `sets-004` : distracteur $6$ (sans erreur identifiable) remplacé par $7$ (piège réel : oublier
  $\emptyset$ dans $2^3=8$).
- `sets-005` : piège nommé explicitement dans `explanation` (lire $A-B$ comme une soustraction
  numérique).
- `sets-008` (Défi) : converti de flash à qcm (HANDOFF §5).

Re-vérifié (gate + relecture aveugle complète des 12 questions, brute force) après application :
**PASS**, aucune régression.
