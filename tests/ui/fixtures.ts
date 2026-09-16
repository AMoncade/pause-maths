// Banque et cours de test du lot UI (indépendants du contenu réel, vide aujourd'hui).
import type { Course, FlashQuestion, QcmQuestion, Question, VfQuestion } from '@/lib/types';

export const uiCourses: Course[] = [
  {
    code: 'MAT1400',
    title: 'Calcul 1',
    color: '#f97316',
    topics: [
      { id: 'mat1400-part', label: 'Dérivées partielles', exam: 'intra', defaultOn: true },
      { id: 'mat1400-lagr', label: 'Lagrange', exam: 'intra', defaultOn: true },
    ],
  },
  {
    code: 'MAT1500',
    title: 'Mathématiques discrètes',
    color: '#a855f7',
    topics: [{ id: 'mat1500-logic', label: 'Logique propositionnelle', exam: 'intra', defaultOn: true }],
  },
  {
    code: 'MAT1600',
    title: 'Algèbre linéaire',
    color: '#3b82f6',
    topics: [{ id: 'mat1600-det', label: 'Déterminants', exam: 'intra', defaultOn: true }],
  },
  {
    code: 'STT1700',
    title: 'Introduction à la statistique',
    color: '#22c55e',
    topics: [],
  },
];

export const qcm: QcmQuestion = {
  id: 'mat1400-part-001',
  course: 'MAT1400',
  topic: 'mat1400-part',
  difficulty: 1,
  type: 'qcm',
  prompt: 'Que vaut $\\frac{\\partial}{\\partial x}(x^2 y)$ ?',
  explanation: 'On dérive en $x$ en traitant $y$ comme une constante.',
  choices: [
    { text: '$2xy$', correct: true },
    { text: '$x^2$', correct: false, why: 'Ça, c’est la dérivée par rapport à $y$.' },
    { text: '$2x$', correct: false, why: 'Le facteur $y$ ne disparaît pas.' },
    { text: '$2xy + x^2$', correct: false, why: 'On ne dérive pas en $y$ en même temps.' },
  ],
};

export const vf: VfQuestion = {
  id: 'mat1600-det-001',
  course: 'MAT1600',
  topic: 'mat1600-det',
  difficulty: 2,
  type: 'vf',
  prompt: 'Pour $A$ de taille $3 \\times 3$, $\\det(2A) = 2\\det(A)$.',
  explanation: '$\\det(2A) = 2^3\\det(A)$ : le facteur sort une fois par ligne.',
  answer: false,
};

export const flash: FlashQuestion = {
  id: 'mat1500-logic-001',
  course: 'MAT1500',
  topic: 'mat1500-logic',
  difficulty: 1,
  type: 'flash',
  prompt: 'Contraposée de $p \\to q$ ?',
  answer: '$\\neg q \\to \\neg p$',
  keyPoints: ['Équivalente à l’implication', 'À ne pas confondre avec la réciproque $q \\to p$'],
  explanation: 'La réciproque n’est pas équivalente ; la contraposée, oui.',
};

export const defi: QcmQuestion = {
  id: 'mat1400-lagr-001',
  course: 'MAT1400',
  topic: 'mat1400-lagr',
  difficulty: 3,
  type: 'qcm',
  challenge: true,
  prompt: 'Maximum de $xy$ sous $x + y = 2$ ?',
  explanation: 'Le point critique est $x = y = 1$.',
  solution: '1. $\\nabla(xy) = \\lambda \\nabla(x+y)$ donne $y = x$.\n2. Avec $x + y = 2$ : $x = y = 1$.\n3. **Maximum** : $1$.',
  choices: [
    { text: '$1$', correct: true },
    { text: '$2$', correct: false, why: 'C’est $x + y$, pas $xy$.' },
    { text: '$0$', correct: false },
    { text: '$4$', correct: false, why: 'Tu as pris $x = y = 2$.' },
  ],
};

const more: Question[] = [2, 3, 4].map((n) => ({
  ...vf,
  id: `mat1600-det-00${n}`,
  prompt: `Énoncé vrai numéro ${n} : $\\det(I) = 1$.`,
  answer: true,
}));

/** 6 questions ordinaires (qcm, vf, flash) + 1 Défi. */
export const uiBank: Question[] = [qcm, vf, flash, defi, ...more];

export function memoryStorage(init: Record<string, string> = {}) {
  const map = new Map(Object.entries(init));
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}
