# HANDOFF — Pause Maths: start coding from here

**State (verified 2026-09-16 17:50 EDT with `ls -la C:\Users\adrie\pause-maths`): nothing built.
This folder holds only this file and an empty `.git` (`git init -b main`, no commits, no remote).
Every decision is settled with the user, and the plan is approved. Start at "First hour" below.**

Written by the planning session. The approved plan is also at
`C:\Users\adrie\.claude\plans\i-want-to-make-immutable-newt.md`. This file repeats it, plus the facts
and traps found along the way, so you don't need to open the plan.

---

## 1. What the user wants (in their words, condensed)

> an app usable on my phone or computer that can switch/rotate between my college classes
> (MAT1400 MAT1500 MAT1600 MAT1700 + an "all" option) and asks quick questions on the material,
> so in random free time, instead of scrolling Instagram, I read a question, click the answer,
> get feedback — entertaining and mind-refreshing.

About the user (Adrien, adrien@moncade.com, GitHub `AMoncade`, UdeM math bachelor, fall 2026):
- Writes to Claude in English. **App content and UI are in French.**
- **Standing preferences (from memory):**
  - Work autonomously: don't ask for validation mid-task and don't offer optional extra work. Pick the best option, state it in one line, keep going.
  - Keep `docs/WORKLOG.md` with a dated entry after every finished step, plus a `CLAUDE.md` telling future sessions to read it first.
  - Commit and push everything.
- iPhone user. Windows 11, RTX 4060, Node 24.
- Strong preference for **zero recurring cost**; rejected paid APIs in past projects.

## 2. Course facts

| App code | Real course | Intra | Final | Source of the fact |
|---|---|---|---|---|
| MAT1400 | Calcul 1 (several-variable calculus; textbook Stewart, *Calcul à plusieurs variables*) | Oct 26 | Dec 17 | Verified: StudiUM course list. Dates relayed from the exploration agent reading `Downloads\Info MAT1400.txt` |
| MAT1500 | Mathématiques discrètes (Rosen) | Oct 29 | Dec 10 | Verified: StudiUM. Dates relayed (`Info MAT1500.txt`) |
| MAT1600 | Algèbre linéaire (Lay 5e, flipped classroom) | Oct 16 | Dec 11 | Verified: StudiUM. Dates relayed (plan de cours PDF) |
| **STT1700** | Introduction à la statistique | Oct 7 | Dec 15 | Verified: StudiUM lists "STT1700-A-A26". Dates relayed (from the `.ics`) |

- **"MAT1700" = STT1700.** The user typed MAT1700 and later confirmed it's the stats course. Show **STT1700** in the app.
- **Ignore MAT1000 / MAT1720.** They are in `C:\Users\adrie\plan-etudes\tests\fixtures\`, but that was an older registration. The user confirmed they are **not** taking them.

**Topics already known.** Reasoned: these lists are official UdeM descriptions plus notes the exploration agent pulled from the local files. They are not yet checked against StudiUM content.
- **MAT1400**
  - Before the intra:
    - Annexes A–B: vectors/matrices, lines & planes
    - Ch. 3: functions of several variables, limits/continuity, cylinders & quadrics
    - Ch. 4: partial derivatives, tangent plane, chain rule, directional derivative/gradient
    - Ch. 5: extrema, optimization, Lagrange
  - After the intra:
    - Ch. 6: double integrals, polar coordinates
    - Ch. 7: triple integrals, cylindrical/spherical coordinates, change of variables
    - Ch. 1: sequences, series
    - Ch. 2: power series, Taylor
  - Exams: no calculator, formula sheet provided.
- **MAT1500**
  - Intra = ch. 1–3: logic, sets, functions, proofs (direct, contradiction, cases, induction), divisibility, primes, modular arithmetic
  - Final adds ch. 4–5 (counting) and maybe ch. 7 (graphs)
  - Devoir 1: trees/leaves, propositions, ∀/∃/∃!
  - Devoir 2: logical operators, De Morgan, negation, converse/contrapositive
- **MAT1600**
  - The plan de cours has no week list.
  - Objectives: linear systems, vector/Euclidean spaces, linear maps, diagonalization.
  - Standard Lay order: systems & Gauss → matrix algebra/inverse → determinants → vector spaces/bases → eigenvalues/diagonalization → orthogonality.
- **STT1700**
  - Nothing known locally; StudiUM has 38 PDFs (see §3).
  - Derive the topics from those PDFs. Don't invent them.

## 3. StudiUM facts

Verified 2026-09-16 ~17:30 EDT. Source: claude-in-chrome, the user's logged-in Chrome, in-page `fetch` + `DOMParser`, read-only.

**Course list:** `https://studium.umontreal.ca/my/courses.php`

