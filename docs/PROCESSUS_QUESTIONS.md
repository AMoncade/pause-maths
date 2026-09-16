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

Le lecteur de ce document ne voit jamais le code de l'app. Il voit seulement les notes de
l'utilisateur et cette spécification.

## Format JSON exact

Chaque question est un objet ; la réponse finale est un tableau `Question[]`. Champs communs à
tous les types :

| champ | type | règle |
|---|---|---|
| `id` | string | forme `<idDuThème>-nnn`, ex. `stt1700-ectype-004` ; `nnn` sur 3 chiffres, commence à `001` dans chaque thème |
| `course` | string | un des 4 codes : `"MAT1400"`, `"MAT1500"`, `"MAT1600"`, `"STT1700"` |
| `topic` | string | l'`id` du thème (voir la liste par cours plus bas) — jamais un id inventé |
| `difficulty` | 1, 2 ou 3 | surtout 1 et 2 ; 3 seulement pour une question Défi |
| `type` | string | `"qcm"`, `"vf"` ou `"flash"` |
| `prompt` | string | ≤ 280 caractères, maths en `$…$` (en ligne) ou `$$…$$` (bloc) |
| `explanation` | string | 1 à 3 phrases, qui nomment le piège classique de la question |
| `challenge` | booléen, optionnel | présent et `true` seulement pour une question Défi |
| `solution` | string, optionnel | **obligatoire si `challenge: true`**, absent sinon ; solution pas à pas en Markdown |

Champs propres à chaque type :

- **`qcm`** : `choices`, un tableau d'**exactement 4** objets `{text, correct, why?}`.
  Exactement un `correct: true`. `why` est le texte montré quand ce mauvais choix précis est
  choisi ; mets-en un pour chaque mauvais choix, jamais pour le bon.
