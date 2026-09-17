# Brief lot MAT1600 — vérification contre le vrai matériel (admin adrie-59, 2026-09-17)

Vérifier les thèmes, les `defaultOn` et les 101 questions MAT1600 contre le matériel StudiUM réel maintenant dans D:\Math\MAT1600 ; corriger ce qui diverge. Intra MAT1600 le **vendredi 16 octobre** (matériel). Les questions du tour 1 ont été écrites depuis Downloads + descriptions officielles, jamais depuis StudiUM.

## Vérifié par l'admin
- D:\Math\MAT1600 : 146 entrées (100 fichiers StudiUM sur 137, les 37 manquants sont 35 PNG décoratifs + 2 PDF que le lot A récupère), 20 pages Markdown dont la page structure (calendrier), 12 pages de TP hebdomadaires, 2 relectures de quiz (Quiz-tp1, Quiz-tp2), anciens examens et corrigés des TP extraits des zips. INDEX.md et LIENS.md en tête.
- Worktree `C:/Users/adrie/pause-maths-wt/mat1600`, branche `lot/mat1600`, avancé sur main (≥ 17c8df8). 101 questions, 363 tests verts.
- Règle des ids ACTIVE (prod déployée) : un changement de sens ou de réponse = nouvel id + ancien id dans `src/content/retired-ids.json` (fichier admin : envoie-moi la liste des ids à retirer, je l'écris). Une coquille garde son id.
- Lire d'abord CLAUDE.md, docs/WORKLOG.md, docs/sources/mat1600.md, docs/reviews/relecture-opus/ (MAT1600).

## Tâches
1. Calendrier : lire la page structure et le plan de cours ; écrire dans docs/sources/mat1600.md le tableau semaine → sections → date civile, la matière exacte de l'intra du 16 octobre, et comparer aux thèmes de `src/content/mat1600/index.ts` (`exam`, `defaultOn` = « déjà vu en classe à la date du build », aujourd'hui 17 sept). Corriger l'index si ça diverge.
2. Questions : pour chaque thème intra, confronter les questions aux notes, aux TP, aux corrigés et aux anciens examens : notation et vocabulaire du cours, résultats énoncés comme dans les notes, thèmes hors intra mal classés, questions qui portent sur une matière absente du cours. Corriger ; nouvel id si le sens change. Ne pas réécrire ce qui est juste.
3. Ajouter des questions seulement si un sujet de l'intra n'est couvert par aucune (méthode PROCESSUS_QUESTIONS : brouillon agy, gate, relecture aveugle par sous-agent Haiku).
4. `npm test` mesuré, docs/reviews/mat1600/verification-studium.md (ce qui a été comparé, ce qui divergeait, ce qui a été changé, ce qui n'a pas été lu), entrée WORKLOG, `git add` explicite seulement, push lot/mat1600.
5. Rapport à adrie-59 : SHA, comptes mesurés (questions, modifiées, retirées, ajoutées), ids à retirer, écarts de calendrier. Puis STOP (l'utilisateur fera /clear).

## Périmètre
`src/content/mat1600/**`, `docs/sources/mat1600.md`, `docs/reviews/mat1600/**`, `docs/WORKLOG.md`. Lecture seule sur D:\Math\MAT1600 ; aucun fichier de cours dans le dépôt. Pas de Chrome.

## Non vérifié par l'admin
Le contenu des PDF (je n'en ai lu aucun) ; que les 20 pages Markdown couvrent bien le calendrier complet. Si une affirmation est fausse, le dire au lieu de l'exécuter.

## Économie
Un seul rapport à la fin ou dès blocage. Un thème par contexte si la vérification s'avère longue : s'arrêter après les thèmes intra et rapporter.
