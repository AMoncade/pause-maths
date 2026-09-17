# HANDOFF ADMIN — reprendre la régie de Pause Maths sur un autre ordinateur

**Écrit le 2026-09-17 par la session admin (adrie-59, Claude Fable 5.1) à la fin du premier tour de régie ; section 0 ajoutée à la fin du tour 2, le même jour.
État vérifié : `main@fe3e696` + ce commit, `npm test` 363/363, `tsc --noEmit` et `npm run build` propres,
aucun worktree avec du travail non commité, toutes les branches `lot/*` intégrées dans `main`.**

Ce document s'adresse à la **session admin** du prochain tour : celle qui découpe, délègue, intègre et
n'exécute pas elle-même. Les sessions exécutantes lisent `CLAUDE.md`, `docs/WORKLOG.md` et `HANDOFF.md`
(la spécification d'origine, toujours valable pour ce qui n'est pas marqué fait ici).

---

## 0. Tour 2 — 2026-09-17, même poste (lire en premier)

**État vérifié à la fin du tour 2 : `main@a8ab8cb + ce commit`, `npm test` 363/363, `tsc` et `npm run build` propres,
toutes les branches `lot/*` intégrées, `bank-stats` actif sur les 4 cours.** Journal : `docs/regie/deck-journal.jsonl`
(tour 2 à partir de la ligne « Tour 2 ouvert »), attributions : `docs/regie/deck-claims.json`, briefs :
`docs/regie/briefs/tour2-*.md` (chaque brief nomme ce que l'admin n'avait pas vérifié ; trois d'entre eux se sont
révélés faux sur un point, et les sessions l'ont dit au lieu d'exécuter).

### Livré au tour 2

| Lot | Résultat | Vérification |
|---|---|---|
| PWA | **https://pause-maths.vercel.app** — projet Vercel `pause-maths` (équipe am-oncade-s-projects), auto-deploy sur push `main`, Blob store privé `pause-maths-sync` créé en CLI (`vercel blob create-store`, aucun clic dashboard). Bug de prod trouvé et corrigé : Vercel transpile les `.ts` des fonctions sans réécrire les imports sans extension → imports `.js` explicites dans `api/sync.ts` et `src/lib/progress.ts`. `ifMatch` réel = mock. | `curl -sI` sur `/`, `/sw.js`, `/manifest.webmanifest`, `/api/sync` |
| Lot A | Les 4 cours StudiUM dans `D:\Math`, relance = « rien de nouveau » partout (STT1700 46, MAT1400 29, MAT1500 5, MAT1600 134 fichiers). Skill `studium-sync` corrigée et validée en réel (`claude-skills@9caaf57`). | `python studium_sync.py plan` |
| MAT1600 | Vérifié contre StudiUM : 101 → 115 (thème intra « Transformations linéaires » manquant ajouté, 15 questions bases/rang reclassées final → thème `dim`, 15 ids retirés, notation Ker/Im). Intra **16 oct**. | `docs/reviews/mat1600/verification-studium.md` |
| MAT1400 | Vérifié : 96 → 107 (droites paramétriques, différentiabilité, F = f − λg). Intra **26 oct**. | `docs/reviews/mat1400/verification-studium.md` |
| MAT1500 | Vérifié sur le peu de matériel (devoirs 1-2) : 96 → 102. Intra **29 oct**, chap. 1-3. 5 thèmes / 60 questions invérifiables faute de notes. | `docs/reviews/mat1500/verification-studium.md` |
| STT1700 | 0 → 48 questions d'intra (descr 14, prob 17, var 17) en 4 jalons, thèmes dérivés du calendrier StudiUM, relecture Opus unique appliquée. Intra **7 oct** (sections 1-3). | `docs/sources/stt1700.md`, `docs/reviews/relecture-opus/stt1700.md` |

**Règle des ids ACTIVE depuis le premier déploiement** (écrite dans `CLAUDE.md`).

### `defaultOn` STT1700 — règle datée, à appliquer par l'admin
Semaine 1 = 31 août. `stt1700-prob` passe à `true` **le 21 septembre ou après**, `stt1700-var` **le 28 septembre ou
après** (source : `docs/sources/stt1700.md`). C'est un changement d'une ligne dans `src/content/stt1700/index.ts`,
à faire lors du premier push après ces dates.

