// Sélection des cours et des thèmes — logique pure, testée dans tests/ui/ui-select.test.ts.
import type { Course, CourseCode, Progress } from './types';

export function isAll(selected: readonly CourseCode[], all: readonly CourseCode[]): boolean {
  return all.every((c) => selected.includes(c));
}

/**
 * Puce de cours : quand « Tout » est actif, taper un cours ne garde que lui ;
 * sinon on bascule ce cours, et une sélection vide revient à « Tout ».
 */
export function toggleCourse(
  selected: readonly CourseCode[],
  code: CourseCode,
  all: readonly CourseCode[],
): CourseCode[] {
  if (isAll(selected, all)) return [code];
  const next = selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code];
  if (next.length === 0) return [...all];
  return all.filter((c) => next.includes(c));
}

export function toggleTopic(topics: readonly string[], id: string): string[] {
  return topics.includes(id) ? topics.filter((t) => t !== id) : [...topics, id];
}

export function setCourseTopics(topics: readonly string[], course: Course, on: boolean): string[] {
  const ids = course.topics.map((t) => t.id);
  const rest = topics.filter((t) => !ids.includes(t));
  return on ? [...rest, ...ids] : rest;
}

/** Nouveau Progress avec des réglages modifiés et `updatedAt` à jour (fusion de synchro). */
export function withSettings(
  p: Progress,
  patch: Partial<Omit<Progress['settings'], 'updatedAt'>>,
  now: number,
): Progress {
  return { ...p, settings: { ...p.settings, ...patch, updatedAt: now } };
}
