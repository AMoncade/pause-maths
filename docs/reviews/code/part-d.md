# Relecture Opus — Part D (processus d'ajout de questions)

Relu le 2026-09-16 par le lot UI (Opus 5), sur `main@3bab630`, sans rien modifier.

**Fichiers relus :**
- `docs/PROCESSUS_QUESTIONS.md`
- `.claude/skills/ajouter-questions/SKILL.md`
- `scripts/blind-review.ts`

**Relus contre :**
- `src/lib/schema.ts`
- `src/lib/gate.ts`
- `scripts/import-questions.ts`
- `src/content/*/index.ts`

**Angle.** Le document est lu par un modèle sur claude.ai, qui ne voit pas le code. Il doit en sortir du JSON qui passe l'import du premier coup.

## Tests réellement lancés

- **Extraction.** Les 4 blocs ```json du document ont été extraits tels quels par script, puis mis dans un tableau, dans un fichier temporaire hors du dépôt.
- **`npm run import -- <fichier>` : refusé, aucun fichier écrit.** Deux problèmes :
  - `[id-unique] mat1500-modul-002` : id déjà dans la banque ;
  - `[id-unique] mat1400-chain-005` : idem.

  `git status src/content` est resté vide.
- **Mêmes exemples, ids libres** (`importQuestions` sur une copie temporaire de `src/content`) : **acceptés** (2 qcm, 1 vf, 1 flash, dont 1 Défi). Aucune erreur de format, KaTeX ou caractère de contrôle dans les exemples.
- **Sondes de règles**, sur la même copie temporaire. Résultats cités dans les points ci-dessous :
  - **refusées :** `challenge: false`, `\n` dans `explanation`, clé inconnue, `align` dans `$…$`, `\textsc`, 4 `keyPoints`, objet seul au lieu d'un tableau, « Aucune de ces réponses », choix en double ;
  - **acceptées :** `why` sur le bon choix, `solution` sans `challenge`, id sans 3 chiffres, **paire de `$` littéraux**.
- **`scripts/blind-review.ts`** :
  - sur les exemples : Markdown et clé corrects ;
  - sur un collage entouré de ```json : échec (voir 14).

## PROCESSUS_QUESTIONS.md

### 1. (Élevée) La numérotation « commence à `001` dans chaque thème » garantit des collisions, et l'import refuse alors tout le lot

**Constat.** Le modèle ne voit pas la banque. Sur un thème qui a déjà des questions, il repart à `001` et entre en collision avec l'existant. Or `import-questions.ts` est tout ou rien : un seul `id-unique` suffit pour qu'aucun fichier ne soit écrit. C'est vérifié : les exemples du document eux-mêmes sont refusés pour cette raison.

**À faire.** Deux options :
- donner dans le document le **prochain numéro libre par thème**, généré depuis `src/content` au moment de la mise à jour ;
- ou dire au modèle de numéroter librement, et faire renuméroter les collisions par la skill avant l'import. C'est sûr tant que la question n'est pas publiée (voir 15).

### 2. (Élevée) La liste des thèmes est périmée et ne donne que des ids, sans libellés

**Écart avec `src/content/*/index.ts` :**
- MAT1400 : il manque `mat1400-grad`, `mat1400-dint`, `mat1400-tint`, `mat1400-suit`, `mat1400-tayl` ;
- MAT1500 : il manque `mat1500-count`, `mat1500-graphs` ;
- MAT1600 : à jour ;
- STT1700 : toujours vide (cohérent avec le document).

**Libellés absents.** Sans libellé, le modèle doit deviner ce que couvre `mat1400-fonc` ou `mat1400-chain`. L'exemple flash le montre : une question sur « ∇f nul en un extremum » est rangée dans `mat1400-chain`, alors qu'elle relève de `mat1400-extr` (ou `mat1400-grad`).

**À faire.** Un tableau `id | libellé | intra/final` par cours, généré depuis `src/content/*/index.ts`.

### 3. (Élevée) Exemple Défi `mat1600-det-009` : deux `why` sont faux en arithmétique

Données de l'exemple : det(A) = 3, det(B) = 4, 2×2. La bonne réponse est 3.