- **`vf`** : `answer`, un booléen (`true` = l'énoncé est vrai). Pas de `choices` : l'app affiche
  toujours "Vrai" puis "Faux" dans cet ordre.
- **`flash`** : `answer` (string, la réponse à révéler) et `keyPoints`, un tableau de **1 à 3**
  phrases courtes. Pas de `choices`.

**Pièges JSON à connaître :**
- Échapper tout backslash de commande LaTeX : `"\\frac{1}{2}"`, `"\\sigma"`, `"\\bar{x}"`,
  `"\\sqrt{n}"`. Un seul backslash (`"\bar"`) produit un caractère de contrôle invisible dans le
  JSON, que le gate rejette et qui casse l'affichage sans erreur visible.
- Pas de virgule finale, pas de commentaires : du JSON strict, rien d'autre autour.

## Thèmes par cours

*Section à mettre à jour périodiquement — la liste bouge tant que le contenu des 4 cours n'est
pas fini. À jour au 2026-09-16.*

**MAT1400 — Calcul 1**
`mat1400-vect`, `mat1400-fonc`, `mat1400-quad`, `mat1400-part`, `mat1400-chain`, `mat1400-extr`,
`mat1400-lagr`

**MAT1500 — Mathématiques discrètes**
`mat1500-logic`, `mat1500-quant`, `mat1500-sets`, `mat1500-func`, `mat1500-proof`,
`mat1500-induc`, `mat1500-divis`, `mat1500-modul`

**MAT1600 — Algèbre linéaire**
`mat1600-syst`, `mat1600-vect`, `mat1600-matr`, `mat1600-det`, `mat1600-esp`, `mat1600-diag`,
`mat1600-orth`

**STT1700 — Introduction à la statistique**
Thèmes pas encore fixés (à dériver du plan de cours une fois lu). Ne jamais inventer un id de
thème STT1700 : demande la liste à jour si elle ne t'a pas été fournie avec ce document.

## Règles de style

- **Rapide de tête** : 15 à 45 secondes de réflexion, sans calculatrice, sauf question Défi.
- **Réécrire, jamais copier.** Ne recopie aucune phrase des notes de cours ou d'un énoncé
  d'examen. Reformule l'idée avec tes propres mots et un exemple différent des chiffres du cours.
- **Mauvais choix = vraie erreur d'étudiant.** Chaque distracteur d'un `qcm` doit correspondre à
  une confusion réelle et classique (mélange de formule, oubli d'une condition, erreur de signe),
  jamais une réponse absurde ou hors sujet.
- **`explanation` nomme le piège.** Ne décris pas juste le bon calcul : dis pourquoi l'erreur
  qu'un étudiant ferait est tentante.
- **Jamais** "toutes ces réponses" ni "aucune de ces réponses" comme choix.
- **Règles Défi** : `challenge: true` seulement pour les ~10 % de questions plus dures
  (difficulté 3 en général) ; elles gardent le même format que leur type (4 choix pour un qcm
  Défi, etc.) mais ajoutent `solution`, une résolution pas à pas complète en Markdown.
- Français partout, y compris dans `explanation` et `solution`.

## Trois exemples par type

```json
{
  "id": "mat1600-diag-004",
  "course": "MAT1600",
  "topic": "mat1600-diag",
  "difficulty": 1,
  "type": "qcm",
  "prompt": "Si $A$ est une matrice $3\\times 3$ avec valeurs propres $2, 2, 5$, quel est $\\det(A)$ ?",
  "explanation": "Le déterminant est le produit des valeurs propres (avec multiplicité), pas leur somme — c'est la trace qu'on additionne.",
  "choices": [
    { "text": "20", "correct": true },
    { "text": "9", "correct": false, "why": "9 est la somme $2+2+5$ : c'est la trace, pas le déterminant." },
    { "text": "10", "correct": false, "why": "Oubli de compter $2$ deux fois (multiplicité algébrique)." },
    { "text": "0", "correct": false, "why": "Aucune valeur propre n'est nulle, donc $A$ est inversible et $\\det(A) \\neq 0$." }
  ]
}
```

```json
{
  "id": "mat1500-modul-002",
  "course": "MAT1500",
  "topic": "mat1500-modul",
  "difficulty": 2,
  "type": "vf",
  "prompt": "Si $a \\equiv b \\pmod{n}$ et $c \\equiv d \\pmod{n}$, alors $ac \\equiv bd \\pmod{n}$.",
  "explanation": "Vrai : la congruence modulo $n$ est compatible avec la multiplication, contrairement à la division qui exige des conditions supplémentaires (inverse modulaire).",
  "answer": true
}
```

```json
{
  "id": "mat1400-chain-005",
  "course": "MAT1400",
  "topic": "mat1400-chain",
  "difficulty": 1,
  "type": "flash",
  "prompt": "Que donne $\\nabla f$ en un point où $f$ atteint un maximum local (et est différentiable) ?",
  "explanation": "Le gradient s'annule aux extrema locaux d'une fonction différentiable, comme $f'(x)=0$ en une variable — mais ça n'exclut pas un point-selle.",
  "answer": "$\\nabla f = \\vec{0}$",
  "keyPoints": [
    "Condition nécessaire, pas suffisante : un gradient nul peut aussi être un point-selle.",
    "Il faut que $f$ soit différentiable au point pour que ça s'applique."
  ]
}
```

Exemple d'une question Défi (`qcm` avec `solution`) :

```json
{
  "id": "mat1600-det-009",
  "course": "MAT1600",
  "topic": "mat1600-det",
  "difficulty": 3,
  "type": "qcm",
  "challenge": true,
  "prompt": "Pour $A, B$ des matrices $2\\times 2$, si $\\det(A)=3$ et $\\det(B)=4$, que vaut $\\det(2AB^{-1})$ ?",
  "explanation": "Le piège classique : appliquer $\\det(kA)=k\\det(A)$ sans le facteur $k^n$ pour une matrice $n\\times n$, et oublier que $\\det(B^{-1}) = 1/\\det(B)$.",
  "choices": [
    { "text": "3", "correct": true },
    { "text": "1.5", "correct": false, "why": "Oubli du facteur $k^n = 2^2 = 4$ dans $\\det(2AB^{-1}) = 4 \\cdot \\det(A)/\\det(B)$." },
    { "text": "6", "correct": false, "why": "Utilise $\\det(2AB^{-1}) = 2\\det(A)/\\det(B)$ au lieu de $2^2$." },
    { "text": "24", "correct": false, "why": "Multiplie par $\\det(B)$ au lieu de diviser : oubli que c'est $B^{-1}$." }
  ],
  "solution": "1. $\\det(2AB^{-1}) = \\det(2I)\\cdot\\det(A)\\cdot\\det(B^{-1})$ pour des matrices $2\\times2$.\n2. $\\det(2I) = 2^2 = 4$ (facteur $k^n$, pas $k$).\n3. $\\det(B^{-1}) = 1/\\det(B) = 1/4$.\n4. Produit : $4 \\times 3 \\times (1/4) = 3$."
}
```

## Auto-vérification avant de répondre

Avant d'envoyer le tableau JSON final, vérifie pour **chaque** question :

- [ ] `id` respecte `<idDuThème>-nnn`, et `topic` est un id de la liste ci-dessus (jamais inventé).
- [ ] `course` correspond au cours du thème choisi.
- [ ] `prompt` ≤ 280 caractères, maths en `$…$`/`$$…$$` avec les backslashes doublés (`\\frac`, pas `\frac`).
- [ ] `qcm` : exactement 4 `choices`, exactement 1 `correct: true`, chaque mauvais choix a un `why`.
- [ ] `vf` : `answer` est un booléen, pas de `choices`.
- [ ] `flash` : `answer` + 1 à 3 `keyPoints`, pas de `choices`.
- [ ] `challenge: true` ⇔ `solution` présent (jamais l'un sans l'autre).
- [ ] Aucun choix "toutes/aucune de ces réponses".
- [ ] Rien n'est copié mot pour mot des notes de cours : tout est reformulé.
- [ ] Chaque mauvais choix correspond à une vraie confusion d'étudiant, pas à une réponse au hasard.
- [ ] `explanation` nomme le piège, pas juste le calcul correct.
- [ ] Le JSON est strictement valide (pas de virgule finale, guillemets doubles partout).

**Réponds avec un seul tableau JSON, rien d'autre.**