| Site | course id | Sections | Activity modules on course page | Files inside folders |
|---|---|---|---|---|
| MAT1400-A-A26 | 349955 | 6 | forum 3, url 6, resource 1, folder 1 | 4 pdf |
| MAT1400-AB-A26 | 366020 | 21 | label 6, resource 4, url 1, **quiz 16**, forum 3, folder 1, **h5pactivity 11** | 20 pdf |
| MAT1500-A-A26 | 349970 | 1 | forum 1, folder 2, label 1 | 4 pdf + 1 jpg |
| MAT1600-A-A26 | 349974 | 2 | forum 1, url 2 | 0 |
| MAT1600-AB-A26 | 366018 | 20 | label 70, forum 4, **resource 36**, folder 2, **quiz 14**, **page 12** | 74 pdf |
| STT1700-A-A26 | 355495 | 2 | label 1, forum 2, resource 6, folder 11 | 38 pdf + 1 txt |

Section names on those pages:
- **MAT1400-A:** "Introduction", "Notes du cours", "Vidéos", "À propos de l'examen intra", "Rétroaction pour moi", "Examen final".
- **MAT1400-AB:** starts with "🧮 Introduction", "🎓 Soutien à la réussite étudiante", "⚠️ IMPORTANT ⚠️ Test obligatoires pour acceder au reste du cours", "💬 Forums", "📧 Heures de bureau", "✍ TP ✍", then "Semaine 1…".

Other items on the course list, all out of scope: 119010 Mathématiques (program page), DélibérUM, the plagiarism training, the consent training, "Exploration- MAT1400" (id 241499, a teaching-strategies site).

**Traps found (verified):**
- **The extension censors output.** A `javascript_tool` call whose return value contained file names and URLs came back as `[BLOCKED: Cookie/query string data]`. Return only counts or names without query strings, and never try to read cookies. Nothing can be downloaded with curl/PowerShell using the session.
- **Supabase is out** for sync storage. `list_projects` shows all 3 of the user's projects **INACTIVE** (paused): "API signals backup", "plan-etudes", "plan-etudes-test". Free projects pause after 7 days without use.

## 4. Local files

`D:\Math` (verified): contains only 4 **empty** folders the user created: `MAT1400`, `MAT1500`, `MAT1600`, `MAT1700`.

