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

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `modul-004` (MOYENNE, bloquant pour le lot Engine) : choix fourre-tout « aucune de ces
  opérations n'est garantie » (interdit par le HANDOFF §8, non détecté par le gate — trou signalé
  à l'admin) remplacé par un vrai distracteur, $a-c\equiv d-b \pmod n$ (ordre des termes inversé).
- `modul-001` : distracteur $12$ remplacé par $3{,}4$ (quotient décimal confondu avec le reste).
- `modul-002` : `why` du choix $1$ corrigé (nommait mal l'erreur — ignorer le signe de $-7$).
- `modul-003`, `modul-005` : piège nommé explicitement dans `explanation`.
- `modul-007` : question entièrement réécrite (« pourquoi » remplacé par un calcul concret de
  division euclidienne, $-10$ par $4$, pour plus de valeur d'entraînement) — évite aussi la
  quasi-duplication avec `modul-002`.
- `modul-008` (Défi) : converti de flash à qcm (HANDOFF §5).

Re-vérifié (gate + relecture aveugle complète des 8 questions, Python) après application :
**PASS**, aucune régression. Le distracteur $a-c\equiv d-b$ confirmé faux par contre-exemple
concret.

## Complément à 12 questions (jalon 2, cible ~12/thème)

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-modul-009 | $1$ | haute | `pow(3,4,5)==1` | conforme |
| mat1500-modul-010 | Vrai (critère d'inversibilité) | haute | 6 cas testés (pgcd=1 vs pgcd>1) | conforme |
| mat1500-modul-011 | $5$ | haute | $3\times5=15\equiv1\pmod7$ | conforme |
| mat1500-modul-012 (défi) | $\{2,5\}$ | haute | brute force sur les 6 résidus mod 6 | conforme |

**Verdict : PASS.** Aucune ambiguïté. Total du thème : 12 questions.

## Relecture Opus (b) (docs/reviews/relecture-opus/mat1500-b.md) — correction appliquée

- `modul-008` (Défi) : `explanation` alignée sur le distracteur le plus tentant (soustraire au
  lieu d'additionner les deux congruences).

## Relecture Opus (b), complément (docs/reviews/relecture-opus/mat1500-b.md) — corrections appliquées

- `modul-009` : `why` du distracteur $4$ corrigé ($3^2 \bmod 5 = 4$, pas $3^1$).
- `modul-011` : les trois `why` nomment maintenant l'erreur réelle (croire être son propre
  inverse ; confondre avec le quotient ; confondre avec l'inverse additif) au lieu de seulement
  revérifier le calcul.
- `modul-012` : prompt reformulé pour ne plus éliminer d'avance le distracteur $\{2\}$.

Re-vérifié (Python, venv hors dépôt) : **PASS** sur les 3 items.
