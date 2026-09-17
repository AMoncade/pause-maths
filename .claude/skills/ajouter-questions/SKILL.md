---
name: ajouter-questions
description: Utiliser quand l'utilisateur colle un tableau JSON de nouvelles questions Pause Maths (produit via docs/PROCESSUS_QUESTIONS.md) à importer dans la banque, ou demande d'ajouter/importer des questions.
---

# Ajouter des questions

## Aperçu

L'utilisateur produit des questions ailleurs (un projet claude.ai suivant
`docs/PROCESSUS_QUESTIONS.md`) et colle le JSON obtenu dans la session. Cette skill couvre tout
le trajet de ce JSON jusqu'au dépôt : sauvegarde, import, contrôle qualité complet, commit, push.
**Aucune question n'est committée sans avoir passé le gate en entier** — les tests de format
*et* la relecture aveugle. Un import qui échoue au gate est corrigé ou retiré, jamais poussé tel quel.

## Étapes

1. **Sauvegarder le JSON collé** dans le scratchpad de la session (pas dans le dépôt), ex.
   `<scratchpad>/import-<date>.json`. Le collage peut être entouré d'une clôture ```` ```json ````
   et porter un BOM : ni `npm run import`, ni `blind-review.ts` n'en ont besoin, les deux
   nettoient (`parsePasted`). Terminé quand le fichier existe.

2. **Importer.**
   ```
   npm run import -- <chemin-du-fichier>
   ```
   Tout ou rien : au moindre problème, **rien n'est écrit**, et la commande liste les problèmes
   (une ligne par règle du gate, ex. `[katex] mat1600-diag-901 : ...`). Un succès imprime un
   résumé des comptes routés — il n'y a jamais d'import partiel.
   - **`id-unique`** (id déjà dans la banque — attendu, le modèle qui a écrit le JSON ne voit
     jamais la banque) : relance avec `--renumber` au lieu de corriger les ids à la main :
     ```
     npm run import -- <chemin-du-fichier> --renumber
     ```
     Ça réattribue à chaque question, dans l'ordre du fichier, le prochain numéro libre de son
     thème (au-dessus du plus grand numéro déjà présent, ids retirés jamais réutilisés), et
     l'imprime (ancien id → nouveau) **même si le gate refuse ensuite pour une autre raison**.
     Sans risque : ces ids ne sont pas encore publiés. Ne renumérote jamais à la main.
   - **Toute autre règle** (`schema`, `katex`, `control-char`, `prompt-length`,
     `choice-catchall`, `choice-duplicate`, `challenge-solution`…) : corrige le JSON dans le
     fichier du scratchpad d'après le message, puis réimporte.

3. **Gate — tests de format et build.**
   ```
   npm test
   npm run build
   ```
   Les deux doivent passer sur les fichiers nouvellement routés (règle de `CLAUDE.md` avant tout
   push destiné à `main`). Un échec ici se corrige dans le JSON source puis se réimporte —
   jamais en éditant le fichier de contenu à la main pour faire taire le test.

