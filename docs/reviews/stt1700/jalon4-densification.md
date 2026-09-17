# Jalon 4 — sous-sujets non couverts par les 34 questions

Comparaison entre le contenu retenu par thème (`docs/sources/stt1700.md`) et les 34 questions
existantes (10 descr, 12 prob, 12 var) : chaque formule/notion sans question au moins vf, flash
ou qcm est un candidat.

- **`stt1700-descr`** : aucune question sur les diagrammes (bâtons vs histogramme vs
  tige-feuilles), sur la transformation affine de l'écart-type ($s_y=|b|s_x$), ni sur
  l'asymétrie gauche/droite ; le lien $r_{xy}=b\,s_x/s_y$ n'est testé nulle part (seule la
  formule $r_{xy}=c_{xy}/(s_xs_y)$ l'est, via -010).
- **`stt1700-prob`** : les axiomes de Kolmogorov ($\Pr(\emptyset)=0$) et la monotonie
  ($A\subseteq B\Rightarrow\Pr(A)\le\Pr(B)$) ne sont pas testés ; la règle du complément
  ($\Pr(A^c)=1-\Pr(A)$) et la règle de multiplication ($\Pr(A\cap B)=\Pr(A\mid B)\Pr(B)$) comme
  formules isolées non plus ; l'indépendance mutuelle n'est testée que pour 2 événements, jamais 3.
- **`stt1700-var`** : $E(X)=np$ pour la binomiale n'est jamais demandé seul (seule sa variance
  l'est, -010) ; aucune évaluation numérique de la fonction de répartition $F(x)$ ; la
  combinaison linéaire n'est testée qu'à 2 variables indépendantes (-008), jamais à 3 ; la
  contrainte de somme à 1 des $p_i$ n'est testée que pour une v.a. discrète simple (-001), jamais
  pour la loi multinomiale ; la fonction de masse binomiale $p(x)=\binom nx p^x(1-p)^{n-x}$ n'est
  jamais demandée comme formule (seulement appliquée numériquement, -009).

14 questions ciblent ces trous : +4 descr, +5 prob, +5 var (détail et vérification numérique
dans `docs/reviews/stt1700/stt1700-descr.md`, `-prob.md`, `-var.md` après relecture).
