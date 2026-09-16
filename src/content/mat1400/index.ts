// Propriété du lot MAT1400 (adrie-d7). Liste initiale = HANDOFF §2, à affiner d'après D:\Math\MAT1400.
import type { Course } from '@/lib/types';

export const mat1400: Course = {
  code: 'MAT1400',
  title: 'Calcul 1',
  color: '#f97316',
  topics: [
    { id: 'mat1400-vect', label: 'Vecteurs, droites et plans', exam: 'intra', defaultOn: true },
    { id: 'mat1400-fonc', label: 'Fonctions de plusieurs variables, limites', exam: 'intra', defaultOn: true },
    { id: 'mat1400-quad', label: 'Cylindres et quadriques', exam: 'intra', defaultOn: true },
    { id: 'mat1400-part', label: 'Dérivées partielles, plan tangent', exam: 'intra', defaultOn: true },
    { id: 'mat1400-chain', label: 'Règle de chaîne, gradient, dérivée directionnelle', exam: 'intra', defaultOn: false },
    { id: 'mat1400-extr', label: 'Extrema et optimisation', exam: 'intra', defaultOn: false },
    { id: 'mat1400-lagr', label: 'Multiplicateurs de Lagrange', exam: 'intra', defaultOn: false },
  ],
};
