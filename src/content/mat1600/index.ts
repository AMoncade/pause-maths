// Propriété du lot MAT1600 (adrie-18). Liste vérifiée contre le calendrier StudiUM réel
// (D:\Math\MAT1600) le 2026-09-17 — voir docs/sources/mat1600.md et
// docs/reviews/mat1600/verification-studium.md. Ordre = ordre pédagogique du cours (séances 1-11).
import type { Course } from '@/lib/types';

export const mat1600: Course = {
  code: 'MAT1600',
  title: 'Algèbre linéaire',
  color: '#3b82f6',
  topics: [
    { id: 'mat1600-syst', label: 'Systèmes linéaires et Gauss', exam: 'intra', defaultOn: true }, // séance 1
    { id: 'mat1600-vect', label: 'Équations vectorielles, indépendance', exam: 'intra', defaultOn: true }, // séances 1-2
    { id: 'mat1600-matr', label: 'Algèbre des matrices, inverse', exam: 'intra', defaultOn: true }, // séance 2
    { id: 'mat1600-det', label: 'Déterminants', exam: 'intra', defaultOn: true }, // séance 3, théorie lundi 14 sept
    { id: 'mat1600-esp', label: 'Espaces vectoriels, noyau et image', exam: 'intra', defaultOn: false }, // séance 4, lundi 21 sept
    { id: 'mat1600-trans', label: 'Transformations linéaires', exam: 'intra', defaultOn: false }, // séance 5, lundi 28 sept
    { id: 'mat1600-dim', label: 'Bases, dimension et rang', exam: 'final', defaultOn: false }, // séances 6-7, fin octobre
    { id: 'mat1600-orth', label: 'Orthogonalité', exam: 'final', defaultOn: false }, // séances 8-9, novembre
    { id: 'mat1600-diag', label: 'Valeurs propres et diagonalisation', exam: 'final', defaultOn: false }, // séances 10-11, fin novembre
  ],
};
