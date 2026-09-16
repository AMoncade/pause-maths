# Relecture aveugle — mat1500-divis (jalon 2)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification SymPy (`gcd`, `isprime`, `factorint`) et force brute (recherche de
contre-exemples sur de petits entiers) dans un venv temporaire hors dépôt, supprimé après usage.

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-divis-001 | $\exists k, b=ak$ | haute | définition + contre-exemple sur $a=3,b=12$ | conforme |
| mat1500-divis-002 | Faux | haute | `12 % 3 == 0` mais pas l'inverse | conforme |
| mat1500-divis-003 | Faux | haute | `sympy.isprime(91) == False`, `factorint(91)={7:1,13:1}` | conforme |
| mat1500-divis-004 | $6$ | haute | `sympy.gcd(24,18) == 6` | conforme |
| mat1500-divis-005 | Vrai | haute | recherche exhaustive sous 100 | conforme |
| mat1500-divis-006 | $a \mid (b+c)$ | haute | force brute (aucun contre-exemple, $a\in[1,15]$) + analyse ciblée du distracteur A (« seulement si $a$ premier » : vérifié faux, $a \mid abc$ est vrai inconditionnellement) | conforme |
| mat1500-divis-007 (flash) | $60 = 2^2 \times 3 \times 5$ | haute | `sympy.factorint(60)` | conforme |
| mat1500-divis-008 (flash, défi) | preuve par substitution | haute | relecture de la structure de preuve | conforme |

**Verdict global : PASS.** Aucune ambiguïté. `mat1500-divis-006` était déjà à difficulté 2 (le
distracteur A demande plus qu'un rappel direct) — aucune correction nécessaire.
