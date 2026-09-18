# Pause Maths

Application web progressive (PWA) de questions rapides pour réviser quatre cours de l'Université de Montréal, automne 2026 : **MAT1400**, **MAT1500**, **MAT1600** et **STT1700**. L'idée : remplacer quelques minutes de défilement par quelques questions de cours, sur téléphone ou ordinateur.

**Production : https://pause-maths.vercel.app**

## Ce que fait l'app

- Questions à choix multiples, vrai/faux et cartes flash, en français, avec explication et justification de chaque mauvais choix.
- Par cours et par thème ; les thèmes déjà vus en classe sont cochés par défaut, les autres se cochent dans les réglages.
- Mode « Défi » pour les questions plus longues, avec solution rédigée.
- Progression locale (hors ligne) et synchronisation entre appareils par un code, sans compte.
- Installable sur l'écran d'accueil (iPhone, Android, bureau), thème clair et sombre, clavier.

## Banque de questions

| Cours | Questions | Intra |
|---|---|---|
| MAT1400 | 107 | 26 octobre |
| MAT1500 | 102 | 29 octobre |
| MAT1600 | 115 | 16 octobre |
| STT1700 | 48 | 7 octobre |

Chaque question est réécrite à partir du matériel du cours, jamais copiée. Toutes passent un contrôle automatique (`npm test`), une relecture à l'aveugle par un modèle qui ne voit pas la réponse attendue, puis une relecture complète. Le détail est dans `docs/reviews/`. Les cours ont été vérifiés contre le matériel réel de StudiUM (calendrier, notes, devoirs, anciens examens) ; ce qui n'a pas pu l'être est écrit dans `docs/reviews/<cours>/verification-studium.md`.

## Développement

Prérequis : Node 24.

```bash
npm ci
npm run dev        # serveur local
npm test           # tests (contenu, moteur, API de synchro)
npm run typecheck
npm run build
```

Ajouter des questions : suivre `docs/PROCESSUS_QUESTIONS.md`, puis `npm run import -- fichier.json --renumber`.

## Structure

- `src/content/<cours>/` : thèmes (`index.ts`) et questions (un JSON par thème). `src/content/retired-ids.json` : ids qui ne doivent plus être réutilisés.
- `src/lib/` : schéma et contrôle des questions, progression, planification des révisions, synchronisation.
- `src/components/` : interface (Preact).
- `api/sync.ts` : fonction Vercel de synchronisation (Vercel Blob privé).
- `docs/` : `WORKLOG.md` (journal daté), `HANDOFF.md` (spécification), `HANDOFF-ADMIN.md` (état et reprise du projet), `sources/` (matière de chaque cours), `reviews/` (relectures), `regie/` (journal de coordination des sessions).

## Déploiement

Projet Vercel `pause-maths` : chaque push sur `main` déploie la production. Le stockage de synchronisation est un Blob store privé lié au projet.

## Licence

Projet personnel, dépôt privé. Aucun fichier de cours n'est inclus.
