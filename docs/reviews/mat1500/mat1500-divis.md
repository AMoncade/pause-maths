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

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `divis-001` : choix correct précisé ($a\ne0$) ; `why` du distracteur « diviseur commun »
  corrigé (deux entiers ont toujours 1 en commun — trivialement vrai, pas « plus faible »).
- `divis-003` (MOYENNE) : reformulée en Vrai/Faux sans donner la factorisation dans l'énoncé
  (elle rendait la question triviale) ; l'`explanation` la révèle maintenant.
- `divis-005` : piège nommé (croire que $1$ est premier).
- `divis-006` : deux distracteurs artificiels remplacés par $(b+c)\mid a$ (sens inversé) et
  $a^2\mid(b+c)$ (sur-généralisation), tous deux avec contre-exemple concret dans le `why`.
- `divis-008` (Défi) : converti de flash à qcm (HANDOFF §5).

Re-vérifié (gate + relecture aveugle complète des 8 questions, SymPy) après application :
**PASS**, aucune régression.

## Complément à 12 questions (jalon 2, cible ~12/thème)

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-divis-009 | $36$ | haute | `sympy.lcm(12,18)==36`, `pgcd*ppcm=a*b` | conforme |
| mat1500-divis-010 | Vrai (lemme d'Euclide) | haute | vérifié sur plusieurs triplets premiers/composés | conforme |
| mat1500-divis-011 | $\text{pgcd}(12,6)$ | haute | trace complète de l'algorithme d'Euclide | conforme |
| mat1500-divis-012 (défi) | contradiction via $N \bmod p_i = 1$ | haute | vérifié sur 4 listes de premiers différentes | conforme |

**Verdict : PASS.** Aucune ambiguïté. Total du thème : 12 questions.

## Relecture Opus (b) (docs/reviews/relecture-opus/mat1500-b.md) — correction appliquée

- `divis-008` (Défi) : distracteur artificiel remplacé par une confusion réelle avec la preuve
  additive du thème ($a(k_1+k_2)$ au lieu du produit $a(k_1k_2)$), `explanation` alignée.

Re-vérifié (SymPy, venv hors dépôt) : **PASS**.
