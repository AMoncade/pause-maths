# Relecture aveugle — mat1500-proof (jalon 2)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification SymPy (crible sur $n^2+n+41$, algèbre de la parité, irrationalité
de $\sqrt2$) dans un venv temporaire hors dépôt, supprimé après usage.

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-proof-001 | preuve directe ($n=2k \Rightarrow n^2=2m$) | haute | analyse de structure | conforme |
| mat1500-proof-002 | un seul contre-exemple suffit | haute | crible $n=0..44$ : $n=40$ donne $1681=41^2$, confirmé non premier | conforme |
| mat1500-proof-003 | Faux | haute | définition de la preuve par contradiction | conforme |
| mat1500-proof-004 | « si $n$ pair alors $n^2$ pair » | haute | comparaison explicite contraposée $\ne$ inverse | conforme |
| mat1500-proof-005 | Vrai | haute | définition nécessaire/suffisant | conforme |
| mat1500-proof-006 | cas pair/impair | haute | algèbre + brute force $n=-10..10$ | conforme |
| mat1500-proof-007 (flash) | directe vs contradiction | haute | analyse conceptuelle | conforme |
| mat1500-proof-008 (flash, défi) | preuve $\sqrt2$ irrationnel | haute | algèbre confirmée par SymPy (`ask(Q.irrational(sqrt(2)))`) | conforme |

**Verdict global : PASS.** Aucune ambiguïté, aucune correction nécessaire.
