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

**Résultat : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**