### Ce qui reste (rien n'est bloqué par une session)

- **Gestes utilisateur** : test de synchro à deux profils de navigateur (HANDOFF §11), installation iPhone,
  réglage Chrome « Téléchargements automatiques → studium.umontreal.ca » (utile pour les prochaines synchros,
  pas bloquant : le repli URL CloudFront signée + `Invoke-WebRequest` marche).
- **D:\Math est curé à la main par l'utilisateur** (renommages, dossiers recomposés, doublons copiés dans
  MAT1400). Décision : la curation fait autorité ; la skill ignore les fichiers renommés (commande `ignore`).
  Le suivi par empreinte est le vrai correctif, non fait. `INDEX.md`/`LIENS.md` de MAT1600 sont périmés par cette
  réorganisation. 15 « Séance N » de MAT1600 ont été remontées dans leurs dossiers de semaine par le lot A.
- **Pièges pour l'utilisateur** (à relayer, pas à coder) : les 5 anciens intras MAT1400 portent sur les séries
  (matière du FINAL en A26) ; le devoir 1 de MAT1500 commence par des arbres (ch. 7, examinable aux quiz de TP, 0
  question) ; MAT1500 interdit l'IA aux évaluations et la décourage aux devoirs.
- **STT1700 après l'intra** : 7 thèmes de final sans question. MAT1600 : quiz-TP 3-11 et séances 6-11 non relus.
- **Blobs de test** restants dans le store (clés aléatoires, privées, négligeables).

### Ce que le tour 2 a appris

- **Jetons** : tour 1 = 1 747 M relus en cache pour 10 sessions ; tour 2 = ~400 M pour le même volume de
  livrables. Ce qui a marché : 2 exécutants à la fois, un thème ou une vérification par contexte, `/clear` entre
  deux, briefs dans le dépôt et messages réduits à un pointeur, un seul rapport par tâche, relecture aveugle par
  sous-agent Haiku, une seule relecture Opus par cours.
- **agy pour les brouillons** : marche si on lui donne les bonnes réponses déjà calculées et qu'on ne lui demande
  que les distracteurs et le JSON (79 s) ; expire en le laissant tout inventer (2 timeouts au jalon 3). Il double
  les backslashs LaTeX et se trompe dans l'arithmétique des distracteurs : tout revérifier en fractions exactes.
- **Le classificateur du mode auto refuse les messages inter-sessions longs** : mettre le brief dans
  `docs/regie/briefs/` et n'envoyer que le chemin. Il refuse aussi `vercel --prod` (l'utilisateur approuve dans le
  terminal de la session concernée ; l'admin ne le fait pas à sa place).
- **Sans `/clear` utilisateur**, une tâche neuve va à une session encore propre ou à un sous-agent engendré par
  l'admin (`Agent`, modèle sonnet) : contexte vide garanti.
- **Mesurer avant d'arbitrer** : la « collision » Downloads était l'utilisateur lui-même ; la « bulle Chrome »
  du tour 1 était un bug de la skill. Les deux se lisaient sur le disque.

---

## 1. Ce qui est fait (et où le vérifier)

