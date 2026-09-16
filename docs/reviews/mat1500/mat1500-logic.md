# Relecture aveugle — mat1500-logic (jalon 1)

Date : 2026-09-16. Sous-agent recevant les questions sans flag `correct` ni `explanation`,
choix mélangés. Vérification mécanique (SymPy, venv temporaire hors dépôt, supprimé après
usage) pour les items algébriques (001, 003, 005).

| id | réponse retenue par l'agent | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-logic-001 | $\neg p \vee q$ | haute | SymPy : tautologie $\text{Implies}(p,q) \equiv \neg p \vee q$ | conforme au flag `correct` du fichier |
| mat1500-logic-002 | Vrai | haute | définition | conforme |
| mat1500-logic-003 | $\neg p \vee \neg q$ | haute | SymPy : De Morgan confirmé, $\neg p \wedge \neg q$ réfuté | conforme |
| mat1500-logic-004 | « $p$ si et seulement si $q$ » | haute | analyse des distracteurs (XOR, implication stricte) | conforme |
| mat1500-logic-005 (flash, défi) | preuve en 3 étapes (implication → De Morgan → double négation) | haute | SymPy : tautologie confirmée | conforme |

**Verdict global : PASS.** Aucun choix à deux réponses défendables, aucune ambiguïté relevée.
