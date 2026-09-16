# Réponse à la relecture pédagogique Opus (docs/reviews/relecture-opus/mat1400.md)

Toutes les corrections proposées ont été appliquées. Aucun rejet.

## Élevée

- **vect-007** : `why` du choix $(2,4,4)$ corrigé → "additionné ($2+2$) au lieu d'être soustrait", au lieu de l'explication fausse sur "$B$ gardé tel quel".

## Moyenne

- **grad-008** : reformulé sur la dérivée directionnelle dans la direction de $\vec v=(3,4)$ (au lieu de la formule générale $D_{\vec v}f$), qui lève l'ambiguïté de convention signalée.
- **chain-002** : `z=f(x,y)` explicité dans l'énoncé.
- **0 Défi** : déjà en cours de résolution en parallèle de cette relecture (voir Jalon 2) ; la banque compte maintenant 8 questions Défi sur 96 (8,3 %).

## Basse (16 points)

Tous appliqués :
- chain-007 reformulé (ne télégraphie plus la réponse) ; grad-003 et grad-005 : hypothèse $\nabla f\ne\vec0$ ajoutée.
- grad-006 transformé en question de gradient complet ($\nabla f$, pas une seule partielle) pour rester dans le bon thème.
- vect-003 : notation $d$ désambiguïsée (constante du plan $e$, distance $D$).
- fonc-001 : `why` corrigé ($\sqrt{x^2+y^2}\ne x+y$, pas de confusion avec $(x+y)^2$).
- fonc-006 : distracteur "$1$" remplacé par deux distracteurs représentant de vraies confusions (chemins qui donnent en réalité la même valeur ici ; confondre "non défini en un point" avec "pas de limite").
- fonc-007 reformulé (ne télégraphie plus la réponse).
- grad-002 : distracteur "multiplier par $\|\nabla f\|$" remplacé par "confondre point et direction".
- vect-004 : distracteur $11$ remplacé par $7$ (piège trace vs déterminant).
- vect-005 : distracteur $(1,1,0)$ remplacé par $(1,1,1)$.
- quad-005 : "Cône elliptique" → "Cône (circulaire)" ; `why` du choix Cylindre et Paraboloïde corrigés.
- quad-006 : `why` du choix Hyperboloïde à une nappe corrigé.
- quad-004 : notation $4\ne9\ne1$ remplacée par une phrase correcte.
- **quad-002 / fonc-004 (redondance)** : quad-002 changé pour $z=4x^2+y^2$ (trace elliptique, demi-axes $1$ et $2$) au lieu de $z=x^2+y^2$ (trace circulaire, même piège que fonc-004).
- chain-001 : `why` reformulés avec $z_x,z_y$ au lieu de $f_x,f_y$ (pas de $f$ défini dans l'énoncé).
- chain-003, chain-004, grad-005, part-003, part-004, part-008 : phrase "Le piège : …" ajoutée à chaque `explanation`.

## Vérification après correctifs

- Gate officiel (`npm test`) : 76/76 verts après tous les correctifs.
- Relecture aveugle refaite (nouveau seed, choix re-mélangés) sur les 8 questions dont la valeur/structure a changé : vect-004, vect-005, vect-007, fonc-006, quad-002, grad-002, grad-006, grad-008. Voir la mise à jour correspondante dans `docs/reviews/mat1400/mat1400-<thème>.md`.
- Les autres correctifs (formulation/piège nommé, sans changement de valeur ni de structure) n'ont pas nécessité de nouvelle relecture aveugle complète ; vérifiés manuellement pour cohérence mathématique.
