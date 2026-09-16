# Relecture aveugle — mat1500-modul (jalon 2)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification SymPy/Python (`Mod`, `divmod`, `pow(...,mod)`, essais aléatoires)
dans un venv temporaire hors dépôt, supprimé après usage. Convention Python `%` vs convention
mathématique (`{0,...,n-1}`) vérifiée explicitement pour 002 : elles coïncident ici (diviseur
positif), pas de risque de double bonne réponse.

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-modul-001 | $2$ | haute | `17 % 5 == 2` | conforme |
| mat1500-modul-002 | $2$ | haute | `divmod(-7,3) == (-3,2)` | conforme |
| mat1500-modul-003 | Vrai | haute | définition + instance $23,3,5$ | conforme |
| mat1500-modul-004 | $ac \equiv bd$ | haute | contre-exemple numérique pour D (`pow(3,5,7) != pow(10,19,7)`) | conforme |
| mat1500-modul-005 | Vrai | haute | `(23-3) % 5 == 0` | conforme |
| mat1500-modul-006 | vendredi | haute | `(1+17) % 7 == 4` → vendredi | conforme |
| mat1500-modul-007 (flash) | définition via l'algorithme de division euclidienne | haute | analyse conceptuelle | conforme |
| mat1500-modul-008 (flash, défi) | preuve par substitution | haute | 5 essais aléatoires ($n \in [2,50]$) confirmant l'identité algébrique | conforme |

**Verdict global : PASS.** `mat1500-modul-006` était déjà à difficulté 2 (deux étapes : réduire
mod 7 puis remapper l'indice) — aucune correction nécessaire, la calibration proposée par
l'agent correspondait déjà à la valeur existante.
