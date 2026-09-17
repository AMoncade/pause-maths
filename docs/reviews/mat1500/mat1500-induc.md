# Relecture aveugle — mat1500-induc (jalon 2)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification SymPy (algèbre de $n! \ge 2^n$, $2^{k+1}$, somme $1+\cdots+n$) dans
un venv temporaire hors dépôt, supprimé après usage.

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-induc-001 | étape inductive $k \to k+1$ | haute | analyse conceptuelle | conforme |
| mat1500-induc-002 | Faux | haute | définition (cas de base manquant) | conforme |
| mat1500-induc-003 | hypothèse pour $k$ fixé arbitraire | haute | analyse conceptuelle | conforme |
| mat1500-induc-004 | $n=4$ | haute | script : $n!\ge2^n$ faux pour $n=1,2,3$, vrai dès $n=4$ | conforme |
| mat1500-induc-005 | Vrai | haute | définition de l'induction forte | conforme |
| mat1500-induc-006 | $2^{k+1}=2\cdot2^k>2k\ge k+1$ | haute | vérification symbolique des 4 identités proposées | conforme |
| mat1500-induc-007 (flash) | cas de base + étape inductive | haute | analyse conceptuelle | conforme |
| mat1500-induc-008 (flash, défi) | preuve de $1+\cdots+n=n(n+1)/2$ | haute | algèbre vérifiée | conforme |

**Verdict global : PASS.** Aucune ambiguïté. Remarque non bloquante de l'agent : 007 et 001
se recoupent en contenu (cas de base + étape inductive) — acceptable dans un pool de pratique
avec répétition espacée, gardé tel quel.

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `induc-004` (ÉLEVÉE) : `explanation` corrigée — $0! = 1 = 2^0$ est une égalité (donc l'inégalité
  $n!\ge2^n$ est VRAIE à $n=0$, pas fausse comme l'affirmait le texte précédent) ; elle est hors
  de la portée annoncée ($n\ge4$), ce qui reste la bonne raison de rejeter ce cas de base.
- `induc-008` (Défi) : converti de flash à qcm (HANDOFF §5).

Re-vérifié (gate + relecture aveugle complète des 8 questions, SymPy) après application :
**PASS**, aucune régression ; valeurs de $n!$ et $2^n$ reconfirmées pour $n=0..4$.

## Complément à 12 questions (jalon 2, cible ~12/thème)

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-induc-009 | $n=0$ | haute | $0^3-0=0$, $3\mid0$ | conforme |
| mat1500-induc-010 | $(k^3-k)+3(k^2+k)$ | haute | expansion symbolique de $(k+1)^3-(k+1)$ | conforme |
| mat1500-induc-011 | cas premier / composé | haute | analyse conceptuelle | conforme |
| mat1500-induc-012 (défi) | appliquer l'HI forte à $a$ | haute | analyse conceptuelle | conforme |

**Verdict : PASS.** Correction mineure appliquée suite à la relecture : choix distracteur A de
`mat1500-induc-012` reformulé pour ne plus être défendable même par un lecteur très littéral
(affirmait à tort que rien ne garantit $2 \le a$, alors que $a>1$ entier l'implique
automatiquement). Total du thème : 12 questions.

## Relecture Opus (b) (docs/reviews/relecture-opus/mat1500-b.md) — correction appliquée

- `induc-008` (Défi) : `explanation` alignée sur le distracteur le plus tentant (mauvaise
  factorisation donnant $k(k+2)/2$).

## Relecture Opus (b), complément (docs/reviews/relecture-opus/mat1500-b.md) — corrections appliquées

- `induc-008` (ÉLEVÉE) : `explanation` corrigée — le mécanisme d'erreur décrit précédemment était
  mathématiquement faux ; nouvelle description vérifiée par SymPy.
- `induc-009` : converti en flash (éliminait les 2 distracteurs artificiels restants).
- `induc-011` : réponse raccourcie, 3 nouveaux distracteurs réels (au lieu d'arbitraires), ne
  duplique plus la réponse d'induc-012.
- `induc-012` : 2 distracteurs remplacés, réponse raccourcie.

Re-vérifié (SymPy, venv hors dépôt) : **PASS** sur les 4 items.