4. **Gate — relecture aveugle.** Génère le matériel aveugle à partir du **fichier du scratchpad**
   (les questions nouvellement soumises), jamais du fichier fusionné de `src/content` qui
   contient aussi les anciennes questions déjà relues :
   ```
   npx tsx scripts/blind-review.ts <fichier-du-scratchpad> --seed <n> --key <chemin-clé> > <chemin-markdown>
   ```
   Il valide l'entrée, mélange les choix (mulberry32 seedé), retire
   `correct`/`why`/`explanation`/`solution`, et écrit la clé de correspondance (id → lettre
   correcte, id → mapping lettre→index d'origine) dans `--key`, **jamais sur stdout** — ne donne
   cette clé au sous-agent sous aucun prétexte, elle sert uniquement à comparer après coup.
   Choisis un chemin de clé et de markdown dans le scratchpad de session, pas dans le dépôt.

   Donne le Markdown (pas le JSON source) à un sous-agent de relecture. Il doit :
   - choisir une réponse par question, avec son niveau de confiance ;
   - dire pourquoi chacun des autres choix est faux (un simple "bon choix trouvé" ne suffit pas :
     ça ne détecte pas une question à deux réponses correctes) ;
   - vérifier tout résultat calculé avec un script SymPy/scipy dans un venv **hors du dépôt**.

   Compare ensuite son verdict à la clé. Consigne le résultat dans
   `docs/reviews/<cours>/<idDuThème>.md` (créer le fichier s'il n'existe pas). Désaccord si :
   l'agent choisit une lettre dont le mapping ne correspond pas à `correctLetter`, ou il trouve un
   deuxième choix défendable comme correct, ou SymPy contredit un calcul.

5. **Désaccord → troisième agent**, sans lui dire ce que les deux premiers ont conclu, mêmes
   règles qu'à l'étape 4 (nouveau `--seed` pour éviter qu'il reconnaisse le même mélange). Sa
   conclusion tranche : la question est corrigée (nouveau JSON, retour à l'étape 2) ou retirée
   (étape 6).

6. **Retirer une question rejetée.**
   - **Pas encore committée** (rejetée entre l'import et le premier commit) : enlève-la
     directement du fichier routé dans `src/content/<cours>/<thème>.json`, ou corrige-la et
     laisse-la. Ne touche pas à `retired-ids.json` : il est réservé aux ids **déjà publiés**, et
     `npm test` échouerait (`id-retired`) si un id y figurait tout en restant dans `src/content`.
   - **Déjà publiée** (dans une version antérieure de `main`) : c'est un retrait après coup,
     pas un rejet d'import. `retired-ids.json` est un fichier de l'admin (régie) — signale-lui
     l'id à retirer au lieu d'y toucher.

7. **Ajouter une entrée datée en haut de `docs/WORKLOG.md`** (règle de `CLAUDE.md`, avant le
   commit) : ce qui a été importé, ce qui a été corrigé ou retiré à la relecture, le compte final.

8. **Commit.** Liste précisément les chemins touchés (`git diff --cached --name-only` avant de
   committer) : fichiers `src/content/<cours>/*.json` routés, `docs/reviews/**` et
   `docs/WORKLOG.md` mis à jour. `git add <chemins explicites>` un par un — jamais `-A`, jamais
   `.`, jamais `commit -a`.

9. **Push** sur la branche du lot. Un push sur `main` redéploie automatiquement sur Vercel.

10. **Rapport.** Une ligne résumant : combien importées, combien corrigées et pourquoi, combien
    retirées et pourquoi. Si ce lot travaille sous une régie multi-session, ce rapport va à
    l'admin de la régie (`SendMessage`), jamais à l'utilisateur.

## Erreurs fréquentes

| Erreur | Pourquoi c'est un problème |
|---|---|
| Committer avant que `npm test` **et** `npm run build` passent | Le gate existe pour attraper les caractères de contrôle et formules KaTeX cassées — invisibles à l'œil dans le JSON. |
| Sauter la relecture aveugle parce que les tests de format passent | Les tests de format ne vérifient pas qu'une réponse est mathématiquement correcte, ni qu'un seul choix l'est. |
| Relire à l'aveugle le fichier fusionné de `src/content` au lieu du fichier du scratchpad | On relit aussi les anciennes questions déjà passées au gate, pour rien. |
| Donner à l'agent de relecture le champ `correct` ou `explanation`, ou lui montrer la clé `--key` | Ça invalide la relecture : il confirmerait la réponse au lieu de la trouver. |
| Lancer le script SymPy à l'intérieur du dépôt | Le venv de vérification est un outil de session, pas un artefact du projet ; il ne se commite pas. |
| `git add -A` ou `git commit -a` | Risque de committer un fichier hors du périmètre de ce lot. |
| Ajouter à `retired-ids.json` une question qui n'a jamais été publiée | `npm test` échoue (`id-retired`) si l'id reste aussi dans `src/content`. Une question retirée avant son premier commit se supprime simplement du fichier routé. |
| Renumérer les ids en collision à la main | `npm run import -- <fichier> --renumber` le fait automatiquement et sans risque, tant que rien n'est encore publié. |
