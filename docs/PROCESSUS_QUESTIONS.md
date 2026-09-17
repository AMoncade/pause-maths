# Processus d'ajout de questions — Pause Maths

Ce document est fait pour être collé dans un projet claude.ai qui contient déjà toutes les notes
de cours de l'utilisateur. Le modèle qui le lit doit produire, en une seule réponse, un tableau
JSON de questions prêt à être importé dans l'app **Pause Maths**. Rien d'autre n'est demandé au
modèle : pas de code, pas d'explication, pas de plan — seulement le tableau JSON final, conforme
au format ci-dessous.

## But

Pause Maths est une PWA de questions rapides pour réviser MAT1400, MAT1500, MAT1600 et STT1700.
La banque de questions est un ensemble fixe de fichiers JSON dans le dépôt, jamais générée en
direct. Ajouter des questions veut dire : produire ce JSON une fois, ici, à partir des notes de
cours de l'utilisateur, puis le faire importer par une session Claude Code qui applique le
contrôle qualité (tests de format, relecture à l'aveugle, vérification SymPy) avant de le committer.

Le lecteur de ce document ne voit jamais le code de l'app, ni la banque de questions déjà écrite.
Il voit seulement les notes de l'utilisateur et cette spécification.

## Format JSON exact

Chaque question est un objet ; la réponse finale est un tableau `Question[]`. **Le schéma est
strict : aucune clé en dehors de celles listées ci-dessous** (une clé comme `"source"` ou
`"tags"` fait rejeter la question entière). Champs communs à tous les types :

| champ | type | règle |
|---|---|---|
| `id` | string | forme `<idDuThème>-nnn`, ex. `stt1700-ectype-004`. Numérote en commençant à `001` dans chaque thème, **même si tu ne connais pas l'état actuel de la banque** : une collision n'est jamais bloquante pour toi, elle est réglée automatiquement (renumérotation) au moment de l'import. |
| `course` | string | un des 4 codes : `"MAT1400"`, `"MAT1500"`, `"MAT1600"`, `"STT1700"` |
| `topic` | string | l'`id` du thème (voir la liste par cours plus bas) — jamais un id inventé |
| `difficulty` | 1, 2 ou 3 | `3` est réservé aux questions Défi, et une question Défi est **toujours** `3` (jamais 1 ou 2) |
| `type` | string | `"qcm"`, `"vf"` ou `"flash"` |
| `prompt` | string | ≤ 280 caractères **de la source JSON** (commandes LaTeX et `$` comptent, pas le rendu affiché) ; maths en `$…$` (en ligne) ou `$$…$$` (bloc) ; une seule ligne, pas de saut de ligne |
| `explanation` | string | 1 à 3 phrases, une seule ligne, qui nomment le piège classique de la question |
| `challenge` | booléen, optionnel | écris `true`, ou **omets la clé entièrement** — jamais `"challenge": false` |
| `solution` | string, optionnel | **obligatoire si `challenge: true`**, absent sinon ; solution pas à pas en Markdown limité (voir plus bas), étapes séparées par un saut de ligne |

Champs propres à chaque type :

- **`qcm`** : `choices`, un tableau d'**exactement 4** objets `{text, correct, why?}`.
  Exactement un `correct: true`. `why` est le texte montré quand ce mauvais choix précis est
  choisi ; mets-en un pour chaque mauvais choix, jamais pour le bon.
- **`vf`** : `answer`, un booléen (`true` = l'énoncé est vrai). Pas de `choices` : l'app affiche
  toujours "Vrai" puis "Faux" dans cet ordre.
- **`flash`** : `answer` (string, la réponse à révéler) et `keyPoints`, un tableau de **1 à 3**
  phrases courtes. Pas de `choices`.

### `solution` : le sous-ensemble Markdown rendu

L'app rend, dans une `solution` : paragraphes, listes numérotées et à puces, titres `# …`,
`**gras**`, `*italique*`, `` `code` ``, et les formules `$…$` / `$$…$$`. Elle ne rend **pas** :
tableaux, liens, images, citations `>`. Sépare les étapes par un saut de ligne (`\\n` en JSON)
plutôt que de tout numéroter sur une seule ligne.

### Formules : KaTeX n'est pas LaTeX

- Seuls `$…$` et `$$…$$` sont reconnus. `\\( … \\)` et `\\[ … \\]` ne le sont pas et
  s'afficheraient tels quels.
- Les mots en français dans une formule vont dans `\\text{…}` (ex. `$\\text{si } n \\text{ est pair}$`),
  jamais tapés directement — un mot nu dans une formule n'est pas détecté par le contrôle
  automatique et s'affiche mal.
- `aligned`, `pmatrix`, `bmatrix` sont permis, mais seulement en mode bloc (`$$…$$`).
  `align` seul, ou tout environnement placé dans `$…$`, est refusé.
- Pas de `\\newcommand`, pas de paquets, pas de `\\textsc`.
- KaTeX est en mode strict : une lettre accentuée (`é`, `à`…) hors `\\text{…}` à l'intérieur d'une
  formule est refusée, pas seulement un avertissement — encore une raison d'utiliser `\\text{…}`
  pour tout mot français.
- Un dollar littéral (parler d'argent, pas d'une formule) s'écrit `\\$`, jamais un `$` seul.

**Pièges JSON à connaître :**
- Toute commande LaTeX s'écrit avec un **double** backslash : `"\\frac{1}{2}"`, `"\\sigma"`,
  `"\\bar{x}"`, `"\\sqrt{n}"`, `"\\underbrace{...}"`. Un seul backslash casse les choses de deux
  façons différentes selon la lettre qui suit :
  - devant une lettre d'échappement JSON valide (`b`, `f`, `n`, `r`, `t` — donc `"\bar"` contient
    en fait `\b`) : produit un caractère de contrôle invisible, rejeté avec un message clair ;
  - devant toute autre lettre (`\s`, `\l`, `\c`, `\d`, `\e`, `\u` non suivi de 4 chiffres
    hexadécimaux comme dans `\underbrace`, `\uparrow`…) : ce n'est même pas un échappement JSON
    valide, et **tout le collage** devient illisible — pas seulement cette question-là.
- Pas de virgule finale, pas de commentaires : du JSON strict, rien d'autre autour.

## Thèmes par cours

*Section à régénérer depuis `src/content/*/index.ts` à chaque fois que la liste bouge — ne pas
la considérer comme figée. Régénérée le 2026-09-16 (relecture Opus, `docs/reviews/code/part-d.md`).*

**MAT1400 — Calcul 1**

| id | libellé | examen |
|---|---|---|
| `mat1400-vect` | Vecteurs, matrices, droites et plans | intra |
| `mat1400-fonc` | Fonctions de plusieurs variables, limites et continuité | intra |
| `mat1400-quad` | Cylindres et surfaces quadriques | intra |
| `mat1400-grad` | Dérivées directionnelles et gradient | intra |
| `mat1400-part` | Dérivées partielles, plan tangent | intra |
| `mat1400-chain` | Règle de dérivation en chaîne | intra |
| `mat1400-extr` | Valeurs extrêmes et optimisation | intra |
| `mat1400-lagr` | Multiplicateurs de Lagrange | intra |
| `mat1400-dint` | Intégrales doubles, coordonnées polaires | final |
| `mat1400-tint` | Intégrales triples, cylindriques et sphériques | final |
| `mat1400-suit` | Suites et séries numériques | final |
| `mat1400-tayl` | Séries de puissances et séries de Taylor | final |

**MAT1500 — Mathématiques discrètes**

| id | libellé | examen |
|---|---|---|
| `mat1500-logic` | Logique propositionnelle | intra |
| `mat1500-quant` | Quantificateurs et négation | intra |
| `mat1500-sets` | Ensembles | intra |
| `mat1500-func` | Fonctions | intra |
| `mat1500-proof` | Méthodes de preuve | intra |
| `mat1500-induc` | Induction | intra |
| `mat1500-divis` | Divisibilité et nombres premiers | intra |
| `mat1500-modul` | Arithmétique modulaire | intra |
| `mat1500-count` | Dénombrement | final |
| `mat1500-graphs` | Graphes et coloriages | final |

**MAT1600 — Algèbre linéaire**

| id | libellé | examen |
|---|---|---|
| `mat1600-syst` | Systèmes linéaires et Gauss | intra |
| `mat1600-vect` | Équations vectorielles, indépendance | intra |
| `mat1600-matr` | Algèbre des matrices, inverse | intra |
| `mat1600-det` | Déterminants | intra |
| `mat1600-esp` | Espaces vectoriels et bases | intra |
| `mat1600-diag` | Valeurs propres et diagonalisation | final |
| `mat1600-orth` | Orthogonalité | final |

**STT1700 — Introduction à la statistique**
Thèmes pas encore fixés (à dériver du plan de cours une fois lu). Ne jamais inventer un id de
thème STT1700 : demande la liste à jour si elle ne t'a pas été fournie avec ce document.

## Règles de style

- **Rapide de tête** : 15 à 45 secondes de réflexion, sans calculatrice, sauf question Défi.
- **Réécrire, jamais copier.** Ne recopie aucune phrase des notes de cours ou d'un énoncé
  d'examen. Reformule l'idée avec tes propres mots et un exemple différent des chiffres du cours.
- **Mauvais choix = vraie erreur d'étudiant.** Chaque distracteur d'un `qcm` doit correspondre à
  une confusion réelle et classique (mélange de formule, oubli d'une condition, erreur de signe),
  jamais une réponse absurde ou hors sujet. Vérifie toi-même l'arithmétique de chaque `why` :
  le nombre affiché doit être celui que donne réellement le calcul fautif décrit.
- **`explanation` nomme le piège.** Ne décris pas juste le bon calcul : dis pourquoi l'erreur
  qu'un étudiant ferait est tentante.
- **Jamais** "toutes ces réponses" ni "aucune de ces réponses" comme choix.
- **Règles Défi** : `challenge: true` seulement pour les ~10 % de questions plus dures ; elles
  gardent le même format que leur type (4 choix pour un qcm Défi, etc.) mais ajoutent `solution`,
  une résolution pas à pas complète en Markdown, et sont **toujours** `difficulty: 3`.
- Français partout, y compris dans `explanation` et `solution`.

## Neuf exemples (trois par type), dans le format de réponse final

Ces exemples utilisent des numéros d'id volontairement élevés (`-901`, `-902`…) pour ne pas
laisser croire qu'ils commencent la numérotation réelle d'un thème — à l'usage, numérote comme
indiqué plus haut (`001`, `002`…). Ils montrent aussi la forme exacte attendue en sortie : **un
seul tableau**, pas des objets isolés.

```json
[
  {
    "id": "mat1600-diag-901",
    "course": "MAT1600",
    "topic": "mat1600-diag",
    "difficulty": 1,
    "type": "qcm",
    "prompt": "Si $A$ est une matrice $3\\times 3$ avec valeurs propres $2, 2, 5$, quel est $\\det(A)$ ?",
    "explanation": "Le déterminant est le produit des valeurs propres (avec multiplicité), pas leur somme — c'est la trace qu'on additionne.",
    "choices": [
      { "text": "20", "correct": true },
      { "text": "9", "correct": false, "why": "9 est la somme $2+2+5$ : c'est la trace, pas le déterminant." },
      { "text": "10", "correct": false, "why": "Oubli de compter $2$ deux fois (multiplicité algébrique) : $2\\times5$ au lieu de $2\\times2\\times5$." },
      { "text": "0", "correct": false, "why": "Aucune valeur propre n'est nulle, donc $A$ est inversible et $\\det(A)\\neq0$." }
    ]
  },
  {
    "id": "mat1500-divis-901",
    "course": "MAT1500",
    "topic": "mat1500-divis",
    "difficulty": 2,
    "type": "qcm",
    "prompt": "Combien $60$ a-t-il de diviseurs positifs ?",
    "explanation": "On utilise $60=2^2\\cdot3\\cdot5$, puis $(2+1)(1+1)(1+1)=12$ : le piège est d'oublier le « +1 » sur chaque exposant.",
    "choices": [
      { "text": "12", "correct": true },
      { "text": "2", "correct": false, "why": "Utilise les exposants eux-mêmes ($2\\cdot1\\cdot1$) au lieu d'ajouter 1 à chacun avant de multiplier." },
      { "text": "6", "correct": false, "why": "Traite $15=3\\cdot5$ comme un seul facteur premier, donnant $(2+1)(1+1)=6$." },
      { "text": "168", "correct": false, "why": "Calcule la somme des diviseurs (formule $\\prod(1+p+p^2+\\dots)$) au lieu de leur nombre." }
    ]
  },
  {
    "id": "mat1400-lagr-901",
    "course": "MAT1400",
    "topic": "mat1400-lagr",
    "difficulty": 3,
    "type": "qcm",
    "challenge": true,
    "prompt": "Pour maximiser $f(x,y)=xy$ sous la contrainte $x+y=10$, quelle est la valeur maximale de $xy$ ?",
    "explanation": "Le piège classique : s'arrêter au point critique $(x,y)$ ou à $\\lambda$ sans calculer $f$ à ce point, ou perdre le facteur $\\tfrac14$ dans $\\left(\\tfrac{x+y}{2}\\right)^2$.",
    "choices": [
      { "text": "25", "correct": true },
      { "text": "0", "correct": false, "why": "Prend un point admissible non critique, ex. $x=0, y=10$, au lieu de résoudre $\\nabla f=\\lambda\\nabla g$." },
      { "text": "5", "correct": false, "why": "Trouve $x=y=5$ mais s'arrête là : c'est un point critique, pas la valeur de $f$, qui vaut $5\\times5=25$." },
      { "text": "50", "correct": false, "why": "Calcule $10^2/2=50$ au lieu de $10^2/4=25$ (confond $\\left(\\tfrac{x+y}{2}\\right)^2$ avec $\\tfrac{(x+y)^2}{2}$)." }
    ],
    "solution": "1. $\\nabla f = (y, x)$, $\\nabla g = (1, 1)$.\n2. $\\nabla f = \\lambda \\nabla g \\Rightarrow y = \\lambda,\\ x = \\lambda \\Rightarrow x = y$.\n3. Avec $x+y=10$ : $x=y=5$.\n4. $f(5,5) = 5\\times5 = 25$."
  },
  {
    "id": "mat1500-modul-901",
    "course": "MAT1500",
    "topic": "mat1500-modul",
    "difficulty": 2,
    "type": "vf",
    "prompt": "Si $a \\equiv b \\pmod{n}$ et $c \\equiv d \\pmod{n}$, alors $ac \\equiv bd \\pmod{n}$.",
    "explanation": "Vrai : la congruence modulo $n$ est compatible avec la multiplication, contrairement à la division qui exige des conditions supplémentaires (inverse modulaire).",
    "answer": true
  },
  {
    "id": "mat1600-vect-901",
    "course": "MAT1600",
    "topic": "mat1600-vect",
    "difficulty": 1,
    "type": "vf",
    "prompt": "Trois vecteurs de $\\mathbb{R}^2$ forment nécessairement une base de $\\mathbb{R}^2$.",
    "explanation": "Faux : une base de $\\mathbb{R}^2$ a exactement 2 vecteurs indépendants. Trois vecteurs dans $\\mathbb{R}^2$ sont automatiquement dépendants, donc ne forment jamais une base.",
    "answer": false
  },
  {
    "id": "mat1400-part-901",
    "course": "MAT1400",
    "topic": "mat1400-part",
    "difficulty": 2,
    "type": "vf",
    "prompt": "Si $f$ a des dérivées partielles secondes mixtes continues, alors $f_{xy} = f_{yx}$.",
    "explanation": "Vrai (théorème de Clairaut/Schwarz) : le piège est de croire que ça vaut toujours, même sans la continuité des dérivées secondes.",
    "answer": true
  },
  {
    "id": "mat1400-extr-901",
    "course": "MAT1400",
    "topic": "mat1400-extr",
    "difficulty": 1,
    "type": "flash",
    "prompt": "Que donne $\\nabla f$ en un point où $f$ atteint un extremum local (et est différentiable) ?",
    "explanation": "Le gradient s'annule aux extrema locaux d'une fonction différentiable — mais ça n'exclut pas un point-selle.",
    "answer": "$\\nabla f = \\vec{0}$",
    "keyPoints": [
      "Condition nécessaire, pas suffisante : un gradient nul peut aussi être un point-selle.",
      "Il faut que $f$ soit différentiable au point pour que ça s'applique."
    ]
  },
  {
    "id": "mat1500-proof-901",
    "course": "MAT1500",
    "topic": "mat1500-proof",
    "difficulty": 1,
    "type": "flash",
    "prompt": "Que prouve-t-on réellement dans une preuve par contraposée de $p \\Rightarrow q$ ?",
    "explanation": "Le piège est de confondre la contraposée avec la réciproque, qui elle n'est pas équivalente.",
    "answer": "$\\neg q \\Rightarrow \\neg p$",
    "keyPoints": [
      "Logiquement équivalent à $p\\Rightarrow q$, mais souvent plus facile à manipuler.",
      "À ne pas confondre avec la réciproque $q\\Rightarrow p$, qui n'est pas équivalente."
    ]
  },
  {
    "id": "mat1600-esp-901",
    "course": "MAT1600",
    "topic": "mat1600-esp",
    "difficulty": 2,
    "type": "flash",
    "prompt": "Que faut-il vérifier pour qu'un ensemble de vecteurs soit une base d'un espace vectoriel $V$ ?",
    "explanation": "Le piège est de vérifier une seule des deux conditions et de conclure trop vite.",
    "answer": "Qu'il est libre (indépendant) et qu'il engendre $V$.",
    "keyPoints": [
      "Le nombre de vecteurs doit alors égaler $\\dim V$.",
      "Un ensemble libre mais qui n'engendre pas $V$ n'est pas une base : c'est juste indépendant."
    ]
  }
]
```

## Auto-vérification avant de répondre

Avant d'envoyer le tableau JSON final, vérifie pour **chaque** question :

- [ ] Aucune clé en dehors de celles du tableau de format (le schéma est strict).
- [ ] `id` respecte `<idDuThème>-nnn`, et `topic` est un id de la liste ci-dessus (jamais inventé).
- [ ] `course` correspond au cours du thème choisi.
- [ ] `prompt` et `explanation` tiennent sur une seule ligne (pas de saut de ligne) ; `prompt` ≤ 280 caractères de la source JSON.
- [ ] Maths en `$…$`/`$$…$$` seulement (jamais `\\( \\)` ni `\\[ \\]`), mots français dans `\\text{…}`, `aligned`/`pmatrix` seulement en `$$…$$`.
- [ ] Tout backslash de commande LaTeX est doublé (`\\frac`, `\\sigma`, `\\underbrace`…), et tout dollar littéral est `\\$`.
- [ ] `qcm` : exactement 4 `choices`, exactement 1 `correct: true`, chaque mauvais choix a un `why` dont l'arithmétique est juste.
- [ ] `vf` : `answer` est un booléen, pas de `choices`.
- [ ] `flash` : `answer` + 1 à 3 `keyPoints`, pas de `choices`.
- [ ] `challenge` : `true` ou absent, jamais `false` ; `challenge: true` ⇔ `solution` présent ⇔ `difficulty: 3`.
- [ ] Aucun choix "toutes/aucune de ces réponses".
- [ ] Rien n'est copié mot pour mot des notes de cours : tout est reformulé.
- [ ] Chaque mauvais choix correspond à une vraie confusion d'étudiant, pas à une réponse au hasard.
- [ ] `explanation` nomme le piège, pas juste le calcul correct.
- [ ] Le JSON est strictement valide (pas de virgule finale, guillemets doubles partout, un seul tableau).

**Réponds avec un seul tableau JSON, rien d'autre.**
