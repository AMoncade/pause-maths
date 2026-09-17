# Vérification MAT1500 contre le vrai matériel StudiUM (tour 2, 2026-09-17)

Brief : `docs/regie/briefs/tour2-mat1500-verif.md`. Worktree `pause-maths-wt/mat1500`, branche
`lot/mat1500`, partie de `main@ccc05c7`. Matériel comparé : `D:\Math\MAT1500` (lecture seule,
aucun fichier de cours commité). Méthode et livrable calqués sur
`docs/reviews/mat1400/verification-studium.md` et `docs/reviews/mat1600/verification-studium.md`.

**Le matériel est mince** : 9 fichiers, dont 2 sans intérêt (une image de la politique IA, et une
copie du plan de cours). Aucune note de cours, aucun quiz relu, aucun ancien examen, aucun
exercice de TP. Tout ce qui suit s'appuie donc sur quatre documents seulement. La dernière section
dit ce qui n'a pas pu être vérifié — c'est la partie la plus importante de ce rapport.

## Ce qui a été comparé

- **Page de structure StudiUM** (`01 Plan de cours\StudiUM - structure MAT1500-A-A26.md`) : tableau
  daté des évaluations, contenu par chapitre, format du cours, barème, consignes d'examen, dates
  importantes. Lue en entier, confrontée aux 10 thèmes de `src/content/mat1500/index.ts` (label,
  `exam`, `defaultOn`, ordre). `Info MAT1500.txt` (copie du 9 septembre) dit la même chose, sans
  écart.
- **Les deux devoirs** (`mat1500-devoir-1.pdf`, 9 problèmes ; `mat1500-devoir-2.pdf`, 6 problèmes),
  lus problème par problème. Ce sont les seuls énoncés écrits par l'enseignant.
- **Le corrigé du devoir 1** (`Dev 1 Corrigé.pdf`, 10 pages manuscrites de l'auxiliaire Baland
  Omar), lu en entier : c'est la seule source qui montre le niveau de rédaction attendu et les
  réponses officielles.
