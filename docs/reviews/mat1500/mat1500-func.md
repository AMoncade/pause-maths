# Relecture aveugle — mat1500-func (jalon 2)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification calculatoire (SymPy/math) dans un venv temporaire hors dépôt,
supprimé après usage.

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-func-001 | $f(a)=f(b) \Rightarrow a=b$ | haute | analyse des définitions | conforme |
| mat1500-func-002 | $-4$ | haute | `math.floor(-3.2) == -4` | conforme |
| mat1500-func-003 | Faux | haute | contre-exemple $f(x)=2x$ sur $\mathbb{Z}$ | conforme |
| mat1500-func-004 | $7$ | haute | $f(g(3))=7$ vs $g(f(3))=8$ calculés séparément | conforme |
| mat1500-func-005 | Faux | haute | $2x=1$ n'a pas de solution entière | conforme |
| mat1500-func-006 | Faux | haute | même contre-exemple que 005 | conforme |
| mat1500-func-007 (flash) | définition de la surjectivité, $\forall b\,\exists a$ | haute | analyse conceptuelle | conforme |
| mat1500-func-008 (flash, défi) | preuve injectivité + surjectivité | haute | résolution symbolique SymPy des deux moitiés | conforme |

**Verdict global : PASS.** Aucune ambiguïté, aucune correction de difficulté nécessaire.
