// Chargement de la banque — propriété de l'admin.
import type { Question } from '@/lib/types';
import retired from './retired-ids.json';

const files = import.meta.glob<Question[]>('./*/*.json', { eager: true, import: 'default' });

/** Toutes les questions de tous les cours, sans validation (validée par tests/content.test.ts). */
export const bank: Question[] = Object.values(files).flat();

export const retiredIds: Set<string> = new Set(retired as string[]);

/** Version de la banque: date de build + nombre de questions (affichée dans Stats). */
export const bankVersion = {
  builtAt: __BUILD_DATE__,
  count: bank.length,
};
