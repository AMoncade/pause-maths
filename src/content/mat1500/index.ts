// Propriété du lot MAT1500 (adrie-87). Thèmes ajustés d'après le calendrier réel :
// voir docs/sources/mat1500.md pour le raisonnement des `defaultOn`.
import type { Course } from '@/lib/types';

export const mat1500: Course = {
  code: 'MAT1500',
  title: 'Mathématiques discrètes',
  color: '#a855f7',
  topics: [
    { id: 'mat1500-logic', label: 'Logique propositionnelle', exam: 'intra', defaultOn: true },
    { id: 'mat1500-quant', label: 'Quantificateurs et négation', exam: 'intra', defaultOn: true },
    { id: 'mat1500-sets', label: 'Ensembles', exam: 'intra', defaultOn: false },
    { id: 'mat1500-func', label: 'Fonctions', exam: 'intra', defaultOn: false },
    { id: 'mat1500-proof', label: 'Méthodes de preuve', exam: 'intra', defaultOn: false },
    { id: 'mat1500-induc', label: 'Induction', exam: 'intra', defaultOn: false },
    { id: 'mat1500-divis', label: 'Divisibilité et nombres premiers', exam: 'intra', defaultOn: false },
    { id: 'mat1500-modul', label: 'Arithmétique modulaire', exam: 'intra', defaultOn: false },
    { id: 'mat1500-count', label: 'Dénombrement', exam: 'final', defaultOn: false },
    { id: 'mat1500-graphs', label: 'Graphes et coloriages', exam: 'final', defaultOn: false },
  ],
};