Useful material in `C:\Users\adrie\Downloads`. Existence verified with `Test-Path`; content descriptions relayed from the exploration agent.
- `Info MAT1400.txt`: full MAT1400 calendar, week by week
- `Plan de cours - MAT1400-A26.pdf` (8 p)
- `MAT1400.pdf` (183 p, Owens course notes); `MAT1400 (1).pdf` is a duplicate
- `MAT1400_M1_Formes_indeterminees_exemples.md`: study notes on indeterminate forms
- `Examens des années précédentes avec leurs solutions-20260909\`: `MAT1400-A20-Corrigé-Final.pdf`, `MAT1400-A23-Corrigé-Final.pdf`, `MAT1400-A24-Rév-Intra - Corrigé.pdf`, `MAT1400-H22-corr.pdf`
- `Info MAT1500.txt`, `mat1500-devoir-1.pdf`, `mat1500-devoir-2.pdf`
- `Devoirs-20260909\`: `mat1500-devoir-1.pdf` (a copy) and `economist.jpg` (not course material)
- `Plan-MAT1600-AB-A26 .pdf` (note the space before `.pdf`), plus notes `3.3_Matrice_des_cofacteurs.pdf`, `3.4_Calcul_determinants_dordre_n.pdf`, `3.6_Linverse_dune_matrice.pdf`, `5.4_Representation_matricielle.pdf`
- `horaire-udem-A26.ics`: the current schedule, with exam dates

Other projects that are not dependencies, for reference only:
- `C:\Users\adrie\synchro-calendrier`: a working TS/Vite/Vitest Chrome extension. `docs/REPERAGE-STUDIUM-2026-09-10.md` there describes StudiUM.
- `C:\Users\adrie\plan-etudes`: Python.

## 5. Settled decisions

All settled with the user in a grilling session, Q1–Q19; the user answered every one with the recommended option. **Do not re-ask any of these.**

| Topic | Decision |
|---|---|
| Platform | **PWA**, installable (iPhone: Safari → Share → "Sur l'écran d'accueil"; desktop: Chrome/Edge Install), works offline. Name **Pause Maths**. |
| Sync | **Yes.** Phone ↔ computer via a **sync code** (e.g. `K7F2-9QXD-M3PA`), no account. Auto-sync after each round. |
| Access | Anyone with the link can use it; `noindex`. Questions are **rewritten, never copied** from course files. No course file goes online. Classmates can each use their own sync code. |
| Question source | **Fixed, checked bank** (JSON in repo). No live AI generation. |
| Adding questions | A French "question-making process" doc the user uploads to their claude.ai project (which has all their notes). It outputs **ready-to-import JSON**; the user pastes it into a Claude Code session, and every import gets the **full quality gate** (format tests + blind re-solve + SymPy). |
| Question style | ~90 % quick, in-your-head (15–45 s, no calculator) + a **Défi** switch (off by default): harder questions, still 4 choices, then a "Voir la solution" step-by-step. |
| Unseen material | Per-course **topic checklist** in Settings; defaults = what's been taught as of today. The user sends new class content over time. |
| Game layer | **Medium:** combo counter + flame, daily streak, XP + level per course, mastery bar per topic, recap card. No badges, sounds or leaderboards. |
| Home screen | Course chips `Tout · MAT1400 · MAT1500 · MAT1600 · STT1700` (multi-select) · modes **Rafale** (5 questions → recap → "Encore 5") / **Sans fin** / **À revoir** (last-answer-wrong only) · Défi switch · streak/XP. |
| Look | **Playful & colorful**, Duolingo-like: a color per course, rounded cards, bouncy feedback, combo flame. Follows system light/dark. |
| Course material | Scrape StudiUM into `D:\Math` (rules in §6), plus a reusable **update command** (`studium-sync` skill) that fetches only new files. |
| v1 content | **Intra material first**, ~100 checked questions per course, built in exam-date order **STT1700 → MAT1600 → MAT1400 → MAT1500**. Before that, deploy early with ~10 per course so the user can install it. Final-exam topics come later. |

**Out of scope** (the user did not ask; don't add): accounts/passwords, push notifications, leaderboards, badges, sounds, live AI, native app.

## 6. Part A: build `D:\Math` from StudiUM

**Layout.** Merge the `-A` and `-AB` sites into one course folder, and rename the empty `D:\Math\MAT1700` to `STT1700`.
```
D:\Math\<COURSE>\01 Plan de cours\  02 Notes de cours\  03 Exercices & TP\
                 04 Devoirs\  05 Quiz & solutions\  06 Examens passés\
                 LIENS.md    videos / external URLs, with their StudiUM section
                 INDEX.md    every file: original StudiUM section, date, 1-line summary
