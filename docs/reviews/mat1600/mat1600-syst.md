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

**Résultat : 4/4 publiables, 0 correction nécessaire.**
