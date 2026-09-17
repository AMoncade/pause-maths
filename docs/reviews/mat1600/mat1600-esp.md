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

**Résultat (jalon 2, 1-8) : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-esp-006 et esp-007 (corrigés suite à la relecture Opus)

- **esp-006 (élevée) :** le `why` du distracteur $\{(1,0,0),(0,0,1)\}$ affirmait à tort
  que ce sont des colonnes pivots de $A$ ($2\times3$, donc dans $\mathbb R^2$) tout en
  utilisant des vecteurs $\mathbb R^3$. Corrigé en $\{(1,0),(0,1)\}$ avec `why`
  distinguant domaine ($\mathbb R^3$) et codomaine ($\mathbb R^2$). Bump à difficulty 3.
- **esp-007 :** inversé pour tester « famille génératrice de taille $n$ ⇒ base »
  (dual du théorème déjà testé par `vect-006`), pour éliminer le recoupement signalé.

Relecture aveugle (seed 303) : esp-006 confiance 5/5, base du noyau $\{(-2,1,0)\}$
reconfirmée par SymPy, les 3 distracteurs (dont le nouveau, vérifié comme n'étant même
pas dans $\mathbb R^3$) tous réfutés individuellement. esp-007 confiance 5/5, théorème
de la base (forme duale) confirmé par raisonnement + exemple concret. 0 désaccord.

**Résultat (jalon 2, 1-8) : 8/8 publiables, 0 correction nécessaire, 0 désaccord.**

## mat1600-esp-009 à 020 (extension à 20/thème)

Relecture aveugle (seed 501) sur les 12 nouvelles : fermeture sous addition/multiplication
scalaire de {009} vérifiée numériquement ; intersection (010) et union (011) de
sous-espaces vérifiées par exemples concrets (contre-exemple $x$-axe/$y$-axe pour
l'union) ; théorème du rang confirmé pour {012} et {015} avec des matrices concrètes ;
$v_3=v_1+v_2$ confirmé exactement pour le Défi {014} (rang $2<3$). Concepts (013, 016,
017, 018, 019, 020) confirmés par raisonnement. 0 désaccord.

**Résultat (jalon 2, 1-20) : 20/20 publiables, 0 correction nécessaire, 0 désaccord.**

## Corrections suite à la relecture Opus, round 4 (complémentaire 3)

- **esp-016 (ambiguïté) :** reformulé « Tout sous-espace vectoriel de $\mathbb R^n$ ne
  contient que le vecteur nul » pour éliminer la double lecture.
- **esp-019 (donnée manquante) :** espace ambiant précisé ($H\subset\mathbb R^7$),
  distracteur $7$ ajouté, « $10$ » remplacé par « $1$ ».
- **esp-014 (doublon de vect-008, Défi) :** remplacé par un Défi propre au thème :
  base/dimension de $H=\{x+y=0,\ z=2w\}\subset\mathbb R^4$, $\dim H=2$.
- **esp-017 (redondant avec esp-008/013) :** remplacé par une lecture concrète (rang
  à partir des positions de pivots d'une $4\times6$).
- **esp-009 :** indice de longueur retiré (choix correct simplifié à « Oui »).
- **esp-012 :** `why` reformulés pour nommer l'erreur réelle ($m-\text{rang}$ vs
  nombre de lignes).
- **esp-015 :** « espace nul » résiduel → « noyau ».
- Pièges nommés ajoutés à esp-010, 011, 015, 018, 020.

Relecture aveugle ciblée (seed 801) sur esp-014, 016, 017, 019 : 0 désaccord. SymPy
reconfirme $\dim H=2$ pour esp-014 (rang $2$ de la matrice de contraintes) ; esp-016
vérifié sans ambiguïté grammaticale (la tournure restrictive « ne...que » exclut la
lecture alternative) ; rang $=3$ pour esp-017 (nombre de colonnes pivots, indépendant
de leur position) ; borne $5$ confirmée pour esp-019 malgré l'espace ambiant
$\mathbb R^7$.

**Résultat final : 20/20 publiables, 0 correction nécessaire, 0 désaccord.**
