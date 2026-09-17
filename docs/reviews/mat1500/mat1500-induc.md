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