- **Le PDF d'équivalences logiques** (`02 Notes de cours\Ressources d'étude\equivalences-logiques.pdf`),
  une page scannée : tableaux 5 et 6 du manuel français (p. 15) et 7 et 8 du manuel anglais
  (p. 29). Seule référence de notation déposée par l'enseignant.
- **Les 96 questions existantes**, une par une, contre ce matériel.

## Ce qui divergeait

1. **`mat1500-proof` avait `defaultOn: false`** alors que les méthodes de preuve sont dans les deux
   devoirs déjà exigibles au 17 septembre. Corrigé à `true`. Preuves :
   - devoir 1 #1 et #2 : deux preuves complètes à rédiger, la seconde guidée mot pour mot par
     « Supposer (pour contradiction) que… » ;
   - devoir 2 #6 : cinq énoncés à mettre sous forme « Si $P$, alors $Q$ », puis réciproque,
     contraposée, et vrai/faux justifié ;
   - devoir 2 #5 : trois non-équivalences à réfuter par contre-exemple.

   C'est le seul `defaultOn` en écart sur les 10. Les neuf autres sont justes : `logic` et `quant`
   confirmés par la quasi-totalité des deux devoirs ; `sets`, `func`, `divis`, `modul`, `induc`
   n'ont **aucune trace** dans les devoirs ; `count` et `graphs` sont de la matière du final.

2. **`docs/sources/mat1500.md` était bâti sur `Downloads` et sur des résumés `agy`** des devoirs,
   avec la mention « `D:\Math\MAT1500` vide ». Le fichier est refait à partir des sources réelles :
   calendrier daté complet, tableau chapitre → thème, tableau `defaultOn` avec la preuve par
   problème de devoir, section notation du cours, section « non vérifié ».

3. **Une affirmation du jalon 1 était fausse.** `docs/sources/mat1500.md` disait que le contenu des
   devoirs 1 et 2 est « entièrement de la logique propositionnelle et des quantificateurs ». Ce
   n'est pas le cas : deux des neuf problèmes du devoir 1 sont des preuves sur les **arbres**
   (sommet, arête, degré, feuille, chemin, cycle), et le devoir 2 #6 porte sur la parité et la
   divisibilité. La conclusion tirée à l'époque (`logic` et `quant` à `true`) restait bonne, mais
   la prémisse manquait `proof` — d'où le point 1.

4. **En-tête de `index.ts`** : la source du calendrier est désormais la page de structure StudiUM,
   avec date, heure et local de l'intra et du final, et la date de référence des `defaultOn`.

5. **Six gaps réels, comblés par 6 questions**, chacun prouvé par un problème précis d'un devoir —
   voir la section suivante.

## Les 6 questions ajoutées

Aucune n'est un Défi. Chacune est rattachée à un problème du matériel ; aucune n'en reprend
l'énoncé ni les exemples (règle de `CLAUDE.md` : réécrites, jamais copiées).

| Id | Type | Gap | Preuve dans le matériel |
|---|---|---|---|
| `mat1500-logic-013` | qcm | « Est-ce une proposition ? » : 0 question sur 96 | Devoir 1 #3 : neuf phrases à classer proposition / non-proposition, puis vrai / faux. C'est le problème le plus long du devoir 1 et le seul entièrement corrigé au tableau dans le corrigé. |
| `mat1500-logic-014` | flash | proposition vs prédicat : le mot « prédicat » n'apparaissait dans aucun énoncé | Corrigé du devoir 1 #3e : « Non, c'est un prédicat et non pas une proposition ». Devoir 1 #4 et devoir 2 #2 demandent de définir un prédicat. |
| `mat1500-logic-015` | qcm | priorité des connecteurs et parenthésage : 0 question | Devoir 2 #5a-b, avec la morale écrite en italique dans l'énoncé : ne jamais écrire une expression mixte sans parenthèses. |
| `mat1500-logic-016` | qcm | négation du biconditionnel : `logic-004` sait lire $\leftrightarrow$, rien ne le niait | Devoir 2 #3e : $\neg(P \leftrightarrow Q)$. Le lien avec $\oplus$ vient du devoir 1 #8. |
| `mat1500-quant-013` | vf | $\forall$ ne distribue pas sur $\vee$ : la banque avait les deux cas du $\exists$ (`quant-007`, `quant-008`), pas celui-là | Devoir 2 #5c, qui demande exactement des prédicats montrant que $\forall x (P(x) \vee Q(x))$ n'équivaut pas à $(\forall x P(x)) \vee (\forall x Q(x))$. |
| `mat1500-proof-013` | qcm | « suffit pour » : seul « nécessaire » était couvert, et en vrai/faux (`proof-005`) | Devoir 2 #1e et #1f, qui opposent « suffit pour » et « est nécessaire pour » sur la même paire de propositions. |

`quant-013` introduit au passage « univers du discours », le terme employé dans les deux devoirs
et absent de la banque jusqu'ici.

Vérifications avant import (tables de vérité exhaustives, node, hors dépôt) :
$\neg(p \leftrightarrow q) \equiv (p \wedge \neg q) \vee (\neg p \wedge q) \equiv p \oplus q$ ;
$\neg p \leftrightarrow \neg q \equiv p \leftrightarrow q$ et $(p \wedge q) \vee (\neg p \wedge \neg q) \equiv p \leftrightarrow q$
(les deux distracteurs sont donc l'énoncé de départ, pas sa négation) ;
$(p \wedge q) \vee r \not\equiv p \wedge (q \vee r)$, séparés par $p$ faux, $q$ faux, $r$ vrai ;
$p \rightarrow q$ distinct de $q \rightarrow p$, de $p \leftrightarrow q$ et de $\neg p \rightarrow \neg q$,
et $\neg p \rightarrow \neg q \equiv q \rightarrow p$ ; $2^n > n^2$ faux en $n=2,3,4$ et vrai en
$n=0,1,5,6$ ; sur $\mathbb{Z}$, tout entier est $\ge 0$ ou $\le 0$ sans qu'aucune des deux
propriétés soit universelle.

## Ce qui ne divergeait pas (vérifié, laissé tel quel)

- **`exam` des 10 thèmes.** La matière de l'intra est donnée une seule fois, dans le tableau
  d'évaluations : « Chapitres 1 à 3 ». Les 8 thèmes `intra` couvrent exactement les chapitres 1
  (logique, quantificateurs, ensembles, fonctions), 2 (divisibilité, arithmétique modulaire) et 3
  (preuves, induction) ; `count` couvre les chapitres 4-5 et `graphs` le chapitre 7, tous deux
  enseignés après le 29 octobre. **Aucune question n'est mal classée intra/final. Aucun id à
  retirer.**
- **Ordre et libellés des thèmes** : conformes au découpage du plan. Seule remarque, sans effet
  aujourd'hui : `mat1500-count` couvre à lui seul deux chapitres distincts du plan (4 Dénombrement,
  5 Techniques de dénombrement avancées) ; à rouvrir quand la matière du final sera abordée.
- **Date de l'intra** : 29 octobre, 10h30-12h20, B-2325 Pav. 3200 J.-Brillant. Le brief l'annonçait
  au 29 octobre : confirmé. C'est un **jeudi**, dans la plage du TP, pas dans une plage de cours —
  cohérent avec les cinq quiz, eux aussi en TP le jeudi.
- **Les 96 questions existantes** : aucune n'a été modifiée sur le fond, aucune n'est contredite
  par le matériel. Là où le recoupement est possible, il est exact :
  - `quant-004` reprend la forme du devoir 1 #9 pour $\exists!$, au symbole près ;
  - `quant-012` réfute « il existe un plus petit réel », soit le dernier item du devoir 1 #3, et
    par le même argument que le corrigé (exhiber un témoin plus petit) ;
  - `logic-005` est la simplification de $\neg(p \rightarrow q)$ demandée au devoir 2 #3b ;
  - `logic-011` est exactement l'équivalence du devoir 2 #4e ;
  - `logic-001`, `logic-003`, `logic-009` correspondent aux lignes du tableau 6, du tableau 5
    (De Morgan) et du tableau 5 (distributivité) du PDF d'équivalences ;
  - `quant-001`, `quant-002` correspondent aux négations demandées au devoir 2 #3a, #3c, #3d ;
  - `proof-004`, `proof-005`, `proof-002` correspondent au devoir 2 #6iii, #1f et #5 ;
  - `logic-002` est la définition de réciproque du devoir 2 #6ii.
- **Un seul texte retouché**, sans changement de sens ni de réponse (donc même id) : `logic-010`,
  dont l'`explanation` signale maintenant que le tableau du manuel note les constantes de vérité
  $V$ et $F$.

## Notation du cours : ce que dit le matériel

Relevé complet dans `docs/sources/mat1500.md`. Les trois points qui auraient pu justifier une
réécriture et qui, vérification faite, n'en justifient pas :

- **$\Leftrightarrow$ contre $\equiv$.** L'enseignant écrit $\Leftrightarrow$ au devoir 2, et les
  tableaux français du PDF aussi ; la banque écrit $\equiv$. Mais les tableaux anglais 7 et 8 de
  **la même page** remise aux étudiants écrivent $\equiv$ : les deux notations sont sous les yeux
  de l'étudiant. Rien à changer.
- **$P, Q, R$ contre $p, q, r$.** Les devoirs utilisent les majuscules, les tableaux du manuel les
  minuscules. La banque suit le manuel. Rien à changer.
- **Noms des lois.** Le tableau français nomme identité, domination, idempotence, double négation,
  commutativité, associativité, distributivité et De Morgan ; le devoir 2 #4 demande de nommer
  « De Morgan, négation et distributivité ». **Ni « absorption » ni « exportation » n'y figurent**,
  alors que `logic-011` et `logic-012` s'appuient sur ces deux noms. Les deux questions donnent
  elles-mêmes le nom dans l'énoncé, et le contenu est bien au programme (le devoir 2 #4e est
  l'exportation), donc rien n'est faux ; c'est consigné pour le cas où un corrigé d'examen
  emploierait une autre terminologie.

Un point reste ouvert : `sets-011` note la différence symétrique $A \oplus B$ « notation de
Rosen ». Aucun matériel rapatrié ne porte sur les ensembles, donc **impossible de vérifier**. À
noter que le seul emploi de $\oplus$ dans le matériel est le ou exclusif propositionnel du
devoir 1 #8.

## Piège signalé : le devoir 1 commence par de la théorie des graphes

Les problèmes #1 et #2 du devoir 1 — deux des neuf — demandent de prouver qu'ajouter une arête à
un arbre crée un cycle, puis qu'un arbre à plus d'un sommet a au moins deux feuilles. Or les
graphes sont le **chapitre 7**, « selon le temps restant dans les dernières semaines », et l'intra
porte sur les chapitres 1 à 3.

Lecture retenue : l'enseignant se sert des arbres comme terrain d'exercice de rédaction de preuve
avant d'avoir formalisé la logique — le devoir y redéfinit « degré » et « feuille » au passage,
signe que le chapitre n'a pas été enseigné. C'est pourquoi `mat1500-graphs` reste `exam: 'final'`,
`defaultOn: false` et sans question.

**Mais** le quiz du 17 septembre prend « 1-2 questions directement des deux derniers devoirs » :
ces deux preuves sont donc une matière de quiz possible, et la banque n'a rien dessus. Réviser
MAT1500 dans l'app avant un quiz ne remplace pas la relecture du devoir lui-même. Si l'admin veut
couvrir les quiz (et non seulement l'intra), c'est le premier chantier à ouvrir.

## Écarts sur le matériel lui-même (rien à corriger dans le dépôt)

- **`02 Notes de cours`, `03 Exercices & TP`, `05 Quiz & solutions` et `06 Examens passés` sont
  vides** (sauf le PDF d'équivalences). StudiUM lui-même n'a que trois dossiers : Nouvelles,
  Devoirs, Ressources d'étude. Il n'y a rien de plus à rapatrier pour l'instant.
- **Le dossier StudiUM « Devoirs » ne contient que le corrigé du devoir 1** ; les énoncés des
  devoirs 1 et 2 viennent de Téléchargements (13 septembre). `economist.jpg`, l'image de la
  politique IA, s'est retrouvée dans ce dossier par la même occasion.
- **Le PDF d'équivalences est un scan de deux éditions différentes du manuel** sur une seule page,
  avec des annotations manuscrites qui donnent les deux pages sources. Le tableau français est
  plus court que l'anglais (8 lignes contre 11) : c'est pourquoi l'absorption manque.
- **Politique IA du cours** : l'usage d'outils d'IA est « interdit » pour les évaluations et
  « fortement découragé » pour les devoirs, avec une justification longue de l'enseignant. À
  signaler à l'utilisateur : réviser avec une banque de questions relève de l'entraînement
  personnel, pas de la production d'un travail, mais le cours a une position explicite sur le
  sujet.

## Relecture aveugle des 6 nouvelles questions

`scripts/blind-review.ts`, seed 17, clé écrite dans un fichier séparé (scratchpad, hors dépôt) et
jamais montrée au sous-agent. Sous-agent **Haiku** frais, interdit de lire tout fichier du dépôt —
les énoncés lui ont été passés en clair dans la consigne, choix mélangés, sans `correct`, sans
`why`, sans `explanation`.

**6/6 réponses conformes à la clé** (C, D, B, Faux, B, et une réponse libre équivalente pour la
carte flash), chacune avec un raisonnement correct et une réfutation nommée de chaque distracteur.
Le sous-agent a réfuté `logic-015` avec un contre-exemple différent du mien ($p$ faux, $q$ vrai,
$r$ vrai), qui sépare bien les deux lectures lui aussi. **0 désaccord, 0 ambiguïté signalée, 0
question à deux réponses défendables.**

Une réserve du sous-agent, retenue telle quelle : `logic-015` est « faisable en 45 s si on maîtrise
les priorités d'opérateurs ; autrement il faut une table de vérité (2-3 min) ». La question a été
gardée en difficulté 2 sans statut de Défi, parce que l'`explanation` donne le contre-exemple et
que le point du devoir 2 #5 est justement qu'aucune priorité ne doit être supposée.

## Mesures

- `npm test` : **363 tests verts** (14 fichiers) — inchangé, le gate valide dynamiquement.
  `tsc --noEmit` : OK.
- Gate d'import : `npm run import -- <fichier> --renumber`, 6 questions acceptées (4 qcm, 1 vf,
  1 flash), aucune renumérotation nécessaire.
- Comptes MAT1500 : **96 → 102 questions** (+6). `mat1500-logic` 12→16, `mat1500-proof` 12→13,
  `mat1500-quant` 12→13 ; les 5 autres thèmes intra inchangés à 12.
- Équilibre (`tests/bank-stats.test.ts`) : Défi 14/102 = 13,7 % (borne 5-15 %), qcm 61/102 =
  59,8 % (borne 50-70 %), minimum par thème intra 12 (borne 8). La part de Défi, à 14,6 % avant ce
  lot, repasse sous le plafond avec un peu plus de marge.
- **1 `defaultOn` corrigé, 1 `explanation` retouchée, 0 question retirée, 0 id à retirer.**

## Non lu / non vérifié

- **Aucun calendrier de matière semaine par semaine n'existe** dans le matériel : le seul tableau
  daté est celui des évaluations. Impossible de dire quelle section est couverte quelle semaine.
  Les `defaultOn` reposent entièrement sur la matière des deux devoirs, pas sur un relevé de
  séances. C'est l'écart de méthode le plus net avec MAT1400 et MAT1600, où le calendrier StudiUM
  est daté séance par séance.
- **Les titres de section du manuel** (2.1, 2.3-2.5, 3.1-3.3, 4.6, 5.4-5.5…) ne figurent nulle
  part dans `D:\Math\MAT1500`. Le rattachement fin de `divis`/`modul` au chapitre 2 et de
  `proof`/`induc` au chapitre 3 vient du titre des chapitres et des objectifs d'apprentissage. Si
  la section 2.1 de l'édition française porte sur les **algorithmes**, c'est de la matière d'intra
  sans aucune question dans la banque : à vérifier dès qu'un exemplaire du manuel ou une note de
  cours arrive.
- **Les thèmes `sets`, `func`, `divis`, `modul`, `induc` (60 questions sur 102) n'ont pu être
  confrontés à rien** : aucun devoir, aucune note, aucun corrigé ne touche à ces matières. Leur
  contenu reste celui des relectures Opus (`docs/reviews/relecture-opus/mat1500.md` et
  `mat1500-b.md`), vérifié mathématiquement mais pas contre le cours.
- **Le niveau de difficulté attendu aux évaluations** : sans quiz relu ni ancien examen, rien ne
  permet de calibrer les Défi ni de savoir quelle proportion de l'intra est de la rédaction de
  preuve plutôt que du calcul.
- **La date de l'intra** : la page de structure l'annonce elle-même « à titre indicatif et
  susceptible de modifications », et les consignes demandent de revérifier dans Synchro Académique.
- **Le 7 septembre** (Fête du travail) tombe un lundi, jour de cours : rien ne dit si la séance a
  eu lieu, donc le nombre de séances tenues au 17 septembre (5 ou 6) est incertain. Sans effet sur
  les `defaultOn`, qui ne s'appuient pas sur un compte de séances.
- **Le brouillon des 6 questions n'est pas passé par `agy`**, contrairement à ce que suggérait le
  brief : les PDF étaient lisibles directement (texte intégré pour les devoirs, corrigé manuscrit
  lisible tel quel), et 6 questions à calibrer sur un matériel qu'il fallait avoir lu en entier ne
  se déléguaient pas utilement. Les deux contrôles qui comptent — gate d'import et relecture
  aveugle — ont bien été faits.