| Lot | Livré | Vérification |
|---|---|---|
| Scaffold | Vite 8 + Preact + TS, contrat `src/lib/types.ts`, agrégateur `src/content/{courses,bank}.ts` | `npm run build` |
| Engine | `src/lib/{schema,gate,progress,merge,scheduler}.ts`, `scripts/import-questions.ts` (`--renumber`), gate 14 règles + `tests/fixtures/broken.json` (42 cas, chaque règle prouvée), `tests/bank-stats.test.ts`, `tests/source-hygiene.test.ts` | `npm test` |
| UI | Tous les écrans (`src/components/`, `src/app.tsx`), thème clair/sombre, clavier, bandeaux, mise à jour sans rechargement ; checklist §11 du HANDOFF passée dans Chrome (14 points) | `docs/WORKLOG.md` entrée « checklist §11 » |
| PWA + synchro | `vite.config.ts` (VitePWA prompt), icônes, `src/lib/{pwa,sync}.ts`, `api/sync.ts` sur **Vercel Blob privé** ; 11 points de relecture Opus corrigés (`docs/reviews/code/pwa-sync.md`) | `tests/api/sync.test.ts` (12 tests) |
| Contenu | MAT1400 96 · MAT1500 96 · MAT1600 101 questions d'intra, chacune relue en aveugle (`scripts/blind-review.ts`) puis par 2 à 4 relectures Opus (`docs/reviews/relecture-opus/`), réponses des auteurs dans `docs/reviews/<cours>/` | `npm test` (content + bank-stats) |
| Part D | `docs/PROCESSUS_QUESTIONS.md`, skill projet `.claude/skills/ajouter-questions/`, `scripts/blind-review.ts` ; 21 points de relecture appliqués (`docs/reviews/code/part-d.md`) | exemples du doc passés dans `npm run import` |
| Skill utilisateur | `studium-sync` dans le repo privé `AMoncade/claude-skills` (commit 8b447bf), **validée sur données synthétiques seulement** | `~/.claude/skills/studium-sync/SKILL.md` |
| Régie | Journal de toutes les décisions : `docs/regie/deck-journal.jsonl` (84 lignes) ; attributions : `docs/regie/deck-claims.json` | — |

Écarts assumés par rapport à `HANDOFF.md` (tous journalisés) : `docs/SOURCES.md` → `docs/sources/<cours>.md` ;
`vf` porte `answer: boolean` ; `settings.topics` → `settings.topicOverrides` ; `resetAt` dans `Progress` ;
stockage Vercel Blob au lieu d'Upstash (le gratuit d'Upstash s'archive après 30 j d'inactivité) ;
téléchargements StudiUM par clic d'ancre natif (le fetch in-page est bloqué par CORS/CloudFront) ;
Moodle 4 affiche les tentatives dans `table.quizreviewsummary`.

**Règle des ids suspendue jusqu'au premier déploiement** : tant qu'aucune progression utilisateur n'existe,
un changement de sens peut garder son id. Dès la première mise en production, appliquer HANDOFF §7
(nouvel id + `src/content/retired-ids.json`) et l'écrire dans `CLAUDE.md`.

## 2. Ce qui reste, et pourquoi c'est bloqué

Tout ce qui reste dépend de **deux gestes de l'utilisateur** qui n'ont pas eu lieu sur le premier
ordinateur. Rien d'autre n'est bloqué.

### 2a. Déploiement (bloqué par `vercel login`)

Ni le CLI Vercel ni le connecteur MCP n'étaient authentifiés. À faire par l'utilisateur sur le nouveau
poste : `npx vercel login` (ou connecter le connecteur Vercel de claude.ai). Ensuite, **lot PWA** (Sonnet) :

1. Créer le projet Vercel lié à `AMoncade/pause-maths` (auto-deploy sur `main`).
2. Créer le **Blob store** dans l'onglet Storage du projet — c'est un clic utilisateur ; le lot décrit le chemin exact, l'admin relaie.
3. Déployer `main`, puis `curl -sI` sur l'URL prod, `/sw.js`, `/manifest.webmanifest` : 200 + en-têtes de `vercel.json`.
4. Écrire l'URL prod dans `CLAUDE.md` (fichier admin : l'admin l'écrit).
5. Test de synchro à deux profils de navigateur (HANDOFF §11), puis installation iPhone par l'utilisateur.
6. Vérifier `ifMatch`/`BlobPreconditionFailedError` contre le vrai service (le mock suit la doc, jamais testé en réel).

### 2b. StudiUM → `D:\Math` (bloqué par le réglage Chrome)

Chrome retient les téléchargements multiples. La bulle « Autoriser » expire et l'onglet a été mis en veille
par l'économiseur de mémoire. Réglage permanent à faire par l'utilisateur :
*Paramètres → Confidentialité et sécurité → Paramètres des sites → Téléchargements automatiques →
ajouter `studium.umontreal.ca`*. Puis **lot A** (Opus, seule session autorisée à utiliser Chrome) :

1. Charger la skill `studium-sync` ; elle contient `studium.js` (listing in-page validé sur les 6 sites,
   213 modules) et `studium_sync.py` (plan / ingestion / manifeste / INDEX / LIENS).
