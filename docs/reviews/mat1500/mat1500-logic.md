# Relecture aveugle — mat1500-logic (jalon 1 + jalon 2, 12 questions)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification SymPy (tautologies, tables de vérité) dans un venv temporaire hors
dépôt, supprimé après usage. Trois passes de relecture : 001-005 (jalon 1), 006-008 puis 009-012
(compléments jalon 2).

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-logic-001 | $\neg p \vee q$ | haute | SymPy : tautologie $\text{Implies}(p,q) \equiv \neg p \vee q$ | conforme |
| mat1500-logic-002 | Vrai | haute | définition | conforme |
| mat1500-logic-003 | $\neg p \vee \neg q$ | haute | SymPy : De Morgan | conforme |
| mat1500-logic-004 | biconditionnel | haute | analyse des distracteurs | conforme |
| mat1500-logic-005 (flash, défi) | preuve en 3 étapes | haute | SymPy : tautologie | conforme |
| mat1500-logic-006 | $\neg p \rightarrow \neg q$ (inverse) | haute | SymPy `Equivalent` sur les 4 choix vs l'implication de départ | conforme |
| mat1500-logic-007 | Vrai (tiers exclu) | haute | SymPy `satisfiable(Not(p\|~p))` = False | conforme |
| mat1500-logic-008 (flash) | tautologie vs contradiction | haute | analyse conceptuelle | conforme |
| mat1500-logic-009 | $(p \wedge q) \vee (p \wedge r)$ | haute | SymPy tautologie | conforme |
| mat1500-logic-010 | Vrai (domination) | haute | trivial | conforme |
| mat1500-logic-011 | $p \rightarrow (q \rightarrow r)$ (exportation) | haute | SymPy tautologie, contre-exemples pour A/C/D | conforme |
| mat1500-logic-012 (flash) | absorption, $p \vee (p \wedge q) \equiv p$ | haute | SymPy tautologie | conforme |

**Verdict global : PASS** sur les trois passes. Correction cosmétique appliquée suite à la 3e
passe : parenthèses explicites ajoutées au choix D de `mat1500-logic-009` pour éviter toute
dépendance à la priorité des opérateurs (le choix restait faux, seule la lisibilité était en
cause).
