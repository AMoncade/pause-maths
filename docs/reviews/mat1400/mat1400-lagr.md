# Relecture — mat1400-lagr

8 questions initiales (mat1400-lagr-001 à 008). Relecture aveugle via `scripts/blind-review.ts`
(seed 8), vérification SymPy (résolution du système $\nabla f=\lambda\nabla g$, comparaison des
candidats). Verdicts comparés à la clé : accord total (8/8).

| id | verdict | notes |
|---|---|---|
| mat1400-lagr-001 | confirmé (v1) | système $y=\lambda,x=\lambda \Rightarrow x=y$ |
| mat1400-lagr-002 | confirmé (v1, retiré en ronde 2) | $f(5,5)=25$ |
| mat1400-lagr-003 | confirmé | VF=Vrai ; condition de régularité $\nabla g\ne\vec0$ |
| mat1400-lagr-004 | confirmé | ne pas diviser par $x$ sans traiter $x=0$ séparément |
| mat1400-lagr-005 | confirmé | procédure en 3 étapes + comparaison des candidats |
| mat1400-lagr-006 | confirmé (v1) | $f(1,1)=f(-1,-1)=2$ |
| mat1400-lagr-007 | confirmé | VF=Faux ; il faut comparer tous les candidats |
| mat1400-lagr-008 | confirmé | $\nabla f=\lambda\nabla g$ = gradients parallèles |
| mat1400-lagr-009 (Défi) | confirmé | Lagrange sur l'ellipse $x^2+4y^2=4$, min$=1$ en $(0,\pm1)$, max$=4$ en $(\pm2,0)$ |
| mat1400-lagr-010 | confirmé (v1) | Lagrange à 3 variables $xyz$ sous $x+y+z=12$, force $x=y=z$ |
| mat1400-lagr-011 | confirmé (v1, retiré en ronde 2) | $f(4,4,4)=64$ |
| mat1400-lagr-012 | confirmé | VF=Vrai ; le signe de $\lambda$ n'invalide pas la solution |

## Ronde 2 (deuxième relecture pédagogique Opus, points 21-36)

Problèmes signalés :
- **Élevée** : lagr-001 et lagr-010, le `why` du distracteur "équations multipliées/combinées"
  décrivait en fait l'erreur $f=\lambda g$ (confondre les fonctions avec leurs gradients), pas une
  vraie combinaison d'équations.
- **Moyenne** : lagr-002 et lagr-011 révélaient en clair, dans leur propre énoncé, la réponse de
  lagr-001 et lagr-010 (« avec $x=y=5$… », « avec $x=y=z=4$… ») — un vrai souci puisque l'ordre
  d'affichage des questions est aléatoire dans l'app. lagr-006 avait le même défaut (révélait les
  candidats $(1,1)/(-1,-1)$ dans son propre énoncé).

Corrections appliquées :
- **lagr-001** et **lagr-010** réécrits en questions complètes et autonomes : l'énoncé demande
  directement la valeur maximale (plus le système intermédiaire), toute la dérivation (y compris
  pourquoi $\nabla f=\lambda\nabla g$ et pas $f=\lambda g$) est dans l'`explanation`. Les anciens
  distracteurs "système" (qui ne peuvent plus s'appliquer à une réponse numérique) sont remplacés
  par des distracteurs numériques réels (confusion avec la contrainte, erreur d'arithmétique,
  supposition erronée d'une frontière à vérifier).
- **lagr-006** : énoncé changé pour ne plus révéler les candidats $(1,1)/(-1,-1)$ ; toute la
  résolution (deux cas $\lambda=\pm2$) déplacée dans l'`explanation`. Réponse et distracteurs
  inchangés.
- **lagr-002** et **lagr-011** retirés (fusionnés dans lagr-001 et lagr-010 respectivement).
  **⚠️ à ajouter à `src/content/retired-ids.json` par l'admin** (fichier hors périmètre du lot
  contenu) : `mat1400-lagr-002`, `mat1400-lagr-011`.
- **mat1400-lagr-013** (nouveau) : minimiser $x+y$ sous $xy=16$, valeur $8$ — couvre un angle
  Lagrange différent (fonction linéaire sous contrainte hyperbolique, plutôt que produit sous
  contrainte linéaire) pour remplacer le contenu perdu par la fusion de lagr-002.
- **mat1400-lagr-014** (nouveau) : question dédiée à "pourquoi $\nabla f=\lambda\nabla g$ et pas
  $f=\lambda g$" — reloge proprement le piège identifié aux points 1 (lagr-001/010) dans sa propre
  question conceptuelle, plutôt que comme distracteur numérique mal formé.

Relecture aveugle refaite (nouveau seed, `round2-fixes.md`) sur lagr-001, lagr-006, lagr-010,
lagr-013, lagr-014 : 5/5 confirmées contre la nouvelle clé, chaque système de Lagrange résolu
depuis zéro par SymPy (aucun candidat oublié), aucun désaccord. lagr-014 confirmée avec confiance
4/5 par l'agent (formulation "les gradients (les courbes de niveau)" jugée un peu maladroite) —
corrigée en "les gradients (perpendiculaires aux courbes de niveau) sont parallèles entre eux".

Total après ronde 2 : toujours 12 questions (001,003,004,005,006,007,008,009,010,012,013,014 —
002 et 011 retirés, 013 et 014 ajoutés).
