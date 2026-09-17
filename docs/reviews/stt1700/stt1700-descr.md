# Relecture — stt1700-descr (jalon 1)

Brouillon initial produit par `agy` (Gemini/Opus 4.6, quota Google) à partir de
`docs/PROCESSUS_QUESTIONS.md` et des PDF `1. Statistiques descriptives/*.pdf` +
`AideMemoire_intra1_STT1700.pdf`. Vérification manuelle avant import (Fraction Python) :
**3 des 10 questions du brouillon initial avaient une erreur mathématique réelle**,
corrigées avant le gate (voir « Essai `agy` » plus bas) — donc 7/10 gardées telles
quelles, 3/10 corrigées, 0/10 rejetées.

Gate (`npm test`, `npm run build`) : 0 erreur après corrections. Relecture aveugle via
`scripts/blind-review.ts` (seed 217, clé dans le scratchpad de session, jamais montrée
au relecteur), sous-agent **Haiku** frais, vérification Python (fractions exactes) pour
chaque calcul.

## stt1700-descr-001 (qcm)

Réponse : $10$ — confiance 5/5. Vérifié : données $3,5,7,9,11$, $\bar x=7$,
$\sum(x_i-\bar x)^2=40$, $s^2=40/4=10$. Réfutations correctes pour $\sqrt{10}$
(écart-type, pas variance), $40$ (numérateur non divisé) et $8$ ($n=5$ au dénominateur
au lieu de $n-1=4$).
Verdict : **OK**.

## stt1700-descr-002 (qcm)

Réponse : $5$ — confiance 5/5. Vérifié : $n=6$ pair, médiane $=(x_{(3)}+x_{(4)})/2=(4+6)/2=5$.
Réfutations correctes pour $4$, $6$ (une seule des deux valeurs centrales) et $5{,}67$
(moyenne confondue avec médiane).
Verdict : **OK**.

## stt1700-descr-003 (qcm)

Réponse : $6{,}5$ — confiance 5/5. Vérifié : $n=10$, position $Q_1=(n+1)/4=2{,}75$,
interpolation entre $x_{(2)}=2$ et $x_{(3)}=8$ : $2+0{,}75\times6=6{,}5$. Réfutations
correctes pour $2$ (position arrondie vers le bas), $8$ (méthode médiane-des-moitiés du
relecteur, cohérente avec la position arrondie vers le haut) et $5$ (position $n/4=2{,}5$
au lieu de $(n+1)/4$).
Verdict : **OK**.

## stt1700-descr-004 (qcm)

Réponse : $0{,}7$ — confiance 5/5. Vérifié : $z=(72-65)/10=0{,}7$. Réfutations correctes
pour $-0{,}7$ (signe inversé), $7$ (division par $s$ oubliée) et $7{,}2$ ($x/s$ sans
centrer).
Verdict : **OK**.

## stt1700-descr-005 (qcm)

Réponse : $1{,}875$ — confiance 5/5. Vérifié : $b=c_{xy}/s_x^2=30/16=1{,}875$. Réfutations
correctes pour $7{,}5$ (division par $s_x$ au lieu de $s_x^2$), $0{,}75$ ($r_{xy}$ au lieu
de $b$) et $3$ (division par $s_y$ au lieu de $s_x^2$).
Verdict : **OK**.

## stt1700-descr-006 (qcm)

Réponse : $100$ — confiance 5/5. Vérifié : $\text{IQR}=55-25=30$, clôture haute
$=Q_3+1{,}5\times\text{IQR}=55+45=100$ ; $\max=130>100$ donc la moustache s'arrête à $100$
(boîte modifiée). Réfutations correctes pour $130$ (boîte simple, pas modifiée), $85$
(facteur $1{,}5$ oublié) et $70$ (part de la médiane au lieu de $Q_3$).
Verdict : **OK**.

## stt1700-descr-007 (vf)

