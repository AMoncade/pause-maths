# WORKLOG — Pause Maths

Une entrée datée par tâche finie. La plus récente en haut. Chaque lot ajoute la sienne dans son worktree ; l'admin fusionne.

## 2026-09-16 — Lot UI : checklist §11 « App in Chrome » (lot/ui)

- Faite dans un onglet dédié (nouvelle fenêtre, localhost seulement), sur `vite preview` du build de main@394e8a7 (146 questions réelles), 390 px (iframe) puis pleine largeur. Aucun autre onglet touché ; onglet fermé à la fin.
- **OK** : choix des cours (depuis Tout, un cours seul ; 9 réponses toutes MAT1600) ; bonne et mauvaise réponse avec `why` et explication ; Rafale → bilan → Encore 5 ; Sans fin (7 questions sans doublon, flamme de combo, redémarrage après épuisement) ; À revoir = exactement les 2 ratées puis « Tout est revu ! » ; décocher des thèmes les retire (12 réponses, un seul thème) ; Défi éteint = aucune question Défi sur 12, allumé = badge + « Voir la solution » (Markdown + KaTeX, défilement dans la feuille) ; carte flash (clic et Espace) ; rechargement : 26 cartes, Défi, thèmes, série, XP conservés ; raccourcis au vrai clavier : 3, Entrée, Espace, 2, F, Entrée (bilan puis Encore 5), Échap.
- **PWA** : manifest lié et valide (id, scope, start_url, display standalone, lang fr-CA, icônes 192/512/maskable en 200) ; service worker `activated`, contrôle la page ; précache 31 URL uniques (37 entrées, doublons icônes/manifest côté config) dont index.html et les 21 woff2 ; `beforeinstallprompt` reçu → bouton « Installer » affiché (non cliqué). Hors ligne : serveur arrêté puis rechargement → l'app, ses polices et les formules KaTeX se chargent depuis le cache, `fetch` vers le serveur échoue.
- **Corrigé** : en-tête de carte (Signaler seul sur une 2e ligne avec un thème long) ; boutons Vrai/Faux et auto-évaluation poussés en bas aussi sur desktop ; retour à la ligne entre « ( » et une formule. Vérifié par captures Edge headless, tests ajoutés.
- **Non fait / limites** : le panneau DevTools lui-même n'est pas pilotable par l'extension — manifest, SW et cache vérifiés par script dans la page, et « hors ligne » simulé en arrêtant le serveur au lieu du mode offline de DevTools. Fenêtre passée en arrière-plan en cours de route : captures Chrome impossibles ensuite, vérifications par script.

## 2026-09-16 — MAT1400 Jalon 2 complet : 96 questions, 8 thèmes intra (lot mat1400)

- Les 8 thèmes intra (vect, fonc, quad, grad, part, chain, extr, lagr) sont à 12 questions
  chacun, 96 au total : 59 qcm / 21 vf / 16 flash (61/22/17 %), 8 Défi (8,3 %) avec solution
  pas-à-pas.
- Relecture aveugle systématique via `scripts/blind-review.ts` (choix mélangés, sans flag
  correct) + sous-agent + vérification SymPy dans un venv scratch : les 96 questions confirmées
  contre leur clé, zéro désaccord sur l'ensemble du lot.
- Relecture pédagogique Opus (`docs/reviews/relecture-opus/mat1400.md`, sur les 48 premières
  questions) : tous les points appliqués (1 élevée : `why` faux de vect-007 ; 3 moyennes :
  grad-008, chain-002, absence de Défi ; 16 basses). Détail dans
  `docs/reviews/mat1400/reponse-relecture-opus.md`. Aucun rejet.
- `npm test` : 315 tests verts après rebase sur main (autres lots inclus).
- Suite possible : garder ~12/thème comme référence si de nouveaux thèmes post-intra
  (ch. 6-7, 1-2) sont ouverts avant le final ; `D:\Math\MAT1400` toujours vide au moment de
  cette entrée (lot StudiUM en attente), contenu tiré de `Downloads`.

## 2026-09-16 — Lot UI : écrans, composants, thème ludique, KaTeX (lot/ui)

- **Écrans** (`src/components/`) : Home (tuiles de cours multi-sélection avec niveau et barre d'XP, « Tout », commutateur Défi, série, Rafale / Sans fin / À revoir avec compteur), QuestionCard (qcm mélangé via `order`, vf toujours Vrai puis Faux), FlashCard (révéler, puis Pas su / Je savais, hors combo), Feedback (feuille qui monte : bonne réponse, `why` du choix tapé, explication, « Voir la solution »), Solution (Markdown simple + formules), Recap (score, points aux couleurs des cours, combo max, XP gagné, passages de niveau, cartes à revoir, Encore 5, confettis si parfaite), Settings (thèmes via `isTopicOn`/`setTopic`, synchro avec `checkSyncCode`, réinitialisation via `resetProgress` en deux temps), Stats (série, XP, vues, maîtrise par thème, signalements copiables, version de la banque), écran vide (banque vide / sélection vide / rien à revoir), bandeaux installation, récupération et échec d'écriture.
- **Logique pure testée** : `ui-game.ts` (manche, combo, fin « done »/« quit » ; `session` = un seul objet muté, contrat Engine), `ui-keys.ts` (1–4, V/F, Espace, 1/2 sur carte flash révélée, Entrée, Échap ; rien quand un champ ou un bouton a le focus), `ui-select.ts`, `ui-markdown.ts` (formules protégées ; solution d'une seule ligne « 1. … 2. … » découpée si les numéros se suivent), `ui-env.ts` (standalone, iOS, vibrate, reduced motion, theme-color suivant le thème).
- **app.tsx** : sauvegarde après chaque changement + bandeau persistant si échec ; synchro au démarrage, fin de manche, retour au premier plan, retour en ligne (relancée si une réponse arrive pendant l'aller-retour) ; mise à jour appliquée sur Home, ou au bouton « Encore » du Recap avec reprise du mode via sessionStorage. `main.tsx` appelle `initPwa()`.
- **Look** : jetons CSS clair/sombre, dérivés `color-mix` par cours (`.tint`), boutons à rebord qui s'enfoncent, Baloo 2 + Figtree auto-hébergées (latin, OFL, `src/styles/fonts/`), icônes SVG dessinées, logo « pause » aux quatre couleurs. Ressort / secousse / feuille / flamme / confettis seulement sous `prefers-reduced-motion: no-preference`.
- **Revue de design** (agent impeccable-finish-reviewer, sur 17 captures) → corrigé : titres de cours sur 2 lignes, XP par cours sur les tuiles, boutons Pas su / Je savais et tuiles Vrai/Faux (plus grandes) dans la zone du pouce, « Déjà vues » dans Stats, bandeau de niveau à rebord. Vérifié ensuite par captures : flamme de combo en jeu, confettis aux couleurs des cours joués.
- **Vérifié** : `npm run typecheck`, `npm test` et `npm run build` verts ; 59 tests dans `tests/ui/` (logique, composants, parcours App en jsdom avec `pwa.ts` et `syncNow`/`checkSyncCode` simulés). Rendu contrôlé en Edge headless (pas Chrome) sur le serveur dev via un harnais jetable non commité, 390 px et 1280 px, clair et sombre.
- **Pas vérifié** : checklist §11 « App in Chrome » (Chrome réservé au lot A) ; comportement réel sur iPhone (safe areas, installation, vibrate absent) ; synchro contre le vrai `api/sync`.

## 2026-09-16 — MAT1600 : calibration des 40 questions (lot mat1600)

- Vérification de la distribution sur les 5 thèmes intra (40 questions) : 57.5 % qcm /
  25 % vf / 17.5 % flash (cible ~60/20/20, écart mineur acceptable) ; difficulté 20×1 /
  20×2 / 0×3 (bien "surtout 1-2") ; 6 Défis / 40 = 15 % (cible ~10 %, légèrement au-dessus
  mais pas de correction jugée nécessaire). Aucun changement fait suite à cette
  vérification.
- En attente de la réponse de l'admin sur la portée du jalon 2 (40 vs ~100 questions,
  cf. entrée précédente) avant de continuer.
## 2026-09-16 — Lot PWA : corrections de la relecture Engine (api/sync.ts, src/lib/sync.ts)

11 points relevés par le lot Engine sur `main@2c50626`. 1 à 9 corrigés, 10 documenté, 11 (OK) sans action.

- **1 (élevée), CAS concurrentielle.** `get(..., { useCache: false })` (plus de lecture CDN périmée) ; `put()` conditionnel sur `ifMatch` (etag lu) ou `allowOverwrite: false` si rien n'existait. Sur `BlobPreconditionFailedError` : relit l'état réel et refusionne, jusqu'à 3 tentatives ; épuisées → 409 « Synchro concurrente, réessaie ». `writeWithRetry()` dans `api/sync.ts`.
- **2 (élevée), fuite de `syncCode`.** Retiré du corps avant fusion, avant stockage et avant toute réponse (`withoutSyncCode`), des deux côtés. Le client renvoie son propre code sur le résultat final (`{...merged, syncCode}`), jamais celui du serveur (qui n'en a plus).
- **3 (moyenne), blob illisible.** `readStoredProgress` distingue désormais absent / ok / illisible (JSON invalide ou rejeté par `ProgressSchema` après `migrate()`). GET illisible → 422 explicite (plus de faux 404 « code inexistant »). PUT sur un blob illisible : copie du brut dans `sync/<clé>.backup-<horodatage>.json` avant toute réécriture (rien n'est perdu en silence), écrasé ensuite avec l'etag lu.
- **4 (moyenne), rate limit incomplet.** GET est désormais limité aussi (pas seulement PUT), par IP en plus de la clé (`x-forwarded-for`/`x-real-ip`) ; création de clé (blob absent) plafonnée à 5/h/IP pour ne pas pouvoir cribler le quota gratuit ; les `Map` de compteurs sont purgées au-delà de 1000 entrées.
- **5 (moyenne), clé en query string.** Passe désormais en en-tête `X-Sync-Key`, des deux côtés. `Cache-Control: no-store` sur toutes les réponses de `api/sync.ts`.
- **6 (moyenne), pas de délai réseau.** `AbortSignal.timeout(10_000)` sur les 3 `fetch` du client ; message dédié « Réseau trop lent » sur timeout, distinct de « Hors ligne ».
- **7 (basse), messages d'erreur.** Messages spécifiques par code (502/400/409/413/429) des deux côtés ; `getRes.json()` qui échoue → « Réponse du serveur illisible » (plus confondu avec Hors ligne) ; un GET 200 refusé par `ProgressSchema` côté client interrompt la synchro avec « Version de l'app périmée » au lieu de fusionner en silence puis d'écraser le serveur.
- **8 (basse), réponse du PUT ignorée.** Le client valide `putRes.json()` avec `ProgressSchema` et renvoie `merge(merged, serveur)` ; si la réponse est mal formée, il garde `merged` (l'écriture a déjà réussi côté serveur, seule la relecture a échoué).
- **9 (basse), taille du fusionné non vérifiée.** `writeWithRetry` mesure `JSON.stringify(merged)` avant chaque tentative d'écriture ; trop gros → 413 sans écrire.
- **10 (info), documenté.** `Content-Length` absent/invalide → `Number()` vaut 0/NaN et ne rejette rien à cette étape ; la mesure réelle du corps parsé juste après est le filet qui compte (commentaire ajouté dans le code).
- **11 : rien à faire** (code de synchro sans biais, normalisation correcte, pas de `runtimeCaching` sur `/api/sync`, imports serveur sans DOM, `resetAt` pris en compte par `merge()`).
- Tests obligatoires ajoutés dans `tests/api/sync.test.ts` (mock `@vercel/blob` étendu : etag par écriture, `ifMatch`/`allowOverwrite` conditionnels, file `__getQueue` pour scripter une lecture périmée) : deux PUT entrelacés convergent sans perte après un conflit détecté et une nouvelle tentative ; `syncCode` jamais stocké ni renvoyé (corps de réponse et texte brut du blob vérifiés) ; un blob illisible n'est jamais réécrit sans sauvegarde préalable, et le GET correspondant renvoie 422 plutôt qu'un faux 404. 12 tests dans ce fichier, 256 au total. `npm run typecheck` et `npm run build` : OK.
- **Non vérifiable sans Vercel :** le comportement réel d'`ifMatch`/`BlobPreconditionFailedError` face au vrai service (le mock reproduit le contrat documenté, pas testé contre l'API réelle) ; le rate limit par IP en présence de plusieurs instances serverless simultanées (best-effort par construction, documenté) ; `curl` en production.

## 2026-09-16 — Lot PWA : branchement sur merge.ts et ProgressSchema

- `src/lib/sync.ts` et `api/sync.ts` : `tempMerge` retiré des deux côtés, remplacé par `import { merge } from '@/lib/merge'` (client) / `'../src/lib/merge'` (serveur).
- Validation du JSON reçu (GET distant côté client, corps du PUT côté serveur) : `isProgress` (duck-typing) retiré, remplacé par `ProgressSchema.safeParse` de `src/lib/schema.ts` des deux côtés — pas seulement le PUT server comme demandé, le même risque existait côté client sur la réponse GET, corrigé par cohérence.
- `npm run typecheck`, `npm test` (234 tests), `npm run build` : verts après le rebase sur main@d546614.
## 2026-09-16 — MAT1600 jalon 2, syst/vect/matr complétés à 8 (lot mat1600)

- `syst` (+4), `vect` (+4), `matr` (+6) : les 5 thèmes intra (`syst`, `vect`, `matr`,
  `det`, `esp`) sont maintenant à 8 questions chacun, 40 au total.
- `syst` : système homogène non trivial, système sur-déterminé mais compatible,
  position de pivot, forme vectorielle paramétrique (Défi).
- `vect` : résoudre $c_1v_1+c_2v_2=b$, famille libre de taille = dimension ⇒ engendre,
  indépendance de 3 vecteurs par élimination (Défi, $v_3=v_1-v_2$) plutôt que
  proportionnalité deux à deux.
- `matr` : dimensions du produit, non-commutativité $AB\ne BA$, $(AB)^{-1}=B^{-1}A^{-1}$
  (miroir du piège $(AB)^T=B^TA^T$ déjà fait), $(kA)^{-1}=\tfrac1kA^{-1}$ (pas $kA^{-1}$),
  matrice identité, vérifier une inverse par multiplication directe (Défi).
- Gate `npm test` vert à chaque étape. Relecture aveugle (`scripts/blind-review.ts`) +
  SymPy (venv hors dépôt) pour chaque lot de 4-6 questions : 0 désaccord partout.
  Journaux mis à jour dans `docs/reviews/mat1600/{mat1600-syst,mat1600-vect,mat1600-matr}.md`.
- Total jalon 2 à date : 40 questions (8×5 thèmes intra), toutes relues et gate verte.
- Question posée à l'admin : le brief visait « ~100 » mais avec seulement 5 thèmes
  intra pour MAT1600 (et les 2 thèmes finaux volontairement sans questions), 8/thème
  donne 40, pas 100 — comme pour les autres cours, je considère 40 (~8/thème) comme le
  livrable de ce jalon 2, et j'attends une confirmation avant de pousser au-delà (plus
  de questions par thème, ou ouvrir `diag`/`orth` malgré le HANDOFF qui dit de les
  laisser vides avant l'intra).

## 2026-09-16 — MAT1600 jalon 2, thème esp (lot mat1600)

- `src/content/mat1600/mat1600-esp.json` : 8 questions (5 qcm / 2 vf / 1 flash, 1 Défi)
  sur sous-espaces, base/dimension, théorème du rang, base de Col(A) vs Nul(A).
  Distracteurs : contenance du vecteur nul oubliée, ensemble générateur pris pour une
  base, colonnes de la forme échelonnée confondues avec celles de $A$ originale,
  variable pivot confondue avec variable libre dans le calcul du noyau.
- Gate `npm test` : 0 erreur. Relecture aveugle (`scripts/blind-review.ts`, seed 7) par
  un sous-agent frais + SymPy (venv hors dépôt) : 8/8 confirmées, 0 désaccord. Journal
  dans `docs/reviews/mat1600/mat1600-esp.md`.
- `syst` et `vect` complétés à 8 questions chacun (top-up de jalon 1) : homogène non
  trivial, système sur-déterminé mais compatible, position de pivot, forme vectorielle
  paramétrique (syst) ; résoudre pour les coefficients $c_1,c_2$, famille libre de taille
  = dimension ⇒ engendre, indépendance de 3 vecteurs par élimination plutôt que
  proportionnalité deux à deux (vect). En cours de relecture aveugle.
- Suite : compléter `matr` à ~8 (actuellement 2), puis considérer `diag`/`orth` (final,
  hors intra) si le temps le permet.

## 2026-09-16 — MAT1600 jalon 2, thème det (lot mat1600)

- `src/content/mat1600/mat1600-det.json` : 8 questions (5 qcm / 2 vf / 1 flash, 1 Défi).
  Distracteurs sourcés des PDF `3.3`-`3.6` de Downloads (cf. `docs/sources/mat1600.md`) :
  mineur confondu avec cofacteur, signe $(-1)^{i+j}$ oublié, $\det(kA)=k\det A$ au lieu de
  $k^n\det A$, $\det(A+B)=\det A+\det B$, trace confondue avec déterminant d'une
  triangulaire, effet d'un échange de lignes vs remplacement de ligne.
- Gate `npm test` : 0 erreur. Relecture aveugle via `scripts/blind-review.ts` (seed 42) par
  un sous-agent frais + vérification SymPy (venv hors dépôt) : 8/8 confirmées, 0 désaccord.
  Journal dans `docs/reviews/mat1600/mat1600-det.md`.
- Suite : thème `esp` en relecture ; puis compléter `syst`/`vect`/`matr` à ~8 questions.

## 2026-09-16 — MAT1500 Jalon 1 (lot mat1500)

- `src/content/mat1500/index.ts` : les 8 thèmes intra du scaffold + 2 thèmes finaux ajoutés
  (`mat1500-count` dénombrement ch. 4-5, `mat1500-graphs` graphes ch. 7, `exam:'final'`, sans
  questions). `defaultOn` corrigé d'après le calendrier réel : seuls `mat1500-logic` et
  `mat1500-quant` passent à `true` (le scaffold initial avait aussi `mat1500-sets` à `true`).
  Raisonnement : le premier quiz (17 sept.) ne porte que sur les devoirs 1-2, et le contenu de
  ces deux devoirs (lu via `agy`, gists seulement) est entièrement de la logique et des
  quantificateurs — aucune trace d'ensembles, fonctions, divisibilité ou induction. Détails et
  limites de cette inférence dans `docs/sources/mat1500.md`.
- Jalon 1 : 10 questions (5 `mat1500-logic`, 5 `mat1500-quant` ; 6 qcm / 2 vf / 2 flash dont 1
  Défi). Distracteurs = erreurs réelles vues dans les devoirs : négation d'un quantificateur
  imbriqué à moitié basculée, réciproque/contraposée confondues, De Morgan appliqué au mauvais
  connecteur, $\exists!$ pris pour $\exists$, ordre $\forall\exists$ vs $\exists\forall$.
- Relecture aveugle par sous-agent (choix mélangés, sans flag ni explication) + vérification
  SymPy (tautologies propositionnelles) et force brute sur domaines finis (négations de
  quantificateurs, unicité) dans un venv temporaire hors dépôt : verdict PASS, aucune
  ambiguïté. Deux flash cards remontées de difficulté 1 à 2 suite aux notes de calibration de
  l'agent (`mat1500-quant-003`, `mat1500-quant-005`). Journal dans `docs/reviews/mat1500/`.
- `D:\Math\MAT1500` toujours vide (lot StudiUM pas encore livré) : contenu tiré de `Downloads`
  (lecture seule), sources consignées dans `docs/sources/mat1500.md`.
- Écart assumé, comme pour mat1400 : script de gate local (scratchpad, hors dépôt) le temps que
  `tests/content.test.ts` soit disponible, abandonné dès le rebase sur main@26c884f.
- Gate officiel (`npm test`, 76 tests) vert après rebase sur main@72b6986.
- Suite : Jalon 2, ~8 questions par thème sur les 8 thèmes intra (~100 au total), un thème à la
  fois, via `scripts/blind-review.ts` (disponible depuis main@8af2316).
## 2026-09-16 — MAT1600 Jalon 1 : 10 questions (lot mat1600)

- `docs/sources/mat1600.md` : `D:\Math\MAT1600` encore vide (lot A pas passé) ; matière
  tirée de `C:\Users\adrie\Downloads` (plan de cours + 4 PDF cofacteurs/déterminants/inverse)
  en attendant. Écart signalé : `5.4_Representation_matricielle.pdf` ne traite pas des
  transformations linéaires malgré son nom/sa numérotation (ch. 5 de Lay) — contenu
  élémentaire (vecteurs en coordonnées, base canonique, relation de Chasles), classé sous
  `mat1600-vect` plutôt que `mat1600-diag`.
- 10 questions sur les thèmes déjà enseignés (`mat1600-syst`, `mat1600-vect`,
  `mat1600-matr`, `defaultOn:true`) : `src/content/mat1600/{mat1600-syst,mat1600-vect,mat1600-matr}.json`.
  6 qcm / 2 vf / 2 flash, 1 Défi (inverse 2×2 pas à pas, vérifiée $AA^{-1}=I$).
- Gate : `npm test` (`tests/content.test.ts` + `src/lib/gate.ts`) → 0 erreur.
- Relecture aveugle (sous-agent, choix mélangés sans `correct`/`explanation`) + vérification
  SymPy (venv hors dépôt) sur les 10 questions : 0 désaccord, 0 correction. Journal dans
  `docs/reviews/mat1600/{mat1600-syst,mat1600-vect,mat1600-matr}.md`.
- Écart assumé (comme le lot mat1400) : script de validation local en attendant le gate réel,
  abandonné dès `tests/content.test.ts` disponible, comme demandé par l'admin.
- Convention suivie pour `solution` (Défi) : éviter tout saut de ligne dans une formule
  (`\nabla`, `\neq`… piègent le JSON) ; étapes numérotées "1) … 2) …" sur une seule ligne
  quand une formule suit de près.
- Suite : Jalon 2, ~8 questions/thème sur `syst,vect,matr,det,esp` (~100 au total), un
  thème à la fois, en commençant par `mat1600-det` (matière la mieux sourcée).

## 2026-09-16 — MAT1400 Jalon 1 (lot mat1400)

- `src/content/mat1400/index.ts` : 8 thèmes intra réordonnés selon le calendrier réel de `Downloads/Info MAT1400.txt` (le cours enseigne le chap. 4.4 — gradient/dérivées directionnelles — avant 4.1-4.2 ; à noter, contre-intuitif si on suit l'ordre du manuel Stewart). `defaultOn` = déjà enseigné au 2026-09-16 : vect (annexes A-B), fonc (3.1-3.2), quad (3.3) seulement. 4 thèmes post-intra ajoutés (`exam:'final'`, sans questions).
- Jalon 1 : 10 questions sur ces 3 thèmes (6 qcm / 2 vf / 2 flash), distracteurs = erreurs d'étudiant réelles (signe oublié, confusion produit scalaire/vectoriel, rayon vs valeur de $z$, cercle vs cylindre en 3D).
- Relecture aveugle par sous-agent (choix mélangés, pas de flag correct) + vérification SymPy pour chaque calcul numérique : les 10 confirmées sans correction. Journal dans `docs/reviews/mat1400/`.
- `D:\Math\MAT1400` toujours vide (lot StudiUM pas encore terminé) : contenu tiré de `Downloads` (lecture seule), sources consignées dans `docs/sources/mat1400.md`.
- Gate officiel (`npm test`, 76 tests) passe après rebase sur main (26c884f). Écart assumé : j'avais d'abord écrit un script de validation local (scratchpad, hors dépôt) en attendant le gate réel — abandonné dès que `tests/content.test.ts` a été disponible, comme demandé par l'admin.
- Suite : Jalon 2, ~10-13 questions par thème sur les 8 thèmes intra (~100 au total, un thème à la fois, gate + relecture aveugle + SymPy pour chaque).
## 2026-09-16 — Engine jalon 3 : thèmes par choix explicite, remise à zéro synchronisée, gate.ts lisible (lot Engine)

- `src/lib/types.ts` (autorisation exceptionnelle de l'admin, patch exact) : `Settings.topics` → `topicOverrides: Record<string, boolean>` ; `Progress.resetAt?` ; JSDoc de `flagged` (union assumée).
- `schema.ts` à jour. `progress.ts` : `isTopicOn`, `setTopic` (met `settings.updatedAt`), `resetProgress` (cartes et jours actifs effacés ; réglages, signalements et code gardés ; `resetAt = now`) ; `emptyProgress` sans choix de thème.
- `merge.ts` : `resetAt` = max des deux côtés, cartes avec `at < resetAt` écartées ; toujours commutatif, associatif, idempotent (testé avec des remises à zéro).
- `scheduler.ts` : signature validée par l'admin `nextQuestion(bank, p, session, mode, now, rng, courses)` ; thèmes via `isTopicOn`, thème absent de `courses` = décoché.
- `gate.ts` contenait deux regex avec des octets de contrôle BRUTS (NUL…) : git le traitait comme binaire. Remplacées par une comparaison de codes ; `tests/source-hygiene.test.ts` vérifie qu'aucun source Engine n'en contient (contrôle : il trouve 6 octets dans l'ancienne version).
- `tests/api/sync.test.ts` (lot PWA) : 2 littéraux `topics: []` → `topicOverrides: {}` pour suivre le type, rien d'autre.
- `npm test` : 253 verts ; `tsc --noEmit` et `npm run build` : OK.

## 2026-09-16 — Engine jalon 2 : progress, merge, scheduler, import (lot Engine, branche lot/engine)

- `src/lib/progress.ts` : `loadProgress` (JSON → `migrate` pas à pas → Zod ; échec ou version inconnue = copie brute `pause-maths:backup-<ts>` puis état neuf ; l'original n'est retiré qu'après la copie, et reste si la copie échoue), `saveProgress`, `dayKey`, `markActive`, `streak` (sûr aux changements d'heure), `xp`, `level`, `levelProgress`, `mastery`, `toggleFlag`.
- `src/lib/merge.ts` : commutatif, associatif, idempotent, égalités comprises (ordre total fixe) ; sans DOM.
- `src/lib/scheduler.ts` : `INTERVAL_MS`, `mulberry32`, `applyAnswer` (carte neuve = box 1, donc bonne réponse → box 2), `nextQuestion` (paliers A → B → C → D, À revoir en un palier, pondération weak calculée sur toute la banque). Sans fin épuisé : `session.shown` tronqué EN PLACE aux 10 derniers, ou à (sélection − 1) si la sélection est plus petite.
- `scripts/import-questions.ts` : tout ou rien (gate complet + ids déjà en banque + fichier cible lisible), fusion triée par id, clôture ```json et BOM acceptés, chemin relatif au dossier d'appel (INIT_CWD). Vérifié à la main : `npm run import` sur un vrai fichier écrit `src/content/mat1600/mat1600-syst.json`, `content.test` passe avec, le 2e import est refusé (id-unique) ; fichier retiré ensuite.
- Contrôle du scheduler : la variante « sans mutation » du redémarrage Sans fin fait échouer 7 tests.
- `npm test` : 225 verts ; `tsc --noEmit` et `npm run build` : OK.
- Ouvert (à l'admin) : une remise à zéro serait annulée par la synchro (merge garde les cartes du serveur) ; les thèmes ajoutés plus tard ne sont pas cochés chez un utilisateur existant ; un « dé-signalement » est annulé par l'union de `flagged`.

## 2026-09-16 — Engine jalon 1 : schema + gate (lot Engine, branche lot/engine)

- `src/lib/schema.ts` : `QuestionSchema` (union discriminée stricte : clé inconnue refusée), `QuestionFileSchema`, `CardStateSchema`, `SettingsSchema`, `ProgressSchema`. Aucune transformation des données.
- `src/lib/gate.ts` : `checkBank` (12 règles, `RULES`), `checkFiles` (+ `file-shape`, `file-route`, issues rattachées à leur fichier), `formatIssues`. Chaque règle est vérifiée indépendamment de la validité Zod.
- Règle des caractères de contrôle validée par l'admin : U+000A toléré seulement dans `solution` et hors formule ; tout le reste rejeté (`\nabla`, `\neq` dans une formule de solution = rejet).
- Contrôle du gate : `tests/fixtures/broken.json` (34 cas) ; `tests/gate.test.ts` vérifie que chaque cas lève exactement sa règle et que les cas couvrent toutes les règles. Vérifié aussi à la main : un fichier cassé temporaire dans `src/content/stt1700/` fait échouer `tests/content.test.ts` (control-char, topic-unknown, file-route), puis retiré.
- Trouvé et corrigé par l'admin (main@b433065) : `hasStrayDollar` signalait `\$` comme orphelin.
- Vérifié : `import.meta.glob` de `bank.ts` fonctionne sous Vitest 5 ; KaTeX `renderToString` tourne en node sans DOM. `vitest.config.ts` fixe `TZ=America/Toronto` et inclut `tests/**/*.test.{ts,tsx}`.
- `npm test` : 76 tests verts ; `tsc --noEmit` : OK.
## 2026-09-16 — Part D, tâche intermédiaire : scripts/blind-review.ts (lot Part D)

- `scripts/blind-review.ts` : `npx tsx scripts/blind-review.ts <fichier.json|dossier> [--seed N] --key <chemin>`. Lit un fichier ou dossier de `Question[]`, valide chaque fichier avec `QuestionFileSchema` (`src/lib/schema.ts`, rebasé depuis le jalon 1 du lot Engine) — sort en erreur claire (chemin Zod + message) si le JSON n'a pas déjà passé le gate, mélange les choix `qcm` (mulberry32 seedé, seed par défaut 1, fisher-yates), imprime un Markdown sans `correct`/`why`/`explanation`/`solution` sur stdout, écrit la clé de correspondance (id → lettre correcte, id → mapping lettre→index d'origine ; pour `vf`/`flash`, la réponse attendue) dans le fichier `--key`, jamais sur stdout. `vf` affiche "Vrai / Faux" sans mélange (ordre fixe de l'app) ; `flash` n'affiche que le prompt + consigne. Ne modifie jamais `src/content`. Typecheck (`tsc --noEmit`) propre ; testé manuellement sur des fixtures (fichier seul, dossier, `--key` manquant, JSON rejeté par le schéma).
- `.claude/skills/ajouter-questions/SKILL.md` mise à jour : l'étape 4 (relecture aveugle) passe par ce script au lieu de construire le matériel aveugle à la main ; nouvelle règle "ne jamais montrer la clé au sous-agent".
- `npm test` après rebase sur main@26c884f : 76 tests verts, `tsc --noEmit` propre.

## 2026-09-16 — Part D, phase 1 : processus + skill d'import (lot Part D)

- `docs/PROCESSUS_QUESTIONS.md` : doc à uploader dans le projet claude.ai de l'utilisateur ; format JSON exact (dérivé de `src/lib/types.ts`), thèmes par cours (à jour au 2026-09-16, MAT1400/1500/1600 seulement — STT1700 vide, pas encore dérivé des PDFs), règles de style, 4 exemples, auto-vérification, consigne de sortie stricte.
- `.claude/skills/ajouter-questions/SKILL.md` : paste JSON → scratchpad → `npm run import -- <fichier>` → gate (`npm test` + relecture aveugle par sous-agent avec vérif SymPy hors dépôt) → désaccord → 3e agent → commit (chemins explicites) → push → rapport à l'admin de régie.
- `scripts/import-questions.ts` n'existe pas encore (lot Engine, en cours) ; la commande `npm run import` est déjà câblée dans `package.json`. La skill s'arrête et prévient l'admin si le script est absent ou que son contrat diffère — à réviser quand le lot Engine pousse.
- Phase 2 (contenu STT1700, ~100 questions) bloquée en attente de `D:\Math\STT1700` (lot A).
## 2026-09-16 — Lot PWA : service worker, manifest, icônes, synchro, vercel.json

- `vite.config.ts` : `VitePWA` en `registerType: 'prompt'` (pas `autoUpdate`), `injectRegister: false` (l'enregistrement du SW est fait à la main dans `src/lib/pwa.ts`), `workbox.globPatterns` + `cleanupOutdatedCaches`, manifest complet (id, scope, lang fr-CA, standalone, icônes 192/512 + maskable).
- **Vérifié par un build temporaire** (import jetable de `katex/dist/katex.min.css` dans `main.tsx`, retiré ensuite) : les `.woff2` de KaTeX atterrissent bien dans `dist/assets/*.woff2` et passent par `globPatterns` sans avoir besoin d'`includeAssets`.
- Icônes générées hors dépôt (SVG source + `sharp`, dans le scratchpad de la session, jamais commité) : `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (fond dégradé violet/indigo, `π` blanc), `apple-touch-icon.png` (180 px, **opaque**, vérifié sans canal alpha), `favicon-32.png`.
- `index.html` : liens icônes + meta `apple-mobile-web-app-*`. Le lien `<link rel="manifest">` est injecté automatiquement par le plugin (vérifié dans `dist/index.html`).
- `src/lib/pwa.ts` : `initPwa()` enregistre le SW via `virtual:pwa-register`, `onUpdateReady(cb)` / `applyUpdate()` pour que le lot UI choisisse le moment (Home/Recap), `visibilitychange` → `registration.update()` au plus 1×/heure.
- `src/lib/sync.ts` : `generateSyncCode` / `formatSyncCode` / `normalizeSyncCode` (alphabet 32 sans 0/O/1/I), `syncNow(p)` (GET puis PUT sur `/api/sync`, clé = SHA-256(code) en hex), plus `checkSyncCode(code)` (ajout hors contrat, pour que l'écran "Entrer un code" distingue un code inexistant d'une simple première activation — sinon un 404 sur un code tapé par erreur est silencieusement pris pour une activation neuve). **Fusion temporaire locale (`tempMerge`)** en attendant `src/lib/merge.ts` (lot Engine, toujours absent) : remplacer l'import dès qu'il existe, signature identique à celle du contrat.
- `api/sync.ts` (fonction Vercel Node) : GET/PUT, clé validée par regex (64 hex), taille ≤ 200 Ko (content-length + mesure réelle), rate limit en mémoire (20 PUT/min par clé, best-effort — repart à zéro sur une instance froide, documenté comme tel), même `tempMerge` dupliqué côté serveur.
- `vercel.json` : `Cache-Control: no-cache` sur `/sw.js`, `/index.html`, `/manifest.webmanifest` ; `Content-Type: application/manifest+json` sur le manifest ; `/assets/(.*)` en immutable 1 an.
- **Stockage — décision (item 5 du brief) : Vercel Blob, pas Upstash.** Recherché (WebSearch) : le tier gratuit Upstash **archive la base après 30 jours d'inactivité** (l'endpoint est supprimé, restauration manuelle possible depuis la console) — même défaut que Supabase, risque réel vu l'usage par intermittence (semaines sans ouvrir l'app entre les sessions d'étude). Rien trouvé indiquant une suppression par inactivité pour Vercel Blob. `access: 'private'` est disponible sur `put`/`get` (`@vercel/blob` 2.8.0) : le blob n'est lisible qu'avec le token du projet, pas par URL publique devinée — donc **aucune intégration Marketplace à accepter**, ce point du brief tombe.
- Ajouté à `package.json` (dépendance runtime) : `@vercel/blob@^2.8.0`. `@vite-pwa/assets-generator` **pas** installé : icônes générées via `sharp` en dehors du dépôt (scratchpad de la session), donc aucune dépendance de génération d'icônes ajoutée au projet.
- Tests : `tests/api/sync.test.ts`, 9 cas (`@vercel/blob` mocké en mémoire) — clé mal formée, 404 sur code inconnu, PUT puis GET identique, fusion sur deux PUT successifs, carte la plus récente gagne même stockée, corps trop gros (413), corps invalide (400), rate limit (429 après 20), méthode non supportée (405). `npm run typecheck`, `npm test`, `npm run build` passent tous les trois.
- **Écart au brief, signalé à l'admin :** `CLAUDE.md` dit "aucun lot ne touche `package.json`" ; le brief de l'admin m'a explicitement autorisé à le faire pour ce lot. Les deux ne sont pas alignés — à corriger dans `CLAUDE.md` si l'admin confirme l'exception.
- **Zone grise trouvée :** `src/main.tsx` n'a pas de propriétaire dans le tableau des périmètres de `CLAUDE.md`. Personne n'appelle encore `initPwa()` — non touché ici pour rester dans mon périmètre déclaré ; signalé à l'admin.
- **Bloqué :** ni le MCP Vercel (`list_teams`/`list_projects` renvoient vide ou une erreur générique) ni le CLI (`npx vercel whoami` → "A new login is required") ne sont authentifiés dans cette session. Impossible de créer le projet Vercel, donc impossible d'obtenir l'URL de prod, d'activer Vercel Blob, ou de vérifier avec `curl` (items 7 et 11 du brief). Détails envoyés à l'admin par SendMessage.

## 2026-09-16 — Étape 0 : scaffold (admin adrie-59)

- Vite 8 + Preact + TypeScript, Vitest 5, Zod 4, KaTeX, vite-plugin-pwa installés. Toutes les dépendances sont posées ici pour qu'aucun lot ne touche `package.json`.
- Vérifié : vitest 5.0.1 accepte vite ^8 en peer (`npm view vitest peerDependencies`).
- Contrat de types partagé dans `src/lib/types.ts` ; agrégateur `src/content/courses.ts` + `bank.ts` ; un `index.ts` par cours avec les thèmes initiaux du HANDOFF §2 (STT1700 vide, à dériver des PDFs).
- Écarts au HANDOFF, assumés par l'admin : `docs/SOURCES.md` devient `docs/sources/<cours>.md` (un fichier par session de contenu) ; les `vf` portent `answer: boolean` au lieu de `choices`.
- Dépôt GitHub privé `AMoncade/pause-maths`, 7 worktrees sous `C:\Users\adrie\pause-maths-wt\`.