D:\Math\.studium-manifest.json   StudiUM module id + file name + timestamp → local path
D:\Math\PROCESSUS_QUESTIONS.md   copy of the process doc (created in Part D)
```
**Copy** (don't move) the §4 Downloads material into the matching folders. Downloads must stay untouched. Skip `economist.jpg` and the duplicate `MAT1400 (1).pdf`.

**Mechanism.** This part is reasoned; nothing below has been tried yet.
1. Listing: in-page `fetch` + `DOMParser` on `course/view.php?id=…`, `mod/folder/view.php`, `mod/resource/view.php`. Sequential GETs only.
2. Files: trigger Chrome downloads of `pluginfile.php` links with `forcedownload=1`, one at a time. They land in `C:\Users\adrie\Downloads`.
3. Pages and quiz reviews: convert to Markdown in-page, then trigger a Blob download of a `.md`.
4. PowerShell then moves each finished download into its target folder, tracked through the manifest. Watch for Chrome's `(1)` suffix when a name already exists in Downloads, and don't touch files that were already in Downloads.
5. If Chrome shows "Ce site tente de télécharger plusieurs fichiers", ask the user to click **Autoriser**. It's their browser permission; don't click it yourself.
6. PDF text reading for INDEX summaries can be offloaded to the `agy` skill (Antigravity/Gemini, read-only) to save Claude quota.

**Hard safety rules. Breaking one could cost the user grades.**
- **Quizzes:** only load `mod/quiz/view.php?id=…` and follow the **review ("Relecture")** links of attempts that are **already finished**. **Never** click or POST "Tenter le test" / "Commencer" / "Continuer". Some quizzes are graded (the MAT1600 quiz-TPs give bonus points; MAT1400-AB has required tests that gate the rest of the course).
- **H5P activities** and the whole "⚠️ Test obligatoires" section: list them in LIENS.md only. Never open them or interact.
- **Videos:** links only, no download.
- Never post in forums, submit anything, or change any StudiUM setting.
- **Verification:** record the attempt count shown on each quiz page before scraping and after; they must match.

**`studium-sync` skill** (user-level):
- Location: `C:\Users\adrie\.claude\skills\studium-sync\SKILL.md`. That folder is the git repo `AMoncade/claude-skills` (private): **commit and push after creating it**. Load the `writing-skills` / `writing-for-agents` skills before writing it.
- What it does: re-list modules, download only items missing from the manifest, update INDEX.md and LIENS.md, print "what's new" per course (or "rien de nouveau").

## 7. Part B: the app (`C:\Users\adrie\pause-maths`, private GitHub repo `AMoncade/pause-maths`)

**Tooling.** Verified 2026-09-16 with `node -v`, `npm view`, `gh auth status`:
- Node v24.14.1, npm 11.11.0, git 2.45.1.
- `gh` is logged in as AMoncade over https.
- Latest versions: vite 8.3.0, vite-plugin-pwa 1.3.0 (peer vite ≤ 8 OK), @preact/preset-vite 2.10.6 (peer vite 8 OK), preact 10.29.8, vitest 5.0.1, zod 4.6.5, katex 0.18.7.
- **Not checked:** vitest 5's peer range against vite 8. Run `npm view vitest peerDependencies` before installing.

**Stack:** Vite + **Preact** + TypeScript, `vite-plugin-pwa`, KaTeX (npm, woff2 fonts precached), Zod, Vitest, plain CSS variables (no Tailwind), and one Vercel serverless function for sync. Why Preact: 6 components, no router, ~4 KB versus ~45 KB for React, same hooks.

```
CLAUDE.md                          read docs/WORKLOG.md first; content rules; production URL
HANDOFF.md                         this file (keep it; mark sections done as you go)
.claude/skills/ajouter-questions/  project skill: import → gate → blind review → commit → deploy
docs/WORKLOG.md · docs/PROCESSUS_QUESTIONS.md · docs/SOURCES.md · docs/reviews/
api/sync.ts                        GET/PUT progress blob keyed by SHA-256(sync code)
scripts/import-questions.ts        validate pasted JSON, route to topic files, reject dup ids
src/content/courses.ts             code, title, color, ordered topics {id, label, exam:'intra'|'final', defaultOn}
src/content/<course>/<topic>.json  loaded with import.meta.glob
src/content/retired-ids.json
src/lib/schema.ts progress.ts merge.ts scheduler.ts sync.ts MathText.tsx
src/components/  Home, CourseChips, QuestionCard, FlashCard, Feedback, Solution, Recap,
                 Settings (topic checklist, sync code, reset), Stats (flagged ids, bank version)
