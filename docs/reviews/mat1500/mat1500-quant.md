# Relecture aveugle — mat1500-quant (jalon 1 + jalon 2, 12 questions)

Date : 2026-09-16. `scripts/blind-review.ts` (choix mélangés, sans flag `correct` ni
`explanation`). Vérification par force brute sur domaines finis et SymPy dans un venv temporaire
hors dépôt, supprimé après usage. Trois passes : 001-005 (jalon 1), 006-008 puis 009-012
(compléments jalon 2).

| id | réponse retenue | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-quant-001 | $\exists x, \neg P(x)$ | haute | force brute, domaine à 3 éléments | conforme |
| mat1500-quant-002 | $\exists x \, \forall y, \neg P(x,y)$ | haute | force brute, domaine 2×2 | conforme |
| mat1500-quant-003 | Faux | haute | contre-exemple $\{0,1\}$, $P(x,y)=(x\ne y)$ | conforme |
| mat1500-quant-004 | formule d'unicité | haute | force brute sur sous-ensembles d'un domaine à 3 éléments | conforme |
| mat1500-quant-005 (flash) | négation de « tout étudiant a réussi un examen » | haute | même schéma que 002 | conforme |
| mat1500-quant-006 | $\exists x \, \forall y, L(x,y)$ | haute | analyse de la traduction | conforme |
| mat1500-quant-007 | Vrai ($\exists$ distribue sur $\vee$) | haute | force brute exhaustive, domaines de taille 1 à 4 | conforme |
| mat1500-quant-008 (flash, défi) | contre-exemple pair/impair | haute | calcul explicite du contre-exemple | conforme |
| mat1500-quant-009 | $\forall x, x^2 \ge 0$ | haute | vérification de la négation (piège $>$ vs $\ge$) | conforme |
| mat1500-quant-010 | Vrai | haute | fait mathématique | conforme |
| mat1500-quant-011 | $\exists x\,(S(x)\wedge\forall y(E(y)\rightarrow F(x,y)))$ | haute | analyse de la règle de style $\forall\to$/$\exists\wedge$ | conforme |
| mat1500-quant-012 (flash, défi) | preuve : $\mathbb{R}$ n'a pas de plus petit élément | haute | témoin explicite $y=x-1$ vérifié symboliquement | conforme |

**Verdict global : PASS** sur les trois passes. Aucune ambiguïté, aucune correction nécessaire.

## Relecture Opus (docs/reviews/relecture-opus/mat1500.md) — corrections appliquées

- `quant-003` : `explanation` reformulée — le sens de l'implication ($\exists y\forall x \Rightarrow
  \forall x\exists y$, jamais l'inverse) était énoncé de façon ambiguë.
- `quant-005` : notation corrigée, $P(x)$ devient $P(x,y)$ (le prédicat est binaire).
- `quant-008`, `quant-012` (Défi) : convertis de flash à qcm (même règle que les 5 autres Défi
  du lot, ajoutés après la relecture Opus initiale mais soumis à la même exigence du HANDOFF §5).
- `**gras**` retiré (un seul cas, hors `solution`).

Re-vérifié (gate + relecture aveugle complète des 12 questions, force brute + SymPy) après
application : **PASS**, aucune régression, contre-exemples de 008/012 confirmés valides.

## Relecture Opus (b) (docs/reviews/relecture-opus/mat1500-b.md) — corrections appliquées

- `quant-008` (Défi, ÉLEVÉE indirecte) : option qui changeait le domaine ($\{0\}$) en
  contradiction avec l'énoncé (« sur $\mathbb{Z}$ ») remplacée par un quasi-contre-exemple sur
  $\mathbb{Z}$ ($P(x)=x>0$, $Q(x)=x\ge1$, qui échoue car $x=1$ satisfait les deux).
- `quant-010` : remplacée par $\forall x, x^2>0$ (Faux, $x=0$) pour nommer le piège du cas
  d'égalité, au lieu d'une redite triviale de quant-009.
- `quant-011` (ÉLEVÉE) : `why` corrigé — les deux formules ne s'impliquent pas l'une l'autre
  (vérifié par deux modèles opposés), plus une reformulation française.
- `quant-012` (Défi) : `explanation` alignée sur les distracteurs réels (témoin qui ne marche que
  pour certains $x$, pas « tester des exemples »).

Re-vérifié (force brute, modèles finis, venv hors dépôt) : **PASS** sur les 4 items touchés.

## Relecture Opus (b), complément — converti en flash

- `quant-011` : converti de qcm à flash, ce qui élimine à la fois l'incohérence de français
  relevée (« $F(x,y)$ = a échoué $y$ » vs « échoué à ») et le risque de `why` mal formulé sur un
  distracteur — la traduction correcte et la règle de style sont maintenant dans `answer` et
  `keyPoints`.
