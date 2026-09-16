# Réponse à la relecture pédagogique Opus — MAT1600

Source : `docs/reviews/relecture-opus/mat1600.md` (main@e66ab6c, 10 questions lues :
matr 2, syst 4, vect 4). Décisions ci-dessous, appliquées à `main` avant l'extension à
20/thème (voir `docs/WORKLOG.md`).

## Moyennes

### 1. mat1600-matr-002 (Défi mal calibré + `why` faux + distracteur sans erreur réelle)

**Accepté intégralement.**
- (a) Retiré `challenge`/`solution` ; question conservée en difficulty 2 (option la plus
  simple proposée par le relecteur — un vrai Défi de plus est déjà ajouté ailleurs dans
  l'extension à 20, voir `matr-017`).
- (b) `why` reformulé : ne dit plus « ne diviser que si $\det A\ne1$ » (faux : on divise
  toujours par $\det A$, diviser par $1$ ne change simplement rien).
- (c) Distracteur remplacé par $\begin{pmatrix}-3&5\\1&-2\end{pmatrix}$ (= $-A^{-1}$),
  `why` : déterminant calculé comme $bc-ad=-1$ au lieu de $ad-bc=1$. Vérifié par SymPy.
- Ajouté à l'`explanation` : « Le piège : oublier d'échanger $a$ et $d$, ou de changer
  le signe de $b$ et $c$. »

### 2. mat1600-vect-001 (notion de « base » pas encore enseignée)

**Accepté, avec adaptation.** Plutôt que déplacer la question vers `mat1600-esp`
(ce qui exige de toucher `retired-ids.json`, hors périmètre du lot contenu) ou de créer
un nouvel id, la question est reformulée sur place pour ne tester que l'indépendance
linéaire (« La famille $\{v_1,v_2,v_3,v_4\}$ est-elle linéairement indépendante ? »),
sans le mot « base ». Même fait mathématique testé ($v_4=v_1+v_2+v_3$), même réponse
correcte : conservé comme une reformulation, pas un changement de sens au sens de la
règle d'id du HANDOFF. Les 3 distracteurs ont aussi été réécrits pour rester cohérents
avec la nouvelle formulation (dont un piège « bonne conclusion, mauvaise raison » sur
l'indépendance de $v_1,v_2,v_3$ seuls).

## Basses

| # | Sujet | Décision |
|---|---|---|
| 3 | matr-002, accord « Quelle est l'inverse » | **Accepté** : « Quel est l'inverse ». |
| 4 | matr-001, distracteur « $AB$, la transposée ne change rien » pas une erreur réelle | **Accepté**, remplacé par « $B^TA^T$ seulement si $A,B$ commutent » (suggestion du relecteur), `why` : l'identité vaut sans condition. |
| 5 | syst-001, indice de longueur (seul le bon choix a un complément) | **Accepté** : `$(1,2)$, solution unique` → `$(1,2)$`. |
| 6 | syst-002/004, barre `&\|&` dans `pmatrix` mal rendue | **Accepté et étendu** : les 2 cas signalés **et 3 autres du même type trouvés par grep** (syst-011, syst-016, syst-019, ajoutés pendant l'extension à 20) convertis en `\left(\begin{array}{cc\|c}...\end{array}\right)`, supporté par KaTeX. `npm test` confirme la compilation. |
| 7 | vect-002, distracteur « sans résoudre un système $3\times3$ » sans rapport | **Accepté, avec adaptation.** La correction suggérée par le relecteur introduit la notation $\det$ pour comparer deux vecteurs de $\mathbb R^2$ — mais `mat1600-det` a `defaultOn:false` (pas encore enseigné), exactement le problème de fuite de thème signalé au point 2 pour `vect-001`. Remplacé à la place par un distracteur purement arithmétique dans le cadre déjà utilisé par la question (comparaison de rapports) : « Oui, car $\tfrac32\ne\tfrac64$ », `why` : ces deux rapports valent en fait tous deux $1{,}5$, ce qui confirme au contraire la colinéarité. |
| 8 | syst-004, vect-003, vect-004 : `explanation` ne nomme pas le piège | **Accepté**, piège ajouté aux 3 `explanation`. |
| 9 | vect-004 : difficulty 2 trop élevée pour une définition + typographie | **Accepté** : `difficulty: 1` ; espace ajoutée avant les points-virgules. |

## Vérification

`npm test` vert après tous les changements. Relecture aveugle ciblée (seed 201/203,
sous-agent frais, sans clé) sur les 4 questions dont le contenu (pas seulement le
rendu) a changé : `matr-001`, `matr-002`, `vect-001`, `vect-002` — voir
`docs/reviews/mat1600/mat1600-matr.md` et `mat1600-vect.md` pour le verdict. Les
questions dont seul le rendu LaTeX ou le texte d'`explanation` a changé (syst-001,
syst-002, syst-004, syst-011, syst-016, syst-019, vect-003, vect-004) n'ont pas été
soumises à une nouvelle relecture aveugle complète : leur réponse correcte et leurs
distracteurs sont inchangés.

**Compte mesuré : 2 moyennes appliquées (adaptées, pas verbatim, avec justification
ci-dessus) ; 7 basses — 6 appliquées telles quelles ou adaptées, 0 rejetée en bloc (le
point 7 a été adapté plutôt que rejeté, pour éviter de réintroduire exactement le
problème signalé au point 2).**
