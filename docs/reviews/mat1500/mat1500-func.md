# Relecture aveugle — mat1500-func (jalon 2, 12 questions)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification calculatoire (Python/SymPy) dans un venv temporaire hors dépôt,
supprimé après usage. Deux passes : 001-008 puis 009-012 (complément à 12).

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-func-001 | $f(a)=f(b) \Rightarrow a=b$ | haute | analyse des définitions | conforme |
| mat1500-func-002 | $-4$ | haute | `math.floor(-3.2) == -4` | conforme |
| mat1500-func-003 | Faux | haute | contre-exemple $f(x)=2x$ | conforme |
| mat1500-func-004 | $7$ | haute | $f(g(3))=7$ vs $g(f(3))=8$ | conforme |
| mat1500-func-005 | Faux | haute | pas de solution entière à $2x=1$ | conforme |
| mat1500-func-006 | Faux | haute | même contre-exemple que 005 | conforme |
| mat1500-func-007 (flash) | définition surjectivité | haute | analyse conceptuelle | conforme |
| mat1500-func-008 (flash, défi) | preuve bijection | haute | SymPy des deux moitiés | conforme |
| mat1500-func-009 | $-3$ | haute | `math.ceil(-3.2) == -3` | conforme |
| mat1500-func-010 | Vrai | haute | théorème standard | conforme |
| mat1500-func-011 | $\{0,1,4\}$ | haute | calcul direct des 5 images | conforme |
| mat1500-func-012 (flash) | stricte croissance $\Rightarrow$ injective | haute | preuve par contraposée relue | conforme |

**Verdict global : PASS** sur les deux passes. Correction de notation appliquée suite à la 2e
passe : le choix distracteur de `mat1500-func-011` (liste avec doublons) réécrit en tuple ordonné
plutôt qu'en notation d'ensemble, pour éviter un ensemble à doublons auto-contradictoire —
n'affectait pas la validité de la bonne réponse, seulement la clarté du distracteur.

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `func-004` (ÉLEVÉE) : le `why` du distracteur $9$ était mathématiquement faux
  ($g(g(3))=12\ne9$). Distracteur remplacé par $10 = f(3)+g(3)$ (addition au lieu de
  composition), `why` corrigé et vérifié par calcul direct.
- `func-002` : virgule décimale française ($-3{,}2$) ; distracteur faible ($-3.2$ lui-même)
  remplacé par $-4{,}2$ (piège réel : descendre d'une unité mais oublier que le résultat doit
  être entier). Même correction appliquée à `func-009` par cohérence (question analogue créée
  après la relecture Opus).
- `func-001, 003, 005, 006, 007` : vocabulaire « codomaine » → « ensemble d'arrivée » (terme
  français standard, en l'absence de confirmation du vocabulaire exact du cours — à réviser si
  `D:\Math\MAT1500` montre que le cours utilise « codomaine »).
- `func-005` : reformulée en énoncé Vrai/Faux plutôt qu'en question.
- `func-008` (Défi) : converti de flash à qcm (HANDOFF §5).
- `**gras**` retiré partout hors `solution`.

Re-vérifié (gate + relecture aveugle complète des 12 questions, Python/SymPy) après application :
**PASS**, aucune régression ; le calcul $f(3)+g(3)=4+6=10$ reconfirmé.
