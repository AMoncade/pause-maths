// Propriété du lot MAT1600 (adrie-18). Liste initiale = HANDOFF §2 (ordre Lay), à affiner d'après D:\Math\MAT1600.
import type { Course } from '@/lib/types';

export const mat1600: Course = {
  code: 'MAT1600',
  title: 'Algèbre linéaire',
  color: '#3b82f6',
  topics: [
    { id: 'mat1600-syst', label: 'Systèmes linéaires et Gauss', exam: 'intra', defaultOn: true },
    { id: 'mat1600-vect', label: 'Équations vectorielles, indépendance', exam: 'intra', defaultOn: true },
    { id: 'mat1600-matr', label: 'Algèbre des matrices, inverse', exam: 'intra', defaultOn: true },
    { id: 'mat1600-det', label: 'Déterminants', exam: 'intra', defaultOn: false },
    { id: 'mat1600-esp', label: 'Espaces vectoriels et bases', exam: 'intra', defaultOn: false },
    { id: 'mat1600-diag', label: 'Valeurs propres et diagonalisation', exam: 'final', defaultOn: false },
    { id: 'mat1600-orth', label: 'Orthogonalité', exam: 'final', defaultOn: false },
  ],
};
