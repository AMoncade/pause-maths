# Brief lot A — tour 2 (admin adrie-59, 2026-09-17)

Rapatrier les fichiers de cours StudiUM dans D:\Math avec la skill `studium-sync`, STT1700 d'abord. Seule session autorisée à utiliser Chrome (onglets à soi seulement).

## Vérifié par l'admin
- D:\Math existe avec MAT1400, MAT1500, MAT1600, STT1700 et horaire-udem-A26.ics (même poste que le tour 1).
- `~/.claude/skills/studium-sync` contient SKILL.md, studium.js, studium_sync.py.
- Seul geste utilisateur confirmé : l'authentification Vercel. Le réglage Chrome « Téléchargements automatiques → studium.umontreal.ca » n'est PAS confirmé.

## Tâches
0. Charger la skill. Première action : tester le réglage Chrome avec 2 fichiers de STT1700. Si Chrome bloque les téléchargements multiples (bulle « Autoriser »), s'arrêter après 2 essais et rapporter l'état exact à l'admin (pas de boucle, pas de question à l'utilisateur). L'admin relaiera le réglage : Paramètres → Confidentialité et sécurité → Paramètres des sites → Téléchargements automatiques → ajouter studium.umontreal.ca.
1. Si ça passe : STT1700 entier (intra 7 octobre, ~45 fichiers), puis MAT1600 (~100 + 36 intégrés aux pages), MAT1400 (~29), MAT1500 (~5). Règles HANDOFF §6 : jamais « Tenter le test », jamais de H5P, tentatives de quiz comptées avant/après et rapportées.
2. Après STT1700 : rapport court à l'admin (comptes mesurés sur disque, tentatives avant/après), pour lancer la session contenu STT1700 sans attendre les MAT. Puis continuer.
3. Fin : relancer la skill doit dire « rien de nouveau » ; copier `docs/PROCESSUS_QUESTIONS.md` vers `D:\Math\PROCESSUS_QUESTIONS.md`. Aucun fichier de cours n'entre dans un dépôt git.
4. Correction de la skill : commit + push dans `~/.claude/skills` (AMoncade/claude-skills), `git add` explicite.

## Périmètre
D:/Math/**, ~/.claude/skills/studium-sync/**. Rien dans pause-maths.

## Non vérifié par l'admin
Les comptes de fichiers par cours (chiffres du tour 1) ; que l'onglet StudiUM n'ait pas été mis en veille ; que la session StudiUM soit encore connectée. Si une affirmation est fausse, le dire au lieu de l'exécuter.

## Économie
Aucun accusé de réception, aucun message intermédiaire hors le rapport après STT1700 et le rapport final (comptes mesurés par cours, échecs, tentatives avant/après).
