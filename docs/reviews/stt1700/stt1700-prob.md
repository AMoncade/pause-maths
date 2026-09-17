# Relecture — stt1700-prob (jalon 2)

Brouillon initial produit par `agy` (Antigravity CLI, `claude-opus-4-6-thinking`, quota
Google) à partir de `docs/PROCESSUS_QUESTIONS.md` et d'un résumé du contenu de
`2. Probabilités/CoursSTT1700Sect2A26H27.pdf` (48 diapositives, lues en entier directement
par la session, pas seulement rapportées par `agy`). Vérification numérique indépendante
avant le gate (`fractions.Fraction` en Python, hors dépôt) : **les 12 questions du brouillon
étaient mathématiquement correctes, 0 erreur trouvée** — chaque bonne réponse et chaque
distracteur (`why`) recalculés en fractions exactes correspondent à l'arithmétique annoncée.
Donc 12/12 gardées telles quelles, 0 corrigée, 0 rejetée.

Gate (`npm test`, `npm run build`) : 0 erreur. Relecture aveugle via
`scripts/blind-review.ts` (seed 493, clé dans le scratchpad de session, jamais montrée au
relecteur), sous-agent **Haiku** frais (aucun contexte du brouillon ni du calcul).

## stt1700-prob-001 (qcm)

Réponse : $2/5$ — confiance 5/5. Vérifié : $4$ rouges sur $10$ billes. Réfutations
correctes pour $2/3$ (divise par les bleues au lieu du total), $3/5$ ($\Pr(\text{bleue})$
au lieu de $\Pr(\text{rouge})$) et $1/4$ (numérateur/dénominateur inversés).
Verdict : **OK**.

## stt1700-prob-002 (qcm)

Réponse : $0{,}7$ — confiance 5/5. Vérifié : $0{,}5+0{,}3-0{,}1=0{,}7$. Réfutations
correctes pour $0{,}8$ (addition sans soustraire l'intersection), $0{,}1$ (confond
intersection et union) et $0{,}15$ (applique la formule d'indépendance $0{,}5\times0{,}3$).
Verdict : **OK**.

## stt1700-prob-003 (qcm)

Réponse : $1/4$ — confiance 5/5. Vérifié : $30/(30+90)=30/120=1/4$. Réfutations correctes
pour $3/20$ ($\Pr(\text{maths}\cap\text{réussi})=30/200$, pas la conditionnelle), $2/5$
($\Pr(\text{maths})=80/200$ sans conditionner) et $3/8$ (conditionnement inversé,
$30/80=\Pr(\text{réussi}\mid\text{maths})$).
Verdict : **OK**.

## stt1700-prob-004 (qcm)

Réponse : $0{,}60$ — confiance 5/5. Vérifié : disjoints donc $\Pr(A\cup B)=\Pr(A)+\Pr(B)
=0{,}25+0{,}35=0{,}60$. Réfutations correctes pour $0{,}0875$ (produit $0{,}25\times0{,}35$,
formule d'indépendance mal appliquée), $0{,}35$ (ne garde que $\Pr(B)$) et $1$ (suppose à
tort que deux disjoints sont complémentaires).
Verdict : **OK**.

## stt1700-prob-005 (qcm)

Réponse : $1/3$ — confiance 5/5. Vérifié : $(6/10)(5/9)=30/90=1/3$ (sans remise).
Réfutations correctes pour $9/25$ ($(6/10)^2$, tirage avec remise), $3/10$ (dénominateur du
second tirage resté à 10) et $5/9$ (conditionnelle seule, sans multiplier par $\Pr$ du
premier tirage).
Verdict : **OK**.

## stt1700-prob-006 (qcm)

Réponse : $1/36$ — confiance 5/5. Vérifié : $(1/6)(1/6)=1/36$ (lancers indépendants).
Réfutations correctes pour $1/3$ (additionne $1/6+1/6$ au lieu de multiplier), $1/12$
($1/6\times1/2$, confond avec une pièce) et $1/6$ (un seul lancer considéré).
Verdict : **OK**.

## stt1700-prob-007 (qcm, Défi)

Réponse : $10/29$ — confiance 5/5. Vérifié par Bayes à 3 branches : $\Pr(D)=0{,}50\times
0{,}02+0{,}30\times0{,}03+0{,}20\times0{,}05=0{,}029$, $\Pr(M_1\mid D)=0{,}010/0{,}029=
10/29$. Réfutations correctes pour $1/2$ (probabilité a priori de $M_1$, pas a posteriori),
$1/3$ (suppose les 3 machines équiprobables sachant $D$) et $10/19$ (dénominateur incomplet,
oublie la branche $M_3$).
Verdict : **OK**.

## stt1700-prob-008 (vf)

Réponse : Vrai — confiance 5/5. Confirmé : loi de De Morgan, $(A\cup B)^c=A^c\cap B^c$.
Verdict : **OK**.

## stt1700-prob-009 (vf)

Réponse : Faux — confiance 5/5. Contre-exemple fourni indépendamment par le relecteur (dé,
$A=\{1\}$, $B=\{2\}$) : incompatibles avec probabilités non nulles mais $\Pr(A\mid B)=0\neq
\Pr(A)$, donc pas indépendants.
Verdict : **OK**.

## stt1700-prob-010 (vf)

Réponse : Faux — confiance 5/5. Confirmé : $\Pr(A\mid B)$ exige $\Pr(B)>0$, indéfini sinon
(division par zéro).
Verdict : **OK**.

## stt1700-prob-011 (flash)

Réponse attendue du relecteur : $\Pr(A\cap B)=\Pr(A)\cdot\Pr(B)$, avec la reformulation
équivalente $\Pr(A\mid B)=\Pr(A)$. Correspond à la réponse de la banque.
Verdict : **OK**.

## stt1700-prob-012 (flash)

Réponse attendue du relecteur : $\Pr(A\mid B)=\Pr(B\mid A)\Pr(A)/\Pr(B)$, avec la forme
développée par probabilités totales au dénominateur. Correspond à la réponse de la banque.
Verdict : **OK**.

**Résultat (jalon 2, 1-12) : 12/12 publiables, 0 désaccord avec la clé.**

## Essai `agy` (mesure d'économie du tour 2, jalon 2)

**Mesure : 12 questions produites par `agy`, 12 gardées telles quelles, 0 corrigée, 0
rejetée** — meilleur taux que le jalon 1 (10 produites, 7 inchangées, 3 corrigées). Les
jeux de données numériques du brouillon étaient tous différents des exemples du cours (
demandé explicitement dans le prompt), et l'arithmétique de chaque `why` a résisté à la
vérification en fractions exactes. Hypothèse la plus probable de l'amélioration par rapport
au jalon 1 : le prompt donné à `agy` cette fois listait explicitement le contenu du thème
(axiomes, formules, pièges attendus) au lieu de laisser `agy` dériver ce contenu seul depuis
le PDF brut, et demandait une distribution de types/difficulté précise dès le départ — mais
avec un échantillon de 2 jalons, ce n'est pas encore une conclusion établie.
