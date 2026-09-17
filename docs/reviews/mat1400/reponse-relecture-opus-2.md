# Réponse à la deuxième relecture pédagogique Opus (points 21-36)

Reçue avant l'écriture du fichier complet sur main (résumé transmis par l'admin). Toutes les
corrections appliquées. Aucun rejet.

## Correction d'une erreur du relecteur

- **vect-005** : la correction précédente ($(1,1,0)\to(1,1,1)$, ronde 1) était elle-même fausse
  (ni le produit terme à terme ni la somme ne donnent $(1,1,1)$). Revenu à $(1,1,0)$ avec `why`
  = "c'est $\vec u+\vec v$".

## Élevées

- **part-010** : `why` du distracteur $4{,}996$ incohérent (inverser $\Delta y$ seul donne
  $5{,}02$) ; corrigé pour décrire l'inversion complète du déplacement ($\Delta x=-0{,}02$ ET
  $\Delta y=+0{,}01$), seule combinaison qui donne exactement $4{,}996$ (vérifié).
- **lagr-001, lagr-010** : le `why` "équations combinées/multipliées" décrivait en fait l'erreur
  $f=\lambda g$ ; corrigé en fusionnant chaque paire (voir Moyennes) et en créant lagr-014 dédiée
  à ce piège précis.

## Moyennes

- **chain-010** : `why` de $\cos(1)$ corrigé (terme entier oublié, pas seulement le facteur $2t$).
- **Paires Lagrange (lagr-001+002, lagr-010+011)** fusionnées en questions complètes autonomes ;
  **lagr-006** réécrit pour ne plus révéler ses candidats. Détail complet dans
  `docs/reviews/mat1400/mat1400-lagr.md`. Deux nouvelles questions (lagr-013, lagr-014) ajoutées
  pour garder 12/thème.
- **vect-009 (Défi)** : points changés ($A(1,2,0)$, $B(0,1,1)$, $C(2,0,1)$), réponse
  $x+2y+3z=5$, trop devinable avec les anciens points symétriques.

## Basses

- part-010 : virgules décimales françaises ($5{,}004$).
- fonc-009 : "Vaut $1$" (bouche-trou) remplacé par une vraie confusion de degré.
- chain-011 : $f(0,0)=0$ précisé pour le contre-exemple.
- extr-007 : parenthèse "(D=8>0, f_xx=2>0)" retirée du choix correct (seul choix annoté,
  donnait un indice par sa longueur) ; calcul gardé dans l'`explanation`.
- extr-011 : "$\mathbb R^2$ n'est pas fermé et borné" → "$\mathbb R^2$ est fermé mais pas borné"
  (plus précis).
- fonc-012 : remplacé entièrement (redondant avec fonc-005) par le domaine de
  $\ln(4-x^2-y^2)$, mis en contraste avec fonc-001.
- Difficultés surévaluées : vect-010 et extr-004, $2\to1$. (lagr-002 disparaît avec la fusion.)
- grad-010 : français corrigé ("dans une direction").
- vect-011 : piège nommé explicitement.

## Suivi requis (hors périmètre du lot contenu)

`src/content/retired-ids.json` est propriété de l'admin. Deux ids ont été retirés du contenu
(remplacés par une fusion) et devraient y être ajoutés : `mat1400-lagr-002`,
`mat1400-lagr-011`. Sans impact sur le gate actuel (la règle `id-retired` ne fait qu'empêcher leur
réutilisation future), mais cohérent avec la discipline documentée au HANDOFF §7.

## Vérification

- Gate officiel (`npm test`) : 315/315 verts après tous les correctifs (banque des 4 cours).
- Relecture aveugle refaite (nouveau seed) sur les questions à valeur/structure changée :
  vect-009, fonc-012, lagr-001, lagr-006, lagr-010, lagr-013, lagr-014 → 7/7 confirmées, chaque
  système de Lagrange résolu depuis zéro par SymPy sans candidat oublié. Les correctifs
  wording-only (chain-010, chain-011, extr-007, extr-011, grad-010, vect-011, part-010 virgules)
  n'ont pas nécessité de nouvelle relecture aveugle (réponse et structure inchangées).
