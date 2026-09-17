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

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `logic-001` : `why` du distracteur $p\vee\neg q$ précisé ($\equiv q\to p$, la réciproque).
- `logic-004` : distracteur « ni $p$ ni $q$ » remplacé par « $p$ et $q$ sont tous les deux vrais ».
- `logic-005` (Défi) : converti de flash à qcm (HANDOFF §5 : Défi = 4 choix + solution).
  `explanation` réécrite pour refléter les distracteurs qcm (relu par sous-agent, corrigé après
  un reliquat détecté).
- `logic-009` : parenthèses explicites ajoutées au choix D (clarté, pas de correction
  mathématique).
- `**gras**` retiré partout hors `solution` (MathText n'interprète pas le Markdown hors formule).

Re-vérifié (gate + relecture aveugle complète des 12 questions, SymPy) après application :
**PASS**, aucune régression.

## Relecture Opus (b) (docs/reviews/relecture-opus/mat1500-b.md) — corrections appliquées

- `logic-005` (Défi) : prompt réécrit pour ne plus donner la réponse (elle se lisait dans
  l'énoncé).
- `logic-007`/`008` : redondance réduite, `logic-008` utilise un exemple moins évident
  ($(p\to q)\vee(q\to p)$) au lieu de $p\vee\neg p$ déjà vu en 007.
- `logic-009`, `logic-011` : distracteurs artificiels remplacés par de vraies erreurs
  (confusion $p$/$q$ dans un terme distribué ; $\wedge$ lu comme $\to$ dans l'exportation).
- `logic-010`, `logic-012` : pièges nommés explicitement ; `logic-012` ne présente plus
  « distribuer » comme une erreur (ça fonctionne, ça tourne juste en rond).

Re-vérifié par SymPy (venv hors dépôt) : **PASS**, tous les nouveaux distracteurs confirmés non
équivalents à la bonne réponse.
