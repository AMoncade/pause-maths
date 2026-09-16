// Agrégateur — propriété de l'admin. Chaque session de contenu possède src/content/<cours>/.
import type { Course, CourseCode } from '@/lib/types';
import { mat1400 } from './mat1400';
import { mat1500 } from './mat1500';
import { mat1600 } from './mat1600';
import { stt1700 } from './stt1700';

/** Ordre d'affichage des puces: Tout · MAT1400 · MAT1500 · MAT1600 · STT1700 */
export const courses: Course[] = [mat1400, mat1500, mat1600, stt1700];

export const courseByCode: Record<CourseCode, Course> = {
  MAT1400: mat1400,
  MAT1500: mat1500,
  MAT1600: mat1600,
  STT1700: stt1700,
};

export function topicIds(): Set<string> {
  return new Set(courses.flatMap((c) => c.topics.map((t) => t.id)));
}
