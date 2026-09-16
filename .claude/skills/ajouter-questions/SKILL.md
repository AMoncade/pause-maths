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
   `<scratchpad>/import-<date>.json`. Terminé quand le fichier existe et parse en JSON valide.

2. **Importer.**
   ```
   npm run import -- <chemin-du-fichier>
   ```
   Si `scripts/import-questions.ts` n'existe pas encore ou que la commande échoue pour une
   raison qui n'est pas un problème du JSON lui-même (le lot Engine n'a pas encore poussé le
   script, ou son contrat a changé), **arrête-toi et écris à l'admin (adrie-59)** — ne devine pas
   le comportement du script. Sinon, lis le résumé imprimé (comptes routés, doublons rejetés, ids
   retirés refusés) : c'est la matière du rapport final.

3. **Gate — tests de format.**
   ```
   npm test
   ```
   Doit passer sans échec sur les fichiers nouvellement routés. Un échec ici (id dupliqué,
   caractère de contrôle, `$` orphelin, formule KaTeX invalide, `challenge` sans `solution`,
   "toutes/aucune de ces réponses") se corrige dans le JSON source puis se réimporte — jamais en
   éditant le fichier de contenu à la main pour faire taire le test.

4. **Gate — relecture aveugle.** Génère le matériel aveugle avec le script du projet, jamais à la
   main :
   ```
   npx tsx scripts/blind-review.ts <fichier-ou-dossier-de-questions> --seed <n> --key <chemin-clé> > <chemin-markdown>
   ```
   Il mélange les choix (mulberry32 seedé), retire `correct`/`why`/`explanation`/`solution`, et
   écrit la clé de correspondance (id → lettre correcte, id → mapping lettre→index d'origine) dans
   `--key`, **jamais sur stdout** — ne donne cette clé au sous-agent sous aucun prétexte, elle sert
   uniquement à comparer après coup. Choisis un chemin de clé et de markdown dans le scratchpad de
   session, pas dans le dépôt.

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
   (id ajouté à `src/content/retired-ids.json` — fichier de l'admin, ne pas y toucher directement ;
   signale-le à l'admin à la place).

6. **Commit.** Liste précisément les chemins touchés (`git diff --cached --name-only` avant de
   committer) : fichiers `src/content/<cours>/*.json` routés, `docs/reviews/**` mis à jour.
   `git add <chemins explicites>` un par un — jamais `-A`, jamais `.`, jamais `commit -a`.

7. **Push** sur la branche du lot. Un push sur `main` redéploie automatiquement sur Vercel.

8. **Rapport.** Une ligne résumant : combien importées, combien corrigées et pourquoi, combien
   retirées et pourquoi. Si ce lot travaille sous une régie multi-session, ce rapport va à
   l'admin de la régie (`SendMessage`), jamais à l'utilisateur.

## Erreurs fréquentes

| Erreur | Pourquoi c'est un problème |
|---|---|
| Committer avant que `npm test` passe | Le gate existe pour attraper les caractères de contrôle et formules KaTeX cassées — invisibles à l'œil dans le JSON. |
| Sauter la relecture aveugle parce que les tests de format passent | Les tests de format ne vérifient pas qu'une réponse est mathématiquement correcte, ni qu'un seul choix l'est. |
| Donner à l'agent de relecture le champ `correct` ou `explanation` | Ça invalide la relecture : il confirmerait la réponse au lieu de la trouver. |
| Lancer le script SymPy à l'intérieur du dépôt | Le venv de vérification est un outil de session, pas un artefact du projet ; il ne se commite pas. |
| Montrer la clé `--key` au sous-agent de relecture, ou la lui décrire | Ça invalide la relecture, comme lui donner `correct` directement. |
| `git add -A` ou `git commit -a` | Risque de committer un fichier hors du périmètre de ce lot. |
| Éditer `retired-ids.json` directement | C'est un fichier de l'admin (régie) ; un retrait passe par lui. |