| Choix | Ce que dit le `why` | Ce que donne ce calcul | Vraie erreur derrière le choix |
|---|---|---|---|
| 6 | `2·det(A)/det(B)` | 2·3/4 = 1,5 (c'est le choix « 1.5 ») | 2·3 : k sorti une seule fois et B oublié |
| 24 | multiplier par det(B) au lieu de diviser | 4·3·4 = 48 | 2·3·4 : k une seule fois et multiplication par det(B) |

Ces exemples servent de gabarit au modèle : l'erreur se recopiera.

**À faire.** Corriger les deux `why`.

### 4. (Moyenne) Le dollar littéral n'est pas mentionné, et une paire de `$` passe le gate

**Constat.**
- **Un seul `$`** hors formule : refusé (`stray-dollar`).
- **Une paire** (« 5 $ et 3 $ ») : lue comme une formule `$ et un thé 3 $`. KaTeX la compile en mode non strict (simple avertissement « Accented Unicode text character used in math mode ») et **l'import l'accepte**. L'app affiche alors du texte en italique mathématique.

**À faire.**
- Dans le document : « dollar littéral : `\\$` en JSON ».
- Pour le lot Engine : `strict: 'error'` dans le rendu KaTeX du gate, ou un refus des lettres accentuées en mode math.

### 5. (Moyenne) Les retours à la ligne ne sont permis que dans `solution`, et le document n'en dit rien

**Constat.**
- Le gate refuse U+000A partout, sauf dans `solution` hors formule.
- L'exemple Défi utilise `\n` dans `solution`, ce qui invite à en mettre ailleurs.
- Vérifié : `"Première phrase.\nDeuxième phrase."` dans `explanation` est refusé (`control-char`).

**À faire.** Dans le tableau des champs : « une seule ligne, sauf `solution` (étapes séparées par `\n`) ».

### 6. (Moyenne) KaTeX n'est pas LaTeX, et le document ne le dit pas

**Refusé par le gate (`katex`), vérifié :**
- `\textsc{…}` ;
- `\begin{align}` dans `$…$` (seulement en mode display).

**Non détecté par le gate :**
- des mots français tapés directement dans une formule, au lieu de `\text{…}` : rendu dégradé ;
- les délimiteurs `\( … \)` et `\[ … \]` : l'app ne reconnaît que `$…$` et `$$…$$`, ils s'afficheraient tels quels.

**À faire.** Un paragraphe « KaTeX » :
- seulement `$…$` / `$$…$$` ;
- `\text{…}` pour les mots ;
- `aligned` / `pmatrix` dans `$$…$$` ;
- pas de `\newcommand` ni de paquets.

### 7. (Moyenne) Le schéma est strict, et le document ne le dit pas

**Vérifié :**
- toute clé inconnue est refusée (ex. `"source"`, `"tags"`) ;
- `"challenge": false` est refusé (seul `true` est admis, ou l'absence de la clé).

Le document dit seulement « booléen, optionnel ».

**À faire.**
- « aucun autre champ que ceux listés » ;
- « `challenge` : écrire `true` ou omettre la clé, jamais `false` ».

### 8. (Moyenne) Le Markdown de `solution` n'est pas précisé

**Ce que l'app rend :**
- paragraphes ;
- listes numérotées et à puces ;
- `# titres` ;
- `**gras**`, `*italique*`, `` `code` `` ;
- formules `$`/`$$`.

**Ce qu'elle ne rend pas :** tableaux, liens, images, citations.

Une solution sur une seule ligne « 1. … 2. … » est aussi découpée en étapes, mais `\n` entre les étapes reste plus sûr.

**À faire.** Nommer ce sous-ensemble.

### 9. (Basse) Les exemples ne correspondent pas à la spécification

- **Un exemple par type**, plus un Défi, au lieu de **trois par type** (titre de la section et HANDOFF §9).
- **Numéros incohérents.** Les ids d'exemple (`-004`, `-002`, `-005`, `-009`) contredisent la règle « commence à `001` ».
  - `mat1600-diag` n'a encore aucune question ;
  - deux ids existent déjà dans la banque (voir 1).
- **Objets isolés.** Les exemples ne sont pas montrés dans le tableau final `[ {…}, {…} ]`. Un objet seul est refusé par l'import (vérifié).

### 10. (Basse) Le document se contredit sur la difficulté

- Tableau des champs : « 3 seulement pour une question Défi ».
- Règles Défi : « difficulté 3 en général ».

**À faire.** Garder une seule règle.

### 11. (Basse) Le piège du backslash est incomplet

**Ce que dit le document.** Un backslash unique « produit un caractère de contrôle ».

**Ce qui se passe vraiment :**
- `\b`, `\f`, `\n`, `\r`, `\t` deviennent des caractères de contrôle : refus `control-char`, avec un message utile ;
- `\s`, `\l`, `\m`, `\p`, `\c`, `\d`, `\e`, `\g`… rendent **tout le collage** illisible (`JSON.parse`) ;
- `\u…` (ex. `\underbrace`, `\uparrow`) donne « Bad Unicode escape ».

**À faire.** Le dire, pour que l'auteur sache qu'une seule erreur bloque tout.

### 12. (Basse) Ce que compte la limite de 280 caractères n'est pas précisé

La limite porte sur la **source**, commandes LaTeX et `$` compris (`prompt.length`), pas sur le texte affiché.

### 13. (Info) Le document est plus strict que le gate, sans conséquence

Tolérés par le gate (vérifié) :
- `why` sur le bon choix ;
- `solution` sans `challenge` ;
- id sans 3 chiffres.

Le document les interdit, ce qui ne pose pas de problème. Mais la case « chaque mauvais choix a un `why` » n'est pas vérifiée automatiquement : seule la relecture l'attrape.

## SKILL.md (ajouter-questions)

### 14. (Moyenne) Étape 4 : mauvaise entrée pour `blind-review.ts`, et collage entouré de ```json

**Mauvaise entrée.** La commande prend `<fichier-ou-dossier-de-questions>` sans préciser lequel. Après l'import, `src/content/<cours>/<thème>.json` contient l'ancien et le nouveau : on relirait à l'aveugle des questions déjà revues. L'entrée doit être **le fichier du scratchpad** (nouvelles questions seulement).

**Clôture Markdown.**
- `import-questions.ts` accepte un collage entouré de ```json (`parsePasted`) ;
- `blind-review.ts` fait un simple `JSON.parse`, donc **échoue** sur ce même fichier (vérifié) ;
- or un modèle claude.ai entoure souvent sa réponse d'une clôture.

**À faire.**
- À l'étape 1, enregistrer le JSON déjà nettoyé ;
- ou faire utiliser `parsePasted` par `blind-review.ts` (voir 18).

### 15. (Moyenne) Étape 2 : l'import est tout ou rien, et la skill ne dit pas quoi faire d'un refus

**À ajouter :**
- `id-unique` : renuméroter les ids en collision dans le fichier du scratchpad, puis réimporter. C'est sans risque, puisque ces ids ne sont pas encore publiés.
- Autre règle : corriger le JSON, puis réimporter.

**À retirer :**
- « si `scripts/import-questions.ts` n'existe pas encore » : il existe ;
- « doublons rejetés, ids retirés refusés » dans le résumé : un refus liste les problèmes sans rien écrire, un succès imprime le résumé. Il n'y a jamais d'import partiel.

### 16. (Moyenne) Étape 5 : « retirer » une question pas encore committée

**Problème.** `retired-ids.json` sert aux ids **déjà publiés**. Une question refusée à la relecture avant son premier commit doit simplement être enlevée du fichier routé, ou réimportée sans elle. Et si son id finissait dans `retired-ids.json` alors que la question est encore dans `src/content`, `npm test` échouerait (`id-retired`).

**À faire.** Distinguer les deux cas.

### 17. (Basse) Étapes 6 et 7 : deux règles de `CLAUDE.md` absentes

Ni l'entrée datée dans `docs/WORKLOG.md`, ni `npm run build` avant un push destiné à `main` ne sont mentionnés.

## scripts/blind-review.ts

### 18. (Basse) Le JSON d'entrée est lu sans `parsePasted`

`scripts/import-questions.ts` exporte déjà `parsePasted` (BOM et clôture Markdown). L'importer ici règle 14 sans toucher à la skill.

### 19. (Basse) `mulberry32` est recopié

`src/lib/scheduler.ts` l'exporte déjà : l'importer évite deux implémentations. Elles donnent aujourd'hui la même suite, pas un bug.

### 20. (Basse) Le Markdown ne donne ni le cours ni le thème

Le relecteur perd le contexte de notation propre au cours. Suggestion : une ligne `MAT1600 · mat1600-det` sous chaque titre.

### 21. (Info, vérifié correct)

Sur les exemples (`--seed 3`) :
- la clé n'est jamais écrite sur stdout ;
- `correct`, `why`, `explanation` et `solution` sont absents du Markdown ;
- le mélange est déterministe ;
- la correspondance lettre → index d'origine est juste (`mat1600-diag-950` : lettre C = index 0 = « 20 », la bonne réponse) ;
- l'entrée est validée par `QuestionFileSchema`, avec un message clair.
