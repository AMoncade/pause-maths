// Cours de test, indépendants de src/content/courses.ts (que les lots de contenu font évoluer).
import type { Course, Topic } from '@/lib/types';

const topic = (id: string, defaultOn = true): Topic => ({ id, label: id, exam: 'intra', defaultOn });

export const testCourses: Course[] = [
  {
    code: 'MAT1600',
    title: 'Algèbre linéaire',
    color: '#3b82f6',
    topics: [topic('mat1600-syst'), topic('mat1600-det', false)],
  },
  {
    code: 'STT1700',
    title: 'Introduction à la statistique',
    color: '#22c55e',
    topics: [topic('stt1700-desc')],
  },
];

/** Ids retirés utilisés par tests/fixtures/broken.json. */
export const testRetired = new Set(['mat1600-syst-900']);
