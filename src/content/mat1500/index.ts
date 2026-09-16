// Propriété du lot MAT1500 (adrie-87). Liste initiale = HANDOFF §2, à affiner d'après D:\Math\MAT1500.
import type { Course } from '@/lib/types';

export const mat1500: Course = {
  code: 'MAT1500',
  title: 'Mathématiques discrètes',
  color: '#a855f7',
  topics: [
    { id: 'mat1500-logic', label: 'Logique propositionnelle', exam: 'intra', defaultOn: true },
    { id: 'mat1500-quant', label: 'Quantificateurs et négation', exam: 'intra', defaultOn: true },
    { id: 'mat1500-sets', label: 'Ensembles', exam: 'intra', defaultOn: true },
    { id: 'mat1500-func', label: 'Fonctions', exam: 'intra', defaultOn: false },
    { id: 'mat1500-proof', label: 'Méthodes de preuve', exam: 'intra', defaultOn: false },
    { id: 'mat1500-induc', label: 'Induction', exam: 'intra', defaultOn: false },
    { id: 'mat1500-divis', label: 'Divisibilité et nombres premiers', exam: 'intra', defaultOn: false },
    { id: 'mat1500-modul', label: 'Arithmétique modulaire', exam: 'intra', defaultOn: false },
  ],
};
