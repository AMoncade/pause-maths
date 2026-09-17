# Pause Maths

PWA de quiz rapides (français) sur MAT1400, MAT1500, MAT1600, STT1700 (UdeM, automne 2026).

**Avant tout : lire `docs/WORKLOG.md`** (journal daté des sessions), puis `HANDOFF.md` (spécification complète et décisions réglées, ne pas les re-poser). **Une session admin qui reprend la régie lit `docs/HANDOFF-ADMIN.md`** (état au 2026-09-17, ce qui reste, les deux gestes utilisateur qui bloquent, méthode du tour précédent).

## Règles

- Contenu et interface en **français**. `MAT1700` n'existe pas : c'est **STT1700**.
- Les questions sont **réécrites, jamais copiées** des fichiers de cours. Aucun fichier de cours n'est commité.
- `src/lib/types.ts` est le contrat partagé entre les lots. On ne le modifie pas sans prévenir l'admin de la régie.
- Chaque étape finie = entrée datée dans `docs/WORKLOG.md` + commit + push.
- Discipline git : `git add <chemins explicites>` seulement. Jamais `-A`, jamais `.`, jamais `commit -a`. Vérifier `git diff --cached --name-only` avant chaque commit.
- Tests : `npm test`. Build : `npm run build`. Les deux doivent passer avant un push sur `main`.

## URL de production

https://pause-maths.vercel.app — projet Vercel `pause-maths` (équipe am-oncade-s-projects), auto-deploy sur push `main`, Blob store privé `pause-maths-sync`. Premier déploiement : 2026-09-17 (`main@2d9cb50`).

**Règle des ids, active depuis ce premier déploiement** (HANDOFF §7) : une correction de coquille garde son id ; un changement de sens ou de réponse prend un **nouvel id** et l'ancien va dans `src/content/retired-ids.json`. Une progression utilisateur peut maintenant exister.

## Périmètres (régie du 2026-09-16)

| Lot | Fichiers |
|---|---|
| Engine | `src/lib/{schema,progress,merge,scheduler}.ts`, `tests/`, `vitest.config.ts`, `scripts/import-questions.ts` |
| UI | `src/main.tsx`, `src/app.tsx`, `src/components/`, `src/styles/`, `src/lib/MathText.tsx`, `src/lib/ui-*.ts`, `tests/ui/` |
| PWA | `vite.config.ts`, `vercel.json`, `api/`, `public/`, `src/lib/{sync,pwa}.ts`, `index.html`, `tests/api/`, et seul lot autorisé à modifier `package.json` (dépendances) |
| Contenu ×4 | `src/content/<cours>/`, `docs/reviews/<cours>/`, `docs/sources/<cours>.md` |
| Part D | `docs/PROCESSUS_QUESTIONS.md`, `.claude/skills/ajouter-questions/` |
| Admin | `src/lib/types.ts`, `src/lib/math.ts`, `src/content/{courses,bank}.ts`, `src/content/retired-ids.json`, `CLAUDE.md`, `HANDOFF.md` |
