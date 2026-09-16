# Relecture — mat1600-esp (jalon 2)

Gate (`npm test`) : 0 erreur. Relecture aveugle via `scripts/blind-review.ts` (seed 7,
clé dans le scratchpad, jamais montrée au relecteur), sous-agent frais, vérification
SymPy dans un venv hors dépôt.

## mat1600-esp-001 (qcm)

Réponse : « Non : il ne contient pas le vecteur nul » — confiance 5/5. Réfutations
correctes : $H$ n'est pas non plus fermé sous l'addition ; toute droite n'est pas un
sous-espace ; le test du vecteur nul suffit déjà à conclure.
Verdict : **OK**.

## mat1600-esp-002 (qcm)

Réponse : $2$ — confiance 5/5. SymPy : rang de $[1,2,-1]=1$, $3-1=2$ ; base du noyau à 2
vecteurs confirmée. Réfutations correctes pour $0$, $3$, $1$.
Verdict : **OK**.

## mat1600-esp-003 (qcm)

Réponse : $3$ — confiance 5/5. SymPy : deux matrices $3\times5$ de rang 2 construites
indépendamment, noyau de dimension 3 dans les deux cas.
Réfutations correctes pour $1$, $2$, $5$.
Verdict : **OK**.

## mat1600-esp-004 (vf)

Réponse : Faux — confiance 5/5. Contre-exemple du relecteur : $\{(1,0),(2,0),(0,1)\}$
engendre $\mathbb R^2$ mais n'est pas libre.
Verdict : **OK**.

## mat1600-esp-005 (qcm)

Réponse : « Les colonnes 1 et 3 de $A$ » — confiance 5/5. Le relecteur a construit une
matrice concrète et montré que les colonnes de la forme échelonnée réduite (choix
réfuté) peuvent même ne pas appartenir à $\text{Col}(A)$ ; colonne 2 démontrée
dépendante des colonnes 1 et 3 ; toutes les colonnes de $A$ montrées dépendantes.
Verdict : **OK**.

## mat1600-esp-006 (qcm, Défi)

Réponse : $\{(-2,1,0)\}$ — confiance 5/5. SymPy : noyau calculé exactement
$\{(-2,1,0)\}$, dimension 1. Chaque distracteur vérifié individuellement : aucun ne
satisfait $Ax=0$.
Verdict : **OK**.

## mat1600-esp-007 (vf)

Réponse : Vrai — confiance 5/5. Théorème de la base (Lay) : une famille libre de $n$
vecteurs dans un espace de dimension $n$ est automatiquement une base.
Verdict : **OK**.

## mat1600-esp-008 (flash)

Réponse attendue du relecteur : dimension = nombre de vecteurs dans une base,
invariant par le théorème d'échange (Steinitz). Correspond à la réponse de la banque.
Verdict : **OK**.

**Résultat : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**