tests/           schema, progress, merge, scheduler, content
vercel.json, vite.config.ts
```

### Question format: a Zod discriminated union on `type`
- **Common fields:**
  - `id`: stable forever; prefix = course (e.g. `mat1600-diag-007`)
  - `course`, `topic`, `difficulty` 1–3
  - `prompt`: ≤ 280 chars, math as `$…$` / `$$…$$`
  - `explanation`: 1–3 sentences, including the classic trap
  - optional `challenge: true` + `solution` (Markdown steps) for Défi
- **`qcm`:** exactly 4 `choices: {text, correct, why?}`, exactly one correct. `why` is shown when that wrong choice is tapped. Order is shuffled at display.
- **`vf`:** choices are always "Vrai" then "Faux", never shuffled.
- **`flash`:** `answer` + 1–3 `keyPoints`, no choices. Tap to reveal, then self-grade "Je savais" / "Pas su". Doesn't count toward the combo.
- **Id rules:** a typo fix keeps the id. A change of meaning or answer gets a new id, and the old id goes in `retired-ids.json`.

### progress.ts
- Key `pause-maths:progress`, `v: 1`.
- Shape: `cards: Record<id, {box 1..5, due, n, k, wrongLast, at}>`, `activeDays: string[]` (streak is derived from it), `settings: {courses, topics, challenge, updatedAt}`, `flagged: string[]`, `syncCode?`.
- **Load:** `JSON.parse` → `migrations[v]` step by step → Zod `safeParse`. On any failure, or a version newer than the app knows, copy the raw data to `pause-maths:backup-<ts>` and start fresh. Never overwrite silently.
- **Save:** the whole object after each answer, inside try/catch. On failure keep state in memory and show a banner.
- **Derived data:** XP and mastery are computed from cards, never stored. Cards whose id is no longer in the bank are ignored.
- Call `navigator.storage.persist()` once.
- Pure functions; `now` is always a parameter.

### merge.ts (pure; used by client and server)
- Per card: keep the entry with the later `at`.
- `activeDays` and `flagged`: union.
- `settings`: the one with the later `updatedAt`.
- Reset progress = a new empty state with fresh timestamps.

### scheduler.ts (pure; seeded mulberry32 rng and `now` injected)
```
INTERVAL = {1: 10 min, 2: 1 d, 3: 3 d, 4: 7 d, 5: 16 d}
applyAnswer(p, id, ok, now): box = ok ? min(box+1, 5) : 1; due = now + INTERVAL[box]; at = now

nextQuestion(bank, selection, p, session, mode, now, rng):
  pool = bank ∩ selected courses ∩ ticked topics ∩ (challenge only if Défi on) − session.shown
  mode aRevoir: pool = cards with wrongLast (single tier)
  tiers (first non-empty): A due & box 1 · B unseen · C due & box ≥ 2 · D not due (earliest due)
  all empty: sansFin → forget shown except last 10 and retry; otherwise return null
  course = weightedPick(courses in tier sorted by code, w = 1 + 2·weak), avoid session.lastCourse if another exists
  topic  = weightedPick(same rule inside the course), avoid session.lastTopic if another exists
  question = fisherYates(candidates, rng) then stable sort (box, due, difficulty) → first
  weak(x) = seen cards with wrongLast / seen cards (0 if none)
```
- **Why tier A comes before unseen:** the user asked for "unseen first", but with ~400 unseen questions a just-missed one would otherwise not come back for weeks.
- **Tests:** fixed seeds; cover each tier, no repeats within a session, course alternation, weighting, the sansFin restart, and challenge filtering.

### Sync
- **Code:** 12 characters from a 32-character unambiguous alphabet (no 0/O/1/I), shown as `XXXX-XXXX-XXXX`, generated on "Activer la synchro". Entering it on another device merges both states.
- **`api/sync.ts`:** key = SHA-256(code); body ≤ 200 KB; basic rate limit; GET returns the blob; PUT runs server-side `merge` with the stored blob, then stores the result.
- **Client:** syncs at the end of a round, on app resume and on reconnect. Offline answers just live in local state until the next sync.
- **Storage choice:** Upstash Redis via the Vercel Marketplace free tier, falling back to Vercel Blob. This is assumed, not verified. **Before wiring, check that the free tier has no inactivity pause/archive** (the reason Supabase was rejected). Adding a Marketplace integration means accepting terms, so **the user must click "Add integration" in Vercel.** Tell them exactly where; don't do it yourself.

### UI, PWA, deploy
- **Theme:**
  - Course colors, rounded cards.
  - Spring animation on a correct answer, shake on a wrong one, combo flame, light confetti on a perfect Rafale.
  - Respect `prefers-reduced-motion`.
  - Call `navigator.vibrate` only if it exists (iOS doesn't have it).
  - Desktop keys: 1–4 answer, V/F, Space reveals a flash card, Enter next.
  - Load the `impeccable` design skill for UI work.
- **Mobile:**
  - `viewport-fit=cover`, `env(safe-area-inset-*)` padding, `100dvh`, `touch-action: manipulation`.
  - `.katex-display { overflow-x: auto }`, or matrices break a 360 px screen.
  - When not running standalone, show a hint to install it.
- **The trap behind the install hint.** Relayed from the plan-review agent, not tested: on iOS, Safari and the home-screen app have **separate storage**, so the user must always use the icon. Home-screen apps are exempt from Safari's 7-day storage eviction.
- **vite-plugin-pwa:**
  - `registerType: 'prompt'`, **not** `autoUpdate` (that would reload in the middle of a Rafale).
  - `workbox.globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,woff2}']`, `cleanupOutdatedCaches: true`.
  - On `visibilitychange` (at most once an hour) call `registration.update()`, because an iOS PWA resumes without reloading.
  - Apply a waiting update silently only on the Home or Recap screen.
  - Show the bank version (build date + question count) in Stats.
