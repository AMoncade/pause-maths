# Relecture aveugle — mat1500-quant (jalon 1)

Date : 2026-09-16. Sous-agent recevant les questions sans flag `correct` ni `explanation`,
choix mélangés. Vérification par force brute sur des domaines finis (2-3 éléments, toutes les
relations booléennes possibles) pour les items 001, 002, 004 — plus robuste qu'une seule table
de vérité puisqu'elle élimine les choix qui seraient corrects « par accident » pour un $P$
particulier. Venv temporaire hors dépôt, supprimé après usage.

| id | réponse retenue par l'agent | confiance | vérification | verdict |
|---|---|---|---|---|
| mat1500-quant-001 | $\exists x, \neg P(x)$ | haute | force brute, domaine à 3 éléments | conforme |
| mat1500-quant-002 | $\exists x \, \forall y, \neg P(x,y)$ | haute | force brute, domaine 2×2 | conforme |
| mat1500-quant-003 | Faux | haute | contre-exemple explicite trouvé : domaine $\{0,1\}$, $P(x,y) = (x \ne y)$ | conforme |
| mat1500-quant-004 | $\exists x \, (P(x) \wedge \forall y \, (P(y) \rightarrow y = x))$ | haute | force brute sur tous les sous-ensembles d'un domaine à 3 éléments | conforme |
| mat1500-quant-005 (flash) | « Il existe un étudiant qui n'a réussi aucun examen » | haute | même schéma que quant-002 (∀∃ → ∃∀ + négation du prédicat) | conforme |

**Verdict global : PASS.** Aucune ambiguïté, aucun choix à deux réponses défendables.

**Calibration appliquée** (suggestion non bloquante de l'agent, suivie) :
- `mat1500-quant-003` : difficulté relevée de 1 à 2 — repérer que l'ordre des quantificateurs
  n'est pas interchangeable demande de construire ou de se rappeler un contre-exemple, pas
  seulement une lecture rapide.
- `mat1500-quant-005` : difficulté relevée de 1 à 2 — traduire un énoncé composé en symboles,
  le nier, puis retraduire est une tâche à plusieurs étapes, plus longue que les négations
  symboliques à une étape (ex. quant-001).
