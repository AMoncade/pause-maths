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

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `proof-008` (ÉLEVÉE) : `explanation` corrigée — sans pgcd$(p,q)=1$, on peut toujours dériver
  que $p$ et $q$ sont pairs, mais ce fait cesse d'être une contradiction (l'erreur initiale disait
  qu'on ne pouvait plus dériver la parité, ce qui est faux). Converti de flash à qcm (HANDOFF §5).

Re-vérifié (gate + relecture aveugle complète des 8 questions, SymPy) après application :
**PASS**, aucune régression ; les distracteurs de 008 (circularité, confusion $p$/$q$, inversion
de sens) confirmés chacun faux pour une raison distincte.

## Complément à 12 questions (jalon 2, cible ~12/thème)

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-proof-009 | toujours vrai (vacuité) | haute | analyse conceptuelle | conforme |
| mat1500-proof-010 | Faux (preuve non constructive possible) | haute | cohérent avec 012 | conforme |
| mat1500-proof-011 | $P(x)$ faux pour tout $x$ | haute | négation de quantificateur | conforme |
| mat1500-proof-012 (défi) | disjonction de cas sur $\sqrt2^{\sqrt2}$ | haute | algèbre vérifiée : $(\sqrt2^{\sqrt2})^{\sqrt2}=2$ | conforme |

**Verdict : PASS.** Aucune ambiguïté. Total du thème : 12 questions.

## Relecture Opus (b) (docs/reviews/relecture-opus/mat1500-b.md) — correction appliquée

- `proof-008` (Défi) : distracteur artificiel « $p^2$ pair donc $p$ impair » remplacé par
  « $p^2$ pair donc $p=2$ » (confondre « pair » avec « égal à 2 »), une vraie erreur d'étudiant.

## Relecture Opus (b), complément (docs/reviews/relecture-opus/mat1500-b.md) — corrections appliquées

- `proof-009` : converti en flash (éliminait le distracteur artificiel restant).
- `proof-011` : parenthèse donnant la réponse retirée du prompt ; redondance de l'`explanation`
  réduite.
- `proof-012` : `why` du distracteur « nécessairement irrationnel » corrigé (c'est vrai par
  Gelfond–Schneider, mais hors de portée de cette preuve) ; 2 distracteurs remplacés ; bonne
  réponse raccourcie.

Re-vérifié (SymPy, venv hors dépôt) : **PASS** sur les 3 items.