- **Manifest:** `id`, `scope`, `lang: "fr-CA"`, `display: "standalone"`, 192/512 + maskable icons, a 180 px opaque apple-touch-icon. Add `<meta name="robots" content="noindex">`.
- **vercel.json:**
  - `Cache-Control: no-cache` on `/sw.js`, `/index.html`, `/manifest.webmanifest`
  - `Content-Type: application/manifest+json` on the manifest
  - `/assets/(.*)`: `public, max-age=31536000, immutable`
  - `engines.node: "24.x"` in package.json
- **Deploy:** GitHub → Vercel Git integration, auto-deploy on push to `main`.
- **Deployment protection.** Relayed from the plan-review agent, not tested: Standard Protection puts a login wall on per-deployment URLs but not on the production domain. **Give the phone only the production URL**, write it in CLAUDE.md, and check it with `curl -sI`.

## 8. Part C: content (the most important part)

For each course, in order STT1700 → MAT1600 → MAT1400 → MAT1500:
1. Read `D:\Math\<course>`: plan de cours, notes, TP/devoir solutions, finished-quiz reviews, past exams.
2. Define the intra topic list in `courses.ts`, with `defaultOn` = taught as of today. Work that out from StudiUM's weekly sections and the course calendars.
3. Author **~100 questions, about 8 per topic, one topic at a time.** Target mix: ~60 % qcm / 20 % vf / 20 % flash, ~10 % Défi, mostly difficulty 1–2.
4. Wrong choices must be **real student mistakes**. Examples:
   - forgetting the jacobian $r$
   - treating the ratio test with $L=1$ as conclusive
   - negating ∀∃ wrongly
   - converse vs contrapositive
   - arrangements vs combinations
   - $\det(kA)=k\det A$ or $\det(A+B)=\det A+\det B$
   - σ vs σ/√n
5. Never write "toutes/aucune de ces réponses". Never copy wording from course files; rewrite.
6. Redeploy after each course. Record the files used in `docs/SOURCES.md` (paths only).

**Quality gate: per topic, and for every import.**
1. `tests/content.test.ts` checks:
   - Zod validity, unique ids, id prefix = course, no retired id, topic exists in `courses.ts`
   - no duplicate choice texts, no "toutes/aucune", prompt ≤ 280
   - **no control characters (U+0000–U+001F) in any string.** This catches JSON `"\theta"`, which silently becomes a tab + "heta"; the same happens with `\frac`, `\nabla`, `\binom`, `\right`, and KaTeX shows no error.
   - every formula from the app's own `splitMath` compiles in KaTeX with `throwOnError: true`, and no stray `$` is left
   - `challenge` ⇒ `solution` is present
   - **Control:** confirm each check fails on a deliberately broken fixture before trusting it.
