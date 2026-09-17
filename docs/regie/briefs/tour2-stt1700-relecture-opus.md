# Brief relecture Opus STT1700 — unique, fin de lot (admin adrie-59, 2026-09-17)

Relire les questions d'intra STT1700 (3 thèmes : descr, prob, var) comme les relectures Opus des cours MAT : bonne réponse, `why` de chaque distracteur, explanations, lisibilité, réponses repérables (longueur, réponse dans l'énoncé), deux réponses défendables. Une seule passe pour le cours.

## Vérifié par l'admin
- Questions dans `src/content/stt1700/*.json` sur main (SHA donné dans le message d'envoi), toutes passées au gate et relues en aveugle par Haiku (bonne réponse seulement : les `why` faux ne sont PAS détectés par la relecture aveugle, c'est ce que cette relecture doit trouver).
- Méthode et format : `docs/reviews/relecture-opus/*.md` (section datée, gravité élevé/moyen/bas, SymPy ou fractions hors dépôt pour tout calcul, **aucun JSON modifié** : l'admin transmet les corrections). Matériel de référence en lecture seule : D:\Math\STT1700 (notes, aide-mémoire intra 1, listes d'exercices), `docs/sources/stt1700.md` pour la matière de l'intra.

## Livrable
- `docs/reviews/relecture-opus/stt1700.md` : par question relue, verdict ; liste des points élevés/moyens/bas avec la correction proposée (texte exact) ; proportions mesurées.
- Worktree dédié, créé depuis le dépôt principal : `git worktree add ../pause-maths-wt/relecture -b lot/relecture main`. Y écrire le fichier, `git add` explicite, push `lot/relecture`.
- Rapport à adrie-59 : SHA, nombre de questions relues, points élevés/moyens/bas, ce qui n'a pas été relu.

## Périmètre
`docs/reviews/relecture-opus/stt1700.md` seulement. Pas de Chrome, pas de JSON.
