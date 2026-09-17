# Relecture — stt1700-var (jalon 3)

Brouillon écrit directement par la session (pas via `agy` : deux essais d'`ask.sh -r -o` avec
`claude-opus-4-6-thinking` ont expiré, un premier avec le timeout par défaut, un second relancé
avec `-t 10m` — même échec ; conformément à la règle de la skill agy ("sur timeout, réessaie une
fois puis fais le travail toi-même"), les 12 questions ont été rédigées à la main à partir du
contenu de section 3 déjà consigné dans `docs/sources/stt1700.md`). Vérification numérique
indépendante avant le gate (`fractions.Fraction` + `math.comb` en Python, hors dépôt) : les 12
bonnes réponses **et** l'arithmétique de chaque distracteur (`why`) recalculées en fractions
exactes correspondent exactement aux valeurs du JSON — **0 erreur trouvée**.

Gate (`npm test` 363 tests, `npm run build`) : 0 erreur, aucun renumérotage nécessaire.
Relecture aveugle via `scripts/blind-review.ts` (seed 719, clé dans le scratchpad de session,
jamais montrée au relecteur), sous-agent **Haiku** frais (aucun contexte du brouillon, du calcul,
ni du dépôt).

## stt1700-var-001 (vf)

Réponse : Vrai — confiance 5/5. Confirmé : $1-(0{,}1+0{,}3+0{,}4)=0{,}2$.
Verdict : **OK**.

## stt1700-var-002 (vf)

Réponse : Vrai — confiance 5/5. Confirmé : $F$ en escalier, saut de $p(x)$ à chaque valeur du
support.
Verdict : **OK**.

## stt1700-var-003 (qcm)

Réponse : $0{,}1$ — confiance 5/5. Vérifié : $(-1)(0{,}3)+0(0{,}5)+2(0{,}2)=0{,}1$. Réfutations
correctes pour $-0{,}3$ (premier terme seul) et $1/3$ (moyenne simple non pondérée) ; $0{,}3$
signalé comme non justifié par le relecteur (en réalité $p(-1)$ recopiée) — même verdict final.
Verdict : **OK**.

## stt1700-var-004 (qcm)

Réponse : $0{,}49$ — confiance 5/5. Vérifié : $4{,}9-2{,}1^2=0{,}49$. Réfutations correctes pour
$4{,}41$ ($\mu^2$ seul) et $4{,}9$ ($E(X^2)$ seul) ; $2{,}8$ signalé comme "pas clair" par le
relecteur mais deviné comme $E(X^2)-E(X)$ — c'est exactement l'erreur voulue ($4{,}9-2{,}1$ au
lieu de $4{,}9-2{,}1^2$).
Verdict : **OK**.

## stt1700-var-005 (qcm)

Réponse : $18$ — confiance 5/5. Vérifié : $4(5)-2=18$. Réfutation correcte pour $20$ (constante
oubliée) ; $9$ et $12$ signalés "sans justification cohérente" par le relecteur (en réalité $12$
= appliquer la transformation avant de multiplier, $9$ = addition au lieu de multiplication) —
même verdict final, la bonne réponse ne fait aucun doute.
Verdict : **OK**.

## stt1700-var-006 (qcm, Défi)

Réponse : $54$ — confiance 5/5. Vérifié : $(-3)^2\times6=54$. Réfutations correctes pour $-54$
(signe négatif gardé au carré — le relecteur relève lui-même qu'une variance ne peut être
négative) et $18$ ($|-3|\times6$ au lieu de $(-3)^2\times6$) ; $13$ deviné comme
$\mathrm{var}(X)+\mathrm{var}(Y)$ plutôt que $6+7$ — verdict final identique.
Verdict : **OK**.

## stt1700-var-007 (vf)

Réponse : Faux — confiance 5/5. Confirmé indépendamment : $\mathrm{var}(X+Y)=\mathrm{var}(X)+
\mathrm{var}(Y)+2\,\mathrm{cov}(X,Y)$, égalité fausse sans $\mathrm{cov}(X,Y)=0$.
Verdict : **OK**.

## stt1700-var-008 (qcm)

Réponse : $17$ — confiance 5/5. Vérifié : $2^2(3)+(-1)^2(5)=17$. Distracteurs $1$, $8$, $11$
tous rejetés à raison (le relecteur ne retrouve pas leur dérivation exacte, mais confirme
qu'aucun n'égale $17$) ; réfutations partielles mais verdict final correct.
Verdict : **OK**.

## stt1700-var-009 (qcm, Défi)

Réponse : $0{,}3456$ — confiance 5/5. Vérifié : $\binom{5}{2}(0{,}4)^2(0{,}6)^3=0{,}3456$.
Réfutation correcte et précise pour $0{,}0346$ (facteur 10 manquant = coefficient binomial
oublié) et $0{,}4$ ($p$ seul) ; $0{,}2304$ signalé comme "erreur possible dans $(0{,}6)^3$" —
c'est exactement l'inversion $p\leftrightarrow1-p$ voulue.
Verdict : **OK**.

## stt1700-var-010 (qcm)

Réponse : $3{,}75$ — confiance 5/5. Vérifié : $20(0{,}25)(0{,}75)=3{,}75$. Réfutations correctes
pour $15$ (facteur $p$ oublié), $0{,}1875$ (facteur $n$ oublié) et $5$ ($E(X)=np$ confondu avec
la variance).
Verdict : **OK**.

## stt1700-var-011 (flash)

Réponse attendue du relecteur : $\mathrm{Bin}(n,p_i)$, avec les points clés (marginale =
schéma succès/échec, $E(X_i)=np_i$, $\mathrm{var}(X_i)=np_i(1-p_i)$). Correspond à la réponse
de la banque.
Verdict : **OK**.

## stt1700-var-012 (flash)

Réponse attendue du relecteur : $aE(X)+bE(Y)$, avec la précision explicite que l'indépendance
n'est pas requise (contrairement à la variance). Correspond à la réponse de la banque.
Verdict : **OK**.

**Résultat (jalon 3, 1-12) : 12/12 publiables, 0 désaccord avec la clé, aucune ambiguïté
signalée par le relecteur.**

## Écart de méthode signalé à l'admin

Contrairement aux jalons 1 et 2, le brouillon **n'est pas passé par `agy`** : deux tentatives
(`ask.sh -r -o ... -m claude-opus-4-6-thinking`, timeout par défaut puis `-t 10m`) ont toutes
deux échoué avec « agy hit the … print timeout ; partial answer discarded ». La skill `agy`
prescrit explicitement de réessayer une fois puis de faire le travail soi-même en cas de
timeout — suivi ici. Conséquence : pas de mesure de taux gardé/produit pour ce jalon (rien
produit par agy à mesurer) ; toutes les 12 questions et leurs distracteurs ont été vérifiés
en fractions exactes avant l'import, comme pour un brouillon agy.