2. **Blind review agent.** It gets shuffled choices with no correct flags and no explanation. For each question it:
   - picks an answer, with confidence
   - says why each other choice is wrong (a blind solve alone won't catch a question with two correct answers)
   - verifies computed results with a SymPy script in a scratch venv **outside the repo**

   A disagreement goes to a third agent to decide, then the question is fixed or dropped. Log results in `docs/reviews/<course>-<topic>.md`.

## 9. Part D: process doc, import, project skill

- **`docs/PROCESSUS_QUESTIONS.md`** (French; also copied to `D:\Math\PROCESSUS_QUESTIONS.md` for the user to upload to claude.ai). Contents:
  - purpose
  - the exact JSON format
  - the list of topic ids per course
  - style rules: 15–45 s, no calculator, rewrite never copy, distractor = real mistake, explanation names the trap, Défi rules
  - 3 examples per type
  - a self-check list
  - "réponds avec un seul tableau JSON, rien d'autre"
- **`scripts/import-questions.ts`** (`npm run import -- <file.json>`): validates, routes each question into `src/content/<course>/<topic>.json`, rejects duplicate or retired ids, prints a summary.
- **`.claude/skills/ajouter-questions/SKILL.md`**: user pastes JSON → save it to scratch → import → gate (tests + blind review) → commit → push (auto-deploy) → report counts plus anything fixed or dropped.

## 10. Execution order

End every step with a WORKLOG entry, a commit and a push.
0. **Scaffold.** Vite + Preact + TS in this folder (don't run the interactive `npm create`; write the config files by hand or pass flags). Then `.gitignore`, `CLAUDE.md`, `docs/WORKLOG.md`, and `gh repo create AMoncade/pause-maths --private --source . --push`.
1. **Part A:** rename `MAT1700` → `STT1700`, scrape StudiUM, copy the Downloads material, write INDEX/LIENS/manifest. Then the `studium-sync` skill (commit + push the skills repo).
2. **Engine, test first:** schema, progress, merge, scheduler.
3. **UI:** screens, KaTeX, playful theme.
4. **PWA + sync function + Vercel deploy** with ~10 reviewed questions per course. Give the user the production URL to install on the iPhone.
5. **Part C content,** course by course in exam order, gate per topic, redeploy after each course.
6. **Part D:** process doc, import script, `ajouter-questions` skill.

Also add a project memory: `C:\Users\adrie\.claude\projects\C--Users-adrie\memory\project_pause_maths.md` plus a line in `MEMORY.md`. Update it at the end.

## 11. Verification (acceptance)

- **Scrape:**
  - file counts per course in D:\Math ≥ the §3 survey
  - every file is listed in INDEX.md
  - quiz attempt counts are identical before and after
  - running `studium-sync` right away reports "rien de nouveau"
- **Tests and build:** `npm test` and `npm run build` pass. For each gate check, also show it failing on a broken fixture.
- **App in Chrome** (claude-in-chrome), `npm run preview` at 390 px width:
  - pick courses; answer right and wrong; feedback and `why` appear
  - Rafale → recap → Encore 5; Sans fin works
  - À revoir shows only misses
  - unticking a topic removes its questions
  - Défi on → challenge questions and "Voir la solution"
  - flash card reveal works
  - progress survives a reload
  - desktop shortcuts work
- **DevTools → Application:** manifest installable, service worker active, reload works offline.
- **Sync:** use two browser profiles.
  - activate the code on A, enter it on B
  - answer on both, one of them offline
  - after reconnecting, both show the merged progress
  - a wrong code gives a clear error
- **Production:**
  - `curl -sI` on the prod URL, `/sw.js` and `/manifest.webmanifest` → 200 with the expected headers
  - deploy a build with one extra question, reopen the app → the update applies on Home and the count in Stats goes up
- **User on iPhone:** prod URL in Safari → Share → "Sur l'écran d'accueil" → open from the icon → enter the sync code → answer a few → airplane mode → still works.

## 12. Not done / not verified

- **Nothing is implemented.** The repo has no commits and no GitHub remote. No Vercel project exists, and `D:\Math` has not been changed.
- **Never tested:**
  - downloading from StudiUM through Chrome (§6 mechanism)
  - whether Chrome shows the multi-download prompt
  - Upstash's free-tier inactivity policy
  - vitest 5 ↔ vite 8 compatibility
  - the iOS storage and Vercel protection behaviour in §7 (relayed from the review agent)
- **STT1700 topics are unknown** until its 38 PDFs are read.
- The MAT1500 TP quiz on Sep 17 comes too soon for this build; nothing to do about it.

**Status: idle.** Nothing in flight, nothing waiting on anyone. The next session starts at step 0.
