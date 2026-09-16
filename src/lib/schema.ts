// Propriété du lot Engine. Schémas Zod qui infèrent exactement les types de src/lib/types.ts.
import { z } from 'zod';
import type { Box, CardState, Choice, CourseCode, Progress, Question, Settings } from './types';

export const COURSE_CODES = ['MAT1400', 'MAT1500', 'MAT1600', 'STT1700'] as const satisfies readonly CourseCode[];
export const PROMPT_MAX = 280;
export const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)+$/;

const CourseCodeSchema = z.enum(COURSE_CODES);
/** Chaîne non vide (au moins un caractère non blanc), sans transformation. */
const text = z.string().regex(/\S/, 'texte vide');

const ChoiceSchema: z.ZodType<Choice> = z.strictObject({
  text,
  correct: z.boolean(),
  why: text.optional(),
});

const base = {
  id: z.string().regex(ID_PATTERN, 'id attendu en minuscules: "<thème>-<nnn>", ex. "mat1600-diag-007"'),
  course: CourseCodeSchema,
  topic: text,
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  prompt: text.max(PROMPT_MAX),
  explanation: text,
  challenge: z.literal(true).optional(),
  solution: text.optional(),
};

const QcmSchema = z.strictObject({
  ...base,
  type: z.literal('qcm'),
  choices: z.tuple([ChoiceSchema, ChoiceSchema, ChoiceSchema, ChoiceSchema]),
});

const VfSchema = z.strictObject({
  ...base,
  type: z.literal('vf'),
  answer: z.boolean(),
});

const FlashSchema = z.strictObject({
  ...base,
  type: z.literal('flash'),
  answer: text,
  keyPoints: z.array(text).min(1).max(3),
});

/** Les issues `custom` portent `params.rule` pour que le gate les range sous la bonne règle. */
export const QuestionSchema: z.ZodType<Question> = z
  .discriminatedUnion('type', [QcmSchema, VfSchema, FlashSchema])
  .superRefine((q, ctx) => {
    if (q.type === 'qcm') {
      const correct = q.choices.filter((c) => c.correct).length;
      if (correct !== 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['choices'],
          message: `exactement 1 choix correct attendu, trouvé ${correct}`,
          params: { rule: 'schema' },
        });
      }
    }
    if (q.challenge && q.solution === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['solution'],
        message: 'une question Défi (challenge: true) doit avoir une solution',
        params: { rule: 'challenge-solution' },
      });
    }
  });

export const QuestionFileSchema: z.ZodType<Question[]> = z.array(QuestionSchema);

const BoxSchema: z.ZodType<Box> = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
const epochMs = z.number().int().nonnegative();
const count = z.number().int().nonnegative();

export const CardStateSchema: z.ZodType<CardState> = z.object({
  box: BoxSchema,
  due: epochMs,
  n: count,
  k: count,
  wrongLast: z.boolean(),
  at: epochMs,
});

export const SettingsSchema: z.ZodType<Settings> = z.object({
  courses: z.array(CourseCodeSchema),
  topicOverrides: z.record(z.string(), z.boolean()),
  challenge: z.boolean(),
  updatedAt: epochMs,
});

export const ProgressSchema: z.ZodType<Progress> = z.object({
  v: z.literal(1),
  cards: z.record(z.string(), CardStateSchema),
  activeDays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  settings: SettingsSchema,
  flagged: z.array(z.string()),
  syncCode: z.string().optional(),
  resetAt: epochMs.optional(),
});
