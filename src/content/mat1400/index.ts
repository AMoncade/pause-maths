// Propriété du lot MAT1400. Ordre et dates = calendrier officiel StudiUM MAT1400-AB-A26
// (vérifié le 2026-09-17, voir docs/sources/mat1400.md), pas l'énumération générique du
// HANDOFF §2. defaultOn = déjà enseigné au 2026-09-17 (le cours suit Stewart mais enseigne
// le chap. 4.4 avant 4.1-4.2).
import type { Course } from '@/lib/types';

export const mat1400: Course = {
  code: 'MAT1400',
  title: 'Calcul 1',
  color: '#f97316',
  topics: [
    // --- Intra (lundi 26 oct. 2026, 15h30-17h20) : annexes A et B, chap. 3, 4 et 5 ---
    { id: 'mat1400-vect', label: 'Vecteurs, matrices, droites et plans', exam: 'intra', defaultOn: true }, // annexes A-B, 1-3 sept
    { id: 'mat1400-fonc', label: 'Fonctions de plusieurs variables, limites et continuité', exam: 'intra', defaultOn: true }, // 3.1-3.2, 8-10 sept
    { id: 'mat1400-quad', label: 'Cylindres et surfaces quadriques', exam: 'intra', defaultOn: true }, // 3.3, 15 sept
    { id: 'mat1400-grad', label: 'Dérivées directionnelles et gradient', exam: 'intra', defaultOn: true }, // 4.4, jeu. 17 sept (théorie 8h30-10h30)
    { id: 'mat1400-part', label: 'Dérivées partielles, plan tangent', exam: 'intra', defaultOn: false }, // 4.1-4.2, 22 sept
    { id: 'mat1400-chain', label: 'Règle de dérivation en chaîne', exam: 'intra', defaultOn: false }, // 4.3, 24 sept
    { id: 'mat1400-extr', label: 'Valeurs extrêmes et optimisation', exam: 'intra', defaultOn: false }, // 5.1-5.2, 29 sept-1 oct
    { id: 'mat1400-lagr', label: 'Multiplicateurs de Lagrange', exam: 'intra', defaultOn: false }, // 5.3, 6-8 oct
    // --- Final (jeu. 17 déc. 2026) : chap. 6, 7, 1, 2. Pas de questions pour l'instant. ---
    { id: 'mat1400-dint', label: 'Intégrales doubles, coordonnées polaires', exam: 'final', defaultOn: false }, // 6.1-6.4
    { id: 'mat1400-tint', label: 'Intégrales triples, coordonnées cylindriques et sphériques, changement de variables', exam: 'final', defaultOn: false }, // 7.1-7.5
    { id: 'mat1400-suit', label: 'Suites et séries numériques', exam: 'final', defaultOn: false }, // ch. 1
    { id: 'mat1400-tayl', label: 'Séries de puissances et séries de Taylor', exam: 'final', defaultOn: false }, // ch. 2
  ],
};
