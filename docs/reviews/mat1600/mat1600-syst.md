# Relecture — mat1600-syst (jalon 1)

Gate (`npm test`) : 0 erreur. Relecture aveugle (sous-agent, choix mélangés, sans flag
`correct` ni `explanation`), calculs vérifiés par SymPy dans un venv hors dépôt.

## mat1600-syst-001 (qcm)

Réponse du relecteur : « $(1,2)$, solution unique » — confiance haute.
SymPy `linsolve({x+y=3, 2x-y=0})` → `{(1, 2)}`.
Réfutations : « infinité de solutions » faux (pentes $-1$ et $2$, distinctes) ; « incompatible »
faux (un point d'intersection existe) ; « $(2,1)$ » faux (ne vérifie pas $2x-y=0$).
Verdict : **OK**, aucun désaccord.

## mat1600-syst-002 (qcm)

Réponse : $x_3$ — confiance haute. SymPy `rref` confirme les pivots en colonnes 1 et 2 ;
colonne 3 sans pivot ⇒ $x_3$ libre. Réfutations correctes pour $x_1$, $x_2$ (pivots) et
« solution unique » (faux, une variable libre implique une infinité de solutions).
Verdict : **OK**.

## mat1600-syst-003 (vf)

Réponse : Faux — confiance haute. Un système compatible peut avoir une infinité de
solutions (cf. mat1600-syst-002) ; « compatible » exclut seulement 0 solution.
Verdict : **OK**.

## mat1600-syst-004 (flash)

Réponse attendue du relecteur : ligne $(0\ 0\ 0\mid5)$ ⇒ équation $0=5$ impossible ⇒
système incompatible. Correspond à la réponse de la banque.
Verdict : **OK**.

## mat1600-syst-005 (qcm, jalon 2)

Réponse : « Non : la deuxième équation est un multiple de la première » — confiance
haute. SymPy : $4x-2y=2(2x-y)$ confirmé, `linsolve` donne $\{(y/2,y)\}$ (infinité de
solutions). Réfutations correctes pour les 3 autres choix.
Verdict : **OK**.

## mat1600-syst-006 (vf, jalon 2)

Réponse : Faux — confiance haute. Contre-exemple SymPy : $z=1,2z=2,3z=3$ (3 équations,
1 inconnue), système compatible et redondant, pas incompatible.
Verdict : **OK**.

## mat1600-syst-007 (flash, jalon 2)

Réponse attendue : position de pivot = premier coefficient non nul d'une ligne non
nulle en forme échelonnée ; sa colonne est une colonne pivot. Correspond à la banque.
Verdict : **OK**.

## mat1600-syst-008 (qcm, Défi, jalon 2)

Réponse : $(3,0)+t(2,1)$ — confiance haute. SymPy : substitution dans $x_1-2x_2$ pour
chaque choix confirme que seule cette forme vaut $3$ pour tout $t$ ; `linsolve` donne
$\{(2x_2+3,x_2)\}$. Réfutations correctes pour les 3 distracteurs.
Verdict : **OK**.

**Résultat (jalon 2, 4-20) : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-syst-009 à 020 (extension ~20/thème)

Relecture aveugle (seed 101) : 12/12 confirmées, 0 désaccord. Points vérifiés par
SymPy : $h=2$ donne une infinité de solutions pour {009} ; $h=6$ rend {010}
incompatible ; comptage de variables libres correct pour {011} ; solution $(1,2,3)$
confirmée pour le système 3×3 de {015}, chaque distracteur échoue à une équation
précise ; solution $(-6,3,2)$ confirmée par substitution arrière pour {019}, chaque
distracteur isolé à une seule erreur (oubli du $-z$, oubli de la division par 2, copie
brute de la colonne de droite). Concepts (012, 013, 014, 016, 017, 018, 020)
confirmés par raisonnement, aucun désaccord. Note du relecteur : {012} suppose que
« forme échelonnée réduite du système » réfère à la matrice augmentée (convention
standard) — pas un défaut.

**Résultat (jalon 2, 1-20) : 20/20 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-syst-008 (rétrogradé) et mat1600-syst-021 (nouveau, suite à la relecture Opus)

- **syst-008 :** Défi jugé trop routinier (forme vectorielle paramétrique) ; `challenge`
  retiré, gardé en difficulty 2 comme qcm ordinaire (question toujours correcte).
- **syst-021 :** nouveau Défi à deux paramètres $h,k$ (difficulty 3), volontairement
  distinct des paramètres à une seule inconnue déjà testés par syst-009/010.

Relecture aveugle (seed 307) sur syst-021 : confiance 5/5, $(h,k)=(6,3)$ confirmé par
SymPy (rang de la matrice de coefficients et de la matrice augmentée) ; chaque
distracteur donne soit une solution unique soit aucune solution, jamais une infinité.
Le distracteur $(6,6)$ testé et confirmé comme un piège pédagogique solide (bon $h$,
mauvais $k$ ⇒ incompatible plutôt qu'infini). 0 désaccord.

**Résultat (jalon 2, 1-21) : 21/21 publiables, 0 correction nécessaire, 0 désaccord.**

## Corrections suite à la relecture Opus, round 3

- **syst-015 (Défi mal calibré) :** difficulty 3 ; distracteurs remplacés par
  $(-1,1,6)$ (vérifie eq. 1-2) et $(4,0,2)$ (vérifie eq. 1-3), empêchant une
  élimination par test partiel des 3 équations.
- **syst-010 :** distracteur faible « $h=-6$ » remplacé par « $h=\tfrac52$ » (rapport
  des constantes confondu avec celui des coefficients), vérifié par SymPy comme
  donnant en fait une solution unique.
- **syst-016 :** un des deux choix « ignorer la ligne » remplacé par une idée
  distincte (« autant de lignes non nulles que d'inconnues »).
- **syst-012 :** précision ajoutée (matrice augmentée, mêmes inconnues).
- Pièges nommés ajoutés à 012, 013, 017, 018, 020.

Relecture aveugle ciblée (seed 703) sur syst-010, syst-015, syst-016 : 0 désaccord.
SymPy reconfirme $h=6$ (pas $\tfrac52$, qui donne une solution unique) pour syst-010 ;
$(1,2,3)$ avec chaque distracteur satisfaisant exactement 2 des 3 équations pour
syst-015.

**Résultat final : 21/21 publiables, 0 correction nécessaire, 0 désaccord.**