2. STT1700 d'abord (intra le **7 octobre**, 45 fichiers), puis MAT1600 (100 + 36 intégrés aux pages),
   MAT1400 (29), MAT1500 (5). Règles de sécurité HANDOFF §6 : jamais « Tenter le test », jamais de H5P,
   tentatives comptées avant/après (elles étaient identiques sur les 27 quiz ouverts).
3. `D:\Math` est **local au premier ordinateur** et ne contient que les copies de Downloads (0 fichier
   StudiUM). Sur le nouveau poste, recréer `D:\Math\{MAT1400,MAT1500,MAT1600,STT1700}` (ou l'équivalent)
   et copier `Downloads` s'il y est. Aucun fichier de cours n'entre jamais dans un dépôt.
4. À la fin : `studium-sync` relancée doit dire « rien de nouveau » ; copier `docs/PROCESSUS_QUESTIONS.md`
   vers `D:\Math\PROCESSUS_QUESTIONS.md`.

### 2c. Après 2b : contenu

- **STT1700** (Sonnet) : thèmes dérivés des PDF (ne pas inventer), `src/content/stt1700/index.ts`,
  jalon 10 puis ~100 questions, même gate + relecture aveugle + relecture Opus. `tests/bank-stats.test.ts`
  n'impose ses proportions qu'à partir de 40 questions intra.
- **MAT1400, MAT1500, MAT1600** (Sonnet, une session chacun) : vérifier thèmes, `defaultOn` et questions
  contre le vrai matériel (sections hebdomadaires StudiUM, TP, quiz) ; corriger ce qui diverge.
- Un Opus relit chaque nouveau lot poussé (méthode : `docs/reviews/relecture-opus/*.md`, section datée,
  SymPy hors dépôt, aucun JSON modifié, l'admin transmet).

## 3. Comment tenir la régie (ce qui a marché)

- **Découpage par fichier, un worktree par lot** : `git worktree add ../pause-maths-wt/<lot> -b lot/<lot> main`.
  Périmètres dans `CLAUDE.md`. Tous les lots de ce tour sont clos : recréer les worktrees seulement pour
  les lots restants (pwa, stt1700, et un par cours MAT pour la vérification).
- **Fichiers admin** : `src/lib/types.ts`, `src/lib/math.ts`, `src/content/{courses,bank}.ts`,
  `src/content/retired-ids.json`, `CLAUDE.md`, `HANDOFF.md`. Une modification de contrat se délègue à une
  seule session avec le patch exact, pour que `main` ne rougisse jamais (voir journal).
- **Intégrer = mesurer** : `git merge` dans un `main` propre, puis `npm test` + `tsc` + build **dans main**,
  puis push. Jamais sur la foi d'un rapport.
- **Interroger git avant les sessions** : plusieurs rapports ont cité des comptes faux (48 annoncé / 42
  mesuré ; 20 annoncé / 8 mesuré). Exiger des comptes mesurés sur `origin`.
- **Opus relit Sonnet** : chaque relecture a trouvé des `why` faux que la relecture aveugle (qui ne vérifie
  que la bonne réponse) ne pouvait pas voir. Une relecture a même corrigé sa propre erreur (vect-005).
- **Une règle de gate qui rougirait `main` se prépare localement et s'active après le nettoyage** (fait
  deux fois : `choice-catchall` élargi, `markdown-outside-solution`).
- **Chrome est une ressource exclusive** : une seule session, onglets propres, jamais ceux des autres.
- **Quota** : une coupure a arrêté 4 sessions en même temps ; à la reprise, mesurer git (rien n'était
  perdu) puis renvoyer à chaque session ce qui restait dans sa file. Le gouverneur du plugin ne voit rien
  sans le pont `~/.claude/deck-quota.json` de la ligne de statut.
- **Mémoire** : la console du plugin `claude-deck` est morte sous pression mémoire ; `node scripts/sessions.js`
  suffit. Le plugin n'est pas nécessaire : `ListAgents` + `SendMessage` + ce journal font la régie.
- **Toute question va à l'admin, jamais à l'utilisateur** ; l'admin ne fait que le scaffold, les fichiers
  admin, les intégrations et les relais.

## 4. Démarrer sur le nouveau poste

```bash
git clone https://github.com/AMoncade/pause-maths.git && cd pause-maths
npm ci && npm test && npm run build          # attendu : 363 tests, build OK
git clone https://github.com/AMoncade/claude-skills.git ~/.claude/skills   # si absent : studium-sync, agy, etc.
```

Puis, en session admin : lire ce fichier, `docs/WORKLOG.md`, `docs/regie/deck-journal.jsonl` (les 10
dernières lignes suffisent), demander à l'utilisateur les deux gestes du §2, ouvrir les sessions
exécutantes (1 Opus pour le lot A, 1 Opus relecteur, 4 Sonnet : pwa, stt1700, puis vérifications MAT),
et repartir des briefs du §2. Chaque brief : périmètre de fichiers, worktree, `git add` explicite
seulement, entrée `docs/WORKLOG.md`, compte rendu mesuré (SHA + comptes) à l'admin.

## 4 bis. Économie de jetons — règles du tour 2 (mesuré, pas deviné)

Mesure du tour 1 avec `node docs/regie/tokens.cjs` (36 h, 10 sessions) : **1,76 milliard de jetons relus
en cache, 6,1 M produits, 5 092 appels**. Répartition : MAT1500 460 M, MAT1600 360 M, UI 228 M,
Engine 204 M, MAT1400 159 M, admin 141 M, lot A 58 M, PWA 54 M, STT1700 41 M. Le coût est dominé par la
**relecture du contexte à chaque appel** (450 k de contexte × 1 000 appels pour une session de contenu),
pas par ce qui est écrit. Conséquences, à appliquer sans exception :

1. **Peu de sessions à la fois : 3 au maximum** (admin comprise). Un lot à la fois par exécutant.
2. **`/clear` après chaque tâche finie.** Une session de contenu écrit UN thème (≈12 questions), passe le
   gate, la relecture aveugle, pousse, rend compte, puis l'utilisateur fait `/clear` dans ce terminal avant
   le thème suivant. Une session ne doit jamais dépasser ~150 k de contexte ; l'admin le vérifie avec
   `tokens.cjs` (colonne `ctx_k_par_appel`) et demande le `/clear`.
3. **Aucun message qui ne change rien** : pas d'accusé de réception, pas de « où en es-tu » tant qu'un
   jalon n'est pas dû, pas de `notify_when_idle` systématique. Un exécutant écrit à l'admin à la fin d'un
   jalon, point. Chaque message reçu coûte à la session tout son contexte.
4. **Une seule relecture Opus par cours, à la fin**, pas une par push (le tour 1 en a fait 3 à 4 par cours).
   La relecture aveugle par question reste, mais par un sous-agent **Haiku** (`model: "haiku"`) avec SymPy,
   pas Sonnet.
5. **Brouillons hors quota Claude** : la rédaction initiale d'un thème peut être confiée à la skill `agy`
   (Gemini, quota Google) à partir de `docs/PROCESSUS_QUESTIONS.md` ; Claude ne fait que le gate, la
   relecture et les corrections. À essayer sur STT1700 et mesurer.
6. **L'admin aussi** : cette session a coûté 141 M pour 527 appels. Démarrer chaque tour dans une session
   admin **neuve** depuis ce fichier, et la `/clear` quand le tour est clos ; ne pas la garder ouverte
   comme tableau de bord.
7. **Mesurer, pas supposer** : `node docs/regie/tokens.cjs 6` toutes les heures de régie ; noter le total
   dans le journal ; si une session dépasse 30 M en cache relu, la faire `/clear`.

## 5. Non vérifié à la fin de ce tour

- Tout ce qui touche Vercel en réel (déploiement, Blob, `ifMatch`, protection des URLs de déploiement).
- iPhone réel : installation, stockage séparé Safari/écran d'accueil, `beforeinstallprompt`.
- Téléchargements StudiUM réels (1 seul PDF de test a transité : `TableLoiNormale.pdf`).
- Que les questions MAT correspondent au calendrier réel du cours (écrites depuis Downloads + descriptions officielles, pas depuis StudiUM).
- Copie de manuel : jamais comparée aux PDF sources (un indice sur MAT1600 vérifié négatif via `agy`).
