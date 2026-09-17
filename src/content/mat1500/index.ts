// Propriété du lot MAT1500 (adrie-87). Thèmes vérifiés contre la page de structure StudiUM
// (MAT1500-A-A26) et les devoirs 1-2 le 2026-09-17 : voir docs/reviews/mat1500/verification-studium.md.
// Intra : jeudi 29 octobre 2026, 10h30-12h20, B-2325 Pav. 3200 J.-Brillant, 35 %, chapitres 1 à 3.
// Final : jeudi 10 décembre 2026, 8h30-11h20, 55 %, cumulatif.
// `defaultOn` = déjà vu en classe au 2026-09-17 ; raisonnement dans docs/sources/mat1500.md.
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
    { id: 'mat1500-proof', label: 'Méthodes de preuve', exam: 'intra', defaultOn: true },
    { id: 'mat1500-induc', label: 'Induction', exam: 'intra', defaultOn: false },
    { id: 'mat1500-divis', label: 'Divisibilité et nombres premiers', exam: 'intra', defaultOn: false },
    { id: 'mat1500-modul', label: 'Arithmétique modulaire', exam: 'intra', defaultOn: false },
    { id: 'mat1500-count', label: 'Dénombrement', exam: 'final', defaultOn: false },
    { id: 'mat1500-graphs', label: 'Graphes et coloriages', exam: 'final', defaultOn: false },
  ],
};
