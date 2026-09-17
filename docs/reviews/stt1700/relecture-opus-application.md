# Réponse à la relecture pédagogique Opus (docs/reviews/relecture-opus/stt1700.md)

Toutes les corrections décidées par l'admin ont été appliquées. Aucun rejet.

## Élevée

- **descr-012** : `why` du choix $24$ corrigé → « Élève le coefficient au carré sans élever aussi $s_x$ : $(-2)^2\times6=24$. La variance, elle, vaut $b^2s_x^2=4\times36=144$ ; l'écart-type est $\lvert b\rvert s_x$. » Id conservé (ni le sens ni la réponse ne changent).

## Moyenne

- **prob-013 → prob-018** : option (b) du rapport retenue par l'admin (meilleure question, rééquilibre les vrai/faux). Nouvel id `stt1700-prob-018` : énoncé « $\Pr(\emptyset)=0$ fait partie des trois axiomes de la définition d'une probabilité. », `answer: false`, `explanation` « Faux : les trois axiomes sont $\Pr(A)\ge0$, l'additivité des événements disjoints et $\Pr(\Omega)=1$. $\Pr(\emptyset)=0$ est une propriété qui s'en déduit. » `stt1700-prob-013` retiré de `stt1700-prob.json`. `src/content/retired-ids.json` **non touché** : fichier admin, l'admin y ajoute `stt1700-prob-013`.
- **descr-003** : option (a) minimale retenue par l'admin. Choix $5$ remplacé par $15{,}75$, `why` : « Prend la position de $Q_3$, $3(n+1)/4=8{,}25$, au lieu de celle de $Q_1$ : on obtient $15+0{,}25\times(18-15)=15{,}75$. » Id conservé, bonne réponse inchangée ($6{,}5$).
- **Commutateur Défi (var-006, prob-017, var-015)** : `challenge` retiré de `var-006` et `prob-017` (leur `solution` reste présente ; le schéma (`src/lib/schema.ts`) n'exige `solution` que si `challenge: true`, l'inverse n'est pas requis — rien à retirer côté `solution`). `var-015` promue Défi (`challenge: true`) avec la `solution` fournie par le rapport (5 étapes, $2+20+9=31$). Ids inchangés partout. Effet mesuré sur `tests/bank-stats.test.ts` : Défi 5/48 = 10,4 % (bornes 5–15 % ✓), qcm inchangé à 28/48 = 58,3 %.

## Basse (8/8 appliquées)

- **var-005** : `why` du choix $9$ complété → « Additionne $4+5$ au lieu de multiplier, et laisse tomber la constante $-2$ au passage. »
- **var-006** : `why` du choix $-54$ corrigé (ne se contredit plus) → « Calcule $-(3^2)\times6=-54$ en sortant le signe du carré, alors que $(-3)^2=9$ — une variance ne peut jamais être négative. »
- **descr-011** : 3ᵉ `keyPoint` ajouté → « Le diagramme circulaire est l'autre graphique du cours pour une variable qualitative. »
- **prob-009** : `explanation` complétée → « … Incompatibilité et indépendance s'excluent mutuellement dès que les deux probabilités sont non nulles. »
- **var-016** : correctif minimal retenu par l'admin (id conservé) — `difficulty` 2 → 1, 2ᵉ `keyPoint` reformulé → « Même contrainte que pour la fonction de masse de toute v.a. discrète. »
- **descr-009** : `prompt` complété → « Le nombre d'enfants dans un ménage est-il une variable qualitative ou quantitative ? Si quantitative : discrète ou continue ? » (réponse inchangée : « Quantitative discrète »).
- **descr-006** : `prompt` reformulé (correctif optionnel du rapport, appliqué) → « Au-delà de quelle valeur une donnée est-elle identifiée séparément comme atypique (boîte modifiée) ? » (même réponse $100$, même id).
- **prob-004** : choix correct $0{,}60$ → $0{,}6$ (cohérence de format avec les trois autres choix).

## Écarté

Rien n'a été écarté : les 12 points du rapport (1 élevée, 3 moyennes, 8 basses) ont tous une décision admin explicite et ont tous été appliqués.

## Vérification après correctifs

- `npm test` : **363/363 verts**, y compris `tests/bank-stats.test.ts` (Défi STT1700 5/48 = 10,4 %, dans les bornes 5–15 % ; qcm 28/48 = 58,3 %, dans les bornes 50–70 % ; chaque thème ≥ 8 questions : descr 14, prob 17, var 17).
- `npm run typecheck` : OK, aucune erreur.
- `npm run build` : OK (avertissement de taille de chunk pré-existant, sans lien avec le contenu).
- Compte mesuré (`grep -c '"id"' src/content/stt1700/*.json`) : descr 14, prob 17, var 17 = **48 questions**, inchangé (une question retirée, une ajoutée).
- Pas de relecture aveugle relancée : aucune bonne réponse n'a changé (seul le sens de `prob-013`→`prob-018` change, avec un nouvel id dédié comme l'exige la règle des ids du HANDOFF §7) ; tous les autres correctifs touchent des `why`/`explanation`/`keyPoints`/`prompt` sans changer la bonne réponse ni la structure. Vérifié manuellement pour cohérence mathématique et pédagogique contre le texte exact du rapport de relecture.