Réponse : Faux — confiance 5/5. Contre-exemple : $\{1,1,2,2,3\}$ est bimodal (modes $1$
et $2$), donc le mode n'est pas nécessairement unique.
Verdict : **OK**.

## stt1700-descr-008 (vf)

Réponse : Vrai — confiance 5/5. Confirmé : ce cours nomme sa règle empirique
« 68-95-99 » (et non « 68-95-99,7 » comme d'autres manuels) pour les intervalles à 1, 2
et 3 écarts-types — vérifié directement dans `CoursSTT1700Sect1A26H27.pdf` (§1.6) avant
d'écrire la question.
Verdict : **OK**.

## stt1700-descr-009 (flash)

Réponse attendue du relecteur : quantitative discrète (le dénombrement d'enfants est une
mesure, pas une catégorie ; valeurs entières). Correspond à la réponse de la banque.
Verdict : **OK**.

## stt1700-descr-010 (qcm, Défi)

Réponse : $\hat y=1+2x$ — confiance 5/5. Vérifié : $b=c_{xy}/s_x^2=20/10=2$,
$a=\bar y-b\bar x=11-10=1$, passe par $(\bar x,\bar y)=(5,11)$. Réfutations correctes pour
$\hat y=11+2x$ ($a=\bar y$ sans soustraire $b\bar x$), $\hat y=2+x$ ($a$ et $b$ échangés) et
$\hat y=8{,}5+0{,}5x$ (pente inversée $s_x^2/c_{xy}$).
Verdict : **OK**.

**Résultat (jalon 1, 1-10) : 10/10 publiables, 0 désaccord avec la clé.**

## Essai `agy` (mesure d'économie du tour 2)

Brouillon initial (`claude-opus-4-6-thinking` via Antigravity) globalement solide sur le
fond (formules, conventions du cours respectées — y compris le piège spécifique
« 68-95-99 » de ce cours et la méthode de quartile du cours plutôt que Tukey) mais avec
**3 défauts réels corrigés avant import**, aucun rejet complet :

1. **Backslash LaTeX doublé deux fois** (43 occurrences dans le fichier : `\\\\bar`,
   `\\\\sum`, etc. au lieu de `\\bar`, `\\sum`) — aurait cassé le rendu KaTeX de presque
   toutes les formules. Corrigé par une passe de substitution automatique
   (`\\\\` → `\\`), revérifié par un parse JSON + relecture visuelle.
2. **Erreur arithmétique dans `descr-010` (Défi) :** covariance donnée ($c_{xy}=10$) ne
   correspondait pas aux 5 points $(x,y)$ fournis dans l'énoncé (recalcul manuel :
   $c_{xy}=44/4=11$, pas $10$) — jeu de données remplacé entièrement par un nouveau
   (vérifié avec `fractions.Fraction` en Python) pour rester cohérent.
3. **`descr-003` (quartile) :** deux distracteurs avaient une valeur numérique
   incohérente avec le calcul décrit dans leur propre `why` (ex. « moyenne de
   $x_{(2)}$ et $x_{(3)}$ » étiquetée $3{,}5$ alors que ce calcul donne $4$ sur les
   données du brouillon). Jeu de données et distracteurs entièrement refaits et
   vérifiés par script.

**Mesure (brief tour 2) : 10 questions produites par agy, 10 gardées (7 telles quelles, 3
corrigées), 0 rejetée.** Utile pour un premier jet correct sur le fond (formules, style,
pièges), mais **pas fiable sans vérification numérique systématique** : les 3 défauts
trouvés étaient tous invisibles à la simple lecture (un problème d'encodage de
caractères, une covariance jamais recalculée à partir des données fournies, et une
incohérence interne entre un texte et son chiffre). Sans le script de vérification
`fractions.Fraction`, l'erreur de `descr-010` serait passée le gate de format (aucune
règle ne vérifie qu'une covariance correspond à des données données en exemple) et
n'aurait été détectée qu'à la relecture aveugle humaine — plus tard et à plus grand
risque de publication.
